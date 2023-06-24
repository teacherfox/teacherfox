import React from "react";
import { Box, Typography, Container } from "@/configs/mui";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useAccordion,
} from "@/common/styles/accordion";

type Props = {};

type QuestionType = {
  question: string;
  answer: string;
  action: string;
};

const QuestionsList: QuestionType[] = [
  {
    question: "Πώς δουλεύει το TeacherFox;",
    answer:
      "Το TeacherFox είναι μια διαδικτυακή πλατφόρμα όπου ως μαθητής μπορείτε να αναζητήσετε τον ιδανικό εκπαιδευτικό. Βρείτε τον εκπαιδευτικό σας, επικοινωνήστε μαζί του και αφού έρθετε σε συμφωνία μαζί ξεκινήστε την εκμάθηση δια ζώσης ή μέσω διαδικτύου. Αλλά πριν από αυτό, βεβαιωθείτε ότι έχετε κάνει εγγραφή στην πλατφόρμα μας.",
    action: "panel1",
  },
  {
    question: "Πώς γίνονται τα μαθήματα;",
    answer:
      "Τα μαθήματα μπορούν να γίνουν είτε δια ζώσης είτε διαδικτυακά ανάλογα με το τι προσφέρει ο κάθε δάσκαλος.",
    action: "panel2",
  },
];

function Faq({}: Props) {
  const { expanded, handleChange } = useAccordion();

  return (
    <section>
      <Container maxWidth="lg">
        <Box textAlign="center" mt={10} mb={5}>
          <h4>Συχνές Ερωτήσεις</h4>
        </Box>
        <Box mb={5}>
          {QuestionsList.map((que, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                aria-controls={`panel${index}d-content`}
                id={`panel${index}d-header`}
              >
                <Typography>{que.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{que.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </section>
  );
}

export default Faq;
