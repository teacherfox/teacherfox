// import styled from "@/configs/mui-styled";
import { Colors } from "@/configs/theme";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Container, AppBar, Box } from "@/configs/mui";

export const TeachersWrapper = styled("div")(
  ({ theme }) => ({
    // "& > div": {
    //   display: "flex",
    //   justifyContent: "center",
    //   alignItems: "center",
    // },
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
    // paddingBottom: "50px",
    // hr: {
    //   backgroundColor: Colors.primary.vivid,
    //   height: "6px",
    //   opacity: 0.25,
    //   marginBottom: "20px",
    //   margingLeft: "20px",
    //   transform: "translateX(20px)",
    // },
  })
  //   mq({
  //     marginTop: ["0px", "0px", "-50px"],
  //     "& > div": {
  //       flexDirection: ["column", "column", "row"],
  //     },
  //   })
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
    // paddingBottom: "50px",
    // hr: {
    //   backgroundColor: Colors.primary.vivid,
    //   height: "6px",
    //   opacity: 0.25,
    //   marginBottom: "20px",
    //   margingLeft: "20px",
    //   transform: "translateX(20px)",
    // },
  })
  //   mq({
  //     marginTop: ["0px", "0px", "-50px"],
  //     "& > div": {
  //       flexDirection: ["column", "column", "row"],
  //     },
  //   })
);
