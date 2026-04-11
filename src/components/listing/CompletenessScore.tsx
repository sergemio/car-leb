'use client';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { QualityTier } from '@/types';

interface CompletenessScoreProps {
  score: number;
  tier: QualityTier;
}

const TIER_LABELS: Record<QualityTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
};

const TIER_MESSAGES: Record<QualityTier, string> = {
  bronze: 'Add more info and photos to boost visibility.',
  silver: 'Good listing. Add more to reach Gold.',
  gold: 'Excellent listing — maximum visibility.',
};

export function CompletenessScore({ score, tier }: CompletenessScoreProps) {
  return (
    <div className="bg-[var(--gray-1)] border border-[var(--gray-2)] rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--gray-4)]">
          Listing Quality
        </span>
        <Badge variant={tier}>{TIER_LABELS[tier]}</Badge>
      </div>
      <ProgressBar value={score} />
      <p className="text-[12px] text-[var(--gray-4)] leading-relaxed">{TIER_MESSAGES[tier]}</p>
    </div>
  );
}
