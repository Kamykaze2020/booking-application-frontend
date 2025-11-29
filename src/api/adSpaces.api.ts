import { http } from "./http";
import type {
  AdSpace,
  AdSpaceType,
  CreateAdSpaceRequest,
} from "../types/adSpace";

export type AdSpaceFilters = {
  type?: AdSpaceType | "";
  city?: string | "";
};

export async function fetchAdSpaces(
  filters: AdSpaceFilters
): Promise<AdSpace[]> {
  const params: Record<string, string> = {};
  if (filters.type) params.type = filters.type;
  if (filters.city) params.city = filters.city;

  // Backend spec: GET /api/v1/ad-spaces
  const res = await http.get<AdSpace[]>("/api/v1/ad-spaces", { params });
  return res.data;
}

export async function createAdSpace(payload: CreateAdSpaceRequest) {
  // backend returns AdSpaceDetailsDto; only need fields compatible with AdSpace
  const res = await http.post<AdSpace>("/api/v1/ad-spaces", payload);
  return res.data;
}
