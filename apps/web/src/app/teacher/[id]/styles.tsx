import { Colors } from "@/configs/theme";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Container, AppBar, Box } from "@/configs/mui";

export const ProfilePageWrapper = styled("main")(({ theme }) => ({
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
