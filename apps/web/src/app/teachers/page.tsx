"use client";
import React from "react";
import Showcase from "@/common/Showcase";
import { Container } from "@/configs/mui";
import { TeachersWrapper } from "./styles";
import Steps from "./components/Steps";
import Faq from "./components/Faq";
import Benefits from "./components/Benefits";
import Pricing from "./components/Pricing";
import Reviews from "./components/Reviews";

type Props = {};

function page({}: Props) {
  return (
    <main>
      <Showcase title="Είμαι εκπαιδευτικός" container="lg" />
      <TeachersWrapper>
        <Steps />
        <Benefits />
        <Faq />
        <Pricing />
        <Reviews />
      </TeachersWrapper>
    </main>
  );
}

export default page;
