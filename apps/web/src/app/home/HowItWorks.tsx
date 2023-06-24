"use client";
import React from "react";
import { HowItWorksSection } from "./styles";
import { Stack, Grid, Container, Box } from "@/configs/mui";

type Props = {};

const Sections = [
  {
    image: "Local_Lessons",
    title: "Δια ζώσης",
    paragraph:
      "Προτιμάς την φυσική παρουσία του εκπαιδευτικού στον χώρο σου ή στον χώρο διδασκαλίας του ; Επέλεξε τώρα την επιθυμητή περιοχή και ξεκίνα το ταξίδι της μάθησης.",
  },
  {
    image: "Online_Lessons",
    title: "Εξ' αποστάσεως",
    paragraph:
      "Έχεις βρει τον ιδανικό εκπαιδευτικό αλλά βρίσκεται σε άλλη πόλη ή χώρα ; Μην απογοητεύεσαι, κλείσε τώρα οnline μαθήματα και απόλαυσε την εκμάθηση από το κινητό ή το laptop σου.",
  },
];

const Steps = [
  {
    number: "01",
    image: "search",
    title: "Αναζήτησε",
    paragraph:
      "Αναζήτησε ανάμεσα σε δεκάδες πιστοποιημένους εκπαιδευτικούς οι οποίοι συνεργάζονται μαζί μας.",
  },
  {
    number: "02",
    image: "contact",
    title: "Επίλεξε",
    paragraph:
      "Επέλεξε τον ιδανικό εκπαιδευτικό ανάλογα με τα κριτήρια σου, την διαθεσιμότητα και την τοποθεσία σου.",
  },
  {
    number: "03",
    image: "choose",
    title: "Επικοινώνησε",
    paragraph:
      "Επικοινώνησε με τον εκπαιδευτικό που επιλέξες και ξεκινήστε άμεσα τα μαθήματα.",
  },
];

function HowItWorks({}: Props) {
  return (
    <section>
      <HowItWorksSection>
        <Box mb={2}>
          <h2>Κάνε μάθημα Τοπικά ή Διαδικτυακά</h2>
        </Box>
        <Grid container spacing={5}>
          {Sections.map((section, index) => (
            <Grid item xs={12} md={6} key={index}>
              <img src={`/images/home/${section.image}.png`} width="400"></img>
              <h3>{section.title}</h3>
              <p>{section.paragraph}</p>
            </Grid>
          ))}
        </Grid>

        <Box mb={2} mt={10}>
          <h2>Πως Λειτουργεί το TeacherFox</h2>
        </Box>
        <Grid container spacing={5}>
          {Steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <h4>{step.number}</h4>
              <img src={`/images/home/${step.image}.png`} width="320"></img>
              <h3>{step.title}</h3>
              <p>{step.paragraph}</p>
            </Grid>
          ))}
        </Grid>
      </HowItWorksSection>
    </section>
  );
}

export default HowItWorks;
