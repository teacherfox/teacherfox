import Image from "next/image";
import styles from "./page.module.css";
import LessonCategories from "./home/LessonCategories";
import HowItWorks from "./home/HowItWorks";
import SuggestedTeachers from "./home/SuggestedTeachers";
import HomeShowcase from "./home/HomeShowcase";

export default function Home() {
  return (
    <main>
      <HomeShowcase />
      <LessonCategories />
      <HowItWorks />
      <SuggestedTeachers />
    </main>
  );
}
