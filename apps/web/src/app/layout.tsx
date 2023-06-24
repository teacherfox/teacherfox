import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TeacherFox | Authentication - Login - Register",
  description: "TeacherFox",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Header title={"Home"} />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
