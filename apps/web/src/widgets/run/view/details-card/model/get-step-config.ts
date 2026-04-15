import type { StepState, StepStyle } from './types';

export const classByState: Record<StepState, string> = {
  idle: 'timeline-step',
  active: 'timeline-step timeline-step--active',
  done: 'timeline-step timeline-step--done',
  failed: 'timeline-step timeline-step--failed',
};

export const stylesByState: Record<StepState, StepStyle> = {
  done: {
    backgroundColor: '#effaf5',
    borderColor: '#cce9dc',
    markerBackground: '#d7f2e4',
    markerColor: '#1f7e57',
  },
  active: {
    backgroundColor: '#edf1ff',
    borderColor: '#c4d0ff',
    markerBackground: '#e3e9ff',
    markerColor: '#2f4eb4',
  },
  failed: {
    backgroundColor: '#ffeef2',
    borderColor: '#f2c5cd',
    markerBackground: '#ffd9e1',
    markerColor: '#b33f55',
  },
  idle: {
    backgroundColor: '#fff',
    borderColor: 'divider',
    markerBackground: '#eef2ff',
    markerColor: '#6276d8',
  },
};
