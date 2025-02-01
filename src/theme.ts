"use client";
import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  const actualVal = (value / 1920) * 100;
  return `${actualVal}vw`;
}

export const NEUTRAL = {
  0: "#FFFFFF",
  50: "#FBFBFB",
  100: "#F1F3F3",
  200: "#DDE1E1",
  201: "rgba(221, 225, 225, 1)",
  300: "#C9CECE",
  301: "rgba(201, 206, 206, 1)",
  400: "#AEB6B6",
  500: "rgba(120, 133, 133, 1)",
  600: "rgba(5, 113, 112, 0.04)",
  700: "rgba(75, 83, 83, 1)",
  800: "#2D3232",
  900: "rgba(241, 243, 243, 1)",
};

export const SECONDARY = {
  0: "#000000",
  50: "#E6E9E9",
  100: "#D1D1D2",
  150: "#021E1E",
  200: "#9AA8A8",
  250: "#022625",
  300: "#677D7C",
  350: "#677D7C",
  400: "#355151",
  500: "#022625",
};

export const PRIMARY = {
  0: "#FFFFFF",
  5: "#E0E0E0",
  10: "#E8E8E8",
  25: "#F0F8F8",
  26: "rgba(240, 248, 248, 1)",
  50: "#E6F8F8",
  100: "#CEF2F1",
  200: "#9CE5E3",
  400: "#39CAC8",
  500: "#08BDBA",
  700: "#057170",
  800: "#034C4A",
  900: "rgba(2, 38, 37, 1)",
};

export const SUCCESS = {
  50: "#E7F8F0",
  100: "#D0F1E1",
  200: "#A0E2C3",
  500: "rgba(18, 183, 106, 1)",
  400: "#41C588",
  600: "#0E9255",
};

export const GREEN = {
  300: "#677D7C",
  200: "#9AA8A8",
  301: "rgba(103, 125, 124, 1)",
  400: "rgba(53, 81, 81, 1)",
  500: "rgba(2, 38, 37, 1)",
  700: "rgba(1, 23, 22, 1)",
};

export const ERROR = {
  50: "#FDECEC",
  100: "#FAD9D9",
  200: "#F5B4B4",
  400: "#EB6969",
  500: "#E64343",
  600: "#B83636",
};

export const WARNING = {
  50: "#FFF6E0",
  200: "#FFDCA0",
  400: "#FFC34D",
  500: "#FCECEC",
  600: "#FFA600",
  700: "#FF8C00",
};

// Define your primary colors
const PRIMARY_LIGHT = "#2E3133";
const PRIMARY_MAIN = "#171A1C";
const PRIMARY_DARK = "#0F1214";

const primaryFont = Inter({
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: {
      light: PRIMARY_LIGHT,
      main: PRIMARY_MAIN,
      dark: PRIMARY_DARK,
    },
    secondary: {
      main: "#19857b",
    },
    background: {
      default: "#F9F9F9",
      paper: "#ffffff",
    },
    error: {
      main: "#ff1744",
    },
  },
  typography: {
    fontFamily: primaryFont.style.fontFamily,
    h1: {
      fontWeight: 700,
      fontSize: pxToRem(36),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(32),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(28),
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: pxToRem(24),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(22),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(20),
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: pxToRem(20),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(18),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(16),
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: pxToRem(18),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(16),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(14),
      },
    },
    h5: {
      fontWeight: 700,
      fontSize: pxToRem(16),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(14),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(12),
      },
    },
    h6: {
      fontWeight: 700,
      fontSize: pxToRem(14),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(12),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(10),
      },
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: pxToRem(16),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(14),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(12),
      },
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: pxToRem(14),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(12),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(10),
      },
    },
    body1: {
      fontWeight: 500,
      fontSize: pxToRem(16),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(14),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(12),
      },
    },
    body2: {
      fontWeight: 500,
      fontSize: pxToRem(14),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(12),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(10),
      },
    },
    caption: {
      fontWeight: 500,
      fontSize: pxToRem(12),
      [`@media (max-width:1200px)`]: {
        fontSize: pxToRem(10),
      },
      [`@media (max-width:768px)`]: {
        fontSize: pxToRem(8),
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "initial",
          padding: pxToRem(12),
          [`@media (max-width:1200px)`]: {
            padding: pxToRem(10),
          },
          [`@media (max-width:768px)`]: {
            padding: pxToRem(8),
          },
        },
      },
    },
  },
});

export default theme;
