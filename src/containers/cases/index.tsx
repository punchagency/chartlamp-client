"use client";

import NavBack from "@/components/NavBack";
import { pxToRem } from "@/theme";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import CasesTable from "./components/table";
import { useCases } from "./hooks/useCases";

export default function CasesPageContainer() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  }

  return (
    <Stack
      sx={{
        borderRadius: pxToRem(24),
        gap: pxToRem(12),
        width: "100%",
      }}
    >
      <NavBack handleNavigation={goBack} />
      <Stack width={"100%"}>
        <CasesTable />
      </Stack>
    </Stack>
  );
}
