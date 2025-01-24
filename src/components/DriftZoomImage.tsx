import { pxToRem } from "@/theme";
import { Box, Stack } from "@mui/material";
import Drift from "drift-zoom";
import Image from "next/image";
import { useEffect, useRef } from "react";

const DriftZoomImage = ({ thumbnail, zoomImage }: any) => {
  const imageRef = useRef(null);
  let driftInstance: any = null;
  const paneContainerRef = useRef(null);

  useEffect(() => {
    if (imageRef.current && paneContainerRef.current) {
      driftInstance = new Drift(imageRef.current, {
        paneContainer: paneContainerRef.current,
        inlinePane: false,
      } as any);
    }

    // Cleanup Drift instance on unmount
    return () => {
      if (driftInstance) {
        driftInstance.destroy();
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "block",
        width: pxToRem(200),
        height: "calc(100vh - 300px)",
      }}
    >
      <Image
        ref={imageRef}
        src={thumbnail}
        data-zoom={zoomImage}
        style={{ cursor: "zoom-in" }}
        alt="anatomy"
        fill={true}
        layout="fill"
        objectFit=""
        objectPosition="none"
        priority={true}
      />
      <Stack
        ref={paneContainerRef}
        alignItems={"flex-end"}
        sx={{
          width: pxToRem(300),
          height: "calc(100vh - 300px)",
          //   backgroundColor: "red",
        }}
      ></Stack>
    </Box>
  );
};

export default DriftZoomImage;
