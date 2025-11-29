import { z } from "zod";

export const adSpaceTypes = [
  "BILLBOARD",
  "BUS_STOP",
  "MALL_DISPLAY",
  "TRANSIT_AD",
] as const;

export const adSpaceStatuses = ["AVAILABLE", "BOOKED", "MAINTENANCE"] as const;

export const createAdSpaceSchema = z.object({
  name: z.string().trim().min(2, "Name is required (min 2 chars)"),
  type: z.enum(adSpaceTypes),
  city: z.string().trim().min(2, "City is required"),
  address: z.string().trim().min(2, "Address is required"),
  pricePerDay: z.coerce
    .number()
    .finite("Price must be a valid number")
    .positive("Price must be > 0"),
  status: z.enum(adSpaceStatuses),
});

export type CreateAdSpaceValues = z.infer<typeof createAdSpaceSchema>;
export type AdSpaceType = (typeof adSpaceTypes)[number];
export type AdSpaceStatus = (typeof adSpaceStatuses)[number];
