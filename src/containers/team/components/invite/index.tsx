import Button from "@/components/Button";
import { IconContainer } from "@/components/IconContainer";
import FormProvider, { RHFSelect } from "@/components/hook-form";
import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import { usePostRequests } from "@/hooks/useRequests";
import { endpoints } from "@/lib/axios";
import { successAlertVar } from "@/state";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import {
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type FormValuesProps = {
  email: string;
  role: string;
  invites: { email: string; role: string }[];
  afterSubmit?: string;
};

export default function InviteModal({ onClose }: { onClose: () => void }) {
  const defaultValues = {
    email: "",
    role: "admin",
    invites: [],
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "invites",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { data, loading, error, postRequests } = usePostRequests();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // Combine email and invites data
      const combinedData = [
        ...(data.email && data.role
          ? [{ email: data.email, role: data.role }]
          : []),
        ...(data.invites || []),
      ];

      // Send all requests concurrently
      await Promise.all(
        combinedData.map((element) =>
          postRequests(endpoints.invitation.create, element)
        )
      );

      successAlertVar("Invitation sent successfully");
      window.location.reload();
    } catch (err) {
      reset();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const email = getValues("email");
      const role = getValues("role");
      if (email && role) {
        if (editingIndex !== null) {
          update(editingIndex, { email, role });
          setEditingIndex(null);
        } else {
          append({ email, role });
        }
        setValue("email", "");
      }
    }
  };

  const handleEdit = (index: number) => {
    const invite = fields[index];
    setValue("email", invite.email);
    setValue("role", invite.role);
    setEditingIndex(index);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
        sx={{
          padding: pxToRem(24),
          gap: pxToRem(24),
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack gap={pxToRem(8)}>
            <Typography
              variant="subtitle1"
              color={SECONDARY[500]}
              fontWeight={700}
              fontSize={pxToRem(28)}
            >
              Invite Team
            </Typography>
            <Typography
              variant="body1"
              color={SECONDARY[300]}
              maxWidth={pxToRem(468)}
            >
              You can invite multiple team members at a time. Type email and hit
              enter to invite multiple.
            </Typography>
          </Stack>
          <Stack gap={pxToRem(8)} alignSelf={"flex-start"}>
            <IconContainer tooltip="Close" onClick={onClose}>
              <CloseModalIcon />
            </IconContainer>
          </Stack>
        </Stack>
        <Stack gap={pxToRem(12)}>
          <Typography variant="subtitle2" color={SECONDARY[500]}>
            Invites
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {fields.map((field, index) => (
              <Chip
                key={field.id}
                label={`${field.email} (${field.role})`}
                onDelete={() => remove(index)}
                onClick={() => handleEdit(index)}
                sx={{ marginBottom: pxToRem(8) }}
              />
            ))}
          </Stack>
          <TextField
            name="email"
            placeholder="Email"
            onKeyDown={handleKeyDown}
            value={watch("email")}
            sx={{
              borderRadius: "16px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
              },
            }}
            onChange={(e) => setValue("email", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <RHFSelect
                    name="role"
                    label=""
                    placeholder="Role"
                    defaultValue="member"
                    variant="outlined"
                    size="small"
                    // native={true}
                    sx={{
                      minWidth: pxToRem(120),
                      py: pxToRem(8),
                      border: "none",
                      "&:hover": {
                        borderColor: "inherit",
                      },
                      "&.Mui-focused": {
                        borderColor: "inherit",
                      },
                    }}
                  >
                    {[
                      { value: "admin", label: "Admin" },
                      { value: "user", label: "User" },
                    ].map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {" "}
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack direction={"row"} gap={pxToRem(16)} alignItems={"center"}>
          <Button
            onClick={onClose}
            sx={{
              height: pxToRem(48),
              width: "100%",
              borderRadius: pxToRem(16),
              bgcolor: "#fff",
              border: `1px solid ${NEUTRAL[200]}`,
              color: SECONDARY[300],
              "&:hover": {
                color: SECONDARY["400"],
                border: `1px solid ${SECONDARY["100"]}`,
                backgroundColor: PRIMARY["25"],
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            sx={{
              height: pxToRem(48),
              width: "100%",
              borderRadius: pxToRem(16),
            }}
          >
            {loading ? "Sending..." : "Send invite"}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
