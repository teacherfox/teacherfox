// import styled from "@/configs/mui-styled";
import { Colors } from "@/configs/theme";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Container, AppBar, Box } from "@/configs/mui";

export const TeachersWrapper = styled("div")(
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

export const BenefitsWrapper = styled("div")(({ theme }) => ({
  background: Colors.background.lightGrey,
  paddingTop: "50px",
  paddingBottom: "50px",
  marginΤοp: "50px",
  fontFamily: "Open Sans",
}));

export const PricingWrapper = styled("div")(({ theme }) => ({
  background: Colors.background.lightGrey,
  paddingTop: "10px",
  paddingBottom: "50px",
  marginΤοp: "50px",
  fontFamily: "Open Sans",
  "h2, h4, h5, p": {
    fontFamily: "Open Sans",
    fontWegith: 300,
  },
  h2: {
    fontSize: "32px",
    color: Colors.text.white,
    backgroundColor: Colors.primary.main,
  },
  small: {
    fontSize: "14px",
    color: Colors.text.header2,
    marginTop: "0px",
    marginBottom: "0px",
  },
}));

export const ReviewsSection = styled(Box)(
  ({ theme }) => ({
    backgroundColor: Colors.background.lightGrey,
    // "& > div": {
    //   display: "flex",
    //   justifyContent: "center",
    //   alignItems: "center",
    // },
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
