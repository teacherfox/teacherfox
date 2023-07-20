import 'server-only';
import LessonCategories from './home/LessonCategories';
import HowItWorks from './home/HowItWorks';
import SuggestedTeachers from './home/SuggestedTeachers';
import HomeShowcase from './home/HomeShowcase';

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
