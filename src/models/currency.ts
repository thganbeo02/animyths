import { TransactionId, UserId } from './branded';

export type CurrencyKind = 'essence' | 'fragments' | 'prime';
export const CURRENCY_KINDS = ['essence', 'fragments', 'prime'] as const;

export interface CurrencyBalances {
  essence: number;
  fragments: number;
  prime: number;
}

export interface CurrencyAmount {
  kind: CurrencyKind;
  amount: number;
}

export type TransactionKind =
  | 'patrol_launch_cost'
  | 'patrol_reward'
  | 'pack_open_cost'
  | 'fusion_cost'
  | 'iap'
  | 'admin_grant'
  | 'refund';

export interface CurrencyTransaction {
  id: TransactionId;
  userId: UserId;
  kind: TransactionKind;
  delta: CurrencyAmount;
  relatedId?: string;
  occuredAt: Date;
}
