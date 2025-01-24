import { CaseNote, NoteCellData } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { getComparator } from "@/utils/general";
import React, {
  startTransition,
  useMemo,
  useOptimistic,
  useState,
} from "react";

interface Data {
  userNote: NoteCellData;
}

type Order = "asc" | "desc";

function createData(userNote: NoteCellData) {
  return {
    userNote,
  };
}

export default function UseNotes({ caseNotes }: { caseNotes: CaseNote[] }) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selectedCell, setSelectedCell] = useState<NoteCellData | null>(null);
  const [loadingCreateNote, setLoadingCreateNote] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  const [optimisticCaseNotes, updateOptimisticNote] = useOptimistic(
    caseNotes,
    (currentNotes: CaseNote[], newNotes: CaseNote[]) => {
      return newNotes;
    }
  );

  const rows = useMemo(() => {
    console.log("optimisticCaseNotes", optimisticCaseNotes);
    if (!optimisticCaseNotes) return [];
    if (!optimisticCaseNotes.length) return [];
    return optimisticCaseNotes.map((item) => {
      const userNote = {
        noteId: item._id,
        note: item.note,
        caseId: item.case,
        userName: item.user.name,
        userImg: item.user.profilePicture,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
      return createData(userNote);
    });
  }, [optimisticCaseNotes]);

  const visibleRows: Data[] = useMemo(
    () =>
      rows && rows.length
        ? [...rows].sort(getComparator(order, orderBy) as any)
        : [],
    [order, orderBy, rows]
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const handleUpdateAddNote = async ({
    caseId,
    note,
  }: {
    caseId: string;
    note: string;
  }) => {
    try {
      setLoadingCreateNote(true);
      await axiosInstance.post(
        `${endpoints.case.reports.updateReport}/${caseId}/notes`,
        {
          note,
        }
      );
      setLoadingCreateNote(false);
      return true;
    } catch (error) {
      setLoadingCreateNote(false);
      return false;
    }
  };

  const handleEditNote = ({
    noteId,
    newNote,
  }: {
    noteId: string;
    newNote: string;
  }) => {
    const notesCopy = optimisticCaseNotes.slice();
    const index = notesCopy.findIndex((note) => note._id === noteId);
    if (index >= 0) {
      const note = notesCopy[index];
      notesCopy[index].note = newNote;
      notesCopy[index].updatedAt = new Date();
      startTransition(() => {
        updateOptimisticNote(notesCopy);
      });
      return handleUpdateEditNote(note);
    }
    return Promise.resolve(false);
  };

  const handleUpdateEditNote = async (caseNote: CaseNote) => {
    try {
      setLoadingCreateNote(true);
      await axiosInstance.patch(
        `${endpoints.case.reports.updateReport}/${caseNote.case}/notes/${caseNote._id}`,
        {
          note: caseNote.note,
        }
      );
      setLoadingCreateNote(false);
      return true;
    } catch (error) {
      setLoadingCreateNote(false);
      return false;
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNoteId) return;
    const notesCopy = optimisticCaseNotes.slice();
    const index = notesCopy.findIndex((note) => note._id === selectedNoteId);

    if (index >= 0) {
      const note = notesCopy[index];
      notesCopy.splice(index, 1);
      startTransition(() => {
        updateOptimisticNote(notesCopy);
      });
      await handleUpdateDeleteCase(note);
      handleDeleteConfirmationModalChange(false);
    }
  };

  const handleUpdateDeleteCase = async (caseNote: CaseNote) => {
    try {
      await axiosInstance.delete(
        `${endpoints.case.create}/${caseNote.case}/notes/${caseNote._id}`
      );
    } catch (error) {}
  };

  const handleEditNoteOpen = (note: NoteCellData) => {
    console.log("handleEditNoteOpen", note);
    setSelectedCell(note);
    setOpenEditModal(true);
  };

  const handleDeleteConfirmationModalChange = (
    status: boolean,
    noteId?: string
  ) => {
    if (noteId) {
      setSelectedNoteId(noteId);
    }
    setOpenDeleteConfirmation(status);
  };

  return {
    createSortHandler,
    handleEditNoteOpen,
    handleEditNote,
    handleUpdateAddNote,
    setOpenEditModal,
    openEditModal,
    visibleRows,
    order,
    orderBy,
    selectedCell,
    loadingCreateNote,
    openDeleteConfirmation,
    handleDeleteConfirmationModalChange,
    handleDeleteNote,
  };
}
