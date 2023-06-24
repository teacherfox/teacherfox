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

export const Section2 = styled("div")(
  mq({ 

      marginTop: ["0px", "0px", "100px"] 
  
})
);

// export const Logo = styled("img")({
//   marginRight: 100,
// });

// export const NavbarContainer = styled("div")({
//   fontFamily: "Open Sans",
//   padding: "7.5px 30px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   minHeight: 120,
//   fontSize: 17,
// });

// export const NavbarAuthButtonsContainer = styled("div")(
//   mq({
//     display: ["flex"],
//     flexDirection: ["column", "row"],
//     justifyContent: [
//       "flex-start",
//       "flex-start",
//       "flex-start",
//       "flex-start",
//       "space-between",
//     ],
//     alignItems: ["center"],
//     marginTop: ["10px", "10px", "10px", "10px", "0px"],
//     marginBottom: ["10px", "10px", "10px", "10px", "0px"],
//     marginLeft: ["0px", "10px", "10px", "10px", "0px"],
//   })
// );

// export const NavbarContainer = styled(Container)(
//   ({ theme }) => ({ height: "100%" }),
//   mq({ maxWidth: ["400px", "500px", "1300px"] })
// );
