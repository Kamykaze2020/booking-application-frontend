export type AdSpaceType =
  | "BILLBOARD"
  | "BUS_STOP"
  | "MALL_DISPLAY"
  | "TRANSIT_AD";
export type AdSpaceStatus = "AVAILABLE" | "BOOKED" | "MAINTENANCE";

export interface AdSpace {
  id: number; // Long -> number
  name: string;
  type: AdSpaceType;
  city: string;
  pricePerDay: number; // BigDecimal -> number (Jackson sends JSON number)
  status: AdSpaceStatus;
}

// Details DTO if later fetch by id
export interface AdSpaceDetailsDto extends AdSpace {
  address: string;
}

export interface CreateAdSpaceRequest {
  name: string;
  type: AdSpaceType;
  city: string;
  address: string;
  pricePerDay: number;
  status: AdSpaceStatus; // send "AVAILABLE" typically
}
