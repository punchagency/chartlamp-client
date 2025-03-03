import {
  CaseDetail,
  DiseaseClass,
  ImageTypeTwo,
  MapViewFilter,
  ReportsDetailWithBodyPart,
} from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import {
  extractBodyPartsFromReport,
  extractFilteredReports,
  extractImagesFromReport,
  extractProvidersFromReport,
  formatCurrencyToNumber,
  getReportsInYear,
} from "@/utils/general";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MapViewEnum } from "../../../constants";

interface MapViewProps {
  caseDetail: CaseDetail | null;
  isMapView?: boolean;
}

export default function useMedicalHistory({
  caseDetail,
  isMapView = false,
}: MapViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const partIdParam = searchParams.get("partId");
  const icdCodeParam = searchParams.get("icd-code");
  const reportIdParam = searchParams.get("reportId");
  const activeYearInViewParam = searchParams.get("activeYearInView") || "0";
  const viewParam = searchParams.get("view");
  const reportIndexParm = searchParams.get("reportIndex");
  const reportIndex = reportIndexParm ? parseInt(reportIndexParm) : 0;
  // const reportIndex = useReactiveVar(reportIndexVar);
  const [filteredReports, setFilteredReports] = useState<
    ReportsDetailWithBodyPart[]
  >(caseDetail?.reports || []);
  const [totalAmountSpent, setTotalAmountSpent] = useState<string>("0");
  const [imageList, setImageList] = useState<ImageTypeTwo[]>([]);
  const [bodyParts, setBodyParts] = useState<DiseaseClass[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [listView, setListView] = useState<any[]>([]);
  const [searchVal, setSearchVal] = useState("");

  const [filterValues, setFilterValues] = useState<MapViewFilter>({
    bodyPart: "",
    icdCode: "",
    tag: [],
    provider: "",
  });

  // const activeYearInView = useReactiveVar(activeYearInViewVar);

  const handleOnLoadMapView = () => {
    if (!caseDetail) return;
    const reports = getReportsInYear(
      caseDetail.reports,
      parseInt(activeYearInViewParam)
    );
    setFilteredReports(reports);

    handleGetTotalAmountSpent(reports);
    handleGetImageList(reports);
    handleGetListView(reports);
    handleGetBodyParts(reports, filterValues);
    handleGetProviders(reports);
  };

  const handleOnLoadDetailsView = () => {
    if (!caseDetail) return;
    const reports = extractFilteredReports(caseDetail.reports, filterValues);
    if (reports.length && !reports[reportIndex]) {
      handleReloadPathWithParams({ reportIndex: 0 });
    } else {
      setFilteredReports(reports);
      handleGetImageList([reports[reportIndex]]);
      handleGetBodyParts(reports);
      handleGetProviders(reports);
    }
  };

  const handleGetTotalAmountSpent = (reports: ReportsDetailWithBodyPart[]) => {
    const totalAmountSpent = reports
      .reduce(
        (acc: number, report: any) =>
          acc + formatCurrencyToNumber(report.amountSpent),
        0
      )
      .toLocaleString();
    setTotalAmountSpent(totalAmountSpent);
  };

  const handleGetImageList = (reports: ReportsDetailWithBodyPart[] | []) => {
    if (!reports.length) setImageList([]);
    if (!partIdParam && viewParam === MapViewEnum.detailsView) {
      setImageList([]);
    } else {
      const extractedImages = extractImagesFromReport(reports, filterValues);
      setImageList(extractedImages);
    }
  };

  const handleGetBodyParts = (
    reports: ReportsDetailWithBodyPart[],
    filterValues?: MapViewFilter
  ) => {
    const bodyParts = extractBodyPartsFromReport(reports, filterValues);
    // console.log("bodyParts", bodyParts);
    setBodyParts(bodyParts);
  };

  const handleGetProviders = (reports: ReportsDetailWithBodyPart[]) => {
    const providers = extractProvidersFromReport(reports);
    const providersSet = new Set(providers);
    const uniqueProviders = Array.from(providersSet);
    setProviders(uniqueProviders);
  };

  const handleGetListView = (reports: ReportsDetailWithBodyPart[]) => {
    const listView = reports.map((report) => {
      if (report.icdCodes.length) {
        // if (
        //   filterValues.bodyPart &&
        //   filterValues.bodyPart === classification.bodyParts
        // ) {
        //   return {
        //     nameOfDisease: report.nameOfDisease,
        //     amountSpent: report.amountSpent,
        //   };
        // }
        if (
          filterValues.tag &&
          filterValues.tag.length &&
          filterValues.tag.includes(report._id.toString())
        ) {
          return {
            nameOfDisease: report.nameOfDisease,
            amountSpent: report.amountSpent,
            reportId: report._id,
          };
        }
        if (
          filterValues.provider &&
          filterValues.provider === report.providerName
        ) {
          return {
            nameOfDisease: report.nameOfDisease,
            amountSpent: report.amountSpent,
            reportId: report._id,
          };
        }
        return {
          nameOfDisease: report.nameOfDisease,
          amountSpent: report.amountSpent,
          reportId: report._id,
        };
      }
    });
    setListView(listView);
  };

  const handleSelect = (fieldName: string, selectedVal: string) => {
    if (fieldName == "tag") {
      if (selectedVal) {
        // console.log("filterValues", fieldName, selectedVal);
        if (viewParam === MapViewEnum.detailsView) {
          getReportsByDcTagMapping(selectedVal).then((reportIds) => {
            setFilterValues({ ...filterValues, [fieldName]: reportIds });
          });
        }
        if (viewParam === MapViewEnum.mapView) {
          getReportsByTagMapping(selectedVal).then((response) => {
            if (!response) return;
            const { reportIds, dcs } = response;
            const uniqueDcs = new Set(dcs);
            const uniqueDcsArray = Array.from(uniqueDcs) as unknown as string[];
            setFilterValues({
              ...filterValues,
              [fieldName]: reportIds,
              dcs: uniqueDcsArray,
            });
          });
        }
      } else setFilterValues({ ...filterValues, [fieldName]: [], dcs: [] });
    } else {
      setFilterValues({ ...filterValues, [fieldName]: selectedVal });
    }
  };

  const getReportsByDcTagMapping = async (caseTagId: string) => {
    if (!caseDetail || !preferredClassification) return;
    const response = await axiosInstance.post(
      `${endpoints.case.reports.updateReport}/${caseDetail._id}/reports/filter-by-dc`,
      {
        caseTagId,
        dc: preferredClassification._id,
      }
    );
    const filteredReports = response.data.map(
      (tag: { report: string }) => tag.report
    );

    return filteredReports;
  };

  const getReportsByTagMapping = async (caseTagId: string) => {
    if (!caseDetail) return;
    const response = await axiosInstance.post(
      `${endpoints.case.reports.updateReport}/${caseDetail._id}/reports/filter-by-tags`,
      {
        caseTagId,
      }
    );
    const filteredReports = response.data.map(
      (tag: { report: string }) => tag.report
    );
    const filteredDcs = response.data.map((tag: { dc: string }) => tag.dc);

    return { reportIds: filteredReports, dcs: filteredDcs };
  };

  const handleSearch = (val: string) => {
    setSearchVal(val);
  };

  const handleFilterByCategory = (category?: string) => {
    if (category) {
      const reports = getReportsInYear(
        caseDetail?.reports || [],
        parseInt(activeYearInViewParam)
      );
      const filteredReports = reports.filter((report) => {
        const found = report.classification.find((classification) => {
          return classification.images.find(
            (image) => image.categoryName === category
          );
        });
        return found;
      });
      console.log("filteredReports", filteredReports);
      setSelectedCategory(category);
      handleGetImageList(filteredReports);
    } else {
      setSelectedCategory("");
      handleOnLoadMapView();
    }
  };

  const handleReloadPathWithParams = (params: { [key: string]: any }) => {
    const searchParamsInner = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      searchParamsInner.set(key, value);
    });

    router.push(`${pathname}?${searchParamsInner.toString()}`);
  };

  const filteredReportsSearch = useMemo(() => {
    if (!searchVal) {
      return filteredReports;
    }
    return filteredReports.filter(
      (userCase) =>
        userCase.nameOfDisease
          .toLowerCase()
          .includes(searchVal.toLowerCase()) ||
        userCase.providerName.toLowerCase().includes(searchVal.toLowerCase()) ||
        userCase.doctorName.toLowerCase().includes(searchVal.toLowerCase()) ||
        userCase.icdCodes
          .map((code) => code.toLowerCase())
          .includes(searchVal.toLowerCase())
    );
  }, [searchVal, filteredReports]);

  const mappingByCategory = useMemo(() => {
    const mapping: { [key: string]: ImageTypeTwo[] } = {
      others: [],
    };
    const uniqueFileNames = new Set();
    bodyParts.forEach((part) => {
      if (/[a-zA-Z0-9]/.test(part.icdCode)) {
        if (part.images.length) {
          part.images.forEach((image) => {
            if (uniqueFileNames.has(image.icdCode)) return;
            uniqueFileNames.add(image.icdCode);
            if (mapping[image.categoryName]) {
              mapping[image.categoryName].push({
                ...image,
                icdCode: part.icdCode,
                reportId: part.reportId,
                classificationId: part?._id,
              });
            } else {
              mapping[image.categoryName] = [
                {
                  ...image,
                  icdCode: part.icdCode,
                  reportId: part.reportId,
                  classificationId: part?._id,
                },
              ];
            }
          });
        } else {
          if (uniqueFileNames.has(part.icdCode)) return;
          uniqueFileNames.add(part.icdCode);
          mapping.others.push({
            _id: "",
            fileName: part.bodyParts,
            categoryName: "",
            icdCode: part.icdCode,
            reportId: part.reportId,
            classificationId: part?._id,
          });
        }
      }
    });
    // console.log("mapping", mapping);
    return mapping;
  }, [imageList]);

  const preferredClassification = useMemo(() => {
    if (!caseDetail) return null;
    const currentReport = caseDetail.reports.find(
      (item) => item._id === reportIdParam
    );
    if (!currentReport) return null;
    const reportClassifications = currentReport.classification;
    const preferredClassification = reportClassifications.find(
      (item) =>
        item.images.find((img) => img._id === partIdParam) ||
        item.icdCode === icdCodeParam
    );
    return preferredClassification;
  }, [caseDetail, partIdParam, icdCodeParam, reportIdParam]);

  // console.log("filteredReportsSearch", filteredReportsSearch);

  useEffect(() => {
    if (isMapView) handleOnLoadMapView();
  }, [caseDetail, activeYearInViewParam, filterValues, isMapView]);

  useEffect(() => {
    if (!isMapView) handleOnLoadDetailsView();
  }, [caseDetail, filterValues, isMapView, reportIndex]);

  useEffect(() => {
    setFilterValues((prev) => ({
      ...prev,
      bodyPart: partIdParam || "",
      icdCode: icdCodeParam || "",
    }));

    // console.log("Updated filter values", {
    //   bodyPart: partIdParam || "",
    //   icdCode: icdCodeParam || "",
    // });
  }, [partIdParam, icdCodeParam]);

  // useEffect(() => {
  //   if (activeYearInViewParam) activeYearInViewVar(+activeYearInViewParam);
  // }, [activeYearInViewParam]);

  // useEffect(() => {
  //   if (activeYearInViewParam) {
  //     console.log("viewParam", viewParam);
  //     if (viewParam == MapViewEnum.mapView) {
  //       router.replace(`${pathname}?view=${viewParam}`);
  //       return;
  //     }
  //     activeYearInViewVar(+activeYearInViewParam);
  //   }
  // }, [activeYearInViewParam, pathname, viewParam]);

  return {
    filteredReports: filteredReportsSearch,
    totalAmountSpent,
    selectedCategory,
    imageList,
    listView,
    bodyParts,
    providers,
    mappingByCategory,
    handleSelect,
    handleSearch,
    handleFilterByCategory,
  };
}
