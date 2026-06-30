import { http } from "@/api/http";  
import { NetWorthSnapshot, 
    CreateNetWorthSnapshotPayload, 
    UpdateNetWorthSnapshotPayload,
UpdateNetWorthItemPayload,
CreateNetWorthItemPayload } from "./net-worth.types";

export function createNetWorthSnapshot(payload: CreateNetWorthSnapshotPayload) {
  return http<NetWorthSnapshot>('/net-worth', {
    method: 'POST',
    body: payload,
  });
}

///
export function getNetWorthSnapshots() {
  return http<NetWorthSnapshot[]>('/net-worth', {
    method: 'GET',
  });
}

export function getNetWorthSnapshot(id: string) {
  return http<NetWorthSnapshot>(`/net-worth/${id}`, {
    method: 'GET',
  });
}

export function updateNetWorthSnapshot(id: string, payload: UpdateNetWorthSnapshotPayload) {
  return http<NetWorthSnapshot>(`/net-worth/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteNetWorthSnapshot(id: string) {
  return http<void>(`/net-worth/${id}`, {
    method: 'DELETE',
  });
}           

export function createNetWorthItem(snapshotId: string, payload: CreateNetWorthItemPayload) {
  return http(`/net-worth/${snapshotId}/items`, {
    method: 'POST',
    body: payload,
  });
}

export function updateNetWorthItem(snapshotId: string, itemId: string, payload: UpdateNetWorthItemPayload) {
  return http(`/net-worth/${snapshotId}/items/${itemId}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteNetWorthItem(snapshotId: string, itemId: string) {
  return http<void>(`/net-worth/${snapshotId}/items/${itemId}`, {
    method: 'DELETE',
  });
}
