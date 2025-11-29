import * as React from "react";
import { Container } from "@mui/material";
import { AdSpaceList } from "./components/AdSpaceList";

export default function App() {
  return (
    <Container sx={{ py: 4 }}>
      <AdSpaceList />
    </Container>
  );
}
