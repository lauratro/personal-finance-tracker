import { http } from "@/api/http";  
import { NetWorthItem,
    NetWorthSnapshot,
    NetWorthSnapshotWithPrevious,
    CreateNetWorthSnapshotPayload, 
    UpdateNetWorthSnapshotPayload,
UpdateNetWorthItemPayload,
CreateNetWorthItemPayload, 
NetWorthIndicators,
SortDirection} from "./net-worth.types";

export function createNetWorthSnapshot(payload: CreateNetWorthSnapshotPayload) {
  return http<NetWorthSnapshot>('/net-worth', {
    method: 'POST',
    body: payload,
  });
}


export function getNetWorthSnapshots(sortDirection: SortDirection = SortDirection.DESC) {
  return http<NetWorthSnapshot[]>(`/net-worth/?sortDirection=${sortDirection}`, {
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
  return http<NetWorthItem>(`/net-worth/${snapshotId}/items`, {
    method: 'POST',
    body: payload,
  });
}

export function updateNetWorthItem(snapshotId: string, itemId: string, payload: UpdateNetWorthItemPayload) {
  return http<NetWorthItem>(`/net-worth/${snapshotId}/items/${itemId}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function getNetWorthItem(snapshotId: string, itemId: string) {
  return http<NetWorthItem>(`/net-worth/${snapshotId}/items/${itemId}`, {
    method: 'GET',
  });
}

export function deleteNetWorthItem(snapshotId: string, itemId: string) {
  return http<void>(`/net-worth/${snapshotId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

export function getNetWorthYearsList() {
  return http<number[]>(`/net-worth/years-list`, {
    method: 'GET',
  });
}

export function getNetWorthSnapshotsBasedOnYear(year: number, includePreviousYear: boolean = false) {
  return http<NetWorthSnapshotWithPrevious>(`/net-worth/by-year/${year}/${includePreviousYear}`, {
    method: 'GET',
  });
}

export function getLastNetWorthIndicators() {
  return http<NetWorthIndicators>(`/net-worth/latest`, {
    method: 'GET',
  });
}

