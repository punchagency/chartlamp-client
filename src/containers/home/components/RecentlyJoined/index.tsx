import Button from "@/components/Button";
import { CustomImage } from "@/components/CustomImage";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";

const contacts = [
  {
    name: "Jasper Giacalone",
    email: "justincollins@yourmail.com",
  },
  {
    name: "Verdi Eargun",
    email: "verdieargun@yourmail.com",
  },
];

function RecentlyJoinedRow({
  name,
  email,
  profilePicture,
}: {
  name: string;
  email: string;
  profilePicture: string;
}) {
  return (
    <Stack direction={"row"} alignItems={"center"}>
      <Stack gap={pxToRem(4)} direction={"row"} alignItems={"center"}>
        <CustomImage
          src={profilePicture || "/images/userHeader.png"}
          wrapperSx={{
            height: pxToRem(44),
            width: pxToRem(44),
            "& img": {
              borderRadius: "50%",
            },
          }}
        />
        <Stack gap={pxToRem(4)}>
          <Typography variant="h5" color={SECONDARY[400]}>
            {name}
          </Typography>
          <Typography variant="body2" color={SECONDARY[400]}>
            {email}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default function RecentlyJoined({ recentlyJoined }: { recentlyJoined: any[] }) {
  return (
    <Stack
      sx={{
        padding: pxToRem(16),
        justifyContent: "space-between",
        gap: pxToRem(16),
        width: "100%",
        height: "100%",
        borderRadius: pxToRem(24),
        bgcolor: NEUTRAL[0],
        boxShadow: "0px 0px 10px rgba(5, 113, 112, 0.04)",
      }}
    >
      <Stack gap={pxToRem(16)}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={pxToRem(8)}
        >
          <Typography
            variant="subtitle1"
            color={SECONDARY[500]}
            fontWeight={700}
          >
            Recently Joined
          </Typography>
          <Button
            sx={{
              height: pxToRem(36),
            }}
          >
            Add new
          </Button>
        </Stack>
        <Stack gap={pxToRem(16)}>
          {recentlyJoined.map((item, index) => (
            <RecentlyJoinedRow {...item} key={index} />
          ))}
        </Stack>
      </Stack>
      {/* <Stack
        direction={"row"}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          gap: pxToRem(5),
          mt: "auto",
          height: pxToRem(40),
          width: pxToRem(309),
          borderRadius: pxToRem(12),
          border: `1px solid ${SECONDARY[50]}`,
        }}
      >
        <AddIcon />
        <Typography variant="body1" color={NEUTRAL[500]}>
          Add New Member
        </Typography>
      </Stack> */}
    </Stack>
  );
}
