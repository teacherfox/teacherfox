import 'server-only';
import React from 'react';
import { Box, Breadcrumbs, Chip, Container } from '@mui/material';
import { Colors } from '../../configs/theme';
import HomeIcon from '@mui/icons-material/Home';

type ContainerSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = { title: string; container?: ContainerSizeType; middle?: string };

function page({ title, container, middle }: Props) {
  return (
    <Box
      sx={{
        paddingTop: '48px',
        paddingBottom: '48px',
        backgroundColor: Colors.background.lightGrey,
      }}
    >
      <Container maxWidth={container || 'xl'}>
        <Breadcrumbs aria-label="breadcrumb">
          <Chip component="a" href="/" label="Home" icon={<HomeIcon fontSize="small" />} />
          {middle && (
            <Chip
              component="a"
              href={`/${middle}`}
              label={middle}
              // icon={<HomeIcon fontSize="small" />}
            />
          )}
          <Chip component="a" href="#" label={title} />
        </Breadcrumbs>
      </Container>
    </Box>
  );
}

export default page;
