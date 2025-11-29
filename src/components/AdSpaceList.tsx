import * as React from "react";
import Grid from "@mui/material/GridLegacy";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AdSpaceFilters } from "./AdSpaceFilters";
import { useAdSpacesStore } from "../store/adSpaces.store";
import type { AdSpace } from "../types/adSpace";
import { EditAdSpaceDialog } from "./EditAdSpaceDialog";
import { CreateAdSpaceDialog } from "../features/adspaces/CreateAdSpaceDialog";

function typeLabel(t: string) {
  return t
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

type SortKey = "name" | "city" | "pricePerDay";

export function AdSpaceList() {
  const loading = useAdSpacesStore((s) => s.loading);
  const error = useAdSpacesStore((s) => s.error);
  const load = useAdSpacesStore((s) => s.load);

  // store state
  const items = useAdSpacesStore((s) => s.items);
  const sortKey = useAdSpacesStore((s) => s.sortKey as SortKey);
  const sortDir = useAdSpacesStore((s) => s.sortDir);
  const filterType = useAdSpacesStore((s) => s.filterType);
  const filterCity = useAdSpacesStore((s) => s.filterCity);

  // local UI actions
  const deleteLocal = useAdSpacesStore((s) => s.deleteLocal);
  const upsertLocal = useAdSpacesStore((s) => s.upsertLocal);

  // dialog state
  const [bookSpace, setBookSpace] = React.useState<AdSpace | null>(null);
  const [editSpace, setEditSpace] = React.useState<AdSpace | null>(null);
  const [deleteSpace, setDeleteSpace] = React.useState<AdSpace | null>(null);

  const [createOpen, setCreateOpen] = React.useState(false);

  // Sort derived list (filters are done server-side load() via query params)
  const visibleItems = React.useMemo(() => {
    const mult = sortDir === "asc" ? 1 : -1;

    return items.slice().sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];

      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * mult;
      }
      return String(va).localeCompare(String(vb)) * mult;
    });
  }, [items, sortKey, sortDir]);

  // load on mount + when filters change
  React.useEffect(() => {
    load();
  }, [load, filterType, filterCity]);

  return (
    <Stack spacing={2}>
      {/*<Typography variant="h5">Available Ad Spaces</Typography>*/}

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Available Ad Spaces</Typography>

        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Add Ad Space
        </Button>
      </Stack>

      <AdSpaceFilters />

      {loading && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress size={22} />
          <Typography variant="body2">Loading…</Typography>
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {/* Table view */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Table View
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="right">Price/day</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {visibleItems.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{typeLabel(s.type)}</TableCell>
                  <TableCell>{s.city}</TableCell>
                  <TableCell align="right">{s.pricePerDay}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setBookSpace(s)}
                      >
                        Book Now
                      </Button>
                      <Button size="small" onClick={() => setEditSpace(s)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setDeleteSpace(s)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && visibleItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2">No results.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Card view */}
      <Typography variant="subtitle1">Card View</Typography>
      <Grid container spacing={2}>
        {visibleItems.map((s) => (
          <Grid item xs={12} md={6} lg={4} key={s.id}>
            <Card>
              <CardContent>
                <Typography fontWeight={700}>{s.name}</Typography>
                <Typography variant="body2">{typeLabel(s.type)}</Typography>
                <Typography variant="body2">City: {s.city}</Typography>
                <Typography variant="body2">
                  Price/day: {s.pricePerDay}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={() => setBookSpace(s)}>
                    Book Now
                  </Button>
                  <Button onClick={() => setEditSpace(s)}>Edit</Button>
                  <Button color="error" onClick={() => setDeleteSpace(s)}>
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <EditAdSpaceDialog
        open={editSpace != null}
        space={editSpace}
        onClose={() => setEditSpace(null)}
        onSave={(updated) => {
          upsertLocal(updated);
          setEditSpace(null);
        }}
      />

      <CreateAdSpaceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(created) => {
          // update store immediately (no reload)
          upsertLocal(created);

          // If GET /ad-spaces returns only AVAILABLE, and might create non-AVAILABLE:
          // load();

          setCreateOpen(false);
        }}
      />
    </Stack>
  );
}
