import 'server-only';
import React from 'react';
import Navbar from './Navbar';

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
