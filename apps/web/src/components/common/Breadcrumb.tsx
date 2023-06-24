"use client";
import React from "react";
import Showcase from "@/common/Showcase";
import { Breadcrumbs, Chip, Box, Container } from "@/configs/mui";
import { HomeIcon } from "@/configs/mui-icons";
import { Colors } from "@/configs/theme";

type ContainerSizeType = "xs" | "sm" | "md" | "lg" | "xl";

type Props = { title: string; container?: ContainerSizeType; middle?: string };

function page({ title, container, middle }: Props) {
  return (
    <Box
      sx={{
        paddingTop: "48px",
        paddingBottom: "48px",
        backgroundColor: Colors.background.lightGrey,
      }}
    >
      <Container maxWidth={container || "xl"}>
        <Breadcrumbs aria-label="breadcrumb">
          <Chip
            component="a"
            href="/"
            label="Home"
            icon={<HomeIcon fontSize="small" />}
          />
          {middle && (
            <Chip
              component="a"
              href={`/${middle}`}
              label={middle}
              // icon={<HomeIcon fontSize="small" />}
            />
          )}
          <Chip component="a" href="#" label={title} />
        </Breadcrumbs>
      </Container>
    </Box>
  );
}

export default page;
