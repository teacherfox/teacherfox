import React from "react";
import { Grid, Box, Container } from "@/configs/mui";

type Props = {};

type StepType = {
  title: string;
  subtitle: string;
  paragraph: string;
  image: string;
};

// TODO: generate these from the BE
const StepsList: StepType[] = [
  {
    title: "Βήμα 1",
    subtitle: "Αναζήτησε",
    paragraph:
      "Αναζήτησε ανάμεσα σε δεκάδες πιστοποιημένους εκπαιδευτικούς οι οποίοι είναι εγγεγραμμένοι στη πλατφόρμα μας.",
    image: "home/search",
  },
  {
    title: "Βήμα 2",
    subtitle: "Επίλεξε",
    paragraph:
      "Επίλεξε τον ιδανικό εκπαιδευτικό ανάλογα με τα κριτήρια σου, την διαθεσιμότητα και την τοποθεσία σου",
    image: "home/choose",
  },
  {
    title: "Βήμα 3",
    subtitle: "Επικοινώνησε",
    paragraph:
      "Επικοινώνησε με τον εκπαιδευτικό που επέλεξες και ξεκινήστε άμεσα τα μαθήματα.",
    image: "home/contact",
  },
];

function Steps({}: Props) {
  return (
    <div>
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
    </div>
  );
}

export default Steps;
