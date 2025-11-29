import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import { z } from "zod";
import type { AdSpace } from "../types/adSpace";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required"),
  pricePerDay: z.number().positive("Price must be > 0"),
});

export function EditAdSpaceDialog(props: {
  open: boolean;
  space: AdSpace | null;
  onClose: () => void;
  onSave: (updated: AdSpace) => void;
}) {
  const [name, setName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [pricePerDay, setPricePerDay] = React.useState<string>("");

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!props.space) return;
    setName(props.space.name);
    setCity(props.space.city);
    setPricePerDay(String(props.space.pricePerDay));
    setError(null);
  }, [props.space, props.open]);

  const onSubmit = () => {
    if (!props.space) return;

    const parsedPrice = Number(pricePerDay);
    const result = schema.safeParse({ name, city, pricePerDay: parsedPrice });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    props.onSave({
      ...props.space,
      name: result.data.name,
      city: result.data.city,
      pricePerDay: result.data.pricePerDay,
    });
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Ad Space</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          />
          <TextField
            label="Price per day"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            type="number"
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
