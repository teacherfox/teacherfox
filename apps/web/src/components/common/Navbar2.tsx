"use client";
import React, { useState, useEffect } from "react";
import theme from "@/configs/theme";
import styled from "@emotion/styled";
import {
  Box,
  Tooltip,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper
} from "@/configs/mui";
import Link from "next/link";
import { TFButtonPrimary, TFButtonSecondary } from "@/elements/TFButton";
import { Colors } from "@/configs/theme";
import UserAvatar from "@/elements/UserAvatar";
import { MenuIcon, LoginIcon, InboxIcon } from "@/configs/mui-icons";
import Image from "next/image";
import {
  Logo,
  NavbarContainer,
  NavbarAuthButtonsContainer,
} from "./styles/navbar";

type INavlink = {
  name: string;
  url: string;
};

const pages: INavlink[] = [
  { name: "Αρχική", url: "/" },
  { name: "Μαθήματα", url: "/all-lessons" },
  { name: "Πώς Λειτουργεί", url: "/students" },
];
const discover = [""];
const settings = ["Profile", "Account", "Dashboard", "Logout"];
const authButtons = ["Είμαι Εκπαιδευτικός", "Σύνδεση / Εγγραφή"];

type Props = {};

const AuthButtons = (logedIn: any): JSX.Element => {
  return (
    <NavbarAuthButtonsContainer>
      <Link href={"/teachers"}>
        <Box mr={5}>
          <TFButtonPrimary>Είμαι Εκπαιδευτικός</TFButtonPrimary>
        </Box>
      </Link>
      {logedIn ? (
        <Link href={"/authentication"}>
          <TFButtonSecondary>Σύνδεση / Εγγραφή</TFButtonSecondary>
        </Link>
      ) : (
        <UserAvatar menu={settings} />
      )}
    </NavbarAuthButtonsContainer>
  );
};

const NavbarLinks = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {pages.map((page, index) => (
        <Box
          sx={{
            a: {
              fontFamily: "Open Sans",
              textDecoration: "none",
              color: Colors.text.navbar,
              fontWeight: "bold",
              fontSize: "15px",
              transition: ".35s",
              "&:hover": {
                color: Colors.text.navbarHover,
              },
            },
          }}
          key={index}
        >
          <Link href={page.url}>
            <Box mr={5}>{page.name}</Box>
          </Link>
        </Box>
      ))}
    </Box>
  );
};

const list = (handleCloseNavMenu: any, logedIn: any) => (
  <Box
    sx={{ width: "auto" }}
    role="presentation"
    onClick={handleCloseNavMenu}
    onKeyDown={handleCloseNavMenu}
  >
    <Box textAlign="center" mt={5}>
      <Link href="/">
        <Image
          src="/images/logo.png"
          width="150"
          height="40"
          alt="teacherfox-logo"
        />
      </Link>
    </Box>
    <List>
      {pages.map((pageItem, index) => (
        <Box
          key={index}
          sx={{
            a: {
              textDecoration: "none",
              color: Colors.text.navbar,
              fontWeight: "bold",
              fontSize: "15px",
              transition: ".35s",
              "&:hover": {
                color: Colors.text.navbarHover,
              },
            },
          }}
        >
          <Link href={pageItem.url}>
            <ListItem disablePadding>
              <ListItemButton>
                {/* <ListItemIcon>
              <InboxIcon />
            </ListItemIcon> */}

                <Box
                  sx={{
                    marginLeft: "20px",
                    fontWeight: "bold",
                  }}
                  pl={3}
                >
                  <ListItemText primary={pageItem.name} />
                </Box>
              </ListItemButton>
            </ListItem>
          </Link>
        </Box>
      ))}
    </List>
    <Divider />
    <AuthButtons logedIn={logedIn} />
  </Box>
);

function Navbar2({}: Props) {
  const [logedIn, setLogedIn] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(true);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(false);
  };

  return (
    <nav>
      <Paper elevation={3} >
      <NavbarContainer>
        {isDesktop ? (
          <>
            <Link href="/">
              <Logo src="/images/logo.png" width="150" height="40" />
            </Link>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <NavbarLinks />
              <AuthButtons logedIn={logedIn} />
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Tooltip title="Menu">
                <IconButton onClick={handleOpenNavMenu}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Drawer
                anchor="top"
                open={anchorElNav}
                onClose={handleCloseNavMenu}
              >
                {list("top", logedIn)}
              </Drawer>
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  width="150"
                  height="40"
                  alt="teacherfox-logo"
                />
              </Link>
              {logedIn ? (
                <Tooltip title="Login/Register">
                  <Link href="/authentication">
                    <LoginIcon />
                  </Link>
                </Tooltip>
              ) : (
                <UserAvatar menu={settings} />
              )}
            </Box>
          </>
        )}
      </NavbarContainer>

      </ Paper>
    </nav>
  );
}

export default Navbar2;
