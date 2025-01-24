import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import { NEUTRAL, PRIMARY, pxToRem } from "@/theme";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useMapper } from "./hook/useMapper";
const inputStyle = {
  border: `1px solid rgba(201, 206, 206, 1)`,
  width: pxToRem(300),
  paddingLeft: pxToRem(15),
  height: pxToRem(48),
  borderRadius: pxToRem(16),
  outline: "none",
  fontSize: pxToRem(16),
  fontWeight: 600,
  color: "#355151",
  "&:hover": {
    background: NEUTRAL[50],
    borderColor: `${NEUTRAL[300]}`,
  },
  "&:focus": {
    background: NEUTRAL[0],
    border: `2px solid ${NEUTRAL[400]}`,
  },
  "&::placeholder": {
    color: "#CCD4D3",
    fontSize: pxToRem(16),
    fontWeight: 500,
  },
};


export default function MapperContainer() {
  const {
    formik,
    handleSubmit,
    searchByCondition,
    affectedBodyPart,
    isSubmitting,
  } = useMapper();
  
  const getImageDisplay = (index: number) => { 
    const svg: any = affectedBodyPart?.images[index]?.svg;
  const svgDataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
  return svgDataUrl
  }

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
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
          <Typography variant="h2" color="primary">
            ICD-Mapper
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can search by the ICD code or by the body part
          </Typography>
        </Box>
        <form
          style={{
            display: "flex",
            alignItems: "center",
            gap: pxToRem(16),
          }}
          onSubmit={formik.handleSubmit}
        >
          <input
            placeholder="Input ICD Code"
            style={inputStyle}
            id="icdCode"
            name="icdCode"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.icdCode}
          />
          <ButtonWithIcon
            text={isSubmitting ? "Searching..." : "Search"}
            icon={<></>}
            onClick={handleSubmit}
            containerStyles={{
              bgcolor: "rgba(23, 26, 28, 1)",
              height: pxToRem(48),
              width: pxToRem(182),
              gap: pxToRem(4),
              borderRadius: pxToRem(16),
              color: NEUTRAL[0],
              cursor: "pointer",
            }}
          />
        </form>
      </Stack>
      <Divider />
      <Grid container spacing={2}>
        <Grid item md={4} sm={12}>
          {affectedBodyPart?.bodyParts && (
            <Stack
              direction={"column"}
              spacing={1}
              alignItems={"flex-start"}
              sx={{ p: 3 }}
            >
              <Typography
                variant="body1"
                fontWeight={700}
                fontSize={pxToRem(16)}
              >
                {affectedBodyPart.bodyParts}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={400}
                fontSize={pxToRem(16)}
              >
                {`Description: ${affectedBodyPart?.description}`}
              </Typography>
            </Stack>
          )}
        </Grid>
        <Grid item md={8} sm={12}>
          <Stack
            bgcolor={NEUTRAL[0]}
            sx={{
              height: "calc(100vh - 195px)",
              width: "100%",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Stack
              justifyContent="center"
              sx={{
                height: "calc(100vh - 195px)",
                overflowY: "auto",
                position: "relative",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "30%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "block",
                    width: pxToRem(600),
                    height: "calc(100vh - 90px - 120px)",
                    borderRadius: pxToRem(16),
                  }}
                >
                  <Image
                    src={`/parts/structure.svg`}
                    alt=""
                    fill={true}
                    layout="fill"
                    objectFit=""
                    objectPosition="none"
                    priority={true}
                  />
                </Box>
              </Box>
              {Boolean(affectedBodyPart?.images?.length) &&
                affectedBodyPart?.images?.map((item: any, index: any) => (
                  <>
                    {/* <Zoom in={true} style={{ transitionDelay: ` ${index * 100}ms` }}> */}
                    <Box
                      key={index}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "30%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          display: "block",
                          width: pxToRem(600),
                          height: "calc(100vh - 90px - 120px)",
                          borderRadius: pxToRem(16),
                        }}
                      >
                        <Image
                          src={getImageDisplay(index)}
                          alt="anatomy"
                          fill={true}
                          layout="fill"
                          objectFit=""
                          objectPosition="none"
                          priority={true}
                        />
                      </Box>
                    </Box>
                    {/* </Zoom> */}
                  </>
                ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
