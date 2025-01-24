"use client";
import { useAuthContext } from "@/auth/useAuthContext";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import OutlinedButton from "@/components/OutlinedButton";
import axiosInstance, { endpoints } from "@/lib/axios";
import { errorAlertVar, successAlertVar } from "@/state";
import { ERROR, PRIMARY, pxToRem, SECONDARY } from "@/theme";
import {
  AppBucketName,
  createParams,
  filePath,
  getFileKey,
  s3Client
} from "@/utils/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Divider, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Button from "../../../components/Button";

type FormValuesProps = {
  email: string;
  name: string;
  phone: string;
};

export default function ProfileTab() {
  const { user, initialize } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    name: Yup.string().required("Name is required"),
    phone: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      email: user?.email || "",
      name: user?.name || "",
      phone: user?.phone || "",
    }),
    [user]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema) as any,
    defaultValues,
  });

  const {
    reset,
    // setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      setLoading(true);
      const imageUrl = await handlePictureSubmit();
      const response = await axiosInstance.patch(
        `${endpoints.user.update}/${user?._id}`,
        {
          ...data,
          profilePicture: imageUrl,
        }
      );
      if (response.data) {
        await initialize();
      }
      successAlertVar("Profile updated successfully");
      setLoading(false);
    } catch (err: any) {
      // reset();
      console.log(err);
      // setError('email', { type: 'manual', message: err.message });
      errorAlertVar(err.message);
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles) {
        const file = acceptedFiles[0] as File;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setPreview(result);
        };
        reader.readAsDataURL(file);
      }
    },
    maxFiles: 1,
    noDrag: true,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
    },
    noClick: true,
  });

  const handlePictureSubmit = async () => {
    if (!selectedFile) return "";
    const params = createParams(selectedFile);
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    if (params.Key && data.$metadata.httpStatusCode === 200) {
      const imageUrl = filePath(params.Key);
      setPreview(imageUrl);
      setSelectedFile(null);
      return imageUrl;
    }
  };

  const handleDeletePicture = async () => {
    // delete picture from s3
    if (!preview) return;
    const key = getFileKey(preview);
    const params = {
      Bucket: AppBucketName,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(params);
      const data = await s3Client.send(command);
      if (data.$metadata.httpStatusCode === 204) {
        console.log("Image successfully deleted from S3.");
        setPreview(null);
      } else {
        console.log("Failed to delete image from S3.");
      }
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  };

  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(user.profilePicture);
    }
  }, [user]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderLeft: `1px solid ${PRIMARY["10"]}`,
        mt: 2,
        minHeight: "85vh",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
        <Typography variant="h2">Change Profile Information</Typography>
        <Typography variant="body2" color="text.secondary">
          You can invite mulitple team member at a time.
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Profile Picture
        </Typography>

        <Stack {...getRootProps()} gap={2}>
          <Avatar
            src={preview || "/images/userHeader.png"}
            onClick={open}
            alt="profile photo"
            sx={{
              width: pxToRem(120),
              height: pxToRem(120),
            }}
          />
          <input {...getInputProps()} />
          <Stack direction="row" spacing={2}>
            <OutlinedButton
              customColor={SECONDARY["350"]}
              onClick={open}
              // disabled={!selectedFile}
            >
              {preview ? "Change picture" : "Select picture"}
            </OutlinedButton>
            <OutlinedButton
              customColor={ERROR["400"]}
              onClick={handleDeletePicture}
            >
              Delete picture
            </OutlinedButton>
          </Stack>
        </Stack>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: pxToRem(500),
            }}
          >
            <Stack direction="column" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <RHFTextField name="name" label="" placeholder="Name" required />
            </Stack>
            <Stack direction="column" spacing={1}>
              <Typography variant="body1" color="text.secondary">
                Email
              </Typography>
              <RHFTextField
                name="email"
                label=""
                placeholder="Email"
                required
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Phone number
              </Typography>
              <RHFTextField
                name="phone"
                label=""
                placeholder="Phone number"
                required
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              sx={{
                maxWidth: pxToRem(148),
              }}
            >
              {loading ? "Loading..." : "Save changes"}
            </Button>
          </Box>
        </FormProvider>
      </Box>
    </Box>
  );
}
