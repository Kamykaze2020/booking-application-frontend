import * as React from "react";
import Grid from "@mui/material/GridLegacy";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type { AdSpaceType } from "../types/adSpace";
import { useAdSpacesStore } from "../store/adSpaces.store";

const TYPES: Array<{ label: string; value: AdSpaceType }> = [
  { label: "Billboard", value: "BILLBOARD" },
  { label: "Bus Stop", value: "BUS_STOP" },
  { label: "Mall Display", value: "MALL_DISPLAY" },
  { label: "Transit Ad", value: "TRANSIT_AD" },
];

export function AdSpaceFilters() {
  const filterType = useAdSpacesStore((s) => s.filterType);
  const filterCity = useAdSpacesStore((s) => s.filterCity);
  const setFilterType = useAdSpacesStore((s) => s.setFilterType);
  const setFilterCity = useAdSpacesStore((s) => s.setFilterCity);

  const sortKey = useAdSpacesStore((s) => s.sortKey);
  const setSort = useAdSpacesStore((s) => s.setSort);

  const items = useAdSpacesStore((s) => s.items);

  const cities = React.useMemo(() => {
    return Array.from(new Set(items.map((x) => x.city))).sort();
  }, [items]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            label="Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AdSpaceType | "")}
          >
            <MenuItem value="">All</MenuItem>
            {TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel id="city-label">City</InputLabel>
          <Select
            labelId="city-label"
            label="City"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value as string)}
          >
            <MenuItem value="">All</MenuItem>
            {cities.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <ToggleButtonGroup
          fullWidth
          exclusive
          value={sortKey}
          onChange={(_, v) => v && setSort(v)}
          aria-label="sort"
        >
          <ToggleButton value="name">Sort: Name</ToggleButton>
          <ToggleButton value="city">Sort: City</ToggleButton>
          <ToggleButton value="pricePerDay">Sort: Price</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
}
