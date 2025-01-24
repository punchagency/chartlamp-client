"use client";

import { format } from "date-fns";

import { CaseDetail } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
} from "react";
// import { caseData } from "../components/table/constants";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CasesEnum } from "../constants";

interface Data {
  _id: string;
  caseNumber: string;
  plaintiff: string;
  dateOfClaim: string;
  claimStatus: string;
  actionRequired: string;
  targetCompletion: string;
  createdAt: string;
  isFavorite: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

type Order = "asc" | "desc";

interface HeadCell {
  disablePadding?: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  align?: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "caseNumber",
    label: "Case Number",
    numeric: false,
  },
  {
    id: "plaintiff",
    label: "Plaintiff",
    numeric: false,
    align: "center",
  },
  {
    id: "dateOfClaim",
    label: "Date of Claim",
    numeric: false,
    align: "center",
  },
  {
    id: "claimStatus",
    label: "Claim Status",
    numeric: false,
    align: "center",
  },
  {
    id: "actionRequired",
    label: "Action Required",
    numeric: false,
    align: "center",
  },
  {
    id: "targetCompletion",
    label: "Target Completion",
    numeric: false,
    align: "center",
  },
  // {
  //   id: "cronStatus",
  //   label: "Cron Status",
  //   numeric: false,
  //   align: "center",
  // },
];

function formatDate(date: any) {
  return format(date, "MMMM d, yyyy");
}

function createData(
  _id: string,
  caseNumber: string,
  plaintiff: string,
  dateOfClaim: string,
  claimStatus: string,
  actionRequired: string,
  targetCompletion: Date,
  createdAt: Date,
  isFavorite: boolean
) {
  return {
    _id,
    caseNumber,
    plaintiff,
    dateOfClaim: formatDate(new Date(dateOfClaim)),
    claimStatus,
    actionRequired,
    targetCompletion: formatDate(new Date(targetCompletion)),
    createdAt: formatDate(new Date(createdAt)),
    isFavorite,
  };
}

