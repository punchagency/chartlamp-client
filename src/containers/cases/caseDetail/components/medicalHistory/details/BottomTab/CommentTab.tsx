import Button from "@/components/Button";
import { CustomImage } from "@/components/CustomImage";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup"; // For form validation
import { useCaseDetailsView } from "../hook";

const CommentSchema = Yup.object().shape({
  comment: Yup.string().required("Comment is required"),
});

export default function CommentTab({
  caseId,
  reportId,
  reportIndex,
}: {
  caseId: string;
  reportId: string;
  reportIndex: number;
}) {
  // console.log("CommentTab", caseId, reportId);
  const {
    addComment,
    getReportComments,
    updateComment,
    comments,
    setComments,
  } = useCaseDetailsView();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      await getReportComments({
        caseId,
        reportId,
      });
    })();
  }, [caseId, reportId, reportIndex]);

  return (
    <Formik
      initialValues={{ comment: "" }}
      validationSchema={CommentSchema}
      onSubmit={async (values, { resetForm }) => {
        const newComment = {
          comment: values.comment,
          isEdited: false,
          createdAt: new Date(),
        };

        if (commentToEdit !== null) {
          // Edit comment
          const editedComment = comments[commentToEdit];
          editedComment.comment = values.comment;
          editedComment.isEdited = true;
          editedComment.createdAt = new Date();
          setComments((prevComments: any[]) => {
            prevComments[commentToEdit] = editedComment;
            return prevComments;
          });
          await updateComment({
            caseId,
            reportId,
            commentId: editedComment._id,
            comment: values.comment,
          });
          setCommentToEdit(null);
          resetForm();
        } else {
          setComments((prevComments: any[]) => [...prevComments, newComment]);
          setIsSubmitting(true);
          try {
            await addComment({
              caseId,
              reportId,
              data: { comment: values.comment },
            });
            resetForm();
          } catch (error) {
            console.error("Failed to add comment", error);
          } finally {
            setIsSubmitting(false);
          }
        }
      }}
    >
      {({ errors, touched, values, handleChange, setFieldValue }) => (
        <Form>
          <Stack
            sx={{
              px: pxToRem(16),
              pt: pxToRem(24),
              pb: pxToRem(24),
              gap: pxToRem(32),
            }}
          >
            {Boolean(comments?.length) && (
              <Stack gap={pxToRem(16)}>
                {comments.map((comment: any, index) => (
                  <Stack direction="row" alignItems={"center"} gap={6} key={index}>
                    <Stack
                      gap={pxToRem(16)}
                      direction={"row"}
                      alignItems={"center"}
                      key={index}
                    >
                      <CustomImage
                        src={
                          comment?.user?.profilePicture ||
                          "/images/userHeader.png"
                        }
                        wrapperSx={{
                          height: pxToRem(34),
                          width: pxToRem(34),
                          "& img": {
                            borderRadius: "50%",
                          },
                        }}
                      />
                      <Stack gap={pxToRem(4)}>
                        <Typography
                          variant="h5"
                          color={SECONDARY[400]}
                          textTransform={"capitalize"}
                        >
                          {comment?.comment}
                        </Typography>
                        {comment?.createdAt && (
                          <Typography
                            variant="h5"
                            color={SECONDARY[400]}
                            textTransform={"capitalize"}
                          >
                            {format(
                              new Date(comment?.createdAt),
                              "MMM dd, yyyy hh:mm a"
                            )}
                          </Typography>
                        )}
                        {comment?.isEdited && (
                          <Typography
                            variant="h5"
                            color={SECONDARY[400]}
                            textTransform={"capitalize"}
                            sx={{
                              opacity: 0.5,
                            }}
                          >
                            Edited
                          </Typography>
                        )}
                      </Stack>
                    </Stack>

                    {comment?._id && (
                      <IconButton
                        onClick={() => {
                          setFieldValue("comment", comment.comment);
                          setCommentToEdit(index);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>
                ))}
              </Stack>
            )}
            <Box
              component={Field}
              name="comment"
              // as="textarea"
              placeholder="Type your comment"
              value={values.comment}
              onChange={handleChange}
              sx={{
                border: `1px solid ${NEUTRAL[301]}`,
                width: "100%",
                px: pxToRem(20),
                py: pxToRem(18.5),
                height: pxToRem(140),
                borderRadius: pxToRem(16),
              }}
            />
            {errors.comment && touched.comment && (
              <div style={{ color: "red" }}>{errors.comment}</div>
            )}

            <Button
              type="submit"
              sx={{
                height: pxToRem(48),
                width: pxToRem(90),
                borderRadius: pxToRem(16),
                fontSize: pxToRem(16),
                fontWeight: 600,
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
