"use client";
import React from "react";
import { ContactWrapper } from "./styles";
import Showcase from "@/common/Showcase";
import { Container, Grid, Box, Divider } from "@/configs/mui";
import ContactForm from "./ContactForm"

type Props = {};

function page({}: Props) {
  return (
    <>
      <Showcase title="Επικοινωνία" container="lg" />{" "}
      <ContactWrapper>
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12} md={8}>
              <h3>Επικοινωνήστε μαζί μας</h3>
              <p>Σύντομα ένας από την ομάδα μας θα έρθει σε επαφή μαζί σας</p>
              <ContactForm />
            </Grid>
            <Grid item xs={12} md={4}>
              <h3>Στοιχεία Επικοινωνίας</h3>
              <p>Email : <a href="mailto:info@teacherfox.com">info@teacherfox.com</a></p>
              <p>Tηλέφωνο : <a href="tel:+35799264445">+357 99264445</a></p>
            </Grid>
          </Grid>
        </Container>
      </ContactWrapper>
    </>
  );
}

export default page;
