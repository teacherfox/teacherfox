'use client';
import { Colors } from '../../configs/theme';
import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const LessonCategoriesSection = styled(Box)(({ theme }) => ({
  paddingTop: '50px',
  marginTop: '50px',
  fontFamily: 'Open Sans',
  'h2, h4, h5, p': {
    fontFamily: 'Open Sans',
  },
  h2: {
    fontSize: '26px',
    color: Colors.text.header,
  },
  p: {
    fontSize: '17px',
    color: Colors.primary.vivid,
  },
}));

export const HowItWorksSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: '50px',
  marginTop: '50px',
  paddingLeft: '80px',
  paddingRight: '80px',
  paddingBottom: '100px',
  fontFamily: 'Open Sans',
  'h2, h4, h5, p': {
    fontFamily: 'Open Sans',
    fontWegith: 300,
  },
  h2: {
    fontSize: '24px',
    color: Colors.text.header,
  },
  h3: {
    fontSize: '21px',
    color: Colors.text.header,
  },
  h4: {
    fontSize: '40px',
    color: Colors.text.header3,
    marginTop: '0px',
    marginBottom: '0px',
  },
  p: {
    fontSize: '15px',
    color: Colors.text.paragraph,
    marginBottom: '0px',
  },
}));

export const SuggestedTeachersSection = styled(Box)(({ theme }) => ({
  backgroundColor: Colors.background.lightGrey,
  textAlign: 'center',
  paddingTop: '50px',
  marginTop: '50px',
  paddingLeft: '80px',
  paddingRight: '80px',
  paddingBottom: '100px',
  fontFamily: 'Open Sans',
  'h2, h4, h5, p': {
    fontFamily: 'Open Sans',
    fontWegith: 300,
  },
  h2: {
    fontSize: '24px',
    color: Colors.text.header,
  },
  h3: {
    fontSize: '21px',
    color: Colors.text.header,
  },
  h4: {
    fontSize: '40px',
    color: Colors.text.header3,
    marginTop: '0px',
    marginBottom: '0px',
  },
  p: {
    fontSize: '15px',
    color: Colors.text.paragraph,
    marginBottom: '0px',
  },
}));

export const ShowcaseSection = styled(Box)(({ theme }) => ({
  backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/newbackground.jpeg')",
  backgroundSize: 'cover',
  backgroundPositionX: 'center',
  backgroundPositionY: 'center',
  minHeight: 350,
  borderBottomLeftRadius: '20%',
  borderBottomRightRadius: '20%',
  //   textAlign: "center",
  paddingTop: '50px',
  marginTop: '50px',
  paddingLeft: '80px',
  paddingRight: '80px',
  paddingBottom: '100px',
  fontFamily: 'Open Sans',
  'h2, h4, h5, p': {
    fontFamily: 'Open Sans',
    fontWegith: 300,
  },
  h1: {
    fontSize: '35px',
    color: Colors.text.white,
  },
  h2: {
    fontSize: '24px',
    color: Colors.text.header,
  },
  h3: {
    fontSize: '21px',
    color: Colors.text.header,
  },
  h4: {
    fontSize: '40px',
    color: Colors.text.header3,
    marginTop: '0px',
    marginBottom: '0px',
  },
  p: {
    fontSize: '15px',
    color: Colors.text.white,
    marginBottom: '0px',
  },
}));

export const StatsSection = styled(Box)(({ theme }) => ({
  background: Colors.background.lightGrey,
  textAlign: 'center',
  paddingTop: '20px',
  marginTop: '20px',
  paddingLeft: '80px',
  paddingRight: '80px',
  paddingBottom: '20px',
  fontFamily: 'Open Sans',
  'h2, h4, h5, p': {
    fontFamily: 'Open Sans',
    fontWegith: 300,
  },
  h2: {
    fontSize: '21px',
    color: Colors.text.navbar,
  },
  p: {
    fontSize: '15px',
    color: Colors.text.navbar,
    marginBottom: '0px',
  },
}));
