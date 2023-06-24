"use client";
import React from "react";
import Showcase from "@/common/Showcase";
import { UserCardWrapper } from "../styles";
import { Grid, Box, Paper, Avatar, Chip } from "@/configs/mui";
import { TFButtonPrimary } from "@/components/elements/TFButton";
import { UserCardType } from "../page";
import {
  FaCalendarWeek,
  FaMapMarkerAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

type Props = {
  userCard: UserCardType;
};

function ProfileTile({ userCard }: Props) {
  const router = useRouter();

  return (
    <Paper sx={{ px: 2, py: 3, mb: 3 }}>
      <UserCardWrapper>
        <Grid container spacing={2}>
          <Grid item md={2} lg={2} sx={{ textAlign: "center", mx: "auto" }}>
            <Box pl={2}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto !important",
                  mb: 1,
                  cursor: "pointer",
                }}
                alt="Remy Sharp"
                //   src="/broken-image.jpg"
                onClick={() => router.push(`teacher/${userCard.id}`)}
              >
                {Array.from(userCard.name)[0]}
              </Avatar>
              <Box display="flex" justifyContent="center" alignItems="center">
                <FaCalendarWeek />

                <h6
                  style={{ marginLeft: "5px" }}
                >{`Ηλικία: ${userCard.age}`}</h6>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center">
                <FaMapMarkerAlt />

                <h6
                  style={{ marginLeft: "5px", whiteSpace: "nowrap" }}
                >{`${userCard.location}`}</h6>
              </Box>
            </Box>
          </Grid>
          <Grid item md={7} lg={7}>
            <h4
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`teacher/${userCard.id}`)}
            >
              {userCard.name}
            </h4>
            <Box display="flex" alignItems="center">
              <FaGraduationCap />
              <h6 style={{ marginLeft: "5px", fontWeight: 400 }}>
                {userCard.academicTitle}
              </h6>
            </Box>
            <p>{userCard.description}</p>
            <Box sx={{ mt: 4 }}>
              <span className="lessons-title">
                <b>Μαθήματα:</b>
              </span>{" "}
              {userCard.lessons.map((lesson, index) => (
                <Chip
                  sx={{ mr: 0.5, mb: 1, cursor: "pointer" }}
                  label={lesson}
                  variant="outlined"
                  key={index}
                  onClick={() => {}}
                />
              ))}
            </Box>
          </Grid>
          <Grid
            item
            md={3}
            lg={3}
            sx={{ textAlign: "center", mx: "auto", width: "100%" }}
          >
            <Paper sx={{ display: "flex", flexDirection: "column", p: 2 }}>
              <h5>{`Από €${userCard.lowestPrice}`}</h5>
              <TFButtonPrimary onClick={() => {}}>Προβολή</TFButtonPrimary>
            </Paper>
          </Grid>
        </Grid>
      </UserCardWrapper>
    </Paper>
  );
}

export default ProfileTile;
