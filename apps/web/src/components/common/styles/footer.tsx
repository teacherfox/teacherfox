import styled from '@emotion/styled';
import { Colors } from '../../../configs/theme';
import { Container } from '@mui/material';
import mq from '../../../configs/MediaQueries';

export const FooterStyled = styled('footer')(({ theme }) => ({
  fontFamily: 'Open Sans',
  backgroundColor: Colors.background.dark,
  color: Colors.text.footer,
  h3: {
    color: Colors.text.white,
    fontWeight: 500,
  },
  a: {
    color: Colors.text.footer,
    textDecoration: 'none',
    marginBottom: 10,
    fontSize: 15,
  },
  paddingTop: 48,
  img: {
    marginBottom: 30,
  },
  hr: {
    backgroundColor: Colors.text.footer,
    height: '1px',
  },
}));

export const FooterContainer = styled(Container)(({ theme }) => mq({ maxWidth: ['400px', '500px', '1300px'] }));
