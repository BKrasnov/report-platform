import type { StepState } from './types';

export function getStepState(step: 1 | 2 | 3, status: string): StepState {
  if (status === 'queued') {
    return step === 1 ? 'active' : 'idle';
  }

  if (status === 'running') {
    if (step === 1) return 'done';
    if (step === 2) return 'active';
    return 'idle';
  }

  if (status === 'succeeded') {
    return 'done';
  }

  if (status === 'failed') {
    if (step < 3) return 'done';
    return 'failed';
  }

  return 'idle';
}
