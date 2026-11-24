import React from 'react';
import {Narr, Shot} from '../effects/Shot';

const A: React.FC = () => <Shot bg="#000" vignette={0} overlay={<Narr text="My mom calls every Sunday." from={4} to={75} size={68} />} />;
const B: React.FC = () => <Shot bg="#000" vignette={0} overlay={<Narr text="I answer maybe once a month." from={4} to={75} size={68} />} />;
export const S02 = [A, B];
