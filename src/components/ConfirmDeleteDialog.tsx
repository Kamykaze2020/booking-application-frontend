import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export function ConfirmDeleteDialog(props: {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={props.open} onClose={props.onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{props.title ?? "Delete item?"}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {props.description ?? "This action cannot be undone."}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button color="error" variant="contained" onClick={props.onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
