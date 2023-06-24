"use client";
import React from "react";
import Showcase from "@/common/Showcase";
import { ResultsWrapper } from "./styles";
import { Container, Grid, Box, Paper } from "@/configs/mui";
import { TFButtonPrimary } from "@/components/elements/TFButton";
import ProfileTile from "./components/ProfileTile";

type Props = {};

type LessonType =
  | "Γαλλικά"
  | "Γλωσσολογία"
  | "Ψυχολογία"
  | "Αγγλικά - Λύκειο (Κύπρος)"
  | "Αγωγή του Πολίτη - Λύκειο (Κύπρος)"
  | "Wing Chun";

export type UserCardType = {
  id: Number;
  online: Boolean;
  name: String;
  age: Number;
  location: String;
  avatar: String;
  academicTitle: String;
  description: String;
  lessons: LessonType[];
  lowestPrice: Number;
};

const UserCards: UserCardType[] = [
  {
    id: 1,
    online: false,
    name: "Ελένη Μαρινάκη",
    age: 34,
    location: "Αττική, Ελλάδα",
    avatar: "",
    academicTitle: "Πτυχιούχος",
    description:
      "Έχοντας τα Γαλλικά ως μητρική γλώσσα και όντας ιδιοκτήτρια Κέντρου Ξένων Γλωσσών, με μεγάλη επιτυχία απόδοσης σε όλα τα μαθησιακά επίπεδα, παραθέτω κάποια βασικά στοιχεία που συνοδεύουν την ιδιότητα μου ως καθηγήτρια: ευελιξία στην μεταδοτικότητα της γνώσης, ενθουσιασμός και διδακτική συνέπεια απέναντι σε όλους τους μαθητές, χωρίς κανένα διαχωρισμό. Στόχος μου είναι η γαλλική γλώσσα να γίνει αγαπητή, χωρίς τη συνοδεία αρνητικών στοιχείων, όπως αυτά της πίεσης και της αίσθησης υποχρέωσης, αντιθέτως η ευχαρίστηση και η προθυμία για μάθηση.",
    lessons: ["Γαλλικά", "Γλωσσολογία"],
    lowestPrice: 12,
  },
  {
    id: 2,
    online: true,
    name: "Ήβη Τσολιά",
    age: 32,
    location: "Αττική, Ελλάδα",
    avatar: "",
    academicTitle: "Πτυχιούχος",
    description:
      "Παραδίδω πανεπιστημιακά και σχολικά μαθήματα σε ιδιαίτερα και ολιγομελή groups. Ειδικεύομαι στις Αρχές Οικονομικής Θεωρίας και τα συναφή μαθήματα σε Ελλάδα και Κύπρο, καθώς και στη Μικροοικονομική στο χώρο της τριτοβάθμιας εκπαίδευσης.",
    lessons: ["Ψυχολογία"],
    lowestPrice: 15,
  },
  {
    id: 3,
    online: true,
    name: "Michalis Aristotelous",
    age: 33,
    location: "Αττική, Ελλάδα",
    avatar: "",
    academicTitle: "Πτυχιούχος",
    description: "Παραδιδω ιδιαιτερα μαθηματα δια ζωσης και εξ αποστασεως.",
    lessons: [
      "Αγγλικά - Λύκειο (Κύπρος)",
      "Αγωγή του Πολίτη - Λύκειο (Κύπρος)",
    ],
    lowestPrice: 5,
  },
  {
    id: 4,
    online: false,
    name: "Βασίλης Ανδρέου",
    age: 24,
    location: "Αττική, Ελλάδα",
    avatar: "",
    academicTitle: "Πτυχιούχος",
    description:
      "Είμαι καθηγητής πληροφορικής σε ιδιωτικό σχολείο και τον ελεύθερο μου χρόνο τα τελευταία 5 χρόνια κάνω σκληρή προπόνηση για πραγματική μάχη.",
    lessons: ["Wing Chun"],
    lowestPrice: 4,
  },
];

function page({}: Props) {
  return (
    <>
      <Showcase title="Αναζήτηση Δασκάλου" />
      <ResultsWrapper>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} lg={3}>
              <Paper sx={{ p: 2 }}>Μάθημα</Paper>
            </Grid>
            <Grid item xs={12} lg={9}>
              {UserCards.map((userCard, index) => (
                <ProfileTile key={index} userCard={userCard} />
              ))}
            </Grid>
          </Grid>
        </Container>
      </ResultsWrapper>
    </>
  );
}

export default page;
