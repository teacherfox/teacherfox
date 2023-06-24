import React from "react";
import { Box, Grid, Paper, Container } from "@/configs/mui";
import { PricingWrapper } from "../styles";
import { TFButtonPrimary } from "@/components/elements/TFButton";

type Props = {};

type PackageType = {
  title: String;
  price: Number;
  features: String[];
};

const PackagesList: PackageType[] = [
  {
    title: "Τρίμηνη συνδρομή",
    price: 49,
    features: [
      "Πρόσβαση στο dashboard",
      "Απεριόριστες αλλαγές",
      "Απεριόριστα μαθήματα",
      "Πιστοποίηση πτυχίων",
      "Τεχνική Υποστήριξη",
    ],
  },
  {
    title: "Ετήσια συνδρομή",
    price: 149,
    features: [
      "Πρόσβαση στο dashboard",
      "Απεριόριστες αλλαγές",
      "Απεριόριστα μαθήματα",
      "Πιστοποίηση πτυχίων",
      "Τεχνική Υποστήριξη",
    ],
  },
  {
    title: "Εξάμηνη συνδρομή",
    price: 89,
    features: [
      "Πρόσβαση στο dashboard",
      "Απεριόριστες αλλαγές",
      "Απεριόριστα μαθήματα",
      "Πιστοποίηση πτυχίων",
      "Τεχνική Υποστήριξη",
    ],
  },
];

function Pricing({}: Props) {
  return (
    <section>
      <PricingWrapper>
        <Box textAlign="center" mt={10} mb={5}>
          <h4>Πακέτα Συνδρομών</h4>
        </Box>
        <Container maxWidth="xl">
          <Box textAlign="center">
            <Grid container spacing={10}>
              {PackagesList.map((packageItem, index) => (
                <Grid key={index} item xs={12} md={4}>
                  <Paper sx={{ py: 2 }}>
                    <Box sx={{ minWidth: "100%" }}>
                      <TFButtonPrimary>{packageItem.title}</TFButtonPrimary>
                    </Box>
                    <small>{`Τιμολογείται ως μία πληρωμή των €${packageItem.price}`}</small>
                    <h2>{`€${packageItem.price} / μήνα`}</h2>

                    <p>
                      <b>Η συνδρομή περιλαμβάνει:</b>
                    </p>
                    {packageItem.features.map((feature, index) => (
                      <p key={index}>{feature}</p>
                    ))}
                    <Box mt={5}>
                      <TFButtonPrimary>Εγγραφή Εκπαιδευτικού</TFButtonPrimary>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </PricingWrapper>
    </section>
  );
}

export default Pricing;
