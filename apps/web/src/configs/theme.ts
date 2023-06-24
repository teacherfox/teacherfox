import { Open_Sans, Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

interface IPrimaryColors {
  main: string;
  light: string;
  vivid: string;
}

interface ITextColors {
  white: string;
  header: string;
  header2: string;
  header3: string;
  paragraph: string;
  paragraph2: string;
  paragraph3: string;
  navbar: string;
  navbarHover: string;
  footer: string;
  success: string;
}

interface IBgColors {
  dark: string;
  lightGrey: string;
}

interface IColors {
  primary: IPrimaryColors;
  text: ITextColors;
  background: IBgColors;
}

export const Colors: IColors = {
  primary: {
    main: "#f68b48",
    light: "#fbeddb",
    vivid: "#ff7333",
  },
  text: {
    white: "#fff",
    header: "#323232",
    header2: "#393939",
    header3: "#c4c8c8",
    paragraph: "#595959",
    paragraph2: "#888888",
    paragraph3: "#5e5d5d",
    navbar: "#595959",
    navbarHover: "#f68b48",
    footer: "#cac6c6",
    success: "#63aa63",
  },
  background: {
    dark: "#595959",
    lightGrey: "#f3f3f3",
  },
};

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const openSans = Open_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      light: "#fbeddb",
      main: "#f68b48",
    },
    secondary: {
      light: "#8c8e8d",
      main: "#595959",
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    // h3: {
    //   fontSize: "3rem",
    // },
  },
});

export default theme;
