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
  bronze: 'Add more info and photos to boost visibility',
  silver: 'Good listing! Add more to reach Gold',
  gold: 'Excellent listing — maximum visibility!',
};

export function CompletenessScore({ score, tier }: CompletenessScoreProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Listing Quality</span>
        <Badge variant={tier}>{TIER_LABELS[tier]}</Badge>
      </div>
      <ProgressBar value={score} />
      <p className="text-xs text-gray-500">{TIER_MESSAGES[tier]}</p>
    </div>
  );
}
