import { Colors } from "@/configs/theme";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Container, AppBar, Box } from "@/configs/mui";

export const ResultsWrapper = styled("main")(({ theme }) => ({
  background: Colors.background.lightGrey,
  marginΤοp: "50px",
  paddingBottom: "50px",
  fontFamily: "Open Sans",
  h3: {
    fontSize: "35px",
    color: Colors.text.header2,
    paddingLeft: "20px",
  },
  "p, h6": {
    fontSize: "16px",
    paddingLeft: "20px",
    paddingRight: "20px",
    color: Colors.text.paragraph3,
  },
}));

export const UserCardWrapper = styled(Box)(
  ({ theme }) => ({
    marginΤοp: "50px",
    fontFamily: "Open Sans",
    "h2, h4, h5, p": {
      fontFamily: "Open Sans",
      fontWegith: 300,
    },
    h2: {
      fontSize: "40px",
      color: Colors.text.header3,
    },

    h4: {
      fontSize: "24px",
      color: Colors.text.paragraph3,
      marginTop: "0px",
      marginBottom: "0px",
      fontWeight: 400,
    },
    h5: {
      fontSize: "23px",
      color: Colors.text.success,
      marginTop: "0px",
      marginBottom: "0px",
    },
    h6: {
      fontSize: "16px",
      color: Colors.text.paragraph3,
      marginTop: "0px",
      padding: "0px",
      marginBottom: "0px",
    },
    p: {
      fontSize: "16px",
      color: Colors.text.paragraph2,
      marginBottom: "0px",
      padding: "0px",
    },
    ".lessons-title": {
      fontSize: "16px",
    },
  })
);
