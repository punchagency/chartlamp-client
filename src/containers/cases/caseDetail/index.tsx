import AppDialog from "@/components/DailogBox";
import NavBack from "@/components/NavBack";
import { useGetRequests } from "@/hooks/useRequests";
import { CaseDetail } from "@/interface";
import { endpoints } from "@/lib/axios";
import { customTagModalVar, shareModalVar } from "@/state/modal";
import { pxToRem } from "@/theme";
import { useReactiveVar } from "@apollo/client";
import { Stack } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomTagModal from "../components/customTag";
import NotesModal from "../components/notesModal";
import ShareModal from "../components/share";
import { CasesEnum } from "../constants";
import Maintenance from "./components/maintenance";
import MapView from "./components/medicalHistory";
import NotesView from "./components/notes";
import UseNotes from "./components/notes/hooks";
import Report from "./components/reports";
import { CaseDetailEnum } from "./constants";
import { useCaseDetails } from "./hooks";
import { notesModalVar } from "./state";

export default function CaseDetailPageContainer() {
  const notesModalState = useReactiveVar(notesModalVar);
  const shareModalState = useReactiveVar(shareModalVar);
  const customTagModalState = useReactiveVar(customTagModalVar);

  const { id, tab } = useParams<{ id: string; tab: CaseDetailEnum }>();

  const [caseData, setCaseData] = useState<CaseDetail | null>(null);

  const { data, loading, getRequests } = useGetRequests<CaseDetail>();

  const router = useRouter();

  const {
    loading: caseLoading,
    caseDetail,
    teamMembers,
    loadingCaseNotes,
    caseNotes,
    getCaseNotes,
  } = useCaseDetails();

  const { handleUpdateAddNote, loadingCreateNote } = UseNotes({
    caseNotes,
  });

  const fetchCaseData = useCallback(() => {
    if (id) {
      getRequests(`${endpoints.case.getById}/${id}`);
    }
  }, [id, getRequests]);

  useEffect(() => {
    fetchCaseData();
  }, [fetchCaseData]);

  useEffect(() => {
    if (tab === CaseDetailEnum.comments && id) getCaseNotes(id);
  }, [tab, id]);

  useEffect(() => {
    if (!loading && data) {
      setCaseData(data);
    }
  }, [loading, data]);

  const viewContent = useMemo(() => {
    switch (tab) {
      case CaseDetailEnum.medicalHistory:
        return <MapView caseDetail={caseDetail} loading={caseLoading} />;
      case CaseDetailEnum.maintenance:
        return (
          <Maintenance
            documents={caseData?.documents || []}
            plaintiff={caseData?.plaintiff || ""}
            caseNumber={caseData?.caseNumber || ""}
            caseId={caseData?._id || ""}
            user={caseData?.user}
            loading={loading}
          />
        );
      case CaseDetailEnum.reports:
        return (
          <Report
            reports={caseData?.reports}
            user={caseData?.user}
            plaintiff={caseData?.plaintiff}
            caseNumber={caseData?.caseNumber}
            loading={loading}
          />
        );
      case CaseDetailEnum.comments:
        return (
          <NotesView
            caseId={caseData?._id || ""}
            caseNotes={caseNotes}
            loadingCaseNotes={loadingCaseNotes}
          />
        );
      default:
        return null;
    }
  }, [tab, caseData, caseDetail, loading, caseLoading]);

  return (
    <Stack
      sx={{
        height: "calc(100vh - 4.5rem)",
        width: "100%",
        // background: "#fff",
        overflowY: "hidden",
      }}
      gap={pxToRem(12)}
    >
      <NavBack
        handleNavigation={() =>
          router.push(`/dashboard/cases/${CasesEnum.management}`)
        }
      />
      {viewContent}
      <AppDialog open={shareModalState} onClose={() => shareModalVar(false)}>
        <ShareModal
          onClose={() => shareModalVar(false)}
          teamMembers={teamMembers}
          caseNumber={caseDetail?.caseNumber || ""}
          name={caseDetail?.plaintiff || ""}
          profilePicture={caseDetail?.user.profilePicture || ""}
          caseId={caseDetail?._id || ""}
        />
      </AppDialog>
      <AppDialog
        open={customTagModalState}
        onClose={() => customTagModalVar(false)}
      >
        <CustomTagModal
          onClose={() => customTagModalVar(false)}
          caseId={caseDetail?._id || ""}
        />
      </AppDialog>
      <AppDialog
        open={customTagModalState}
        onClose={() => customTagModalVar(false)}
      >
        <CustomTagModal
          onClose={() => customTagModalVar(false)}
          caseId={caseDetail?._id || ""}
        />
      </AppDialog>
      <AppDialog open={notesModalState} onClose={() => notesModalVar(false)}>
        <NotesModal
          onClose={() => notesModalVar(false)}
          caseId={caseDetail?._id || ""}
          handleAddNote={handleUpdateAddNote}
          loadingNote={loadingCreateNote}
        />
      </AppDialog>
    </Stack>
  );
}
