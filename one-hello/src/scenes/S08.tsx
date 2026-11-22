import React from 'react';
import {keys} from '../lib';
import {Layer} from '../effects/Parallax';
import {Sfx, Shot} from '../effects/Shot';
import {AptRoom} from '../environments/Apartment';
import {Phone} from '../inserts/PhoneUI';
import {LEO, useT} from './kit';

const Desk: React.FC = () => (
  <Layer depth={0.5} blur={8}>
    <rect x={-500} y={-500} width={3000} height={2200} fill="#1d1e22" />
    <rect x={-500} y={760} width={3000} height={600} fill="#2a2b30" />
  </Layer>
);

const A: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#111" zoom={[1.05, 1.1]}>
      <Desk />
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.0} rot={-3} mode={{kind: 'chat', title: 'The Boys', scroll: keys(t, [0, 70], [0, 120]), msgs: [{text: "let's catch up soon!", meta: '2 years ago'}, {text: 'haha yeah we should', me: true, meta: '2024'}, {text: 'for sure'}, {text: 'next month?', me: false}]}} />
      </Layer>
      <Sfx name="scroll" at={10} volume={0.4} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#111" zoom={[1.1, 1.05]}>
      <Desk />
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.0} rot={2} mode={{kind: 'chats', scroll: keys(t, [0, 70], [0, 160]), rows: [
          {name: 'Mom', text: 'call me when you can', meta: 'Mon'},
          {name: 'Work', text: 'meeting moved to 10', meta: 'Sun'},
          {name: 'Gym Bros', text: 'who is in tmrw?', meta: 'Sat'},
          {name: 'Dan', text: 'congrats on the new job man!', meta: '2y', unread: true},
          {name: 'Uni Group', text: 'photos from the trip', meta: '2y'},
          {name: 'Sara', text: 'haha ok', meta: '3y'},
        ]}} />
      </Layer>
      <Sfx name="scroll" at={6} volume={0.4} />
    </Shot>
  );
};
// over the shoulder: Dan's message, unanswered
const C: React.FC = () => {
  const {g} = useT();
  return (
    <Shot bg="#111" drift={[20, 0]}>
      <Layer depth={0.6} blur={5}>
        <AptRoom mood="dark" />
      </Layer>
      <Layer depth={1}>
        <Phone x={1080} y={520} scale={0.75} rot={-6} mode={{kind: 'chat', title: 'Dan', msgs: [{text: 'congrats on the new job man!', meta: '2 years ago'}, {text: 'Seen', me: false}]}} />
      </Layer>
      <Layer depth={1.35} blur={16}>
        {LEO({x: 560, y: 1800, frame: g, scale: 3.6, back: true})}
      </Layer>
    </Shot>
  );
};
export const S08 = [A, B, C];
