import { SearchIcon } from "@/components/svgs/SearchIcon";
import { CaseDetail } from "@/interface";
import { PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function CasesListView({
  userCases,
}: {
  userCases: CaseDetail[];
}) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const filteredCases = useMemo(() => {
    if (!searchValue) {
      return userCases;
    }
    return userCases.filter((userCase) =>
      userCase.caseNumber.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, userCases]);


  const handleNavigateToDetails = (id: string) => {
    router.push(`/dashboard/case/${id}/medicalHistory?view=mapView`);
  };

  return (
    <Stack
      sx={{
        borderRadius: pxToRem(16),
        bgcolor: "#022625",
        width: "100%",
      }}
    >
      <Box
        sx={{
          borderBottom: `1px solid ${SECONDARY[400]}`,
          width: "100%",
          height: pxToRem(52),
          position: "relative",
          bgcolor: "inherit",
          borderTopLeftRadius: pxToRem(16),
          borderTopRightRadius: pxToRem(16),
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "0.6rem",
            left: "1.2rem",
          }}
        >
          <SearchIcon size={20} />
        </Box>
        <Box
          component={"input"}
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            pl: pxToRem(57),
            py: pxToRem(16),
            bgcolor: "inherit",
            border: "none",
            outline: "none",
            fontSize: pxToRem(14),
            fontWeight: 500,
            borderTopLeftRadius: pxToRem(16),
            borderTopRightRadius: pxToRem(16),
            color: PRIMARY[50],
          }}
        />
      </Box>
      <Stack
        sx={{
          maxHeight: pxToRem(385),
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',  // IE and Edge
          'scrollbar-width': 'none',  // Firefox
        }}
      >
        {filteredCases.map((userCase, index, arr) => (
          <Box
            key={userCase._id}
            onClick={() => handleNavigateToDetails(userCase._id)}
            sx={{
              pl: pxToRem(12),
              py: pxToRem(16),
              bgcolor: "inherit",
              fontSize: pxToRem(14),
              fontWeight: 500,
              borderBottom:
                index !== arr.length - 1
                  ? `1px solid ${SECONDARY[400]}`
                  : "none",
              width: "100%",
              height: pxToRem(48),
              color: PRIMARY[50],
              "&:hover": {
                bgcolor: "#021E1E",
                cursor: "pointer",
              },
            }}
          >
            {userCase.caseNumber}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
