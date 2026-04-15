import { stylesByState } from './get-step-config';
import type { StepState, StepStyle } from './types';

export function getStepStyles(stepState: StepState): StepStyle {
  return stylesByState[stepState];
}
