import {
  CaseDetail,
  DiseaseReport,
  ImageType,
  ImageTypeTwo,
  MapViewFilter,
  ReportsDetailWithBodyPart,
  caseTags,
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
import { useReactiveVar } from "@apollo/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { activeYearInViewVar } from "../../../state";
import { tagsFilter } from "../constants";

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
  const partId = searchParams.get("partId");
  const activeYearInViewParam = searchParams.get("activeYearInView") || "0";
  const viewParam = searchParams.get("view");
  const reportIndexParm = searchParams.get("reportIndex");
  const reportIndex = reportIndexParm ? parseInt(reportIndexParm) : 0;
  // const reportIndex = useReactiveVar(reportIndexVar);
  const [filteredReports, setFilteredReports] = useState<
    ReportsDetailWithBodyPart[]
  >(caseDetail?.reports || []);
  const [totalAmountSpent, setTotalAmountSpent] = useState<string>("0");
  const [imageList, setImageList] = useState<ImageType[]>([]);
  const [bodyParts, setBodyParts] = useState<DiseaseReport[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [listView, setListView] = useState<any[]>([]);
  const [searchVal, setSearchVal] = useState("");
  const [caseTags, setCaseTags] = useState<caseTags[]>([]);

  const [filterValues, setFilterValues] = useState<MapViewFilter>({
    bodyPart: "",
    tag: "",
    provider: "",
  });

  const activeYearInView = useReactiveVar(activeYearInViewVar);

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
    handleGetBodyParts(reports);
    handleGetProviders(reports);
  };

  const handleOnLoadDetailsView = () => {
    if (!caseDetail) return;
    const reports = extractFilteredReports(caseDetail.reports, filterValues);
    // console.log("handleOnLoadDetailsView", caseDetail.reports.length, reports.length);
    setFilteredReports(reports);
    handleGetImageList([reports[reportIndex]]);
    handleGetBodyParts(caseDetail.reports);
    handleGetProviders(caseDetail.reports);
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

  const handleGetImageList = (reports: ReportsDetailWithBodyPart[]) => {
    const extractedImages = extractImagesFromReport(reports, filterValues);
    setImageList(extractedImages);
  };

  const handleGetBodyParts = (reports: ReportsDetailWithBodyPart[]) => {
    const bodyParts = extractBodyPartsFromReport(reports);
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
        if (filterValues.tag && report.tags.includes(filterValues.tag)) {
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
    setFilterValues({ ...filterValues, [fieldName]: selectedVal });
    // const searchParams = new URLSearchParams();
    // searchParams.set("reportIndex", "0");
    // router.push(`${pathname}?${searchParams.toString()}`);
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
      setSelectedCategory(category);
      // setFilteredReports(filteredReports);
      // handleGetTotalAmountSpent(filteredReports);
      handleGetImageList(filteredReports);
      // handleGetListView(filteredReports);
      // handleGetBodyParts(filteredReports);
      // handleGetProviders(filteredReports);
    } else {
      setSelectedCategory("");
      handleOnLoadMapView();
    }
  };

  const getCaseTags = async (caseId: string) => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.case.reports.updateReport}/${caseId}/tags`
      );
      setCaseTags(response.data || []);
    } catch (error) {}
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
    const mapping: { [key: string]: ImageTypeTwo[] } = {};
    const uniqueFileNames = new Set();
    bodyParts.forEach((part) => {
      // console.log("mappingByCategory", part);
      part.images.forEach((image) => {
        if (uniqueFileNames.has(image.fileName)) return;
        uniqueFileNames.add(image.fileName);
        if (mapping[image.categoryName]) {
          mapping[image.categoryName].push({
            ...image,
            icdCode: part.icdCode,
            reportId: part.reportId,
          });
        } else {
          mapping[image.categoryName] = [
            { ...image, icdCode: part.icdCode, reportId: part.reportId },
          ];
        }
      });
    });
    // console.log("mapping", mapping);
    return mapping;
  }, [imageList]);

  const tagsArray = useMemo(() => {
    if (!caseTags.length) return [];
    const labelValue = caseTags.map((tag) => {
      return {
        label: tag.tagName,
        value: tag._id.toString() as any,
      };
    });
    return tagsFilter.slice(0, 2).concat(labelValue);
  }, [caseDetail]);

  // console.log("filteredReportsSearch", filteredReportsSearch);

  useEffect(() => {
    if (isMapView) handleOnLoadMapView();
  }, [caseDetail, activeYearInViewParam, filterValues, isMapView]);

  useEffect(() => {
    if (!isMapView) handleOnLoadDetailsView();
  }, [caseDetail, filterValues, isMapView, reportIndex]);

  useEffect(() => {
    if (partId) {
      setFilterValues({ ...filterValues, bodyPart: partId });
    } else {
      setFilterValues({ ...filterValues, bodyPart: "" });
    }
  }, [partId]);

  useEffect(() => {
    (async () => {
      if (caseDetail) await getCaseTags(caseDetail._id);
    })();
  }, [caseDetail]);

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
    tagsArray,
    providers,
    mappingByCategory,
    handleSelect,
    handleSearch,
    handleFilterByCategory,
  };
}
