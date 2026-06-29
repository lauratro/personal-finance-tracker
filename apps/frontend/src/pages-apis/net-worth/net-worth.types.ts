export enum NetWorthCategory {
  CHECKING_ACCOUNT = 'CHECKING_ACCOUNT',
  SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
  INVESTMENTS = 'INVESTMENTS',
  CASH = 'CASH',
  CRYPTO = 'CRYPTO',
  REAL_ESTATE = 'REAL_ESTATE',
  OTHER = 'OTHER'
}

export type NetWorthItem = {
  id: string;
  snapshotId: string;
  name: string;
  category: NetWorthCategory;
  value: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateNetWorthItemPayload = {
  name: string;
  category: NetWorthCategory;
  value: number;
};

export type UpdateNetWorthItemPayload = Partial<CreateNetWorthItemPayload>;     

export type NetWorthSnapshot = {
  id: string;
  userId: string;
  monthStart: string;
  items: NetWorthItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateNetWorthSnapshotPayload = {
  monthStart: string;
  items: CreateNetWorthItemPayload[];
};

export type UpdateNetWorthSnapshotPayload = Partial<CreateNetWorthSnapshotPayload>;