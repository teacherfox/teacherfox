import React from "react";
import Navbar from "@/components/common/Navbar";
import Navbar2 from "@/components/common/Navbar2";
import { Box } from "@/configs/mui";

type Props = {
  title: string;
};

function Header({ title }: Props) {
  return (
    <div>
      {/* <Navbar /> */}
      <Navbar2 />
      {/* <Box sx={{ minHeight: 430, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{title}</Box> */}
    </div>
  );
}

export default Header;
