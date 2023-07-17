// import styled from "@/configs/mui-styled";
import { Colors } from "@/configs/theme";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Container, AppBar, Box } from "@/configs/mui";

export const AboutUsWrapper = styled("main")(
  ({ theme }) => ({
    "& > div": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    fontFamily: "Open Sans",
    h1: {
      fontSize: "35px",
      color: Colors.text.header2,
      paddingLeft: "20px",
    },
    p: {
      fontSize: "16px",
      paddingLeft: "20px",
      paddingRight: "20px",
      color: Colors.text.paragraph3,
    },
    paddingBottom: "50px",
    hr: {
        backgroundColor: Colors.primary.vivid,
        height: "6px",
        opacity: .25,
        marginBottom: '20px',
        margingLeft: '20px',
        transform: 'translateX(20px)'
    },
  }),
  mq({  marginTop: ["0px", "0px", "-50px"],"& > div": {

      flexDirection: ["column", "column",   "row"] 
  } 
})
);

export const WhyUsSection = styled("div")(
  mq({ 
      marginTop: ["0px", "0px", "100px"] 
})
);
