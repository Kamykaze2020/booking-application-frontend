import type { AdSpace } from "./adSpace";

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface BookingDto {
  id: number;
  adSpace: AdSpace;
  advertiserName: string;
  advertiserEmail: string;
  startDate: string; // LocalDate -> "YYYY-MM-DD"
  endDate: string; // LocalDate -> "YYYY-MM-DD"
  status: BookingStatus;
  totalCost: number; // BigDecimal -> number
  createdAt: string; // Instant -> ISO string
}

export interface CreateBookingRequestDto {
  adSpaceId: number;
  advertiserName: string;
  advertiserEmail: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
}

export interface Booking {
  id: number;
  adSpace: AdSpace; // backend sends AdSpaceDto nested
  advertiserName: string;
  advertiserEmail: string;
  startDate: string; // ISO date yyyy-mm-dd
  endDate: string; // ISO date yyyy-mm-dd
  status: BookingStatus;
  totalCost: number; // backend BigDecimal -> number in JS
  createdAt: string; // ISO instant
}
