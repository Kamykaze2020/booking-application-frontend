import { useMemo, useState } from "react";
import Grid from "@mui/material/GridLegacy";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import type { AdSpace } from "../../types/adSpace";
import { createAdSpace } from "../../api/adSpaces.api";
import {
  adSpaceStatuses,
  adSpaceTypes,
  createAdSpaceSchema,
  type CreateAdSpaceValues,
} from "./adSpaceCreate.validation";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (created: AdSpace) => void; // caller will push into Zustand
};

type FieldErrors = Partial<Record<keyof CreateAdSpaceValues, string>>;

export function CreateAdSpaceDialog({ open, onClose, onCreated }: Props) {
  const [values, setValues] = useState<CreateAdSpaceValues>({
    name: "",
    type: "BILLBOARD",
    city: "",
    address: "",
    pricePerDay: 100,
    status: "AVAILABLE",
  });

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const canSubmit = useMemo(() => !submitting, [submitting]);

  const setField = <K extends keyof CreateAdSpaceValues>(
    key: K,
    value: CreateAdSpaceValues[K]
  ) => {
    setValues((p) => ({ ...p, [key]: value }));
    setFieldErrors((p) => ({ ...p, [key]: undefined }));
    setApiError(null);
  };

  const validate = () => {
    const parsed = createAdSpaceSchema.safeParse(values);
    if (parsed.success) {
      setFieldErrors({});
      return true;
    }
    const next: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path?.[0] as keyof CreateAdSpaceValues | undefined;
      if (key && !next[key]) next[key] = issue.message;
    }
    setFieldErrors(next);
    return false;
  };

  const resetAndClose = () => {
    setApiError(null);
    setFieldErrors({});
    setSubmitting(false);
    onClose();
  };

  const submit = async () => {
    setApiError(null);
    if (!validate()) return;

    try {
      setSubmitting(true);

      const created = await createAdSpace({
        ...values,
        // ensure numeric (TextField can feed string)
        pricePerDay: Number(values.pricePerDay),
      });

      onCreated(created);
      resetAndClose();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to create ad space";
      setApiError(String(msg));
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={resetAndClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Ad Space</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              fullWidth
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name}
              disabled={submitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Type"
              value={values.type}
              onChange={(e) => setField("type", e.target.value as any)}
              fullWidth
              disabled={submitting}
              error={Boolean(fieldErrors.type)}
              helperText={fieldErrors.type}
            >
              {adSpaceTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Status"
              value={values.status}
              onChange={(e) => setField("status", e.target.value as any)}
              fullWidth
              disabled={submitting}
              error={Boolean(fieldErrors.status)}
              helperText={fieldErrors.status}
            >
              {adSpaceStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              value={values.city}
              onChange={(e) => setField("city", e.target.value)}
              fullWidth
              disabled={submitting}
              error={Boolean(fieldErrors.city)}
              helperText={fieldErrors.city}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Price per day"
              type="number"
              value={values.pricePerDay}
              onChange={(e) =>
                setField("pricePerDay", Number(e.target.value) as any)
              }
              fullWidth
              disabled={submitting}
              error={Boolean(fieldErrors.pricePerDay)}
              helperText={fieldErrors.pricePerDay}
              inputProps={{ min: 1, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              value={values.address}
              onChange={(e) => setField("address", e.target.value)}
              fullWidth
              disabled={submitting}
              error={Boolean(fieldErrors.address)}
              helperText={fieldErrors.address}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={resetAndClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={!canSubmit}>
          {submitting ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
