// import styled from "@/configs/mui-styled";
import { Colors } from "@/configs/theme";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Container, AppBar, Box } from "@/configs/mui";

export const NavbarStyled = styled(AppBar)(({ theme }) => ({
  fontFamily: "Open Sans",
  minHeight: 120,
}));

export const Logo = styled("img")({
  marginRight: 100,
});

export const NavbarContainer = styled("div")({
  fontFamily: "Open Sans",
  padding: "7.5px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: 120,
  fontSize: 17,
});

export const NavbarAuthButtonsContainer = styled("div")(
  mq({
    display: ["flex"],
    flexDirection: ["column", "row"],
    justifyContent: [
      "flex-start",
      "flex-start",
      "flex-start",
      "flex-start",
      "space-between",
    ],
    alignItems: ["center"],
    marginTop: ["10px", "10px", "10px", "10px", "0px"],
    marginBottom: ["10px", "10px", "10px", "10px", "0px"],
    marginLeft: ["0px", "10px", "10px", "10px", "0px"],
  })
);

// export const NavbarContainer = styled(Container)(
//   ({ theme }) => ({ height: "100%" }),
//   mq({ maxWidth: ["400px", "500px", "1300px"] })
// );
