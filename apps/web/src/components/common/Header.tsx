import React from "react";
import Navbar from "@/components/common/Navbar";
import { Box } from "@/configs/mui";

type Props = {
  title: string;
};

function Header({ title }: Props) {
  return (
    <div>
      <Navbar />
    </div>
  );
}

export default Header;
