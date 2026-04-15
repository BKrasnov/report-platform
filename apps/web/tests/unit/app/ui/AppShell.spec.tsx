import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppShell } from '@/app/ui/AppShell';

describe('AppShell', () => {
  it('renders header slot and main content area', () => {
    render(<AppShell header={<div>Header</div>}>Body</AppShell>);

    expect(screen.getByText('Header')).toBeDefined();
    expect(screen.getByText('Body')).toBeDefined();
    expect(screen.getByRole('main')).toBeDefined();
  });
});
