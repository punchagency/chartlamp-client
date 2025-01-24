import { Box } from "@mui/material";
import Image from "next/image";

export function CustomImage({
  wrapperSx,
  src,
}: {
  src: string;
  wrapperSx?: Object;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "block",
        ...wrapperSx,
      }}
    >
      <Image
        src={src}
        alt="headerImage"
        fill={true}
        // layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority={true}
      />
    </Box>
  );
}
