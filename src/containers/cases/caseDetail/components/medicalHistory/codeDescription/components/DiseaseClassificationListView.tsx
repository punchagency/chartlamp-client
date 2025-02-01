import AppCheckbox from "@/components/AppCheckbox";
import { Button } from "@/components/Button";
import FilterDrop from "@/containers/cases/components/FilterDrop";
import {
  CaseDcTagMappingUnSaved,
  ImageTypeTwo,
  OptionsType,
} from "@/interface";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { IconButton, Stack, Typography } from "@mui/material";
import { useCallback } from "react";

export default function DiseaseClassificationListView({
  tagsArray,
  selectedCategory,
  caseId,
  mappingByCategory,
  selectedTag,
  loading,
  caseDcTags,
  handleTagIcdCode,
  setSelectedTag,
  handleCancel,
  handleAddCaseTag,
  handleUpdateMultipleCaseDcTags,
  handleIcdCodeClick,
  handleFilterByCategory,
}: {
  tagsArray: OptionsType[] | [];
  mappingByCategory: { [key: string]: ImageTypeTwo[] };
  caseId: string;
  selectedCategory: string;
  selectedTag: string;
  loading: boolean;
  caseDcTags: CaseDcTagMappingUnSaved[];
  handleTagIcdCode: ({
    reportId,
    data,
  }: {
    reportId: string;
    data: {
      caseTagId: string;
      dc: string;
      isRemove: boolean;
    };
  }) => void;
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>;
  handleFilterByCategory: (key: string) => void;
  handleCancel: () => void;
  handleUpdateMultipleCaseDcTags: () => void;
  handleAddCaseTag: (newCaseTags: CaseDcTagMappingUnSaved[]) => void;
  handleIcdCodeClick: (part: ImageTypeTwo) => void;
}) {
  //   console.log("mappingByCategory", mappingByCategory);
  //   console.log("caseDcTags", caseDcTags);
  const isChecked = useCallback(
    ({
      reportId,
      dc,
      icdCode,
    }: {
      reportId: string;
      icdCode?: string;
      dc?: string;
    }) => {
      return caseDcTags.some(
        (item) =>
          (item?.dc === dc || item?.icdCode === icdCode) &&
          item.report === reportId &&
          item.caseTag === selectedTag &&
          !item.isRemove
      );
    },
    [caseDcTags, selectedTag]
  );

  const checkIsAllCategoryChecked = useCallback(
    (parts: ImageTypeTwo[]) => {
      return parts.every((item) => {
        if (!item.classificationId) return true;
        return isChecked({
          reportId: item.reportId,
          dc: item?.classificationId,
          icdCode: item?.icdCode,
        });
      });
    },
    [caseDcTags, selectedTag, mappingByCategory]
  );

  return (
    <Stack
      sx={{
        width: pxToRem(351),
        // width: pxToRem(331),
        maxWidth: pxToRem(351),
        border: `1px solid ${NEUTRAL[201]}`,
        borderTop: "none",
        borderBottomLeftRadius: pxToRem(16),
        borderBottomRightRadius: pxToRem(16),
        position: "absolute",
        top: 0,
        right: pxToRem(16),
        zIndex: 1,
        bgcolor: "white",
      }}
    >
      <Stack
        px={pxToRem(12)}
        py={pxToRem(16)}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant={"h5"} color={SECONDARY[400]}>
          Assign Tags
        </Typography>
        {Boolean(tagsArray.length) && (
          <FilterDrop
            title={selectedTag ? selectedTag : "Select Tag"}
            hideClose={true}
            options={tagsArray.map((item) => {
              return { label: item.label, value: item.value };
            })}
            //   handleSelect={(option) => handleSelect("bodyPart", option)}
            handleSelect={(option) => setSelectedTag(option)}
            bodyStyle={{
              width: "fit-content",
              height: pxToRem(32),
            }}
          />
        )}
      </Stack>

      <Stack
        sx={{
          maxHeight: pxToRem(300),
          overflowY: "auto",
          scrollbarWidth: "thin",
          // reduce scrollbar width
          //   "&::-webkit-scrollbar": {
          //     width: pxToRem(4),
          //   },
          // change scrollbar type
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: NEUTRAL[200],
          },
        }}
      >
        {Object.entries(mappingByCategory).map(([key, value], index) => (
          <Stack key={index}>
            {(() => {
              const isAllCategoryChecked = checkIsAllCategoryChecked(value);
              return (
                <Stack
                  sx={{
                    display: value && value.length > 0 ? "flex" : "none",
                  }}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    p={pxToRem(16)}
                    sx={{
                      borderBottom: `1px solid ${SECONDARY[100]}`,
                      borderTop: `1px solid ${SECONDARY[100]}`,
                      bgcolor: PRIMARY[26],
                      height: pxToRem(48),
                    }}
                  >
                    <Typography
                      variant={"h5"}
                      textTransform={"capitalize"}
                      // onClick={() => handleFilterByCategory(key)}
                      // sx={{
                      //   cursor: "pointer",
                      //   color: selectedCategory === key ? "#08BDBA" : SECONDARY[400],
                      // }}
                    >
                      {key}
                    </Typography>
                    {selectedTag && (
                      <Typography
                        variant={"subtitle2"}
                        color={PRIMARY[900]}
                        fontSize={pxToRem(13)}
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          console.log(
                            "isAllCategoryChecked",
                            isAllCategoryChecked
                          );
                          // return
                          const newCaseTags = value.map((item) => {
                            return {
                              dc: item.classificationId,
                              icdCode: item.icdCode,
                              report: item.reportId,
                              caseTag: selectedTag,
                              case: caseId,
                              isRemove: isAllCategoryChecked ? true : false,
                            };
                          });
                          handleAddCaseTag(newCaseTags);
                        }}
                      >
                        {isAllCategoryChecked ? "Unselect All" : "Select All"}
                      </Typography>
                    )}
                    {/* <IconButton
                onClick={() => handleFilterByCategory("")}
                sx={{
                  visibility: selectedCategory === key ? "visible" : "hidden",
                }}
              >
                <SmallCloseIcon />
              </IconButton> */}
                  </Stack>

                  {value.map((part: ImageTypeTwo, index: number) => (
                    <Stack
                      key={index}
                      px={pxToRem(16)}
                      py={pxToRem(9.5)}
                      direction={"row"}
                      alignItems={"center"}
                      sx={{
                        //   bgcolor: 'red',
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: PRIMARY[50],
                        },
                      }}
                      onClick={() => handleIcdCodeClick(part)}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        gap={pxToRem(8)}
                      >
                        {selectedTag && (
                          <Stack>
                            {(() => {
                              const checked = isChecked({
                                reportId: part.reportId,
                                dc: part?.classificationId,
                                icdCode: part.icdCode,
                              });
                              return (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddCaseTag([
                                      {
                                        dc: part?.classificationId,
                                        icdCode: part.icdCode,
                                        report: part.reportId,
                                        caseTag: selectedTag,
                                        case: caseId,
                                        isRemove: checked,
                                      },
                                    ]);
                                  }}
                                >
                                  <AppCheckbox isChecked={checked} />
                                </IconButton>
                              );
                            })()}
                          </Stack>
                        )}
                        <Typography
                          variant={"body1"}
                          color={SECONDARY[400]}
                          textTransform={"capitalize"}
                        >
                          {part.icdCode}-{part.fileName}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              );
            })()}
          </Stack>
        ))}
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        p={pxToRem(16)}
        sx={{
          display: selectedTag ? "flex" : "none",
          borderTop: `1px solid ${SECONDARY[100]}`,
          borderBottomLeftRadius: pxToRem(16),
          borderBottomRightRadius: pxToRem(16),
          gap: pxToRem(8),
        }}
      >
        <Button
          onClick={handleCancel}
          sx={{
            height: pxToRem(36),
            width: pxToRem(149.5),
            bgcolor: NEUTRAL[0],
            border: `1px solid ${NEUTRAL[200]}`,
            fontSize: pxToRem(16),
            color: SECONDARY[300],
            "&:hover": {
              bgcolor: PRIMARY[25],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          sx={{
            height: pxToRem(36),
            width: pxToRem(149.5),
          }}
          onClick={handleUpdateMultipleCaseDcTags}
        >
          {loading ? "Loading..." : "Apply"}
        </Button>
      </Stack>
    </Stack>
  );
}
