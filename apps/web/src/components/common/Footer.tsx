"use client";
import React from "react";
import { FooterStyled, FooterContainer } from "./styles/footer";
import { Typography, Grid, Box, Container, Divider } from "@/configs/mui";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { InstagramIcon, FacebookIcon } from "@/configs/mui-icons";

type ISectionTitle = string;

type ILinkObject = {
  name: string;
  url: string;
};

type IFooterSection = {
  title: ISectionTitle;
  links: ILinkObject[];
};

const FooterSections: IFooterSection[] = [
  {
    title: "Επικοινωνία",
    links: [
      { name: "+357 99264445", url: "tel:+357 99264445" },
      { name: "info@teacherfox.com", url: "mailto:info@teacherfox.com" },
    ],
  },
  {
    title: "Σχετικά με Εμάς",
    links: [
      { name: "Ποιοι Είμαστε", url: "/about-us" },
      { name: "Πως Λειτουργεί", url: "/students" },
      { name: "Συχνές Ερωτήσεις", url: "/faq" },
      { name: "Επικοινωνία", url: "/contact" },
    ],
  },
  {
    title: "Εκπαίδευση",
    links: [
      { name: "Είμαι Εκπαιδευτικός", url: "/teachers" },
      { name: "Ο Λογαριασμός μου", url: "/authentication" },
      { name: "Μαθήματα", url: "/all-lessons" },
    ],
  },
  {
    title: "Δεδομένα",
    links: [
      { name: "Όροι Χρήσης", url: "/terms-of-use" },
      { name: "Πολιτική Απορρήτου", url: "/privacy-policy" },
    ],
  },
];

type Props = {};

function Footer({}: Props) {
  return (
    <>
      <FooterStyled>
        <FooterContainer>
          <Box textAlign="center" mb={5}>
            <Image
              src="/images/fooretlogo.png"
              width={150}
              height={40}
              alt="TeacherFox logo"
            />
            <Typography variant="body1">
              Η Νο1 Πλατφόρμα στην Κύπρο για ιδιαίτερα μαθήματα.
            </Typography>
          </Box>
          <Box mb={3}>
            <Grid container>
              {FooterSections.map((section, index) => (
                <>
                  <Grid item xs={12} md={3} key={index}>
                    <h3>{section.title}</h3>
                    <Box display="flex" flexDirection="column">
                      {section.links.map((linkItem, index) => (
                        <Link key={index} href={linkItem.url}>
                          {linkItem.name}
                        </Link>
                      ))}
                    </Box>
                    {index === 0 && (
                      <>
                        <Box my={2}>
                          <Divider sx={{ width: "80%" }} />
                        </Box>
                        <Box display="flex">
                          <a href="https://www.facebook.com" target="_blank">
                            <FacebookIcon fontSize="large" />
                          </a>
                          <a href="https://www.instagram.com" target="_blank">
                            <InstagramIcon fontSize="large" />
                          </a>
                        </Box>
                      </>
                    )}
                  </Grid>
                </>
              ))}
            </Grid>
          </Box>
          <Box>
            <Divider />
          </Box>
          <Box py={3} textAlign="center">
            <Typography variant="body1">
              {`© ${moment().format("YYYY")} `}
              <Link href="/">TeacherFox.com</Link>
              {` - All Rights Reserved`}
            </Typography>
          </Box>
        </FooterContainer>
      </FooterStyled>
    </>
  );
}

export default Footer;
