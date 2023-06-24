import React, { forwardRef } from "react";
import { Button, ButtonProps } from "@/configs/mui";
import styled from "@emotion/styled";
import mq from "@/configs/MediaQueries";
import { Colors } from "@/configs/theme";

const StyledButtonPrimary = styled(Button)<ButtonProps>(
  () => ({
    padding: "10px 20px",
    boxShadow: "none",
    textTransform: "capitalize",
    fontFamily: "Open Sans",
    color: "#fff",
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
    "&:hover": {
      // boxShadow: "none",
      color: "#fff",
      backgroundColor: Colors.primary.main,
      borderColor: Colors.primary.main,
    },
    borderRadius: 8,
  }),
  mq({ fontSize: ["14px", "17px"] })
);

const StyledButtonSecondary = styled(Button)<ButtonProps>(
  () => ({
    padding: "10px 20px",
    boxShadow: "none",
    textTransform: "capitalize",
    fontFamily: "Open Sans",
    backgroundColor: "transparent",
    color: Colors.primary.main,
    borderColor: Colors.primary.main,
    "&:hover": {
      // boxShadow: "none",
      color: "#fff",
      backgroundColor: Colors.primary.main,
      borderColor: Colors.primary.main,
    },
    borderRadius: 8,
  }),
  mq({ fontSize: ["14px", "17px"] })
);

type Props = any & ButtonProps;

const TFButtonPrimary = forwardRef((props: Props, ref) => (
  <StyledButtonPrimary variant="contained" {...props} ref={ref} />
));

const TFButtonSecondary = forwardRef((props: Props, ref) => (
  <StyledButtonSecondary variant="outlined" {...props} ref={ref} />
));

export { TFButtonPrimary, TFButtonSecondary };
