import { classByState } from './get-step-config';
import { getStepState } from './get-step-state';

export function getStepClass(step: 1 | 2 | 3, status: string): string {
  const stepState = getStepState(step, status);

  return classByState[stepState];
}
