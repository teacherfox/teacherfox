"use client";
import React from "react";
import { Box, Paper } from "@/configs/mui";
import { Colors } from "@/configs/theme";
import Breadcrumb from "@/common/Breadcrumb";

type ContainerSizeType = "xs" | "sm" | "md" | "lg" | "xl";

type Props = { title: string; container?: ContainerSizeType };

function Showcase({ title, container }: Props) {
  return (
    <>
      <Box
        sx={{
          fontFamily: "Open Sans",
          minHeight: 430,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 45,
          fontWeight: "bold",
          color: Colors.primary.main,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('./stock/bench-accountant.jpg')",
          backgroundSize: "cover",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
        }}
      >
        <Paper
          sx={{
            backgroundColor: Colors.primary.main,
            padding: "2px 10px",
            color: "#fff",
          }}
        >
          {title}
        </Paper>
      </Box>
      <Breadcrumb title={title} container={container} />
    </>
  );
}

export default Showcase;
