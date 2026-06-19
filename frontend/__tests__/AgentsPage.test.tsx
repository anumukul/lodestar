import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AgentsPage from '../app/agents/page';
import { fetchAgents, fetchAgentStats } from '../lib/contract';
import type { AgentEntry, AgentStats } from '../lib/types';

jest.mock('../lib/contract', () => ({
  fetchAgents: jest.fn(),
  fetchAgentStats: jest.fn(),
}));

const mockAgent: AgentEntry = {
  address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUV',
  name: 'Demo Agent',
  description: 'Handles demo requests',
  owner: 'GOWNER',
  score: 820,
  total_payments: 10,
  successful_payments: 9,
  failed_payments: 1,
  total_volume_stroops: '10000000',
  registered_at: 12345,
  last_active: 12350,
  active: true,
  flagged: false,
  flag_reason: '',
};

const mockStats: AgentStats = {
  totalAgents: 1,
  avgScore: 820,
  topAgent: mockAgent,
  totalVolume: '1.00',
};

describe('AgentsPage retry state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lets users retry after the agents request fails', async () => {
    (fetchAgents as jest.Mock)
      .mockRejectedValueOnce(new Error('Network disconnected'))
      .mockResolvedValueOnce({ agents: [mockAgent], count: 1 });
    (fetchAgentStats as jest.Mock).mockResolvedValue(mockStats);

    render(<AgentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Network disconnected')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Demo Agent' })).toBeInTheDocument();
    });
    expect(fetchAgents).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('Network disconnected')).not.toBeInTheDocument();
  });
});
