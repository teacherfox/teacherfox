// import styled from "@/configs/mui-styled";
import { Colors } from "@/configs/theme";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Container, AppBar, Box } from "@/configs/mui";

export const TermsOfUseWrapper = styled("main")(
  ({ theme }) => ({
    paddingTop: "50px",
    marginΤοp: '50px',
    marginBottom: "50px",
    fontFamily: "Open Sans",
    "h1, h2, h3, h4, h5, p, strong": {
      fontFamily: "Open Sans",
      color: Colors.text.header2,
    },
    
  })
);