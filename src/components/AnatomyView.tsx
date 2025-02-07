import { MapViewEnum } from "@/containers/cases/caseDetail/constants";
import { ImageType, ImageTypeTwo } from "@/interface";
import { pxToRem } from "@/theme";
import { Box, Stack } from "@mui/material";
import Drift from "drift-zoom";
import { AnyKindOfDictionary } from "lodash";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
  images: ImageTypeTwo[];
  caseId?: string;
  mappingByCategory?: Record<string, ImageTypeTwo[]>;
  selectedCategory?: string;
  handleFilterByCategory?: (category: string) => void;
  onPartSelect?: (image: ImageTypeTwo) => void;
  hidePopUp?: boolean;
}) {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const containerRef: any = useRef<AnyKindOfDictionary>(null);
  const paneContainerRef = useRef(null);
  const [svgContents, setSvgContents] = useState<{ [key: string]: string }>({});
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

  const getImageUrl = (fileName: string) => {
    const modifiedName = fileName.replace(/\s/g, "+").replace(/\//g, "+");
    return `https://chartlamp.s3.us-east-1.amazonaws.com/svgs/${modifiedName}.svg`;
  };

  const getImageDisplay = (svg: string) => {
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
    return svgDataUrl;
  };

  const handleClick = (event: any) => {
    const svg = event.target.closest("svg");
    if (!svg) return;

    // Get the click position
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    // Convert to SVG coordinate system
    const ctm = svg.getScreenCTM();
    if (ctm) {
      point.x = (point.x - ctm.e) / ctm.a;
      point.y = (point.y - ctm.f) / ctm.d;
    }

    // Use elementsFromPoint to detect elements directly under the click position
    const elementsAtPoint: any[] = document.elementsFromPoint(
      event.clientX,
      event.clientY
    );

    // console.log("elementsAtPoint", elementsAtPoint);

    for (let element of elementsAtPoint) {
      if (["path", "rect", "polygon"].includes(element.tagName.toLowerCase())) {
        const fillColor = element.getAttribute("fill")?.toUpperCase();
        if (!fillColor) continue;
        // Skip white or transparent parts
        if (!["WHITE", "#F1F3F3"].includes(fillColor)) {
          // Check if this element is under the point
          const isInside = element.isPointInFill
            ? element.isPointInFill(point)
            : false;
          if (isInside) {
            return element?.nearestViewportElement?.parentElement.id;
          }
        }
      }
    }
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

  useEffect(() => {
    const fetchSVGs = async () => {
      const svgs: { [key: string]: string } = {};
      await Promise.all(
        images.map(async (item, index) => {
          try {
            const url = getImageUrl(item.fileName);
            const response = await fetch(url);
            const responseText = await response.text();
            if (!responseText.includes("NoSuchKey")) {
              svgs[item.fileName] = responseText;
            } else {
              console.log(
                "Image not found",
                `${index} - ${item.fileName} - ${url}`
              );
            }
          } catch (error) {
            console.log("responseError", error, item.fileName);
          }
        })
      );
      setSvgContents(svgs);
    };

    if (images.length) {
      fetchSVGs();
    }
  }, [images]);

  return (
    <Stack
      alignItems={"flex-end"}
      sx={{
        width: "100%",
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
              id={`${index}`}
              onClick={(e) => {
                const preferredIndex = handleClick(e);
                if (!preferredIndex) return;
                console.log("preferredIndex 1", images[preferredIndex]);
                if (onPartSelect) onPartSelect(images[preferredIndex]);
              }}
              sx={{
                position: "relative",
                display: "block",
                height: "calc(100vh - 350px)",
                borderRadius: pxToRem(16),
                "& svg": {
                  width: "100%",
                  height: "100%",
                  cursor:
                    viewParam === MapViewEnum.mapView ? "pointer" : "default",
                  "& path": {
                    cursor:
                      viewParam === MapViewEnum.mapView ? "pointer" : "default",
                  },
                },
              }}
              dangerouslySetInnerHTML={{
                __html: svgContents[item.fileName] || "",
              }}
            />
          </Box>
        ))}
    </Stack>
  );
}
