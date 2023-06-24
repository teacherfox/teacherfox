"use client";
import React from "react";
import { Box, TextField } from "@/configs/mui";
import { TFButtonPrimary } from "@/components/elements/TFButton";

type Props = {};

function AuthenticationPage({}: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      AuthenticationPage
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <TFButtonPrimary variant="contained">Click</TFButtonPrimary>
    </Box>
  );
}

export default AuthenticationPage;
