import React from "react";
import { Box, Grid, Container } from "@/configs/mui";
import { BenefitsWrapper } from "../styles";

type Props = {};

type BenefitType = {
  icon: string;
  title: string;
  paragraph: string;
};

// TODO: provide from the BE
const BeneftisList: BenefitType[] = [
  {
    icon: "teacher/home",
    title: "Ευέλικτο Ωράριο",
    paragraph:
      "Δουλέψτε από το σπίτι ή από οπουδήποτε αλλού, όποτε εσείς θέλετε. Σαν δάσκαλος που εργάζεται από το σπίτι, μπορείτε να ρυθμίσετε εσείς το ωράριο εργασίας και την ιδανική τοποθεσία.",
  },
  {
    icon: "teacher/teacher-plus",
    title: "Περισσότεροι Μαθητές",
    paragraph:
      "Βρείτε ένα μεγάλο αριθμό μαθητών από Κύπρο και Ελλάδα για να διδάξετε και να κερδίσετε περισσότερα χρήματα.",
  },
  {
    icon: "teacher/money",
    title: "Ορίστε την Τιμή σας",
    paragraph:
      "Εσείς αποφασίζετε πόσο θα χρεώνετε για κάθε μάθημα ή για κάθε ώρα.",
  },
  {
    icon: "teacher/bio-plus",
    title: "Εμπλουτίστε το Βιογραφικό σας",
    paragraph:
      "Όσο περισσότερο διδάσκετε, τόσο μεγαλύτερη εμπειρία και ειδίκευση στο μάθημα σας αποκτάτε.",
  },
];

function Benefits({}: Props) {
  return (
    <section>
      <BenefitsWrapper>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={5}>
            <h4>Οφέλη</h4>
          </Box>
          <Grid container spacing={5}>
            {BeneftisList.map((benefit, index) => (
              <Grid key={index} item xs={12} sm={6}>
                <Grid container>
                  <Grid item xs={4}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img
                        src={`/images/${benefit.icon}.png`}
                        width="90"
                        alt=""
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <div>
                      <h4>{benefit.title}</h4>
                      <p>{benefit.paragraph}</p>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Container>
      </BenefitsWrapper>
    </section>
  );
}

export default Benefits;
