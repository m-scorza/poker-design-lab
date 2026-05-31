/* =========================================================
   shader-bg.js — OBSIDIAN cinematic backdrop + motion system
   Self-mounting. <script src="shader-bg.js"></script>.
   1) WebGL ambient: deep near-black field, slow cool haze, a soft
      INDIGO light that tracks the cursor, and a faint fixed BRASS
      glow in the lower-left. Additive, DPR-capped, pauses when hidden.
   2) Scroll reveals: fades/rises top-level content blocks into view.
   3) Aa type switcher: cycles Grotesk / Techno / Editorial (persisted).
   ========================================================= */

/* ---- type theme: apply immediately to avoid flash ---- */
(function () {
  try {
    var t = localStorage.getItem('obsidian-type');
    if (t && t !== 'grotesk') document.documentElement.setAttribute('data-type', t);
  } catch (e) {}
})();

/* ---- WebGL ambient ---- */
(function () {
  if (document.getElementById('shader-bg')) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'shader-bg';
  canvas.setAttribute('aria-hidden', 'true');
  var s = canvas.style;
  s.position = 'fixed'; s.top = '0'; s.left = '0';
  s.width = '100%'; s.height = '100%';
  s.zIndex = '-2'; s.pointerEvents = 'none'; s.display = 'block';
  s.background = 'transparent';
  (document.body || document.documentElement).prepend(canvas);

  var gl = canvas.getContext('webgl', { antialias: true, alpha: true, depth: false, premultipliedAlpha: true, preserveDrawingBuffer: true });
  if (!gl) { return; }

  var VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

  var FRAG = [
    'precision highp float;',
    'uniform vec2 res;',
    'uniform float t;',
    'uniform vec2 mouse;',
    'float hash(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }',
    'float noise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  f = f*f*(3.0-2.0*f);',
    '  float a = hash(i), b = hash(i+vec2(1.0,0.0)), c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));',
    '  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);',
    '}',
    'float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<5;i++){ s += a*noise(p); p *= 2.03; a *= 0.5; } return s; }',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy - 0.5*res) / res.y;',
    '  float time = t*0.012;',
    '  vec2 q = vec2(fbm(uv*0.9 + vec2(0.0, time)), fbm(uv*0.9 + vec2(4.2,1.3) - time));',
    '  float f = fbm(uv*0.9 + 1.3*q + time*0.4);',
    '  vec3 add = vec3(0.0);',
    // cool structural haze (indigo/blue, very restrained)
    '  add += vec3(0.085,0.09,0.20) * smoothstep(0.45, 0.97, f) * 0.6;',
    '  add += vec3(0.05,0.06,0.12) * smoothstep(0.40, 0.9, q.y) * 0.32;',
    // cursor-tracking INDIGO light, modulated by the noise field
    '  float md = length((uv - mouse));',
    '  float glow = exp(-md*md*1.7);',
    '  float halo = exp(-md*md*0.34);',
    '  add += vec3(0.34,0.31,0.74) * glow * (0.52 + 0.48*f);',
    '  add += vec3(0.13,0.12,0.30) * halo * 0.48;',
    // fixed faint BRASS glow, lower-left — warmth anchor
    '  vec2 brassP = vec2(-0.78, -0.46);',
    '  float bd = length((uv - brassP));',
    '  float bglow = exp(-bd*bd*0.6);',
    '  add += vec3(0.30,0.22,0.085) * bglow * (0.30 + 0.30*q.x);',
    // vignette + dither
    '  float vig = smoothstep(1.75, 0.3, length(uv*vec2(0.8,1.0)));',
    '  add *= mix(0.68, 1.0, vig);',
    '  add += (hash(gl_FragCoord.xy + t) - 0.5) * 0.011;',
    '  gl_FragColor = vec4(max(add, 0.0), 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.warn('shader-bg:', gl.getShaderInfoLog(sh)); return null; }
    return sh;
  }
  var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { return; }
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, 'res');
  var uT = gl.getUniformLocation(prog, 't');
  var uMouse = gl.getUniformLocation(prog, 'mouse');

  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  function resize() {
    var w = Math.floor(innerWidth * DPR), h = Math.floor(innerHeight * DPR);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  var tgt = [0.55, 0.32], cur = [0.55, 0.32], hasMouse = false;
  function toUv(clientX, clientY) {
    var w = canvas.width, h = canvas.height;
    var px = clientX * DPR, py = clientY * DPR;
    return [(px - 0.5*w)/h, ((h - py) - 0.5*h)/h];
  }
  window.addEventListener('pointermove', function (e) {
    hasMouse = true;
    var u = toUv(e.clientX, e.clientY);
    tgt[0] = u[0]; tgt[1] = u[1];
  }, { passive: true });

  var visible = true;
  document.addEventListener('visibilitychange', function () { visible = !document.hidden; if (visible) requestAnimationFrame(frame); });

  var start = performance.now();
  function frame(now) {
    if (!visible) return;
    var time = (now - start) / 1000;
    if (!hasMouse) { tgt[0] = 0.5 + 0.35*Math.cos(time*0.18); tgt[1] = 0.18 + 0.22*Math.sin(time*0.13); }
    cur[0] += (tgt[0]-cur[0]) * 0.06;
    cur[1] += (tgt[1]-cur[1]) * 0.06;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uT, time);
    gl.uniform2f(uMouse, cur[0], cur[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ---- scroll reveals ---- */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function init() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var sel = ['.topbar', '.money-hero', '.card', '.hands-table', '.strip', '.ranges-layout > *',
               '.hands-layout > *', '.row', '.section-block', '.notice-band'];
    var seen = [];
    sel.forEach(function (q) {
      document.querySelectorAll(q).forEach(function (el) {
        if (el.closest('.modal, .modal-bg')) return;
        if (el.__rev) return;
        el.__rev = true; seen.push(el);
      });
    });
    // avoid revealing an element that is itself inside another reveal target (prevents double-fade)
    var targets = seen.filter(function (el) {
      return !seen.some(function (other) { return other !== el && other.contains(el); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var batch = (el.__batch || 0);
        el.style.transitionDelay = (Math.min(batch, 6) * 55) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    var i = 0;
    targets.forEach(function (el) {
      el.classList.add('reveal');
      el.__batch = i++;
      io.observe(el);
    });
    // failsafe: never leave content hidden if the observer never fires
    setTimeout(function () {
      targets.forEach(function (el) {
        if (!el.classList.contains('in')) { el.style.transitionDelay = '0ms'; el.classList.add('in'); }
      });
    }, 1400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ---- Aa type switcher ---- */
(function () {
  var THEMES = [
    { id: 'grotesk',   name: 'Grotesk' },
    { id: 'techno',    name: 'Techno' },
    { id: 'editorial', name: 'Editorial' }
  ];
  function current() {
    try { return localStorage.getItem('obsidian-type') || 'grotesk'; } catch (e) { return 'grotesk'; }
  }
  function apply(id) {
    if (id === 'grotesk') document.documentElement.removeAttribute('data-type');
    else document.documentElement.setAttribute('data-type', id);
    try { localStorage.setItem('obsidian-type', id); } catch (e) {}
  }
  function build() {
    if (document.getElementById('aa-switch')) return;
    var el = document.createElement('button');
    el.id = 'aa-switch';
    el.className = 'aa-switch';
    el.setAttribute('aria-label', 'Cycle typeface');
    function render() {
      var c = current();
      var t = THEMES.find(function (x) { return x.id === c; }) || THEMES[0];
      el.innerHTML = '<span class="aa-glyph">Aa</span><span class="aa-name">Type · <b>' + t.name + '</b></span><span class="aa-kbd">T</span>';
    }
    function cycle() {
      var c = current();
      var idx = THEMES.findIndex(function (x) { return x.id === c; });
      var next = THEMES[(idx + 1) % THEMES.length];
      apply(next.id); render();
    }
    el.addEventListener('click', cycle);
    document.addEventListener('keydown', function (e) {
      if (e.key === 't' && !/input|textarea/i.test((e.target.tagName || ''))) cycle();
    });
    render();
    document.body.appendChild(el);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
