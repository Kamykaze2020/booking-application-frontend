import * as React from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

import type { AdSpace } from "../types/adSpace";
import { createBookingRequest } from "../api/booking.api";

import { useBookingsStore } from "../store/bookings.store";

type FieldErrors = Partial<
  Record<"advertiserName" | "advertiserEmail" | "startDate" | "endDate", string>
>;

const schema = z
  .object({
    advertiserName: z.string().trim().min(1, "Advertiser name is required"),
    advertiserEmail: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .superRefine((val, ctx) => {
    // Validate date order (LocalDate strings)
    const s = dayjs(val.startDate);
    const e = dayjs(val.endDate);

    if (!s.isValid())
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date is invalid",
      });
    if (!e.isValid())
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date is invalid",
      });

    if (s.isValid() && e.isValid() && e.isBefore(s, "day")) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }
  });

function zodErrorsToFieldErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path[0] as keyof FieldErrors;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

function formatLocalDate(d: Dayjs | null): string {
  return d ? d.format("YYYY-MM-DD") : "";
}

export function BookingRequestDialog(props: {
  open: boolean;
  space: AdSpace | null;
  onClose: () => void;

  // optional callback if you want to refresh lists / show toast outside
  onCreated?: (bookingId: number) => void;
}) {
  const [advertiserName, setAdvertiserName] = React.useState("");
  const [advertiserEmail, setAdvertiserEmail] = React.useState("");
  const [start, setStart] = React.useState<Dayjs | null>(dayjs().add(1, "day"));
  const [end, setEnd] = React.useState<Dayjs | null>(dayjs().add(8, "day"));

  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const [apiError, setApiError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // reset when opening / changing selected space
  React.useEffect(() => {
    if (!props.open) return;
    setAdvertiserName("");
    setAdvertiserEmail("");
    setStart(dayjs().add(1, "day"));
    setEnd(dayjs().add(8, "day"));
    setFieldErrors({});
    setApiError(null);
    setSuccessMsg(null);
    setSubmitting(false);
  }, [props.open, props.space?.id]);

  const days = React.useMemo(() => {
    if (!start || !end) return 0;
    const diff = end.diff(start, "day");
    return diff > 0 ? diff : 0; // matches your backend test expectation (end = start + 7 => 7)
  }, [start, end]);

  const totalCost = React.useMemo(() => {
    const price = props.space?.pricePerDay ?? 0;
    return Number((days * price).toFixed(2));
  }, [days, props.space?.pricePerDay]);

  const submit = React.useCallback(async () => {
    if (!props.space) return;

    setApiError(null);
    setSuccessMsg(null);
    setFieldErrors({});

    const payload = {
      adSpaceId: props.space.id,
      advertiserName,
      advertiserEmail,
      startDate: formatLocalDate(start),
      endDate: formatLocalDate(end),
    };

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(zodErrorsToFieldErrors(parsed.error));
      return;
    }

    try {
      setSubmitting(true);
      const created = await createBookingRequest(payload);

      // instant BookingList update
      useBookingsStore.getState().upsert(created);
      setSuccessMsg(
        `Booking request created (#${created.id}). Status: ${created.status}. Total: ${created.totalCost}`
      );
      props.onCreated?.(created.id);
    } catch (e: any) {
      // Friendly message + fallback
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to create booking request.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [
    props.space,
    advertiserName,
    advertiserEmail,
    start,
    end,
    props.onCreated,
  ]);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book Ad Space</DialogTitle>

      <DialogContent>
        {!props.space ? (
          <Alert severity="warning">No ad space selected.</Alert>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight={700}>
                {props.space.name}
              </Typography>
              <Typography variant="body2">
                {props.space.city} • {props.space.type} •{" "}
                {props.space.pricePerDay} / day
              </Typography>
              <Typography variant="body2">
                Status: {props.space.status}
              </Typography>
            </Stack>

            {successMsg && <Alert severity="success">{successMsg}</Alert>}
            {apiError && <Alert severity="error">{apiError}</Alert>}

            <TextField
              label="Advertiser name"
              value={advertiserName}
              onChange={(e) => setAdvertiserName(e.target.value)}
              error={!!fieldErrors.advertiserName}
              helperText={fieldErrors.advertiserName}
              fullWidth
            />

            <TextField
              label="Advertiser email"
              value={advertiserEmail}
              onChange={(e) => setAdvertiserEmail(e.target.value)}
              error={!!fieldErrors.advertiserEmail}
              helperText={fieldErrors.advertiserEmail}
              fullWidth
            />

            <DatePicker
              label="Start date"
              value={start}
              onChange={(v) => setStart(v)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!fieldErrors.startDate,
                  helperText: fieldErrors.startDate,
                },
              }}
            />

            <DatePicker
              label="End date"
              value={end}
              onChange={(v) => setEnd(v)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!fieldErrors.endDate,
                  helperText: fieldErrors.endDate,
                },
              }}
            />

            <Alert severity="info">
              {days > 0 ? (
                <>
                  Total days: <b>{days}</b> • Estimated total:{" "}
                  <b>{totalCost}</b>
                </>
              ) : (
                <>Pick valid dates to compute total cost.</>
              )}
            </Alert>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={!props.space || submitting}
        >
          {submitting ? "Submitting..." : "Submit booking request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
