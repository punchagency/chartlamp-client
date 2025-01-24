import { Button } from "@/components/Button";
import { IconContainer } from "@/components/IconContainer";
import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import { NoteCellData } from "@/interface";
import { successAlertVar } from "@/state";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup"; // For form validation

interface NoteInput {
  note: string;
  caseId: string;
}

interface EditNoteInput {
  newNote: string;
  noteId: string;
}

const NoteSchema = Yup.object().shape({
  note: Yup.string().required("Comment is required"),
});

export default function NotesModal({
  caseId,
  onClose,
  note,
  handleEditNote,
  loadingNote,
  handleAddNote,
}: {
  caseId: string;
  loadingNote: boolean;
  onClose: () => void;
  handleAddNote?: ({ note, caseId }: NoteInput) => Promise<boolean>;
  handleEditNote?: ({ noteId, newNote }: EditNoteInput) => Promise<boolean>;
  note?: NoteCellData | null;
  }) {
  
  return (
    <Formik
      initialValues={{ note: note?.note || "" }}
      validationSchema={NoteSchema}
      onSubmit={async (values, { resetForm }) => {
        let isCompleted = false;
        if (handleAddNote) {
          isCompleted = await handleAddNote({
            note: values.note,
            caseId,
          });
        }
        if (handleEditNote && note) {
          isCompleted = await handleEditNote({
            newNote: values.note,
            noteId: note.noteId || "",
          });
        }
        if (isCompleted) {
          resetForm();
          onClose();
          successAlertVar("Note saved successfully");
        }
      }}
    >
      {({ errors, touched, values, handleChange, setFieldValue }) => (
        <Form>
          <Stack
            sx={{
              // width: pxToRem(650),
              // minHeight: pxToRem(306),
              padding: pxToRem(24),
              gap: pxToRem(24),
              position: "relative",
            }}
          >
            {" "}
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="subtitle1"
                color={SECONDARY[500]}
                fontWeight={700}
                fontSize={pxToRem(28)}
              >
                {note ? "Edit" : "Add"} a Note
              </Typography>
              <IconContainer tooltip="Close" onClick={onClose}>
                <CloseModalIcon />
              </IconContainer>
            </Stack>
            <Stack>
              <Box
                component={Field}
                name="note"
                as="textarea"
                placeholder="Type your note"
                value={values.note}
                onChange={handleChange}
                resize="none"
                sx={{
                  border: `1px solid ${NEUTRAL[301]}`,
                  width: pxToRem(498),
                  height: pxToRem(134),
                  px: pxToRem(20),
                  py: pxToRem(18.5),
                  borderRadius: pxToRem(16),
                }}
              />
              {errors.note && touched.note && (
                <div style={{ color: "red" }}>{errors.note}</div>
              )}
            </Stack>
            <Stack gap={pxToRem(16)} direction={"row"}>
              <Button
                onClick={() => ""}
                sx={{
                  height: pxToRem(48),
                  width: pxToRem(241),
                  backgroundColor: NEUTRAL[0],
                  border: `1px solid ${NEUTRAL[200]}`,
                  "&:hover": {
                    background: PRIMARY[25],
                    border: `1px solid ${NEUTRAL[200]}`,
                  },
                }}
              >
                <Typography variant="subtitle1" color={SECONDARY[300]}>
                  Cancel
                </Typography>
              </Button>
              <Button
                type="submit"
                sx={{
                  height: pxToRem(48),
                  width: pxToRem(241),
                }}
              >
                {loadingNote ? "Saving..." : "Save Note"}
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
