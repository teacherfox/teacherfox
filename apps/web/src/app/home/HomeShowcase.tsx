import 'server-only';
import React from 'react';
import { ShowcaseSection, StatsSection } from './styles';
import { FaBookmark, FaChalkboardTeacher, FaStar } from 'react-icons/fa';
import { Grid } from '@mui/material';

type Props = {};

function HomeShowcase({}: Props) {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'teacher':
        return <FaChalkboardTeacher size={40} />;
      case 'star':
        return <FaStar size={40} />;
      case 'bookmark':
        return <FaBookmark size={40} />;
      default:
        break;
    }
  };

  const Stats = [
    {
      icon: renderIcon('teacher'),
      name: 'Μαθήματα',
      amount: 640,
    },
    {
      icon: renderIcon('star'),
      name: 'Αξιολογήσεις Μαθητών',
      amount: 0,
    },
    {
      icon: renderIcon('bookmark'),
      name: 'Πιστοποιημένοι Καθηγητές',
      amount: 21,
    },
  ];

  return (
    <section>
      <ShowcaseSection>
        <h1>Βρες τον Ιδανικό Εκπαιδευτικό</h1>
        <p>Η No1 Πλατφόρμα στην Κύπρο για Ιδιαίτερα Μαθήματα</p>
      </ShowcaseSection>
      <StatsSection>
        <Grid container>
          {Stats.map((stat, index) => (
            <Grid key={index} item xs={4}>
              <>
                <div>{stat.icon}</div>
                <h2>{stat.amount}</h2>
                <p>{stat.name}</p>
              </>
            </Grid>
          ))}
        </Grid>
      </StatsSection>
    </section>
  );
}

export default HomeShowcase;
