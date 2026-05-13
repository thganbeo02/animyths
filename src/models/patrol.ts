import { CardInstanceId, PatrolId, ZoneId } from './branded';
import { RewardBundle } from './reward';

export interface PatrolDraft {
  zoneId: ZoneId | null;
  squadCardIds: CardInstanceId[];
  durationSeconds: number | null;
}

export type Patrol = InProgressPatrol | CollectedPatrol;

interface PatrolBase {
  id: PatrolId;
  zoneId: ZoneId;
  squadCardIds: CardInstanceId[];
  startedAt: Date;
  endsAt: Date;
}

export interface InProgressPatrol extends PatrolBase {
  status: 'in_progress';
}

export interface CollectedPatrol extends PatrolBase {
  status: 'collected';
  collectedAt: Date;
  rewards: RewardBundle;
}

export function isReady(patrol: InProgressPatrol, now: Date = new Date()): boolean {
  return patrol.endsAt <= now;
}

export function isInProgress(patrol: Patrol): patrol is InProgressPatrol {
  return patrol.status === 'in_progress';
}

export function isCollected(patrol: Patrol): patrol is CollectedPatrol {
  return patrol.status === 'collected';
}
