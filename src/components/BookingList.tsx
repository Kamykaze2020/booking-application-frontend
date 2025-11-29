import * as React from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { BookingFilters } from "./BookingFilters";
import { useBookingsStore } from "../store/bookings.store";
import type { BookingStatus } from "../types/booking";

function statusChipColor(status: BookingStatus) {
  switch (status) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
}

export function BookingList() {
  const loading = useBookingsStore((s) => s.loading);
  const error = useBookingsStore((s) => s.error);
  const load = useBookingsStore((s) => s.load);

  const items = useBookingsStore((s) => s.items);
  const filterStatus = useBookingsStore((s) => s.filterStatus);

  const approve = useBookingsStore((s) => s.approve);
  const reject = useBookingsStore((s) => s.reject);

  React.useEffect(() => {
    load();
  }, [load, filterStatus]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Booking Requests</Typography>

      <BookingFilters />

      {loading && (
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={22} />
          <Typography variant="body2">Loading…</Typography>
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ad space</TableCell>
                <TableCell>Advertiser</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((b) => {
                const isPending = b.status === "PENDING";
                return (
                  <TableRow key={b.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>
                        {b.adSpace?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {b.adSpace?.city} • {b.adSpace?.type}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography>{b.advertiserName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {b.advertiserEmail}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {b.startDate} → {b.endDate}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={b.status}
                        color={statusChipColor(b.status) as any}
                      />
                    </TableCell>

                    <TableCell align="right">
                      {Number(b.totalCost).toFixed(2)}
                    </TableCell>

                    <TableCell align="right">
                      {isPending ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => approve(b.id)}
                            disabled={loading}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => reject(b.id)}
                            disabled={loading}
                          >
                            Reject
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2">No bookings found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
