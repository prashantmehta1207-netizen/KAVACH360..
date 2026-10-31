import React from 'react';
import { SeverityType } from '../types/safety';

interface StatusBadgeProps {
  type: SeverityType | 'compliant' | 'active' | 'standby' | 'alert';
  label: string;
  pulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  label,
  pulse = true,
  className = ''
}) => {
  let bgStyles = '';
  let dotColor = '';

  switch (type) {
    case 'critical':
    case 'alert':
      bgStyles = 'bg-[#FEE2E2] border border-[#FECACA] text-[#991B1B]';
      dotColor = 'bg-[#EF4444]';
      break;
    case 'warning':
      bgStyles = 'bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]';
      dotColor = 'bg-[#F59E0B]';
      break;
    case 'resolved':
    case 'compliant':
      bgStyles = 'bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46]';
      dotColor = 'bg-[#10B981]';
      break;
    case 'processing':
    case 'active':
    default:
      bgStyles = 'bg-[#DBEAFE] border border-[#BFDBFE] text-[#1E40AF]';
      dotColor = 'bg-[#2563EB]';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase font-mono ${bgStyles} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span>{label}</span>
    </span>
  );
};
