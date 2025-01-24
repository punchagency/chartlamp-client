import AppDialog from "@/components/DailogBox";
import UploadcaseModal from "@/containers/cases/components/uploadCase";
import { DocumentDetail, UserDetail } from "@/interface";
import { NEUTRAL, pxToRem } from "@/theme";
import { getFileName } from "@/utils/general";
import { useReactiveVar } from "@apollo/client";
import { Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { MaintenanceView, maintenanceViewVar } from "../../state";
import TopNav from "../TopNav";
import ActionsTab from "../actionsTab";
import MaintenanceGridView from "./grid";
import MaintenanceTable from "./table";

interface MaintenanceProps {
  documents: DocumentDetail[] | [];
  user: UserDetail | undefined;
  loading: boolean;
  plaintiff?: string;
  caseNumber?: string;
  caseId?: string;
}

export default function Maintenance({
  documents,
  user,
  loading,
  plaintiff,
  caseNumber,
  caseId,
}: MaintenanceProps) {
  const maintenanceView = useReactiveVar(maintenanceViewVar);
  const [searchVal, setSearchVal] = useState("");
  const [openUpload, setOpenUpload] = useState(false);
  const [documentSizes, setDocumentSizes] = useState<{ [key: string]: string }>(
    {}
  );

  const getFileSize = async (url: string) => {
    try {
      const response = await axios.head(url);
      const contentLength = response.headers["content-length"];
      if (!contentLength) return "Unknown size";
      const sizeInBytes = parseInt(contentLength, 10);
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      return `${sizeInMB} MB`;
    } catch (error) {
      console.error("Error fetching file size:", error);
      return "Unknown size";
    }
  };


  const handleSearch = (val: string) => {
    setSearchVal(val);
  };

  useEffect(() => {
    const fetchSizes = async () => {
      const sizes = await Promise.all(
        documents.map(async (doc) => {
          const size = await getFileSize(doc.url);
          return { id: doc._id, size };
        })
      );
      const sizeMap = sizes.reduce((acc, { id, size }) => {
        acc[id] = size;
        return acc;
      }, {} as { [key: string]: string });
      setDocumentSizes(sizeMap);
    };

    fetchSizes();
  }, [documents]);

  const mappedDocuments = useMemo(() => {
    return documents
      .map((dc) => ({
        id: dc._id,
        name: getFileName(dc.url),
        url: dc.url,
        uploadedBy: user?.name || "",
        dateUploaded: dc.createdAt,
        size: documentSizes[dc._id] || "Loading...",
      }))
      .filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          doc.uploadedBy.toLowerCase().includes(searchVal.toLowerCase())
      );
  }, [documents, documentSizes, user, searchVal]);

  const componentData = useMemo(() => {
    switch (maintenanceView) {
      case MaintenanceView.listView:
        return (
          <MaintenanceTable
            maintenanceData={mappedDocuments}
            loading={loading}
          />
        );
      case MaintenanceView.gridView:
        return (
          <MaintenanceGridView
            maintenanceData={mappedDocuments}
            loading={loading}
          />
        );
      default:
        return (
          <MaintenanceTable
            maintenanceData={mappedDocuments}
            loading={loading}
          />
        );
    }
  }, [maintenanceView, mappedDocuments, loading]);

  // return <>{componentData}</>;

  return (
    <Stack
      flex={1}
      bgcolor={NEUTRAL[0]}
      sx={{
        boxShadow: { xs: "none", sm: "0px 0px 10px rgba(5, 113, 112, 0.04)" },
        borderRadius: { xs: 0, sm: pxToRem(24) },
        height: "100%",
      }}
    >
      <TopNav />
      <ActionsTab
        userName={plaintiff || ""}
        caseNumber={caseNumber || ""}
        profilePicture={""}
        // profilePicture={user?.profilePicture || ""}
        handleSearch={handleSearch}
        handleUpload={() => setOpenUpload(true)}
      />
      {componentData}
      <AppDialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <UploadcaseModal
          onClose={() => setOpenUpload(false)}
          plaintiff={plaintiff}
          caseNumber={caseNumber}
          caseId={caseId}
          callBkFn={() => setOpenUpload(false)}
        />
      </AppDialog>
    </Stack>
  );
}
