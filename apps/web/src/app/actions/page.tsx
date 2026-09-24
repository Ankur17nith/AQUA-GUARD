'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fallbackActions } from '@/lib/demoData';
import { ActionCenter } from '@/components/actions/ActionCenter';

export default function ActionsPage() {
  const { data: actions = fallbackActions } = useQuery({
    queryKey: ['actions', 62],
    queryFn: () => api.getActions(62)
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ActionCenter actions={actions} />
    </div>
  );
}
