import { http } from '../../api/http';
import {
  InvestmentHistory,
  CreateInvestmentHistoryPayload,
  UpdateInvestmentHistoryPayload,
} from './investment-history-types';

export function createInvestmentHistory(payload: CreateInvestmentHistoryPayload) {
  return http<InvestmentHistory>('/investment-history', {
    method: 'POST',
    body: payload,
  });
}

export function getInvestmentHistories() {
  return http<InvestmentHistory[]>('/investment-history', {
    method: 'GET',
  });
}

export function getInvestmentHistory(id: string) {
  return http<InvestmentHistory>(`/investment-history/${id}`, {
    method: 'GET',
  });
}

export function updateInvestmentHistory(id: string, payload: UpdateInvestmentHistoryPayload) {
  return http<InvestmentHistory>(`/investment-history/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function searchInvestmentHistories(fromDate?: string, untilDate?: string) {
return http<InvestmentHistory[]>(`/investment-history/by-period?fromDate=${fromDate}&untilDate=${untilDate}`, {
  method: "GET",
}
)
}

export function deleteInvestmentHistory(id: string) {
  return http<void>(`/investment-history/${id}`, {
    method: 'DELETE',
  });
}
