import 'server-only';
import React from 'react';
import { SuggestedTeachersSection } from './styles';

type Props = {};

function SuggestedTeachers({}: Props) {
  return (
    <section>
      <SuggestedTeachersSection>
        <h1>Προτεινόμενοι Καθηγητές</h1>
      </SuggestedTeachersSection>
    </section>
  );
}

export default SuggestedTeachers;
