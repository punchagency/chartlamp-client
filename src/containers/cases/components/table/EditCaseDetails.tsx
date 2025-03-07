import Button from "@/components/Button";
import { IconContainer } from "@/components/IconContainer";
import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import { usePatchRequests } from "@/hooks/useRequests";
import { CaseDetail } from "@/interface";
import { endpoints } from "@/lib/axios";
import { errorAlertVar, successAlertVar } from "@/state";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

const inputStyle = {
  border: `1px solid rgba(201, 206, 206, 1)`,
  width: "100%",
  paddingLeft: pxToRem(15),
  height: pxToRem(48),
  borderRadius: pxToRem(16),
  outline: "none",
  fontSize: pxToRem(16),
  fontWeight: 600,
  color: "#355151",
  "&:hover": {
    background: NEUTRAL[50],
    borderColor: `${NEUTRAL[300]}`,
  },
  "&:focus": {
    background: NEUTRAL[0],
    border: `2px solid ${NEUTRAL[400]}`,
  },
  "&::placeholder": {
    color: "#CCD4D3",
    fontSize: pxToRem(16),
    fontWeight: 500,
  },
};

export default function EditCaseDetails({
  onClose,
  selectedCaseNumber,
  plaintiff,
  caseId,
  targetCompletion,
}: {
  onClose: () => void;
  selectedCaseNumber: string;
  targetCompletion: Date;
  caseId: string;
  plaintiff: string;
}) {
  const {
    loading: loadingPatch,
    data,
    error,
    patchRequests,
  } = usePatchRequests<CaseDetail>();

  const handleSubmit = async (values: any) => {
    try {
      await patchRequests(`${endpoints.case.create}/${caseId}`, {
        ...values,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
      onClose();
      successAlertVar("Case updated successfully");
    }
    if (error) {
      errorAlertVar("");
    }
  }, [data, error]);

  const formik = useFormik({
    initialValues: {
      plaintiff: plaintiff || "",
      caseNumber: selectedCaseNumber || "",
      targetCompletion: targetCompletion,
    },

    validationSchema: Yup.object({
      plaintiff: Yup.string().required("Required"),
      caseNumber: Yup.string().required("Required"),
      targetCompletion: Yup.date().required("Required"),
    }),
    onSubmit: () => {
      handleSubmit({
        ...formik.values,
      });
    },
  });

  return (
    <Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        padding={pxToRem(20)}
        // height={pxToRem(64)}
      >
        <Stack>
          <Typography
            color={SECONDARY[500]}
            fontWeight={700}
            fontSize={pxToRem(22)}
          >
            Edit case details
          </Typography>
          {/* <Typography variant="body1" color={SECONDARY[300]}>
            Case Number: {selectedCaseNumber}
          </Typography> */}
        </Stack>
        <IconContainer tooltip="Close" onClick={onClose}>
          <CloseModalIcon />
        </IconContainer>
      </Stack>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: pxToRem(25),
          //   width: "100%",
          minWidth: pxToRem(500),
          borderTop: `1px solid ${NEUTRAL[200]}`,
          padding: pxToRem(20),
        }}
        onSubmit={formik.handleSubmit}
      >
        <Stack gap={0.5} width={"100%"}>
          <Typography variant="body1" color={SECONDARY[300]}>
            Plaintiff
          </Typography>
          <input
            placeholder=""
            style={inputStyle}
            id="plaintiff"
            name="plaintiff"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.plaintiff}
          />
        </Stack>
        <Stack gap={0.5} width={"100%"}>
          <Typography variant="body1" color={SECONDARY[300]}>
            Case Number
          </Typography>
          <input
            placeholder=""
            id="caseNumber"
            name="caseNumber"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.caseNumber}
            style={inputStyle}
          />
        </Stack>
        <Stack gap={0.5} width={"100%"}>
          <Typography variant="body1" color={SECONDARY[300]}>
            Target completion
          </Typography>
          {/* <Stack sx={inputStyle}></Stack> */}
          <input
            placeholder=""
            id="targetCompletion"
            name="targetCompletion"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={
              formik.values.targetCompletion
                ? format(new Date(formik.values.targetCompletion), "yyyy-MM-dd")
                : ""
            }
            style={inputStyle}
          />
        </Stack>

        <Button type="submit">{loadingPatch ? "Saving..." : "Save"}</Button>
      </form>
    </Stack>
  );
}
