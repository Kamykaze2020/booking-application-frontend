import { create } from "zustand";
import type { AdSpace, AdSpaceType } from "../types/adSpace";
import { fetchAdSpaces } from "../api/adSpaces.api";

type SortKey = "name" | "city" | "pricePerDay";
type SortDir = "asc" | "desc";

type AdSpacesState = {
  items: AdSpace[];
  loading: boolean;
  error: string | null;

  filterType: AdSpaceType | "";
  filterCity: string | "";

  sortKey: SortKey;
  sortDir: SortDir;

  load: () => Promise<void>;
  setFilterType: (t: AdSpaceType | "") => void;
  setFilterCity: (c: string | "") => void;
  setSort: (key: SortKey) => void;

  // UI-only actions (until backend has CRUD endpoints)
  deleteLocal: (id: number) => void;
  upsertLocal: (space: AdSpace) => void;

  // Derived helpers
  getVisible: () => AdSpace[];
  getCities: () => string[];
};

function sortCompare(a: AdSpace, b: AdSpace, key: SortKey, dir: SortDir) {
  const mult = dir === "asc" ? 1 : -1;
  const va = a[key];
  const vb = b[key];

  if (typeof va === "number" && typeof vb === "number") return (va - vb) * mult;
  return String(va).localeCompare(String(vb)) * mult;
}

export const useAdSpacesStore = create<AdSpacesState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  filterType: "",
  filterCity: "",

  sortKey: "name",
  sortDir: "asc",

  load: async () => {
    const { filterType, filterCity } = get();
    set({ loading: true, error: null });

    try {
      const data = await fetchAdSpaces({ type: filterType, city: filterCity });
      set({ items: data, loading: false });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to load ad spaces. Is the backend running?";
      set({ error: msg, loading: false });
    }
  },

  setFilterType: (t) => set({ filterType: t }),
  setFilterCity: (c) => set({ filterCity: c }),

  setSort: (key) => {
    const { sortKey, sortDir } = get();
    // clicking same sort toggles dir
    if (key === sortKey) set({ sortDir: sortDir === "asc" ? "desc" : "asc" });
    else set({ sortKey: key, sortDir: "asc" });
  },

  deleteLocal: (id) => set({ items: get().items.filter((x) => x.id !== id) }),

  upsertLocal: (space) => {
    const items = get().items.slice();
    const idx = items.findIndex((x) => x.id === space.id);
    if (idx >= 0) items[idx] = space;
    else items.unshift(space);
    set({ items });
  },

  getVisible: () => {
    const { items, filterType, filterCity, sortKey, sortDir } = get();

    let out = items;

    if (filterType) out = out.filter((x) => x.type === filterType);
    if (filterCity) out = out.filter((x) => x.city === filterCity);

    return out.slice().sort((a, b) => sortCompare(a, b, sortKey, sortDir));
  },

  getCities: () => {
    const cities = Array.from(new Set(get().items.map((x) => x.city))).sort();
    return cities;
  },
}));
