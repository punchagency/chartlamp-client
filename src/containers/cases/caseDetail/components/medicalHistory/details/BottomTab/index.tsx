import { DocumentDetail, ReportsDetail } from "@/interface";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import CommentTab from "./CommentTab";
import GeneralTab from "./GeneralTab";
import MedicalTab from "./MedicalTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
        // sx={{
        //   height: pxToRem(200),
        // }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BottomTab({
  report,
  caseId,
  sourceFile,
  reportIndex,
}: {
  report: ReportsDetail;
  caseId: string;
  sourceFile: DocumentDetail | undefined;
  reportIndex: number;
}) {
  const searchParams = useSearchParams();

  const icdCodeParam = searchParams.get("icd-code");
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const chartNote = useMemo(() => {
    if (!icdCodeParam) return report.medicalNote;
    if (!report.nameOfDiseaseByIcdCode) return report.medicalNote;
    const cls = report.nameOfDiseaseByIcdCode.find(
      (item) => item.icdCode === icdCodeParam
    );
    if (!cls) return report.medicalNote;
    return cls?.summary || report.medicalNote;
  }, [report]);

  return (
    <Stack>
      <Box
        sx={{
          borderTop: `1px solid ${NEUTRAL[900]}`,
          borderBottom: `1px solid ${NEUTRAL[900]}`,
          minHeight: pxToRem(56),
          "& .MuiTabs-indicator": {
            backgroundColor: SECONDARY[500],
          },
          "& button": {
            fontSize: pxToRem(16),
            fontWeight: 600,
            fontFamily: "inherit",
            textTransform: "capitalize",
          },
        }}
      >
        <Tabs value={value} onChange={handleChange} aria-label="Tab details">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Medical" {...a11yProps(1)} />
          <Tab label="Comment" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <GeneralTab report={report} chartNote={chartNote} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MedicalTab report={report} sourceFile={sourceFile} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <CommentTab
          caseId={caseId}
          reportId={report?._id}
          reportIndex={reportIndex}
        />
      </CustomTabPanel>
    </Stack>
  );
}
