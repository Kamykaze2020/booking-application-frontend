import * as React from "react";
import { Container, Stack, Divider } from "@mui/material";
import { AdSpaceList } from "./components/AdSpaceList";
import { BookingList } from "./components/BookingList";

export default function App() {
  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={4}>
        <AdSpaceList />
        <Divider />
        <BookingList />
      </Stack>
    </Container>
  );
}
