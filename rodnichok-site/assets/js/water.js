/* =========================================================
   Вода на WebGL: каустика горного родника + рябь от курсора.
   Без библиотек, один фрагментный шейдер на весь экран.
   ========================================================= */
window.WaterScene = function (canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) { canvas.style.background = 'radial-gradient(120% 90% at 50% 0%,#1a56b8,#06204a)'; return null; }

  const vert = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const frag = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uForce; uniform float uScroll;
uniform vec3 uRip[6]; // xy = позиция, z = время старта

float caustic(vec2 p, float t){
  vec2 i = p; float c = 1.0; float inten = .006;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.2 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0; c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 7.0);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 m = vec2(uMouse.x * asp, uMouse.y);

  // рябь от курсора (постоянная) + кольца от кликов
  float d = length(p - m);
  vec2 dir = normalize(p - m + 1e-4);
  vec2 off = dir * sin(d * 38.0 - uTime * 7.0) * exp(-d * 5.5) * .018 * uForce;
  for (int k = 0; k < 6; k++) {
    float age = uTime - uRip[k].z;
    if (age > 0.0 && age < 3.0) {
      vec2 rp = vec2(uRip[k].x * asp, uRip[k].y);
      float rd = length(p - rp);
      float ring = sin((rd - age * .45) * 55.0) * exp(-abs(rd - age * .45) * 18.0) * (1.0 - age / 3.0);
      off += normalize(p - rp + 1e-4) * ring * .02;
    }
  }
  vec2 q = p + off;

  float t = uTime * .35 + 23.0;
  float c1 = caustic(q * 5.2 + vec2(0.0, uScroll * 2.0), t);
  float c2 = caustic(q * 8.0 + vec2(3.1, 1.7 + uScroll * 3.0), t * 1.2);
  float caus = clamp(c1 * .7 + c2 * .35, 0.0, 1.5);

  // глубина: светлее сверху, темнее внизу
  vec3 deep = vec3(.016, .09, .22);
  vec3 mid  = vec3(.06, .27, .62);
  vec3 top  = vec3(.13, .45, .82);
  float g = smoothstep(0.0, 1.0, uv.y + off.y * 4.0);
  vec3 col = mix(deep, mid, g);
  col = mix(col, top, pow(g, 3.0) * .55);
  col += vec3(.55, .85, 1.0) * caus * (.16 + .32 * g);

  // блик вокруг курсора
  col += vec3(.5, .85, 1.0) * exp(-d * 7.0) * .18 * uForce;

  // виньетка
  vec2 vv = uv - .5;
  col *= 1.0 - dot(vv, vv) * .7;
  gl_FragColor = vec4(col, 1.0);
}`;

  function sh(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog); gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = n => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'), uForce = U('uForce'), uScroll = U('uScroll'), uRip = U('uRip');

  const state = { mx: .5, my: .6, tx: .5, ty: .6, force: .4, scroll: 0, running: true, visible: true, quality: 1 };
  const ripples = new Float32Array(18).fill(-99); let ri = 0;
  const t0 = performance.now();
  const now = () => (performance.now() - t0) / 1000;

  // ограничиваем разрешение: шейдер тяжёлый, а вода всё равно мягкая
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * (innerWidth > 1600 ? .75 : 1) * state.quality;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize(); addEventListener('resize', resize);

  const rect = () => canvas.getBoundingClientRect();
  addEventListener('pointermove', e => {
    const r = rect();
    state.tx = (e.clientX - r.left) / r.width; state.ty = 1 - (e.clientY - r.top) / r.height;
    state.force = Math.min(1.6, state.force + Math.hypot(e.movementX || 0, e.movementY || 0) * .01);
  }, { passive: true });
  canvas.parentElement.addEventListener('pointerdown', e => {
    const r = rect();
    ripples[ri * 3] = (e.clientX - r.left) / r.width; ripples[ri * 3 + 1] = 1 - (e.clientY - r.top) / r.height; ripples[ri * 3 + 2] = now();
    ri = (ri + 1) % 6;
  });

  new IntersectionObserver(([en]) => { state.visible = en.isIntersecting; }).observe(canvas);

  // адаптивное качество: если кадры медленные, снижаем разрешение (вода мягкая, разницы не видно)
  let last = performance.now(), acc = 0, n = 0;
  function frame() {
    requestAnimationFrame(frame);
    const tnow = performance.now(), dt = tnow - last; last = tnow;
    if (!state.visible || !state.running) return;
    acc += dt; n++;
    if (n === 20) {
      if (acc / n > 26 && state.quality > .3) { state.quality *= .7; resize(); }
      acc = 0; n = 0;
    }
    state.mx += (state.tx - state.mx) * .08; state.my += (state.ty - state.my) * .08;
    state.force += (.4 - state.force) * .03;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, now());
    gl.uniform2f(uMouse, state.mx, state.my);
    gl.uniform1f(uForce, state.force);
    gl.uniform1f(uScroll, state.scroll);
    gl.uniform3fv(uRip, ripples);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  frame();
  return state;
};
