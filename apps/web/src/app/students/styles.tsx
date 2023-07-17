// import styled from "@/configs/mui-styled";
import { Colors } from "@/configs/theme";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Container, AppBar, Box } from "@/configs/mui";

export const StudentsWrapper = styled("div")(
  ({ theme }) => ({
    paddingTop: "50px",
    marginΤοp: "50px",
    fontFamily: "Open Sans",
    "h2, h4, h5, p": {
      fontFamily: "Open Sans",
    },
    h2: {
      fontSize: "40px",
      color: Colors.text.header3,
    },
    h5: {
      fontSize: "24px",
      color: Colors.text.header2,
      marginTop: "0px",
      marginBottom: "0px",
    },
    h4: {
      fontSize: "24px",
      color: Colors.text.header2,
      marginTop: "0px",
      marginBottom: "0px",
    },
    p: {
      fontSize: "16px",
      color: Colors.text.paragraph3,
    },
  })
);

export const ReviewsSection = styled(Box)(
  ({ theme }) => ({
    backgroundColor: Colors.background.lightGrey,
    paddingTop: "30px",
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
    h5: {
      fontSize: "24px",
      color: Colors.text.header2,
      marginTop: "0px",
      marginBottom: "0px",
    },
    h4: {
      fontSize: "24px",
      color: Colors.text.header2,
      marginTop: "0px",
      marginBottom: "0px",
    },
    p: {
      fontSize: "16px",
      color: Colors.text.paragraph3,
      marginBottom: "0px",
    },
  })
);
