import React from "react";
import { Box, Paper, Avatar } from "@/configs/mui";
import { ReviewsSection } from "../styles";

function Reviews() {
  return (
    <ReviewsSection>
      <Box textAlign="center" mb={5}>
        <h4>Κριτικές Μαθητών</h4>
      </Box>
      {/* <Container maxWidth="md"> */}
      <Box
        sx={{
          textAlign: "center",
          maxWidth: "640px",
          margin: "auto",
          pb: 5,
        }}
      >
        <Paper elevation={1}>
          <Box sx={{ padding: "25px", pb: 5 }}>
            <Avatar
              sx={{ margin: "auto" }}
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
            />
            <h5>Βασίλης Ανδρέου</h5>
            <p>
              Η συγκεκριμένη πλατφόρμα με βοήθησε να βρω εύκολα δασκάλο για το
              αγαπημένο μου χόμπυ. Τη συστήνω ανεπιφύλακτα !
            </p>
          </Box>
        </Paper>
      </Box>
      {/* </Container> */}
    </ReviewsSection>
  );
}

export default Reviews;
