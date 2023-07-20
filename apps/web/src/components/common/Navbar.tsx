'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo, NavbarAuthButtonsContainer, NavbarContainer } from './styles/navbar';
import { TFButtonPrimary, TFButtonSecondary } from '../elements/TFButton';
import UserAvatar from '../elements/UserAvatar';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Tooltip,
} from '@mui/material';
import { Colors } from '../../configs/theme';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';

type INavlink = {
  name: string;
  url: string;
};

const pages: INavlink[] = [
  { name: 'Αρχική', url: '/' },
  { name: 'Μαθήματα', url: '/all-lessons' },
  { name: 'Πώς Λειτουργεί', url: '/students' },
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

type Props = {};

const AuthButtons = (loggedIn: any): JSX.Element => {
  return (
    <NavbarAuthButtonsContainer>
      <Link href={'/teachers'}>
        <Box mr={5}>
          <TFButtonPrimary>Είμαι Εκπαιδευτικός</TFButtonPrimary>
        </Box>
      </Link>
      {loggedIn ? (
        <Link href={'/authentication'}>
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {pages.map((page, index) => (
        <Box
          sx={{
            a: {
              fontFamily: 'Open Sans',
              textDecoration: 'none',
              color: Colors.text.navbar,
              fontWeight: 'bold',
              fontSize: '15px',
              transition: '.35s',
              '&:hover': {
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
  <Box sx={{ width: 'auto' }} role="presentation" onClick={handleCloseNavMenu} onKeyDown={handleCloseNavMenu}>
    <Box textAlign="center" mt={5}>
      <Link href="/">
        <Image src="/images/logo.png" width="150" height="40" alt="teacherfox-logo" />
      </Link>
    </Box>
    <List>
      {pages.map((pageItem, index) => (
        <Box
          key={index}
          sx={{
            a: {
              textDecoration: 'none',
              color: Colors.text.navbar,
              fontWeight: 'bold',
              fontSize: '15px',
              transition: '.35s',
              '&:hover': {
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
                    marginLeft: '20px',
                    fontWeight: 'bold',
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

function Navbar({}: Props) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
      <Paper elevation={3}>
        <NavbarContainer>
          {isDesktop ? (
            <>
              <Link href="/">
                <Logo src="/images/logo.png" width="150" height="40" />
              </Link>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <NavbarLinks />
                <AuthButtons logedIn={loggedIn} />
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Tooltip title="Menu">
                  <IconButton onClick={handleOpenNavMenu}>
                    <MenuIcon />
                  </IconButton>
                </Tooltip>
                <Drawer anchor="top" open={anchorElNav} onClose={handleCloseNavMenu}>
                  {list('top', loggedIn)}
                </Drawer>
                <Link href="/">
                  <Image src="/images/logo.png" width="150" height="40" alt="teacherfox-logo" />
                </Link>
                {loggedIn ? (
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
      </Paper>
    </nav>
  );
}

export default Navbar;
