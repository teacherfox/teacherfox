"use client";
import React from "react";
import Showcase from "@/common/Showcase";
import { StudentsWrapper } from "./styles";
import Steps from "./components/Steps";
import Faq from "./components/Faq";
import Reviews from "./components/Reviews";

type Props = {};

function StudentsPage({}: Props) {
  return (
    <main>
      <Showcase title="Πώς λειτουργεί" container="lg" />
      <StudentsWrapper>
        <Steps />
        <Faq />
        <Reviews />
      </StudentsWrapper>
    </main>
  );
}

export default StudentsPage;
