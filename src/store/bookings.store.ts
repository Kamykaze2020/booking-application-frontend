import { create } from "zustand";
import type { Booking, BookingStatus } from "../types/booking";
import {
  listBookings,
  approveBookingRequest,
  rejectBookingRequest,
} from "../api/booking.api";

type BookingFilterStatus = BookingStatus | "ALL";

type BookingsState = {
  items: Booking[];
  loading: boolean;
  error: string | null;

  filterStatus: BookingFilterStatus;
  setFilterStatus: (v: BookingFilterStatus) => void;

  load: () => Promise<void>;

  approve: (id: number) => Promise<void>;
  reject: (id: number) => Promise<void>;

  upsert: (b: Booking) => void;
};

function toMessage(e: any) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Something went wrong"
  );
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  filterStatus: "ALL",
  setFilterStatus: (v) => set({ filterStatus: v }),

  load: async () => {
    set({ loading: true, error: null });
    try {
      const { filterStatus } = get();
      const status = filterStatus === "ALL" ? undefined : filterStatus;
      const data = await listBookings(status);
      set({ items: data, loading: false });
    } catch (e) {
      set({ error: toMessage(e), loading: false });
    }
  },

  approve: async (id) => {
    const prev = get().items;
    // optimistic: mark as APPROVED immediately
    set({
      items: prev.map((b) => (b.id === id ? { ...b, status: "APPROVED" } : b)),
      error: null,
    });

    try {
      const updated = await approveBookingRequest(id);

      // reconcile with backend response (in case it changes other fields)
      set({
        items: get().items.map((b) => (b.id === id ? updated : b)),
      });

      // If filter is active, refetch to remove from list.
      // Simpler: refetch always after mutation:
      await get().load();
    } catch (e) {
      set({ items: prev, error: toMessage(e) });
    }
  },

  reject: async (id) => {
    const prev = get().items;
    set({
      items: prev.map((b) => (b.id === id ? { ...b, status: "REJECTED" } : b)),
      error: null,
    });

    try {
      const updated = await rejectBookingRequest(id);
      set({
        items: get().items.map((b) => (b.id === id ? updated : b)),
      });
      await get().load();
    } catch (e) {
      set({ items: prev, error: toMessage(e) });
    }
  },
  upsert: (b) =>
    set((s) => {
      const items = s.items.slice();
      const idx = items.findIndex((x) => x.id === b.id);
      if (idx >= 0) items[idx] = b;
      else items.unshift(b);
      return { items };
    }),
}));
