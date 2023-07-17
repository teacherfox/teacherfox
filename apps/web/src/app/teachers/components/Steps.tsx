import React from "react";
import { Grid, Box, Container } from "@/configs/mui";

type Props = {};

type StepType = {
  title: string;
  subtitle: string;
  paragraph: string;
  image: string;
};

// TODO: replace from the BE
const StepsList: StepType[] = [
  {
    title: "Βήμα 1",
    subtitle: "Εγγραφείτε στο TeacherFox",
    paragraph:
      "Εγγραφείτε συμπληρώνοντας το ονοματεπώνυμο σας, το email και το password σας.",
    image: "teacher/signup",
  },
  {
    title: "Βήμα 2",
    subtitle: "Ολοκληρώστε το Προφίλ σας",
    paragraph:
      "Κατά την εγγραφή, ολοκληρώστε το προφίλ σας μέσα σε λίγα μόνο λεπτά. Προσθέστε το βιογραφικό σας, τα μαθήματα που διδάσκετε, την διαθεσιμότητα σας, τις περιοχές που είστε πρόθυμοι να εξυπηρετήσετε, την τιμή ανά μάθημα  και άλλα πολλά.",
    image: "teacher/complete_profile",
  },
  {
    title: "Βήμα 3",
    subtitle: "Ξεκινήστε την Διδασκαλία",
    paragraph:
      "Συνδεθείτε στον λογαριασμό σας και ελέγξτε τα μηνύματα που λάβατε από υποψήφιους μαθητές σας. Επικοινωνήστε μαζί τους και αφού κλείσετε τον πρώτο μαθητή σας, μπορείτε να ξεκινήσετε την διδασκαλία την επόμενη ή ακόμα και την ίδια ημέρα.",
    image: "teacher/start_teach",
  },
];

function Steps({}: Props) {
  return (
    <Box mb={5}>
      <Container maxWidth="lg">
        {StepsList.map((step, index) => (
          <>
            {index !== 0 && (
              <Box textAlign="center">
                <img
                  src={`./images/${
                    index % 2 !== 0 ? "download7" : "download9"
                  }.png`}
                  height="220"
                  alt=""
                />
              </Box>
            )}
            <Grid container>
              {index % 2 === 0 ? (
                <>
                  <Grid item xs={12} md={6} px={3}>
                    <h2>{step.title}</h2>
                    <h5>{step.subtitle}</h5>
                    <p>{step.paragraph}</p>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <img
                      src={`./images/${step.image}.png`}
                      height="420"
                      alt=""
                    />
                  </Grid>
                </>
              ) : (
                <>
                  {" "}
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <img
                      src={`./images/${step.image}.png`}
                      height="420"
                      alt=""
                    />
                  </Grid>
                  <Grid item xs={12} md={6} px={3}>
                    <h2>{step.title}</h2>
                    <h5>{step.subtitle}</h5>
                    <p>{step.paragraph}</p>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        ))}
      </Container>
    </Box>
  );
}

export default Steps;
