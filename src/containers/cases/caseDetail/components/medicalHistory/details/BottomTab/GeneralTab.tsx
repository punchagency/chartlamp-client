import HighlightedText from "@/components/HighlightedText";
import { ReportsDetail } from "@/interface";
import { SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";
import Highlighter from "react-highlight-words";

export default function GeneralTab({
  report,
  chartNote,
  excerpt,
  icdCode,
  pageNumber,
  diseaseName,
}: {
  report: ReportsDetail;
  chartNote: string;
  diseaseName?: string;
  excerpt?: string;
  icdCode?: string;
  pageNumber?: number;
}) {
  return (
    <Stack
      sx={{
        px: pxToRem(16),
        pt: pxToRem(24),
        pb: pxToRem(24),
        gap: pxToRem(32),
      }}
    >
      <Stack gap={pxToRem(8)}>
        <Typography variant="h5" color={SECONDARY[500]}>
          Charts Notes:
        </Typography>

        <Typography
          variant="body1"
          color={SECONDARY[400]}
          lineHeight={pxToRem(19.2)}
        >
          {chartNote}
        </Typography>
      </Stack>
      <Stack gap={pxToRem(8)}>
        <Typography variant="h5" color={SECONDARY[500]}>
          Document Excerpt:
        </Typography>

        {excerpt && diseaseName ? (
          // <HighlightedText
          //   content={excerpt}
          //   highlight={diseaseName}
          //   alt={icdCode ? [icdCode, icdCode.split(".")?.join(",")] : undefined}
          // />
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={icdCode ? [icdCode, diseaseName] : []}
            autoEscape={true}
            textToHighlight={excerpt}
            highlightStyle={{
              // fontWeight: 500,
              fontSize: pxToRem(16),
              color: SECONDARY[400],
              lineHeight: pxToRem(19.2),
              fontFamily: 'inherit'
            }}
          />
        ) : (
          <Typography
            variant="body1"
            color={SECONDARY[400]}
            lineHeight={pxToRem(19.2)}
          >
            Not available
          </Typography>
        )}
      </Stack>
      <Stack gap={pxToRem(8)}>
        <Typography variant="h5" color={SECONDARY[500]}>
          Page number:
        </Typography>

        <Typography
          variant="body1"
          color={SECONDARY[400]}
          lineHeight={pxToRem(19.2)}
        >
          {pageNumber ? pageNumber : "Not available"}
        </Typography>
      </Stack>
      {/* <Stack gap={pxToRem(8)}>
        <Typography variant="h5" color={SECONDARY[500]}>
          Related:
        </Typography>

        <Typography variant="body1" color={SECONDARY[400]}>
          25 March, 2021
        </Typography>
      </Stack> */}
    </Stack>
  );
}
