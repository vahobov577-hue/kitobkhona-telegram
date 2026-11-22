import React from 'react';
import {ramp} from '../lib';
import {Layer} from '../effects/Parallax';
import {Line, Sfx, Shot} from '../effects/Shot';
import {Glow, Room, Window} from '../environments/common';
import {Phone} from '../inserts/PhoneUI';
import {Silhouette} from '../characters/Silhouette';
import {InBed} from './S11';
import {LEO, useT} from './kit';

// close: Dan picks up — "…Leo?"
const A: React.FC = () => {
  const {t, g} = useT();
  return (
    <Shot cam={() => ({zoom: 2.6, fx: 720, fy: 420})} overlay={<Line text="…Leo?" from={8} to={66} />}>
      <InBed frame={g} expr={t > 14 ? 'surprised' : 'worried'} phone={<g transform="rotate(-40)"><Phone x={0} y={-30} scale={0.09} mode={{kind: 'connected', name: 'DAN', timer: '0:01'}} hand={false} glow={0} /></g>} />
      <Sfx name="pickup" at={2} volume={0.8} />
    </Shot>
  );
};
const B: React.FC = () => {
  const {t} = useT();
  return (
    <Shot bg="#111" zoom={[1.05, 1.1]}>
      <Layer depth={0.5} blur={8}>
        <rect x={-500} y={-500} width={3000} height={2200} fill="#1b1d22" />
      </Layer>
      <Layer depth={1}>
        <Phone x={960} y={560} scale={1.05} mode={{kind: 'connected', name: 'DAN', timer: `0:0${Math.min(9, 2 + Math.floor(t / 30))}`}} />
      </Layer>
    </Shot>
  );
};

/** split screen: Leo's room (left) and Dan's room (right), each lit by the phone; amber fills both */
const Split: React.FC<{amber: number; leoTalk?: number; danTalk?: number; happy?: boolean}> = ({amber, leoTalk = 0, danTalk = 0, happy = false}) => {
  const {g} = useT();
  const half = (side: 0 | 1) => {
    const x0 = side ? 966 : 0;
    const clip = `split${side}`;
    return (
      <g>
        <clipPath id={clip}>
          <rect x={x0} y={0} width={954} height={1080} />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <g transform={`translate(${x0 - 480} 0)`}>
            <Room wall={side ? '#2b2a30' : '#24262c'} wall2={side ? '#34333a' : '#2d3037'} floor="#18191c" floorY={880} />
            <Window x={side ? 560 : 1000} y={170} w={360} h={340} mood="night" seed={'sp' + side} />
            <Glow cx={960} cy={480} r={700} color="#FFB347" opacity={0.55 * amber} />
            {side === 0
              ? LEO({x: 960, y: 1000, frame: g, scale: 1.9, facing: 1, expr: happy ? 'happy' : 'neutral', talk: leoTalk, rig: {armB: [-168, -150], armF: [10, 6], head: 6}, handItemBack: <Phone x={0} y={-20} scale={0.1} mode={{kind: 'off'}} hand={false} glow={0} />})
              : <Silhouette seed="dan" acc="dan" x={960} y={1000} frame={g + 40} scale={1.9} facing={-1} expr={happy ? 'happy' : 'neutral'} talk={danTalk} rig={{armB: [-168, -150], armF: [10, 6], head: 6}} handItemBack={<Phone x={0} y={-20} scale={0.1} mode={{kind: 'off'}} hand={false} glow={0} />} />}
            <Glow cx={side ? 900 : 1020} cy={560} r={240} color="#cfe0ff" opacity={0.35 * (1 - amber)} />
          </g>
        </g>
      </g>
    );
  };
  return (
    <Layer depth={1}>
      <rect x={-500} y={-500} width={3000} height={2200} fill="#000" />
      {half(0)}
      {half(1)}
    </Layer>
  );
};
const C3: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={[1.0, 1.03]} sat={0.6} overlay={<Line text="Man… I thought you were mad at me." from={8} to={80} />}>
      <Split amber={ramp(t, 40, 80, 0, 0.3)} danTalk={t > 8 && t < 60 ? 1 : 0} />
    </Shot>
  );
};
const D: React.FC = () => {
  const {t} = useT();
  return (
    <Shot zoom={[1.03, 1.06]} sat={0.7} overlay={<Line text="I thought YOU were." from={4} to={50} />}>
      <Split amber={ramp(t, 0, 60, 0.3, 1)} leoTalk={t > 4 && t < 34 ? 1 : 0} happy={t > 36} danTalk={t > 40 ? 0.8 : 0} />
      <Sfx name="laugh2" at={36} volume={0.7} />
      <Sfx name="strings" at={0} volume={0.6} dur={70} />
    </Shot>
  );
};
export const S28 = [A, B, C3, D];
void LEO;
