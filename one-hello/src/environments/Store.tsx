import React from 'react';
import {rnd} from '../lib';
import {Room} from './common';

/** small grocery store: shelves with products, register counter */
export const Store: React.FC = () => (
  <g>
    <Room wall="#d8d6d0" wall2="#eceae6" floor="#a9a49c" floorY={880} />
    {[0, 1, 2].map((s) => (
      <g key={s} transform={`translate(${-200 + s * 820} 160)`}>
        <rect x={0} y={0} width={720} height={560} fill="#cfcbc3" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={0} y={120 + r * 130} width={720} height={10} fill="#8f8a82" />
            {Array.from({length: 12}).map((_, i) => (
              <rect key={i} x={14 + i * 58} y={120 + r * 130 - 50 - rnd('p' + s + r + i) * 30} width={44} height={50 + rnd('p' + s + r + i) * 30} rx={4} fill={['#c9604a', '#4d7aa3', '#e2b24a', '#6c9a5a', '#d9d2c2', '#8a5a8a'][(i + r + s) % 6]} />
            ))}
          </g>
        ))}
      </g>
    ))}
  </g>
);

/** checkout counter with register (foreground of the cashier) */
export const Checkout: React.FC = () => (
  <g>
    <rect x={500} y={640} width={1100} height={300} fill="#7e8a92" />
    <rect x={500} y={626} width={1100} height={20} fill="#e6e4df" />
    <g transform="translate(1460 626)">
      <rect x={-80} y={-110} width={160} height={110} rx={8} fill="#2f3237" />
      <rect x={-60} y={-160} width={120} height={60} rx={6} fill="#3d4148" />
      <rect x={-50} y={-152} width={100} height={40} rx={4} fill="#9fd0a6" opacity={0.7} />
    </g>
  </g>
);
