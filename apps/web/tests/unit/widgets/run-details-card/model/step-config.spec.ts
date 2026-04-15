import { describe, expect, it } from 'vitest';

import { getStepClass } from '@/widgets/run/view/details-card/model/get-step-class';
import { getStepState } from '@/widgets/run/view/details-card/model/get-step-state';
import { getStepStyles } from '@/widgets/run/view/details-card/model/get-step-styles';

type Step = 1 | 2 | 3;
type Status = 'queued' | 'running' | 'succeeded' | 'failed';

type Case = {
  status: Status;
  step: Step;
  expectedState: 'idle' | 'active' | 'done' | 'failed';
  expectedClass: string;
};

const matrix: Case[] = [
  {
    status: 'queued',
    step: 1,
    expectedState: 'active',
    expectedClass: 'timeline-step timeline-step--active',
  },
  { status: 'queued', step: 2, expectedState: 'idle', expectedClass: 'timeline-step' },
  { status: 'queued', step: 3, expectedState: 'idle', expectedClass: 'timeline-step' },

  {
    status: 'running',
    step: 1,
    expectedState: 'done',
    expectedClass: 'timeline-step timeline-step--done',
  },
  {
    status: 'running',
    step: 2,
    expectedState: 'active',
    expectedClass: 'timeline-step timeline-step--active',
  },
  { status: 'running', step: 3, expectedState: 'idle', expectedClass: 'timeline-step' },

  {
    status: 'succeeded',
    step: 1,
    expectedState: 'done',
    expectedClass: 'timeline-step timeline-step--done',
  },
  {
    status: 'succeeded',
    step: 2,
    expectedState: 'done',
    expectedClass: 'timeline-step timeline-step--done',
  },
  {
    status: 'succeeded',
    step: 3,
    expectedState: 'done',
    expectedClass: 'timeline-step timeline-step--done',
  },

  {
    status: 'failed',
    step: 1,
    expectedState: 'done',
    expectedClass: 'timeline-step timeline-step--done',
  },
  {
    status: 'failed',
    step: 2,
    expectedState: 'done',
    expectedClass: 'timeline-step timeline-step--done',
  },
  {
    status: 'failed',
    step: 3,
    expectedState: 'failed',
    expectedClass: 'timeline-step timeline-step--failed',
  },
];

describe('run details step config', () => {
  it.each(matrix)(
    'maps $status + step $step to consistent state/class/styles',
    ({ status, step, expectedState, expectedClass }) => {
      const state = getStepState(step, status);
      const className = getStepClass(step, status);
      const styles = getStepStyles(state);

      expect(state).toBe(expectedState);
      expect(className).toBe(expectedClass);
      expect(styles).toBeDefined();
      expect(styles.backgroundColor).toBeTruthy();
      expect(styles.borderColor).toBeTruthy();
      expect(styles.markerBackground).toBeTruthy();
      expect(styles.markerColor).toBeTruthy();
    }
  );
});
