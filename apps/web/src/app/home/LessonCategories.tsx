"use client";
import React from "react";
import { Stack, Paper, Grid, Box, Container } from "@/configs/mui";
import Image from "next/image";
import { LessonCategoriesSection } from "./styles";

type Props = {};

type LessonTileType = {
  title: string;
  image: string;
};

const LessonsList: LessonTileType[] = [
  { title: "Προσχολικά", image: "prosxolika" },
  { title: "Σχολικά", image: "sxolika" },
  { title: "Πανεπιστημιακά", image: "panepistimiaka" },
  { title: "Ξένες Γλώσσες", image: "xenes-glwsses" },
  { title: "Μουσική", image: "mousiki" },
  { title: "Τέχνες", image: "texnes" },
  { title: "Χορός", image: "xoros" },
  { title: "Πολεμικές Τέχνες", image: "polemikes-texnes" },
  { title: "Αθλητισμός", image: "athlitismos" },
  { title: "Πληροφορική", image: "pliroforiki" },
  { title: "Εκπόνηση Εργασιών", image: "ekponisi-ergasiwn" },
  { title: "Περισσότερες", image: "more" },
];

function LessonCategories({}: Props) {
  return (
    <section>
      <LessonCategoriesSection>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={4}>
            <h2>Κατηγορίες Μαθημάτων</h2>
          </Box>
          <Grid container>
            {LessonsList.map((lesson, index) => (
              <Grid item key="index" xs={12} sm={6} md={4} lg={2} xl={2}>
                <Stack
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {}}
                >
                  <Paper
                    sx={{
                      width: "200px",
                      height: "200px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={`/images/lessons/${lesson.image}.png`}
                      width={150}
                      height={150}
                      alt={lesson.title}
                    />
                  </Paper>
                  <p>{lesson.title}</p>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </LessonCategoriesSection>
    </section>
  );
}

export default LessonCategories;
