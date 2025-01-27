import ImageSelectorPopup from "@/containers/cases/caseDetail/components/medicalHistory/codeDescription/components/ImageSelectorPopup";
import { ImageType, ImageTypeTwo } from "@/interface";
import { pxToRem } from "@/theme";
import { Box, Stack } from "@mui/material";
import Drift from "drift-zoom";
import { AnyKindOfDictionary } from "lodash";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function AnatomyView({
  images,
  caseId,
  mappingByCategory,
  handleFilterByCategory,
  selectedCategory,
  onPartSelect,
  hidePopUp = false,
}: {
  images: ImageType[];
  caseId?: string;
  mappingByCategory?: Record<string, ImageTypeTwo[]>;
  selectedCategory?: string;
  handleFilterByCategory?: (category: string) => void;
  onPartSelect?: (path: string) => void;
  hidePopUp?: boolean;
}) {
  const containerRef: any = useRef<AnyKindOfDictionary>(null);
  const paneContainerRef = useRef(null);
  const [popup, setPopup] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const { clientX, clientY } = event;

      setPopup({
        visible: true,
        x: clientX - rect.left + 10, // Adjust relative to parent container
        y: clientY - rect.top + 10,
      });
    }
  };

  const handleClosePopup = () => {
    setPopup({ visible: false, x: 0, y: 0 });
  };

  useEffect(() => {
    const driftInstances: any = [];

    const driftImgs = document.querySelectorAll(".drift-img");
    if (paneContainerRef.current) {
      driftImgs.forEach((img: any) => {
        const driftInstance = new Drift(img, {
          paneContainer: paneContainerRef.current,
          inlinePane: false,
          zoomFactor: 5,
        } as any);
        driftInstances.push(driftInstance);
      });
    }

    return () => {
      driftInstances.forEach((instance: any) => instance.destroy());
    };
  }, [images]);

  // const getImageDisplay = (index: number) => {
  //   const svg: any = images[index]?.svg;
  //   const svgDataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
  //   return svgDataUrl;
  // };

  const getImageUrl = (fileName: string) => {
    const modifiedName = fileName.replace(/\s/g, "+").replace(/\//g, "+");
    return `https://chartlamp.s3.us-east-1.amazonaws.com/svgs/${modifiedName}.svg`;
  };

  return (
    <Stack
      alignItems={"flex-end"}
      sx={{
        width: "100%",
        // height: "calc(100vh - 300px)",
        flex: 1,
        overflowY: "hidden",
        position: "relative",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
      ref={containerRef}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "block",
            width: pxToRem(600),
            height: "calc(100vh - 350px)",
            borderRadius: pxToRem(16),
          }}
        >
          <Image
            src={`/parts/structure.svg`}
            alt=""
            fill={true}
            layout="fill"
            objectFit="contain"
            objectPosition="none"
            priority={true}
          />
        </Box>
      </Box>
      {Boolean(images?.length) &&
        images?.map((item: ImageType, index: number) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "block",
                width: pxToRem(600),
                height: "calc(100vh - 350px)",
                borderRadius: pxToRem(16),
                // background: "red",
              }}
              onClick={(e) => handleImageClick(e)}
            >
              <Image
                className="drift-img"
                src={getImageUrl(item.fileName)}
                data-zoom={getImageUrl(item.fileName)}
                alt=""
                fill={true}
                layout="fill"
                objectFit=""
                objectPosition="none"
                priority={true}
                // onError={(e) => {
                //   console.log("getImageUrl error", item.fileName);
                //   // e.target.src = '';
                // }}
                onError={(e: any) => {
                  e.target.style.display = "none";
                }}
                style={{
                  cursor: "pointer",
                  // background: "red",
                }}
              />
            </Box>
          </Box>
        ))}
      {popup.visible && !hidePopUp && (
        <Stack
          sx={{
            width: "fit-content",
            maxHeight: "10rem",
            border: "1px solid rgba(221, 225, 225, 1)",
            borderTop: "none",
            borderRadius: pxToRem(12),
            overflowY: "auto",
            scrollbarWidth: "thin",
            position: "absolute",
            top: popup.y,
            left: popup.x,
            zIndex: 10,
            // bgcolor: "red",
          }}
        >
          {
            <ImageSelectorPopup
              mappingByCategory={mappingByCategory || {}}
              caseId={caseId || ""}
              selectedCategory={selectedCategory || ""}
              handleFilterByCategory={handleFilterByCategory || (() => {})}
              handleClickAway={handleClosePopup}
              onPartSelect={onPartSelect || (() => {})}
            />
          }
        </Stack>
      )}
    </Stack>
  );
}
