import { api } from "./client";

export type CreateEventPayload = {
  userId: number;
  itemId: number;
  eventType: "view" | "click" | "save";
};

export type EventResponseDTO = {
  id: number;
  userId: number;
  itemId: number;
  eventType: string;
  ts: string;
};

export async function createEvent(payload: CreateEventPayload): Promise<EventResponseDTO> {
  const res = await api.post<EventResponseDTO>("/events", payload);
  return res.data;
}
