import React from 'react';
import { render } from '@testing-library/react';
import RegistryPage from '../app/registry/page';
import { fetchServices } from '../lib/contract';

jest.mock('../lib/contract', () => ({
  fetchServices: jest.fn(),
}));

describe('RegistryPage loading state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows skeleton cards while loading', () => {
    (fetchServices as jest.Mock).mockReturnValue(new Promise(() => {}));

    const { container } = render(<RegistryPage />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(4);
  });
});
