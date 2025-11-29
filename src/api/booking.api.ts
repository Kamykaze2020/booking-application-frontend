import { http } from "./http";
import type { Booking, BookingStatus } from "../types/booking";
import type { BookingDto, CreateBookingRequestDto } from "../types/booking";

export async function createBookingRequest(
  payload: CreateBookingRequestDto
): Promise<BookingDto> {
  const res = await http.post<BookingDto>("/api/v1/booking-requests", payload);
  return res.data;
}

// list bookings
export async function listBookings(status?: BookingStatus): Promise<Booking[]> {
  const res = await http.get<Booking[]>("/api/v1/booking-requests", {
    params: status ? { status } : undefined,
  });
  return res.data;
}

/**
 * endpoints to match backend.
 * Common patterns:
 * - PATCH /api/v1/booking-requests/{id}/approve
 * - PATCH /api/v1/booking-requests/{id}/reject
 * - PATCH /api/v1/booking-requests/{id} body: { status: "APPROVED" }
 */
export async function approveBookingRequest(id: number): Promise<Booking> {
  const res = await http.patch<Booking>(
    `/api/v1/booking-requests/${id}/approve`
  );
  return res.data;
}

export async function rejectBookingRequest(id: number): Promise<Booking> {
  const res = await http.patch<Booking>(
    `/api/v1/booking-requests/${id}/reject`
  );
  return res.data;
}