export function useCases() {
  const { tab } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultUpload = searchParams.get("upload") === "true";
  const [caseList, setCaseList] = useState<CaseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openChangeDateModal, setOpenChangeDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(
    null
  );

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("createdAt");
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filter, setFilter] = useState({
    claimStatus: "",
  });

  const [optimisticCases, updateOptimisticMessage] = useOptimistic(
    caseList,
    (_, updatedCases: CaseDetail[]) => {
      return updatedCases;
    }
  );

  const filteredCases = useMemo(() => {
    if (tab === CasesEnum.management) {
      return optimisticCases.filter((c) => !c?.isArchived);
    } else {
      return optimisticCases.filter((c) => c?.isArchived);
    }
  }, [optimisticCases, tab]);

  const archivedCasesLength = useMemo(() => {
    return optimisticCases.filter((c) => c?.isArchived).length;
  }, [optimisticCases]);

  const rows = filteredCases.map(
    ({
      _id,
      caseNumber,
      plaintiff,
      dateOfClaim,
      claimStatus,
      actionRequired,
      targetCompletion,
      createdAt,
      isFavorite,
    }) => {
      return createData(
        _id,
        caseNumber,
        plaintiff,
        dateOfClaim,
        claimStatus,
        actionRequired,
        targetCompletion,
        createdAt,
        isFavorite
      );
    }
  );

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy) as any)
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const getCases = useCallback(async () => {
    setLoading(true);
    try {
      let url = endpoints.case.userCases;
      if (filter.claimStatus) {
        url += `?claimStatus=${filter.claimStatus}`;
        // console.log("getCases", url);
      }
      const response = await axiosInstance.get(url);
      setCaseList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cases:", error);
      setLoading(false);
    }
  }, [filter]);

  const handleSelectFilter = (fieldName: string, selectedVal: string) => {
    setFilter({ ...filter, [fieldName]: selectedVal });
  };

  const handleFavorite = (e: any, id: string, isFavorite: boolean) => {
    e.stopPropagation();
    console.log("Add to favorites", id);

    const casesCopy = [...filteredCases];
    const index = casesCopy.findIndex((c) => c._id === id);

    if (index !== -1) {
      casesCopy[index].isFavorite = isFavorite;

      startTransition(() => {
        updateOptimisticMessage(casesCopy);
      });
    }
    handleUpdateFavorite(id, isFavorite);
  };

  const handleStatusChange = (id: string, status: string) => {
    console.log("Change status", id, status);

    const casesCopy = [...filteredCases];
    const index = casesCopy.findIndex((c) => c._id === id);

    if (index !== -1) {
      casesCopy[index].claimStatus = status;

      startTransition(() => {
        updateOptimisticMessage(casesCopy);
      });
    }
    handleUpdateClaimStatus(id, status);
  };

  const handleTargetCompletionChange = (date: Date) => {
    const casesCopy = [...filteredCases];
    const index = casesCopy.findIndex((c) => c._id === selectedCaseId);

    if (index !== -1 && selectedCaseId) {
      casesCopy[index].targetCompletion = date;

      startTransition(() => {
        updateOptimisticMessage(casesCopy);
      });
      setOpenChangeDateModal(false);
      handleUpdateTargetCom(selectedCaseId, date);
    }
  };

  const handleArchiveCase = async (e: any, id: string) => {
    e.stopPropagation();

    console.log("Archive case", id);
    const casesCopy = [...filteredCases];
    const index = casesCopy.findIndex((c) => c._id === id);

    if (index !== -1) {
      casesCopy[index].isArchived = true;

      startTransition(() => {
        updateOptimisticMessage(casesCopy);
      });
    }
    await handleUpdateArchiveStatus(id, true);
  };

  const handleRestoreArchivedCase = async (e: any, id: string) => {
    e.stopPropagation();

    console.log("Archive case", id);
    const casesCopy = [...filteredCases];
    const index = casesCopy.findIndex((c) => c._id === id);

    if (index !== -1) {
      casesCopy[index].isArchived = false;

      startTransition(() => {
        updateOptimisticMessage(casesCopy);
      });
    }
    await handleUpdateArchiveStatus(id, false);
  };

  const handleDeleteCase = async (id: string) => {
    const newCases = filteredCases.filter((c) => c._id !== id);
    setCaseList(newCases);
    startTransition(() => {
      updateOptimisticMessage(newCases);
    });
    await handleUpdateDeleteCase(id);
  };

  const handleUpdateDeleteCase = async (caseId: string) => {
    try {
      await axiosInstance.delete(`${endpoints.case.create}/${caseId}`);
    } catch (error) {}
  };

  const handleUpdateArchiveStatus = async (
    caseId: string,
    isArchived: boolean
  ) => {
    try {
      await axiosInstance.patch(`${endpoints.case.create}/${caseId}/archive`, {
        isArchived,
      });
    } catch (error) {}
  };

  const handleUpdateFavorite = async (caseId: string, isFavorite: boolean) => {
    try {
      await axiosInstance.patch(
        `${endpoints.case.create}/${caseId}/update-favorite`,
        {
          isFavorite,
        }
      );
    } catch (error) {}
  };

  const handleUpdateClaimStatus = async (
    caseId: string,
    claimStatus: string
  ) => {
    try {
      await axiosInstance.patch(
        `${endpoints.case.create}/${caseId}/update-claim-status`,
        {
          claimStatus,
        }
      );
    } catch (error) {}
  };

  const handleUpdateTargetCom = async (
    caseId: string,
    targetCompletion: Date
  ) => {
    try {
      await axiosInstance.patch(
        `${endpoints.case.create}/${caseId}/update-target-completion`,
        {
          targetCompletion,
        }
      );
    } catch (error) {}
  };

  const handleNavigateToDetails = (id: string) => {
    router.push(`/dashboard/case/${id}/medicalHistory?view=mapView`);
  };

  const handleConfirmationModalChange = (status: boolean, caseId?: string) => {
    if (caseId) {
      setSelectedCaseId(caseId);
    }
    setOpenConfirmation(status);
  };

  const handleTargetComModalChange = (status: boolean, caseId?: string) => {
    if (caseId) {
      setSelectedCaseId(caseId);
      const caseNumber = filteredCases.find(
        (c) => c._id === caseId
      )?.caseNumber;
      if (!caseNumber) return;
      setSelectedCaseNumber(caseNumber);
    }
    setOpenChangeDateModal(status);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  useEffect(() => {
    getCases();
  }, [getCases]);

  const refetch = useCallback(() => {
    getCases();
  }, [getCases, filter]);

  useEffect(() => {
    if (defaultUpload)
      router.replace(`/dashboard/cases/${CasesEnum.management}`);
  }, [tab]);

  return {
    visibleRows,
    headCells,
    rowsPerPage,
    page,
    orderBy,
    order,
    selectedCaseId,
    openConfirmation,
    caseList,
    loading,
    rows,
    tab,
    archivedCasesLength,
    filteredCases,
    openChangeDateModal,
    selectedCaseNumber,
    handleChangePage,
    handleChangeRowsPerPage,
    setOpenChangeDateModal,
    getCases,
    refetch,
    handleSelectFilter,
    handleUpdateFavorite,
    handleUpdateClaimStatus,
    handleNavigateToDetails,
    handleFavorite,
    handleStatusChange,
    handleArchiveCase,
    handleDeleteCase,
    handleRestoreArchivedCase,
    handleConfirmationModalChange,
    handleTargetCompletionChange,
    handleTargetComModalChange,
    createSortHandler,
  };
}
