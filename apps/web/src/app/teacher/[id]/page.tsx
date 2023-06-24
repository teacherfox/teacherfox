"use client";
import React from "react";
import Breadcrumb from "@/common/Breadcrumb";
import Showcase from "@/common/Showcase";
import { ProfilePageWrapper } from "./styles";
import { Container, Grid, Box, Paper, Avatar, Divider } from "@/configs/mui";
import {
  TFButtonPrimary,
  TFButtonSecondary,
} from "@/components/elements/TFButton";
// import ProfileTile from "./components/ProfileTile";
import {
  FaHouseUser,
  FaHome,
  FaLaptop,
  FaCalendarWeek,
  FaMapMarkerAlt,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaRegCalendarCheck,
  FaUserTie,
} from "react-icons/fa";

type Props = {};

const UserProfile = {
  id: 1,
  online: false,
  name: "Ελένη Μαρινάκη",
  age: 34,
  location: "Αττική, Ελλάδα",
  avatar: "",
  academicTitle: "Πτυχιούχος",
  description:
    "Έχοντας τα Γαλλικά ως μητρική γλώσσα και όντας ιδιοκτήτρια Κέντρου Ξένων Γλωσσών, με μεγάλη επιτυχία απόδοσης σε όλα τα μαθησιακά επίπεδα, παραθέτω κάποια βασικά στοιχεία που συνοδεύουν την ιδιότητα μου ως καθηγήτρια: ευελιξία στην μεταδοτικότητα της γνώσης, ενθουσιασμός και διδακτική συνέπεια απέναντι σε όλους τους μαθητές, χωρίς κανένα διαχωρισμό. Στόχος μου είναι η γαλλική γλώσσα να γίνει αγαπητή, χωρίς τη συνοδεία αρνητικών στοιχείων, όπως αυτά της πίεσης και της αίσθησης υποχρέωσης, αντιθέτως η ευχαρίστηση και η προθυμία για μάθηση.",
  lessons: ["Γαλλικά", "Γλωσσολογία"],
  lowestPrice: 12,
};

function TeacherProfile({}: Props) {
  return (
    <div>
      <Breadcrumb title={UserProfile.name} middle="Teachers" container="lg" />
      <ProfilePageWrapper>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} lg={1}></Grid>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 2 }}>
                <Grid container>
                  <Grid item xs={4}>
                    <Box mt={3}>
                      <Avatar
                        sx={{
                          width: 170,
                          height: 170,
                          mx: "auto !important",
                          mb: 1,
                          cursor: "pointer",
                        }}
                        alt="Remy Sharp"
                        //   src="/broken-image.jpg"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <h2>Όνομα Καθηγητή</h2>
                    <Box component="span" mr={2}>
                      <Box component="span" mr={1}>
                        <FaCalendarWeek />
                      </Box>
                      <span
                        style={{ margin: 0, padding: 0 }}
                      >{`Ηλικία: 40 Ετών`}</span>
                    </Box>
                    <Box component="span">
                      <Box component="span" mr={1}>
                        <FaMapMarkerAlt />
                      </Box>
                      <span
                        style={{ margin: 0, padding: 0 }}
                      >{`Αττική, Ελλάδα`}</span>
                    </Box>
                    <Box justifyContent="center" alignItems="center" mt={2}>
                      <Box component="span" mr={1}>
                        <FaChalkboardTeacher />
                      </Box>
                      {` Μαθηματικά - Φυσική - Χημεία`}
                    </Box>
                    <Box mt={2}>
                      <TFButtonSecondary>
                        Προσθήκη στα Αγαπημένα
                      </TFButtonSecondary>
                    </Box>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <h3 style={{ fontSize: "21px" }}>Σχετικά με εμένα</h3>
                  <Box
                    component="p"
                    sx={{ wordSpacing: "5px", textAlign: "justify" }}
                  >
                    Έχοντας τα Γαλλικά ως μητρική γλώσσα και όντας ιδιοκτήτρια
                    Κέντρου Ξένων Γλωσσών, με μεγάλη επιτυχία απόδοσης σε όλα τα
                    μαθησιακά επίπεδα, παραθέτω κάποια βασικά στοιχεία που
                    συνοδεύουν την ιδιότητα μου ως καθηγήτρια: ευελιξία στην
                    μεταδοτικότητα της γνώσης, ενθουσιασμός και διδακτική
                    συνέπεια απέναντι σε όλους τους μαθητές, χωρίς κανένα
                    διαχωρισμό. Στόχος μου είναι η γαλλική γλώσσα να γίνει
                    αγαπητή, χωρίς τη συνοδεία αρνητικών στοιχείων, όπως αυτά
                    της πίεσης και της αίσθησης υποχρέωσης, αντιθέτως η
                    ευχαρίστηση και η προθυμία για μάθηση.
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <h3 style={{ fontSize: "21px" }}>Διαθεσιμότητα</h3>
                </Box>
                <Divider />
                <Box mb={4}>
                  <h3 style={{ fontSize: "21px" }}>Εκπαίδευση (Πτυχία)</h3>
                  <Box pl={3}>
                    <Box component="span" mr={2}>
                      <b>University of Brighton ( Πανεπιστήμιο Εξωτερικού )</b>
                    </Box>
                    <Box
                      component="span"
                      justifyContent="center"
                      alignItems="center"
                      mt={2}
                    >
                      <Box component="span" mr={1}>
                        <FaRegCalendarCheck />
                      </Box>
                      {` 2010 - 2014`}
                    </Box>
                  </Box>
                  <Box
                    component="span"
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                    pl={3}
                    pb={2}
                  >
                    <Box component="span" mr={1}>
                      <FaGraduationCap />
                    </Box>
                    {` BA English Language Studies with Linguistics`}
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <h3 style={{ fontSize: "21px" }}>Επαγγελματική Εμπειρία</h3>
                  <Box pl={3}>
                    <Box component="span" mr={2}>
                      <b>University of Brighton ( Πανεπιστήμιο Εξωτερικού )</b>
                    </Box>
                    <Box
                      component="span"
                      justifyContent="center"
                      alignItems="center"
                      mt={2}
                    >
                      <Box component="span" mr={1}>
                        <FaRegCalendarCheck />
                      </Box>
                      {` 2010 - 2014`}
                    </Box>
                  </Box>
                  <Box
                    component="span"
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                    pl={3}
                    pb={4}
                  >
                    <Box component="span" mr={1}>
                      <FaUserTie />
                    </Box>
                    {` BA English Language Studies with Linguistics`}
                  </Box>
                </Box>
                <Divider />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 2 }}>
                <p>
                  <Box component="span" sx={{ pr: 1 }}>
                    <FaHouseUser />
                  </Box>
                  <b>Πηγαίνω στο χώρο του μαθητή</b>
                </p>
                <Box sx={{ ml: 3 }}>
                  <p> 10 Περιοχές στην Λεμεσό</p>
                </Box>
                <p>
                  <Box component="span" sx={{ pr: 1 }}>
                    <FaHome />
                  </Box>
                  <b>Δέχομαι μαθητές στο χώρο μου</b>
                </p>
                <Box sx={{ ml: 3 }}>
                  <p> Λεμεσό</p>
                </Box>
                <p>
                  <Box component="span" sx={{ pr: 1 }}>
                    <FaLaptop />
                  </Box>
                  <b>Κάνω μαθήματα online</b>
                </p>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={1}></Grid>
          </Grid>
        </Container>
      </ProfilePageWrapper>
    </div>
  );
}

export default TeacherProfile;
