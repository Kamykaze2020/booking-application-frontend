import * as React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useBookingsStore } from "../store/bookings.store";

export function BookingFilters() {
  const filterStatus = useBookingsStore((s) => s.filterStatus);
  const setFilterStatus = useBookingsStore((s) => s.setFilterStatus);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="APPROVED">Approved</MenuItem>
          <MenuItem value="REJECTED">Rejected</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
