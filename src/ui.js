/* Control Plot Lab — Web UI (React without JSX). */
const CONTROL_LAB_ZH = {
  title: '控制工程绘图台',
  subtitle: '传递函数 · Bode · Nyquist · 根轨迹',
  launch: '控制绘图',
  close: '关闭',
  inputLabel: '传递函数 G(s)',
  placeholder: '例如：10/(s*(s+1)*(s+2))',
  examples: '常用示例',
  options: '绘图选项',
  showAsymptotes: '显示渐近线',
  showGrid: '显示网格',
  kLabel: '参数 K',
  delayLabel: '纯滞后 τ',
  copy: '复制步骤',
  copied: '已复制',
  steps: '计算步骤',
  bode: 'Bode 图',
  nyquist: 'Nyquist 图',
  rootLocus: '根轨迹',
  summary: '分析摘要',
  type: '型别',
  order: '阶次',
  rhp: 'RHP 极点',
  pm: '相位裕度',
  gm: '增益裕度',
  closed: '闭环',
  stable: '稳定',
  unstable: '不稳定',
  marginal: '临界',
  error: '无法解析',
  noRootLocus: '根轨迹不可用',
  noSteps: '当前页面没有可显示的步骤。',
  delayDetected: '检测到纯滞后',
  kDetected: '检测到参数 K',
  kHint: 'Bode/Nyquist 使用该 K 值；根轨迹会自动扫描 K。',
  delayHint: 'Bode/Nyquist 使用精确 e^(−τs)；根轨迹使用二阶 Padé 近似。',
  syntaxHint: '支持 s、K、数字、括号和 + − * / ^。乘号可省略，例如 s(s+1)。纯滞后写成 e^(-0.5s) 或 exp(-0.5s)。',
  rootLocusApprox: '根轨迹对纯滞后采用二阶 Padé 近似',
  exactNyquistDelay: 'Nyquist 曲线为精确纯滞后',
  noK: '传递函数中没有符号 K，按标准反馈增益 K 绘制根轨迹。',
  paramK: '已检测到符号 K，根轨迹以该 K 为变化参数。',
  copyFailed: '复制失败，请手动选择文本。',
  closeHint: 'Esc 关闭',
  zoom: '缩放',
  zoomIn: '放大',
  zoomOut: '缩小',
  reset: '重置',
};

const CONTROL_LAB_EN = {
  title: 'Control plot lab',
  subtitle: 'Transfer function · Bode · Nyquist · root locus',
  launch: 'Control plots',
  close: 'Close',
  inputLabel: 'Transfer function G(s)',
  placeholder: 'e.g. 10/(s*(s+1)*(s+2))',
  examples: 'Examples',
  options: 'Plot options',
  showAsymptotes: 'Show asymptotes',
  showGrid: 'Show grid',
  kLabel: 'Parameter K',
  delayLabel: 'Delay τ',
  copy: 'Copy steps',
  copied: 'Copied',
  steps: 'Calculation steps',
  bode: 'Bode',
  nyquist: 'Nyquist',
  rootLocus: 'Root locus',
  summary: 'Summary',
  type: 'Type',
  order: 'Order',
  rhp: 'RHP poles',
  pm: 'Phase margin',
  gm: 'Gain margin',
  closed: 'Closed loop',
  stable: 'Stable',
  unstable: 'Unstable',
  marginal: 'Marginal',
  error: 'Cannot parse',
  noRootLocus: 'Root locus unavailable',
  noSteps: 'No steps to display for this view.',
  delayDetected: 'Delay detected',
  kDetected: 'Parameter K detected',
  kHint: 'Bode/Nyquist use this K; the root locus sweeps K automatically.',
  delayHint: 'Bode/Nyquist use the exact e^(−τs); the root locus uses a second-order Padé approximation.',
  syntaxHint: 'Supports s, K, numbers, parentheses and + − * / ^. Multiplication may be implicit, as in s(s+1). Write a delay as e^(-0.5s) or exp(-0.5s).',
  rootLocusApprox: 'Root locus uses a second-order Padé approximation of the delay',
  exactNyquistDelay: 'Nyquist curve uses the exact delay',
  noK: 'No symbolic K found; the root locus uses the standard feedback gain K.',
  paramK: 'Symbolic K found; the root locus sweeps that parameter.',
  copyFailed: 'Copy failed; please select the text manually.',
  closeHint: 'Esc to close',
  zoom: 'Zoom',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  reset: 'Reset',
};

function createControlLabUI(React, h, engine, t) {
  const tr = (key, fallback) => {
    try {
      const v = t ? t(key) : null;
      return v && v !== key ? v : fallback;
    } catch (err) {
      return fallback;
    }
  };

  const EXAMPLES = [
    { label: '三阶系统', expr: '10/(s*(s+1)*(s+2))' },
    { label: '二阶振荡', expr: '(s+2)/(s^2+2*s+5)' },
    { label: '参数 K', expr: '3/((K*s+3)*(s+1))' },
    { label: '纯滞后', expr: 'e^(-0.5*s)/(s+1)' },
    { label: 'II 型系统', expr: '1/(s^2*(s+1))' },
    { label: '非最小相位', expr: '(s-1)/(s^2+2*s+2)' },
  ];

  const LAUNCHER_CSS = `
    .cl-launcher{width:28px;height:28px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#6b7280);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:background .15s,color .15s}
    .cl-launcher:hover{background:var(--dsw-alias-bg-layer-2,#f3f4f6);color:var(--dsw-alias-label-primary,#111827)}
    .cl-launcher:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#2563eb);outline-offset:2px}
    .cl-fab{position:fixed;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:9px 14px 9px 11px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:linear-gradient(135deg,#1d4ed8,#2563eb 60%,#0ea5e9);color:#f8fafc;font-size:12.5px;font-weight:650;letter-spacing:.01em;cursor:grab;box-shadow:0 8px 24px rgba(37,99,235,.34),0 2px 6px rgba(2,6,23,.2);pointer-events:auto;transition:box-shadow .15s,filter .15s;font-family:var(--dsw-font-family,ui-sans-serif,system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif);touch-action:none;user-select:none}
    .cl-fab:hover{box-shadow:0 12px 30px rgba(37,99,235,.42),0 3px 8px rgba(2,6,23,.22);filter:saturate(1.08)}
    .cl-fab:active{cursor:grabbing}
    .cl-fab:focus-visible{outline:2px solid #bfdbfe;outline-offset:3px}
    @media (max-width:820px){.cl-fab{padding:8px 12px 8px 10px;font-size:12px}}
  `;

  const CSS = `
    .cl-backdrop{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(2,6,23,.52);backdrop-filter:blur(5px);pointer-events:auto}
    .cl-panel{--cl-bg:var(--dsw-alias-bg-layer-1,#fff);--cl-bg2:var(--dsw-alias-bg-layer-2,#f6f7f9);--cl-bg3:var(--dsw-alias-bg-overlay,#fff);--cl-border:var(--dsw-alias-border-l1,#e5e7eb);--cl-border2:var(--dsw-alias-border-l2,#d1d5db);--cl-text:var(--dsw-alias-label-primary,#111827);--cl-muted:var(--dsw-alias-label-secondary,#6b7280);--cl-brand:var(--dsw-alias-brand-primary,#2563eb);--cl-grid:color-mix(in srgb,var(--cl-border) 72%,transparent);width:min(1520px,97vw);height:min(950px,94vh);background:var(--cl-bg);color:var(--cl-text);border:1px solid var(--cl-border2);border-radius:16px;box-shadow:0 28px 90px rgba(2,6,23,.4);display:flex;flex-direction:column;overflow:hidden;font-family:var(--dsw-font-family,ui-sans-serif,system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif)}
    .cl-header{display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid var(--cl-border);background:linear-gradient(180deg,var(--cl-bg),var(--cl-bg2))}
    .cl-brand{display:flex;align-items:center;gap:12px;min-width:0}
    .cl-logo{width:38px;height:38px;border-radius:11px;background:linear-gradient(145deg,#0f172a,#1d4ed8);display:flex;align-items:center;justify-content:center;color:#e0f2fe;flex:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.18)}
    .cl-title{font-size:16px;font-weight:700;line-height:1.25;letter-spacing:.2px}
    .cl-subtitle{font-size:11.5px;color:var(--cl-muted);margin-top:2px}
    .cl-head-right{margin-left:auto;display:flex;align-items:center;gap:7px;flex-wrap:wrap;justify-content:flex-end}
    .cl-badge{font-size:11px;line-height:1;padding:5px 8px;border-radius:999px;border:1px solid var(--cl-border);background:var(--cl-bg2);color:var(--cl-muted);white-space:nowrap}
    .cl-badge.ok{color:#047857;border-color:color-mix(in srgb,#059669 35%,var(--cl-border));background:color-mix(in srgb,#059669 10%,var(--cl-bg))}
    .cl-badge.bad{color:#b91c1c;border-color:color-mix(in srgb,#dc2626 35%,var(--cl-border));background:color-mix(in srgb,#dc2626 9%,var(--cl-bg))}
    .cl-badge.warn{color:#b45309;border-color:color-mix(in srgb,#d97706 38%,var(--cl-border));background:color-mix(in srgb,#d97706 10%,var(--cl-bg))}
    .cl-iconbtn{width:32px;height:32px;border:1px solid transparent;border-radius:9px;background:transparent;color:var(--cl-muted);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
    .cl-iconbtn:hover{background:var(--cl-bg2);color:var(--cl-text);border-color:var(--cl-border)}
    .cl-iconbtn:focus-visible{outline:2px solid var(--cl-brand);outline-offset:1px}
    .cl-body{flex:1;min-height:0;display:grid;grid-template-columns:268px minmax(0,1fr) 356px}
    .cl-left,.cl-right{min-height:0;overflow:auto;padding:15px 14px;background:var(--cl-bg2);scrollbar-width:thin}
    .cl-left{border-right:1px solid var(--cl-border)}
    .cl-right{border-left:1px solid var(--cl-border);display:flex;flex-direction:column}
    .cl-center{min-width:0;min-height:0;display:flex;flex-direction:column;padding:13px 15px 15px;background:var(--cl-bg);overflow:hidden}
    .cl-section{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--cl-muted);margin:2px 0 8px}
    .cl-section:not(:first-child){margin-top:17px}
    .cl-textarea{width:100%;min-height:92px;box-sizing:border-box;resize:vertical;border:1px solid var(--cl-border2);border-radius:10px;background:var(--cl-bg);color:var(--cl-text);padding:10px 11px;font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;font-size:12.5px;line-height:1.6;outline:none}
    .cl-textarea:focus{border-color:var(--cl-brand);box-shadow:0 0 0 3px color-mix(in srgb,var(--cl-brand) 14%,transparent)}
    .cl-examples{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
    .cl-chipbtn{border:1px solid var(--cl-border);background:var(--cl-bg);color:var(--cl-muted);border-radius:999px;padding:4px 8px;font-size:11px;cursor:pointer;line-height:1.2;white-space:nowrap}
    .cl-chipbtn:hover{border-color:var(--cl-brand);color:var(--cl-brand)}
    .cl-chipbtn.active{background:color-mix(in srgb,var(--cl-brand) 10%,var(--cl-bg));border-color:color-mix(in srgb,var(--cl-brand) 45%,var(--cl-border));color:var(--cl-brand)}
    .cl-krow{display:flex;align-items:center;gap:8px;margin-top:11px}
    .cl-krow label{font-size:12px;color:var(--cl-muted);white-space:nowrap}
    .cl-krow input{width:92px;box-sizing:border-box;border:1px solid var(--cl-border2);border-radius:8px;background:var(--cl-bg);color:var(--cl-text);padding:5px 8px;font-size:12px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;outline:none}
    .cl-krow input:focus{border-color:var(--cl-brand)}
    .cl-note{font-size:11px;line-height:1.5;color:var(--cl-muted);margin:7px 0 0}
    .cl-infobox{margin-top:10px;padding:8px 9px;border-radius:9px;border:1px solid color-mix(in srgb,#d97706 32%,var(--cl-border));background:color-mix(in srgb,#d97706 8%,var(--cl-bg));font-size:11px;line-height:1.5;color:var(--cl-text)}
    .cl-toggles{display:flex;flex-direction:column;gap:7px}
    .cl-toggle{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--cl-text);cursor:pointer;user-select:none}
    .cl-toggle input{accent-color:var(--cl-brand);width:14px;height:14px;cursor:pointer}
    .cl-tip{font-size:10.8px;line-height:1.55;color:var(--cl-muted);margin-top:14px;padding-top:10px;border-top:1px dashed var(--cl-border)}
    .cl-tabs{display:flex;gap:3px;background:var(--cl-bg2);border:1px solid var(--cl-border);padding:3px;border-radius:11px;width:fit-content;max-width:100%}
    .cl-tab{border:0;background:transparent;color:var(--cl-muted);font-size:12.5px;font-weight:600;padding:7px 13px;border-radius:8px;cursor:pointer;white-space:nowrap}
    .cl-tab:hover{color:var(--cl-text)}
    .cl-tab.active{background:var(--cl-bg);color:var(--cl-text);box-shadow:0 1px 3px rgba(15,23,42,.12),0 0 0 1px var(--cl-border)}
    .cl-tab:focus-visible{outline:2px solid var(--cl-brand);outline-offset:1px}
    .cl-summary{display:flex;flex-wrap:wrap;gap:5px;margin:9px 0 9px}
    .cl-stat{font-size:11px;line-height:1.2;padding:4px 8px;border-radius:7px;border:1px solid var(--cl-border);background:var(--cl-bg2);color:var(--cl-muted);white-space:nowrap}
    .cl-stat b{color:var(--cl-text);font-weight:650}
    .cl-stat.ok{color:#047857;border-color:color-mix(in srgb,#059669 32%,var(--cl-border));background:color-mix(in srgb,#059669 8%,var(--cl-bg))}
    .cl-stat.bad{color:#b91c1c;border-color:color-mix(in srgb,#dc2626 32%,var(--cl-border));background:color-mix(in srgb,#dc2626 8%,var(--cl-bg))}
    .cl-stat.warn{color:#b45309;border-color:color-mix(in srgb,#d97706 34%,var(--cl-border));background:color-mix(in srgb,#d97706 8%,var(--cl-bg))}
    .cl-chart-card{flex:1;min-height:0;display:flex;flex-direction:column;border:1px solid var(--cl-border);border-radius:12px;background:var(--cl-bg);overflow:hidden}
    .cl-chart-head{display:flex;align-items:baseline;gap:9px;padding:8px 11px 4px}
    .cl-chart-title{font-size:12px;font-weight:700}
    .cl-chart-sub{font-size:10.5px;color:var(--cl-muted)}
    .cl-legend{display:flex;flex-wrap:wrap;gap:11px;padding:2px 11px 5px;font-size:10.5px;color:var(--cl-muted)}
    .cl-legend span{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
    .cl-dot{width:8px;height:2px;border-radius:2px;display:inline-block}
    .cl-chart-body{flex:1;min-height:0;padding:0 4px 4px;display:flex}
    .cl-chart-svg{width:100%;height:100%;min-height:270px;display:block;overflow:visible}
    .cl-zoom-wrap{position:relative;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden}
    .cl-zoom-stage{position:relative;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden}
    .cl-zoom-inner{width:100%;height:100%;display:flex;transform-origin:center center;will-change:transform;transition:transform .08s linear}
    .cl-zoom-inner.can-pan{cursor:grab}
    .cl-zoom-inner.is-dragging{cursor:grabbing;transition:none}
    .cl-zoom-controls{position:absolute;top:3px;right:5px;z-index:3;display:flex;align-items:center;gap:2px;padding:3px;border:1px solid var(--cl-border);border-radius:8px;background:color-mix(in srgb,var(--cl-bg) 88%,transparent);backdrop-filter:blur(4px);box-shadow:0 2px 8px rgba(2,6,23,.12)}
    .cl-zoom-btn{width:22px;height:22px;border:0;border-radius:5px;background:transparent;color:var(--cl-muted);font-size:13px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}
    .cl-zoom-btn:hover{background:var(--cl-bg2);color:var(--cl-text)}
    .cl-zoom-btn:disabled{opacity:.35;cursor:default}
    .cl-zoom-label{font-size:9.5px;color:var(--cl-muted);padding:0 3px;white-space:nowrap}
    .cl-steps-head{display:flex;align-items:center;gap:8px;margin-bottom:4px}
    .cl-steps-head h3{font-size:12.5px;margin:0;font-weight:700}
    .cl-copy{margin-left:auto;border:1px solid var(--cl-border);background:var(--cl-bg);color:var(--cl-muted);border-radius:8px;padding:4px 8px;font-size:11px;cursor:pointer}
    .cl-copy:hover{color:var(--cl-brand);border-color:var(--cl-brand)}
    .cl-steps-scroll{flex:1;min-height:0;overflow:auto;padding-right:3px;scrollbar-width:thin}
    .cl-step{padding:9px 0;border-bottom:1px dashed var(--cl-border)}
    .cl-step:last-child{border-bottom:0}
    .cl-step-title{font-size:12px;font-weight:700;line-height:1.4;margin-bottom:3px}
    .cl-step-body{font-size:11.5px;line-height:1.58;color:var(--cl-muted);white-space:pre-wrap;word-break:break-word}
    .cl-formula{margin:6px 0 0;padding:7px 9px;border-radius:8px;background:var(--cl-bg);border:1px solid var(--cl-border);border-left:2px solid var(--cl-brand);font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;font-size:11px;line-height:1.55;color:var(--cl-text);white-space:pre-wrap;overflow-wrap:anywhere}
    .cl-empty{padding:18px 12px;font-size:12px;line-height:1.6;color:var(--cl-muted);border:1px dashed var(--cl-border);border-radius:10px;background:var(--cl-bg)}
    .cl-error{padding:14px;border:1px solid color-mix(in srgb,#dc2626 35%,var(--cl-border));border-radius:11px;background:color-mix(in srgb,#dc2626 6%,var(--cl-bg))}
    .cl-error h3{margin:0 0 6px;font-size:13px;color:#b91c1c}
    .cl-error p{margin:0 0 8px;font-size:12px;line-height:1.6;color:var(--cl-text);white-space:pre-wrap}
    .cl-error ul{margin:0;padding-left:18px;font-size:11.5px;line-height:1.7;color:var(--cl-muted)}
    .cl-footnote{font-size:10.5px;color:var(--cl-muted);margin-top:6px;line-height:1.5}
    @media (max-width:1200px){.cl-body{grid-template-columns:238px minmax(0,1fr)}.cl-right{grid-column:1/-1;max-height:270px;border-left:0;border-top:1px solid var(--cl-border)}.cl-chart-svg{min-height:230px}}
    @media (max-width:820px){.cl-backdrop{padding:8px}.cl-panel{width:100vw;height:96vh}.cl-body{grid-template-columns:1fr}.cl-left{border-right:0;border-bottom:1px solid var(--cl-border);max-height:270px}.cl-center{min-height:360px}.cl-right{max-height:250px}.cl-chart-svg{min-height:220px}}
  `;

  const Store = {
    open: false,
    listeners: new Set(),
    setOpen(v) {
      this.open = v;
      for (const fn of Array.from(this.listeners)) fn(v);
    },
    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    },
  };

  function useOpen() {
    const [value, setValue] = React.useState(Store.open);
    React.useEffect(() => Store.subscribe(setValue), []);
    return value;
  }

  function readSavedExpr() {
    try {
      const v = window.localStorage.getItem('control-lab.expr');
      if (v && v.trim()) return v;
    } catch (err) { /* ignore */ }
    return '10/(s*(s+1)*(s+2))';
  }
  function saveExpr(v) {
    try { window.localStorage.setItem('control-lab.expr', v); } catch (err) { /* ignore */ }
  }

  function defaultFabPos() {
    const w = (typeof window !== 'undefined' && window.innerWidth) || 1280;
    const h = (typeof window !== 'undefined' && window.innerHeight) || 800;
    return { x: Math.max(8, w - 176), y: Math.max(8, h - 310) };
  }
  function clampFabPos(p) {
    const w = (typeof window !== 'undefined' && window.innerWidth) || 1280;
    const h = (typeof window !== 'undefined' && window.innerHeight) || 800;
    return {
      x: Math.min(Math.max(8, Number(p && p.x) || 8), Math.max(8, w - 172)),
      y: Math.min(Math.max(8, Number(p && p.y) || 8), Math.max(8, h - 56)),
    };
  }
  function readFabPos() {
    try {
      const raw = window.localStorage.getItem('control-lab.fab');
      if (raw) {
        const p = JSON.parse(raw);
        if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) return clampFabPos(p);
      }
    } catch (err) { /* ignore */ }
    return defaultFabPos();
  }
  function saveFabPos(p) {
    try { window.localStorage.setItem('control-lab.fab', JSON.stringify(p)); } catch (err) { /* ignore */ }
  }

  function Launcher() {
    return h(React.Fragment, null,
      h('style', null, LAUNCHER_CSS),
      h('button', {
        type: 'button',
        className: 'cl-launcher',
        title: tr('launch', '控制绘图'),
        'aria-label': tr('launch', '控制绘图'),
        onClick: () => Store.setOpen(true),
      }, h('svg', {
        viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      },
        h('path', { d: 'M3 12h18M12 3v18', opacity: 0.42 }),
        h('path', { d: 'M4.5 16.2c2.6-8.3 12.4-8.3 15 0' }),
        h('circle', { cx: 17.2, cy: 8.1, r: 1.65, fill: 'currentColor', stroke: 'none' })
      ))
    );
  }

  function Logo() {
    return h('svg', {
      viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none',
      stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round',
      'aria-hidden': true,
    },
      h('path', { d: 'M3 12h18M12 3v18', opacity: 0.45 }),
      h('path', { d: 'M4.5 16.2c2.6-8.3 12.4-8.3 15 0' }),
      h('circle', { cx: 17.2, cy: 8.1, r: 1.6, fill: 'currentColor', stroke: 'none' })
    );
  }

  function fmt(v, digits) {
    if (v === null || v === undefined || Number.isNaN(v)) return '—';
    if (!Number.isFinite(v)) return '∞';
    if (Math.abs(v) < 1e-10) return '0';
    const a = Math.abs(v);
    if (a >= 1e5 || a < 1e-3) return engine.fmt(v, digits || 3);
    let s = v.toPrecision(digits || 3);
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }
  function fmtPm(v) { return v === null || v === undefined ? '—' : fmt(v, 3) + '°'; }
  function fmtGm(v) { return v === null || v === undefined ? '—' : fmt(v, 3) + ' dB'; }

  function Badge({ kind, children }) {
    return h('span', { className: 'cl-badge' + (kind ? ' ' + kind : '') }, children);
  }

  function Stat({ label, value, kind }) {
    return h('span', { className: 'cl-stat' + (kind ? ' ' + kind : '') },
      label ? label + ' ' : '', h('b', null, value));
  }

  function Summary({ result }) {
    const s = result.summary;
    const stabilityKind = s.closedStable ? 'ok' : (s.closedRhp === 0 ? 'warn' : 'bad');
    const stabilityText = s.closedStable ? tr('stable', '稳定') : (s.closedRhp === 0 ? tr('marginal', '临界') : tr('unstable', '不稳定'));
    return h('div', { className: 'cl-summary' },
      h(Stat, { label: tr('type', '型别'), value: String(s.type) }),
      h(Stat, { label: tr('order', '阶次'), value: String(s.order) }),
      h(Stat, { label: 'P', value: String(s.rhpPoles) }),
      h(Stat, { label: tr('pm', '相位裕度'), value: fmtPm(s.pm), kind: s.pm === null || s.pm === undefined ? undefined : (s.pm > 0 ? 'ok' : 'bad') }),
      h(Stat, { label: tr('gm', '增益裕度'), value: fmtGm(s.gm), kind: s.gm === null || s.gm === undefined ? undefined : (s.gm > 0 ? 'ok' : 'bad') }),
      h(Stat, { label: tr('closed', '闭环'), value: stabilityText, kind: stabilityKind }),
      s.delay > 0 ? h(Stat, { label: tr('delayLabel', '纯滞后 τ'), value: fmt(s.delay, 3) + ' s', kind: 'warn' }) : null
    );
  }

  function ErrorCard({ error }) {
    return h('div', { className: 'cl-error' },
      h('h3', null, tr('error', '无法解析')),
      h('p', null, error),
      h('ul', null,
        h('li', null, '变量只使用 s，参数使用 K。'),
        h('li', null, '乘号可以省略：s(s+1)、2s、3(s+2)。'),
        h('li', null, '纯滞后写成 e^(-0.5s) 或 exp(-0.5s)，且只能作为乘性因子。'),
        h('li', null, '指数使用 ^，例如 s^2；不要使用 s**2。')
      )
    );
  }

  function NoLocusCard({ error }) {
    return h('div', { className: 'cl-empty' },
      h('strong', null, tr('noRootLocus', '根轨迹不可用')),
      h('div', { style: { marginTop: '6px' } }, error || tr('noSteps', '当前页面没有可显示的步骤。'))
    );
  }

  function niceRange(min, max) {
    if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: -1, max: 1, ticks: [-1, 0, 1] };
    if (Math.abs(max - min) < 1e-9) { min -= 1; max += 1; }
    const span = max - min;
    const raw = span / 5;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = lo; v <= hi + step * 0.25; v += step) ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    return { min: lo, max: hi, ticks };
  }
  function logTicks(wmin, wmax) {
    const out = [];
    const a = Math.ceil(Math.log10(wmin) - 1e-9);
    const b = Math.floor(Math.log10(wmax) + 1e-9);
    for (let k = a; k <= b; k++) out.push(Math.pow(10, k));
    if (!out.length) out.push(wmin, wmax);
    return out;
  }
  function tickLabel(v) {
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e5 || a < 1e-3) return engine.fmt(v, 2);
    return String(Number(v.toPrecision(3)));
  }
  function polylinePath(points, xf, yf, maxJump) {
    let d = '';
    let prevY = null;
    for (const p of points) {
      const x = xf(p), y = yf(p);
      if (!Number.isFinite(x) || !Number.isFinite(y)) { prevY = null; continue; }
      if (prevY === null || (maxJump && Math.abs(y - prevY) > maxJump)) d += `M${x.toFixed(2)},${y.toFixed(2)}`;
      else d += `L${x.toFixed(2)},${y.toFixed(2)}`;
      prevY = y;
    }
    return d;
  }
  function Arrow({ x1, y1, x2, y2, color, size }) {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const L = size || 8, W = (size || 8) * 0.55;
    const bx = x2 - L * Math.cos(ang), by = y2 - L * Math.sin(ang);
    const px = -Math.sin(ang) * W, py = Math.cos(ang) * W;
    return h('polygon', {
      points: `${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`,
      fill: color,
    });
  }
  function Legend({ items }) {
    return h('div', { className: 'cl-legend' },
      items.map((it, i) => h('span', { key: i },
        h('i', { className: 'cl-dot', style: { background: it.color, width: it.dot === 'circle' ? 7 : 9, height: it.dot === 'circle' ? 7 : 2, borderRadius: it.dot === 'circle' ? '50%' : 2, border: it.border || 'none' } }),
        it.label))
    );
  }

  function ZoomBox({ children }) {
    const [zoom, setZoom] = React.useState(1);
    const [pan, setPan] = React.useState({ x: 0, y: 0 });
    const [dragging, setDragging] = React.useState(false);
    const wrapRef = React.useRef(null);
    const dragRef = React.useRef(null);
    const clampZoom = (z) => Math.min(6, Math.max(1, z));

    React.useEffect(() => {
      if (zoom <= 1) setPan({ x: 0, y: 0 });
    }, [zoom]);

    React.useEffect(() => {
      const el = wrapRef.current;
      if (!el) return undefined;
      const onWheel = (e) => {
        e.preventDefault();
        const f = e.deltaY < 0 ? 1.14 : 1 / 1.14;
        setZoom((prev) => clampZoom(prev * f));
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }, []);

    const zoomBy = (f) => setZoom((prev) => clampZoom(prev * f));
    const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

    return h('div', { className: 'cl-zoom-wrap', ref: wrapRef },
      h('div', { className: 'cl-zoom-controls' },
        h('span', { className: 'cl-zoom-label' }, tr('zoom', '缩放')),
        h('button', {
          type: 'button', className: 'cl-zoom-btn', title: tr('zoomIn', '放大'),
          disabled: zoom >= 6, onClick: () => zoomBy(1.25),
        }, '+'),
        h('button', {
          type: 'button', className: 'cl-zoom-btn', title: tr('zoomOut', '缩小'),
          disabled: zoom <= 1, onClick: () => zoomBy(1 / 1.25),
        }, '−'),
        h('button', {
          type: 'button', className: 'cl-zoom-btn', title: tr('reset', '重置'),
          disabled: zoom <= 1 && pan.x === 0 && pan.y === 0, onClick: reset,
        }, '⟲')
      ),
      h('div', { className: 'cl-zoom-stage' },
        h('div', {
          className: 'cl-zoom-inner' + (zoom > 1 ? ' can-pan' : '') + (dragging ? ' is-dragging' : ''),
          style: { transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` },
          onPointerDown: (e) => {
            if (zoom <= 1) return;
            dragRef.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
            setDragging(true);
            try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          },
          onPointerMove: (e) => {
            const d = dragRef.current;
            if (!d || d.id !== e.pointerId) return;
            setPan({ x: d.px + (e.clientX - d.sx), y: d.py + (e.clientY - d.sy) });
          },
          onPointerUp: (e) => {
            if (!dragRef.current) return;
            dragRef.current = null;
            setDragging(false);
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          },
          onPointerCancel: () => { dragRef.current = null; setDragging(false); },
        }, children)
      )
    );
  }

  function BodeChart({ data, showAsymptotes, showGrid }) {
    const W = 860, H = 448, ML = 66, MR = 18, MT = 14, MB = 34, GAP = 34;
    const pw = W - ML - MR;
    const ph = (H - MT - MB - GAP) / 2;
    const x = (w) => ML + ((Math.log10(w) - Math.log10(data.wmin)) / (Math.log10(data.wmax) - Math.log10(data.wmin))) * pw;
    const xp = (p) => x(p.w);
    const magVals = data.points.map((p) => p.magDb).filter(Number.isFinite);
    let mmin = Math.min.apply(null, magVals.concat([0]));
    let mmax = Math.max.apply(null, magVals.concat([0]));
    const mr = niceRange(mmin, mmax);
    const yM = (v) => MT + ((mr.max - v) / (mr.max - mr.min)) * ph;
    const yMp = (p) => yM(p.magDb);
    const phaseVals = data.points.map((p) => p.phaseDeg).filter(Number.isFinite);
    let pmin = Math.min.apply(null, phaseVals.concat([-180]));
    let pmax = Math.max.apply(null, phaseVals.concat([0]));
    const pr = niceRange(pmin, pmax);
    const yP = (v) => MT + ph + GAP + ((pr.max - v) / (pr.max - pr.min)) * ph;
    const yPp = (p) => yP(p.phaseDeg);
    const xt = logTicks(data.wmin, data.wmax);
    const ymt = mr.ticks;
    const ypt = pr.ticks;

    const grid = [];
    if (showGrid) {
      for (const w of xt) {
        grid.push(h('line', { key: 'gx' + w, x1: x(w), x2: x(w), y1: MT, y2: MT + ph, stroke: 'var(--cl-grid)', strokeWidth: 1 }));
        grid.push(h('line', { key: 'gx2' + w, x1: x(w), x2: x(w), y1: MT + ph + GAP, y2: MT + ph * 2 + GAP, stroke: 'var(--cl-grid)', strokeWidth: 1 }));
      }
      for (const v of ymt) grid.push(h('line', { key: 'gy' + v, x1: ML, x2: ML + pw, y1: yM(v), y2: yM(v), stroke: 'var(--cl-grid)', strokeWidth: 1 }));
      for (const v of ypt) grid.push(h('line', { key: 'gyp' + v, x1: ML, x2: ML + pw, y1: yP(v), y2: yP(v), stroke: 'var(--cl-grid)', strokeWidth: 1 }));
    }

    const magLine = h('path', {
      d: polylinePath(data.points, xp, yMp, ph * 0.8),
      fill: 'none', stroke: '#2563eb', strokeWidth: 2.1, strokeLinejoin: 'round', strokeLinecap: 'round',
      vectorEffect: 'non-scaling-stroke',
    });
    const phaseLine = h('path', {
      d: polylinePath(data.points, xp, yPp, ph * 0.45),
      fill: 'none', stroke: '#d97706', strokeWidth: 2.0, strokeLinejoin: 'round', strokeLinecap: 'round',
      vectorEffect: 'non-scaling-stroke',
    });
    const asymLine = showAsymptotes && data.asymptote.length
      ? h('path', {
        d: polylinePath(data.asymptote, (p) => x(p.w), (p) => yM(p.magDb), ph),
        fill: 'none', stroke: '#94a3b8', strokeWidth: 1.4, strokeDasharray: '5 5',
      })
      : null;

    const gainMarks = data.gainCrossings.slice(0, 3).filter((g) => g.w > 0).map((g, i) => {
      const xx = x(g.w);
      const label = i === 0 ? `ωc=${fmt(g.w)}` : null;
      return h('g', { key: 'gc' + i },
        h('line', { x1: xx, x2: xx, y1: MT, y2: MT + ph, stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '3 4', opacity: 0.65 }),
        h('circle', { cx: xx, cy: yM(0), r: 3.2, fill: '#2563eb' }),
        label ? h('text', { x: xx + 5, y: MT + 11, fontSize: 10, fill: '#2563eb' }, label) : null
      );
    });
    const phaseMarks = data.worstGm ? [data.worstGm].map((g, i) => {
      const xx = x(g.w);
      return h('g', { key: 'pg' + i },
        h('line', { x1: xx, x2: xx, y1: MT + ph + GAP, y2: MT + ph * 2 + GAP, stroke: '#dc2626', strokeWidth: 1, strokeDasharray: '3 4', opacity: 0.65 }),
        h('circle', { cx: xx, cy: yP(-180), r: 3.2, fill: '#dc2626' }),
        h('text', { x: xx + 5, y: MT + ph + GAP + 11, fontSize: 10, fill: '#dc2626' }, `ωg=${fmt(g.w)}`)
      );
    }) : [];

    return h('div', { className: 'cl-chart-card' },
      h('div', { className: 'cl-chart-head' },
        h('span', { className: 'cl-chart-title' }, tr('bode', 'Bode 图')),
        h('span', { className: 'cl-chart-sub' }, `type=${data.type} · ${data.poles.length} poles · ${data.zeros.length} zeros`)
      ),
      h(Legend, { items: [
        { label: '|G| (dB)', color: '#2563eb' },
        { label: '∠G (°)', color: '#d97706' },
        ...(showAsymptotes ? [{ label: tr('showAsymptotes', '渐近线'), color: '#94a3b8' }] : []),
        { label: 'ωc / ωg', color: '#dc2626', dot: 'circle' },
      ] }),
      h('div', { className: 'cl-chart-body' },
        h(ZoomBox, null,
        h('svg', { viewBox: `0 0 ${W} ${H}`, className: 'cl-chart-svg', role: 'img', 'aria-label': 'Bode plot' },
          h('rect', { x: ML, y: MT, width: pw, height: ph, fill: 'transparent', stroke: 'var(--cl-border)', strokeWidth: 1 }),
          h('rect', { x: ML, y: MT + ph + GAP, width: pw, height: ph, fill: 'transparent', stroke: 'var(--cl-border)', strokeWidth: 1 }),
          grid,
          magLine, asymLine, phaseLine,
          gainMarks, phaseMarks,
          // magnitude y labels
          ymt.map((v) => h('text', { key: 'myl' + v, x: ML - 8, y: yM(v) + 3.5, textAnchor: 'end', fontSize: 10, fill: 'var(--cl-muted)' }, tickLabel(v))),
          // phase y labels
          ypt.map((v) => h('text', { key: 'pyl' + v, x: ML - 8, y: yP(v) + 3.5, textAnchor: 'end', fontSize: 10, fill: 'var(--cl-muted)' }, tickLabel(v) + '°')),
          // x labels at bottom
          xt.map((w) => h('text', { key: 'xl' + w, x: x(w), y: H - 12, textAnchor: 'middle', fontSize: 10, fill: 'var(--cl-muted)' }, tickLabel(w))),
          h('text', { x: ML - 46, y: MT + ph / 2, textAnchor: 'middle', fontSize: 10.5, fill: 'var(--cl-muted)', transform: `rotate(-90 ${ML - 46} ${MT + ph / 2})` }, '|G| (dB)'),
          h('text', { x: ML - 46, y: MT + ph + GAP + ph / 2, textAnchor: 'middle', fontSize: 10.5, fill: 'var(--cl-muted)', transform: `rotate(-90 ${ML - 46} ${MT + ph + GAP + ph / 2})` }, '∠G (°)'),
          h('text', { x: ML + pw / 2, y: H - 1, textAnchor: 'middle', fontSize: 10.5, fill: 'var(--cl-muted)' }, 'ω (rad/s)'),
          // -180 reference
          h('line', { x1: ML, x2: ML + pw, y1: yP(-180), y2: yP(-180), stroke: '#dc2626', strokeWidth: 0.8, strokeDasharray: '2 5', opacity: 0.45 })
        )
        )
      )
    );
  }

  function NyquistChart({ data, showGrid }) {
    const W = 860, H = 448, PAD = 28;
    const b = data.plot;
    const bw = Math.max(b.maxX - b.minX, 1e-6);
    const bh = Math.max(b.maxY - b.minY, 1e-6);
    const scale = Math.min((W - PAD * 2) / bw, (H - PAD * 2) / bh);
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    const x = (re) => W / 2 + (re - cx) * scale;
    const y = (im) => H / 2 - (im - cy) * scale;
    const pos = data.positive;
    const mir = data.mirror;
    const path = (pts) => polylinePath(pts, (p) => x(p.re), (p) => y(p.im), null);

    const xt = niceRange(b.minX, b.maxX).ticks;
    const yt = niceRange(b.minY, b.maxY).ticks;
    const grid = [];
    if (showGrid) {
      for (const v of xt) if (x(v) > PAD && x(v) < W - PAD) grid.push(h('line', { key: 'nx' + v, x1: x(v), x2: x(v), y1: PAD, y2: H - PAD, stroke: 'var(--cl-grid)', strokeWidth: 1 }));
      for (const v of yt) if (y(v) > PAD && y(v) < H - PAD) grid.push(h('line', { key: 'ny' + v, x1: PAD, x2: W - PAD, y1: y(v), y2: y(v), stroke: 'var(--cl-grid)', strokeWidth: 1 }));
    }
    const arrows = [];
    if (pos.length > 4) {
      for (const f of [0.28, 0.62]) {
        const i = Math.floor(pos.length * f);
        const p1 = pos[Math.max(0, i - 2)], p2 = pos[i];
        if (p1 && p2) arrows.push(h(Arrow, { key: 'na' + f, x1: x(p1.re), y1: y(p1.im), x2: x(p2.re), y2: y(p2.im), color: '#2563eb', size: 7 }));
      }
    }
    const minOneVisible = -1 >= b.minX - bw * 0.1 && -1 <= b.maxX + bw * 0.1;

    return h('div', { className: 'cl-chart-card' },
      h('div', { className: 'cl-chart-head' },
        h('span', { className: 'cl-chart-title' }, tr('nyquist', 'Nyquist 图')),
        h('span', { className: 'cl-chart-sub' }, data.delay > 0 ? tr('exactNyquistDelay', '精确纯滞后') : `P=${data.P} · N=${data.Ncw === null ? '—' : data.Ncw} · Z=${data.Z === null ? '—' : data.Z}`)
      ),
      h(Legend, { items: [
        { label: 'ω: 0→∞', color: '#2563eb' },
        { label: '镜像', color: '#94a3b8' },
        { label: '−1 点', color: '#dc2626', dot: 'circle' },
        ...(data.originArc.length ? [{ label: '∞ 圆弧', color: '#d97706' }] : []),
      ] }),
      h('div', { className: 'cl-chart-body' },
        h(ZoomBox, null,
        h('svg', { viewBox: `0 0 ${W} ${H}`, className: 'cl-chart-svg', role: 'img', 'aria-label': 'Nyquist plot' },
          h('defs', null,
            h('clipPath', { id: 'cl-nyq-clip' }, h('rect', { x: PAD, y: PAD, width: W - PAD * 2, height: H - PAD * 2 }))
          ),
          h('g', { clipPath: 'url(#cl-nyq-clip)' },
            h('rect', { x: PAD, y: PAD, width: W - PAD * 2, height: H - PAD * 2, fill: 'transparent', stroke: 'var(--cl-border)', strokeWidth: 1 }),
            grid,
            // axes
            (b.minY <= 0 && b.maxY >= 0) ? h('line', { x1: PAD, x2: W - PAD, y1: y(0), y2: y(0), stroke: 'var(--cl-muted)', strokeWidth: 1, opacity: 0.65 }) : null,
            (b.minX <= 0 && b.maxX >= 0) ? h('line', { x1: x(0), x2: x(0), y1: PAD, y2: H - PAD, stroke: 'var(--cl-muted)', strokeWidth: 1, opacity: 0.65 }) : null,
            // mirror first
            h('path', { d: path(mir), fill: 'none', stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.9 }),
            // origin arc
            data.originArc.length ? h('path', { d: path(data.originArc), fill: 'none', stroke: '#d97706', strokeWidth: 1.7, strokeDasharray: '4 4' }) : null,
            // main branch
            h('path', { d: path(pos), fill: 'none', stroke: '#2563eb', strokeWidth: 2.2, strokeLinejoin: 'round', strokeLinecap: 'round' }),
            arrows,
            // start / end
            pos.length ? h('circle', { cx: x(pos[0].re), cy: y(pos[0].im), r: 3.4, fill: '#2563eb' }) : null,
            pos.length ? h('circle', { cx: x(pos[pos.length - 1].re), cy: y(pos[pos.length - 1].im), r: 3.4, fill: 'var(--cl-text)' }) : null,
            // -1 marker
            minOneVisible ? h('g', null,
              h('line', { x1: x(-1) - 7, x2: x(-1) + 7, y1: y(0) - 7, y2: y(0) + 7, stroke: '#dc2626', strokeWidth: 2 }),
              h('line', { x1: x(-1) - 7, x2: x(-1) + 7, y1: y(0) + 7, y2: y(0) - 7, stroke: '#dc2626', strokeWidth: 2 }),
              h('text', { x: x(-1) + 9, y: y(0) - 7, fontSize: 10.5, fill: '#dc2626' }, '−1')
            ) : null
          ),
          // ticks outside clip
          xt.map((v) => (x(v) > PAD && x(v) < W - PAD) ? h('text', { key: 'nxl' + v, x: x(v), y: H - 10, textAnchor: 'middle', fontSize: 10, fill: 'var(--cl-muted)' }, tickLabel(v)) : null),
          yt.map((v) => (y(v) > PAD && y(v) < H - PAD) ? h('text', { key: 'nyl' + v, x: PAD - 5, y: y(v) + 3.5, textAnchor: 'end', fontSize: 10, fill: 'var(--cl-muted)' }, tickLabel(v)) : null),
          h('text', { x: W - 14, y: H - 10, textAnchor: 'end', fontSize: 10.5, fill: 'var(--cl-muted)' }, 'Re'),
          h('text', { x: 12, y: 16, fontSize: 10.5, fill: 'var(--cl-muted)' }, 'Im')
        )
        )
      ),
      data.delay > 0 ? h('div', { className: 'cl-footnote' }, 'ω→∞ 时曲线绕原点无限旋转；图中为有限 ω 范围，稳定性用延迟裕度 / Padé 近似判断。') : null
    );
  }

  function RootLocusChart({ data, showGrid }) {
    const W = 860, H = 448, PAD = 28;
    const b = data.plot;
    const bw = Math.max(b.maxX - b.minX, 1e-6);
    const bh = Math.max(b.maxY - b.minY, 1e-6);
    const scale = Math.min((W - PAD * 2) / bw, (H - PAD * 2) / bh);
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    const x = (re) => W / 2 + (re - cx) * scale;
    const y = (im) => H / 2 - (im - cy) * scale;

    const xt = niceRange(b.minX, b.maxX).ticks;
    const yt = niceRange(b.minY, b.maxY).ticks;
    const grid = [];
    if (showGrid) {
      for (const v of xt) if (x(v) > PAD && x(v) < W - PAD) grid.push(h('line', { key: 'rx' + v, x1: x(v), x2: x(v), y1: PAD, y2: H - PAD, stroke: 'var(--cl-grid)', strokeWidth: 1 }));
      for (const v of yt) if (y(v) > PAD && y(v) < H - PAD) grid.push(h('line', { key: 'ry' + v, x1: PAD, x2: W - PAD, y1: y(v), y2: y(v), stroke: 'var(--cl-grid)', strokeWidth: 1 }));
    }
    const rays = [];
    if (data.asymptote) {
      const L = 1.8 * Math.max(bw, bh);
      for (const a of data.asymptote.angles) {
        const x0 = data.asymptote.sigma.re, y0 = data.asymptote.sigma.im;
        const x1 = x0 + L * Math.cos(a), y1 = y0 + L * Math.sin(a);
        const x2 = x0 - L * Math.cos(a), y2 = y0 - L * Math.sin(a);
        rays.push(h('line', { key: 'ray' + a, x1: x(x1), y1: y(y1), x2: x(x2), y2: y(y2), stroke: '#94a3b8', strokeWidth: 1.2, strokeDasharray: '6 5', opacity: 0.8 }));
      }
    }
    const branchEls = [];
    data.branches.forEach((br, i) => {
      const color = '#c8102e';
      branchEls.push(h('path', {
        key: 'br' + i,
        d: polylinePath(br, (p) => x(p.re), (p) => y(p.im), null),
        fill: 'none', stroke: color, strokeWidth: 2.0, strokeLinejoin: 'round', strokeLinecap: 'round', opacity: 0.95,
      }));
      if (br.length > 4) {
        const j = Math.floor(br.length * 0.66);
        const p1 = br[Math.max(0, j - 2)], p2 = br[j];
        if (p1 && p2) branchEls.push(h(Arrow, { key: 'ba' + i, x1: x(p1.re), y1: y(p1.im), x2: x(p2.re), y2: y(p2.im), color, size: 7 }));
      }
    });
    const poles = data.poles.map((p, i) => h('g', { key: 'p' + i, transform: `translate(${x(p.re)},${y(p.im)})` },
      h('path', { d: 'M-5,-5L5,5M-5,5L5,-5', stroke: 'var(--cl-text)', strokeWidth: 2.1, strokeLinecap: 'round' })
    ));
    const zeros = data.zeros.map((p, i) => h('circle', { key: 'z' + i, cx: x(p.re), cy: y(p.im), r: 5.2, fill: 'var(--cl-bg)', stroke: 'var(--cl-text)', strokeWidth: 2.1 }));
    const breaks = data.breakaways.map((p, i) => h('path', {
      key: 'bk' + i,
      d: `M${x(p.s)},${y(0) - 5}L${x(p.s) + 5},${y(0)}L${x(p.s)},${y(0) + 5}L${x(p.s) - 5},${y(0)}Z`,
      fill: '#059669', stroke: 'var(--cl-bg)', strokeWidth: 1,
    }));
    const crossings = data.imagCross.filter((p) => p.w > 1e-6).slice(0, 5).map((p, i) => h('g', { key: 'jc' + i },
      h('circle', { cx: x(0), cy: y(p.w), r: 3.8, fill: '#dc2626' }),
      h('text', { x: x(0) + 7, y: y(p.w) - 5, fontSize: 9.5, fill: '#dc2626' }, `K=${fmt(p.K)}`)
    ));

    return h('div', { className: 'cl-chart-card' },
      h('div', { className: 'cl-chart-head' },
        h('span', { className: 'cl-chart-title' }, tr('rootLocus', '根轨迹')),
        h('span', { className: 'cl-chart-sub' }, `${data.mode === 'param' ? '参数 K' : '增益 K'} · ${data.n} branches${data.delay > 0 ? ' · Padé' : ''}`)
      ),
      h(Legend, { items: [
        { label: '根轨迹', color: '#c8102e' },
        { label: '极点 ×', color: 'var(--cl-text)' },
        { label: '零点 ○', color: 'var(--cl-text)', dot: 'circle', border: '1.5px solid var(--cl-text)' },
        { label: '渐近线', color: '#94a3b8' },
        { label: '分离点', color: '#059669', dot: 'circle' },
      ] }),
      h('div', { className: 'cl-chart-body' },
        h(ZoomBox, null,
        h('svg', { viewBox: `0 0 ${W} ${H}`, className: 'cl-chart-svg', role: 'img', 'aria-label': 'Root locus plot' },
          h('defs', null, h('clipPath', { id: 'cl-rl-clip' }, h('rect', { x: PAD, y: PAD, width: W - PAD * 2, height: H - PAD * 2 }))),
          h('g', { clipPath: 'url(#cl-rl-clip)' },
            h('rect', { x: PAD, y: PAD, width: W - PAD * 2, height: H - PAD * 2, fill: 'transparent', stroke: 'var(--cl-border)', strokeWidth: 1 }),
            grid,
            (b.minY <= 0 && b.maxY >= 0) ? h('line', { x1: PAD, x2: W - PAD, y1: y(0), y2: y(0), stroke: 'var(--cl-muted)', strokeWidth: 1, opacity: 0.65 }) : null,
            (b.minX <= 0 && b.maxX >= 0) ? h('line', { x1: x(0), x2: x(0), y1: PAD, y2: H - PAD, stroke: 'var(--cl-muted)', strokeWidth: 1, opacity: 0.65 }) : null,
            rays,
            branchEls,
            breaks,
            crossings,
            poles,
            zeros
          ),
          xt.map((v) => (x(v) > PAD && x(v) < W - PAD) ? h('text', { key: 'rxl' + v, x: x(v), y: H - 10, textAnchor: 'middle', fontSize: 10, fill: 'var(--cl-muted)' }, tickLabel(v)) : null),
          yt.map((v) => (y(v) > PAD && y(v) < H - PAD) ? h('text', { key: 'ryl' + v, x: PAD - 5, y: y(v) + 3.5, textAnchor: 'end', fontSize: 10, fill: 'var(--cl-muted)' }, tickLabel(v)) : null),
          h('text', { x: W - 14, y: H - 10, textAnchor: 'end', fontSize: 10.5, fill: 'var(--cl-muted)' }, 'Re'),
          h('text', { x: 12, y: 16, fontSize: 10.5, fill: 'var(--cl-muted)' }, 'Im')
        )
        )
      ),
      data.delay > 0 ? h('div', { className: 'cl-footnote' }, tr('rootLocusApprox', '根轨迹对纯滞后采用二阶 Padé 近似')) : null
    );
  }

  function Steps({ steps, copied, onCopy }) {
    if (!steps || !steps.length) {
      return h('div', { className: 'cl-empty' }, tr('noSteps', '当前页面没有可显示的步骤。'));
    }
    return h(React.Fragment, null,
      h('div', { className: 'cl-steps-head' },
        h('h3', null, tr('steps', '计算步骤')),
        h('button', { type: 'button', className: 'cl-copy', onClick: onCopy }, copied ? tr('copied', '已复制') : tr('copy', '复制步骤'))
      ),
      h('div', { className: 'cl-steps-scroll' },
        steps.map((s, i) => h('section', { className: 'cl-step', key: i },
          h('div', { className: 'cl-step-title' }, `${i + 1}. ${s.title}`),
          h('div', { className: 'cl-step-body' }, s.body),
          s.formula ? h('pre', { className: 'cl-formula' }, s.formula) : null
        ))
      )
    );
  }

  function Overlay() {
    const open = useOpen();
    const [expr, setExpr] = React.useState(readSavedExpr);
    const [debounced, setDebounced] = React.useState(expr);
    const [tab, setTab] = React.useState('bode');
    const [kValue, setKValue] = React.useState('1');
    const [showAsymptotes, setShowAsymptotes] = React.useState(true);
    const [showGrid, setShowGrid] = React.useState(true);
    const [copied, setCopied] = React.useState(false);
    const [fabPos, setFabPos] = React.useState(readFabPos);
    const inputRef = React.useRef(null);
    const fabDragRef = React.useRef(null);
    const lastFabDragRef = React.useRef(0);

    React.useEffect(() => {
      const id = window.setTimeout(() => { setDebounced(expr); saveExpr(expr); }, 230);
      return () => window.clearTimeout(id);
    }, [expr]);

    React.useEffect(() => {
      if (!open) return undefined;
      const onKey = (e) => { if (e.key === 'Escape') Store.setOpen(false); };
      window.addEventListener('keydown', onKey);
      const id = window.setTimeout(() => { try { inputRef.current && inputRef.current.focus(); } catch (err) { /* ignore */ } }, 60);
      return () => { window.removeEventListener('keydown', onKey); window.clearTimeout(id); };
    }, [open]);

    React.useEffect(() => { setCopied(false); }, [tab, debounced]);

    const result = React.useMemo(() => {
      const k = Number.parseFloat(kValue);
      return engine.analyze(debounced, Number.isFinite(k) ? k : 1);
    }, [debounced, kValue]);

    if (!open) return h(React.Fragment, null,
      h('style', null, LAUNCHER_CSS),
      h('button', {
        type: 'button',
        className: 'cl-fab',
        title: '控制绘图（可拖动）',
        'aria-label': tr('launch', '控制绘图'),
        style: { left: fabPos.x, top: fabPos.y },
        onPointerDown: (e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          const r = e.currentTarget.getBoundingClientRect();
          fabDragRef.current = {
            id: e.pointerId,
            sx: e.clientX,
            sy: e.clientY,
            x: r.left,
            y: r.top,
            moved: false,
          };
          try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        },
        onPointerMove: (e) => {
          const d = fabDragRef.current;
          if (!d || d.id !== e.pointerId) return;
          const dx = e.clientX - d.sx;
          const dy = e.clientY - d.sy;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;
          if (!d.moved) return;
          const w = e.currentTarget.offsetWidth || 140;
          const h = e.currentTarget.offsetHeight || 38;
          const vw = window.innerWidth || 1280;
          const vh = window.innerHeight || 800;
          setFabPos({
            x: Math.min(Math.max(8, d.x + dx), Math.max(8, vw - w - 8)),
            y: Math.min(Math.max(8, d.y + dy), Math.max(8, vh - h - 8)),
          });
        },
        onPointerUp: (e) => {
          const d = fabDragRef.current;
          if (!d) return;
          fabDragRef.current = null;
          if (d.moved) {
            lastFabDragRef.current = Date.now();
            const r = e.currentTarget.getBoundingClientRect();
            saveFabPos({ x: r.left, y: r.top });
          }
          try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        },
        onPointerCancel: () => { fabDragRef.current = null; },
        onClick: () => {
          if (Date.now() - lastFabDragRef.current < 350) return;
          Store.setOpen(true);
        },
      },
        h(Logo),
        h('span', null, tr('launch', '控制绘图'))
      )
    );

    const steps = result.ok ? (result.steps[tab] || []) : [];
    const rootLocus = result.ok ? result.rootLocus : null;
    const showNoLocus = tab === 'rootLocus' && result.ok && rootLocus && !rootLocus.ok;

    const copySteps = () => {
      const text = steps.map((s, i) => `${i + 1}. ${s.title}\n${s.body}${s.formula ? `\n${s.formula}` : ''}`).join('\n\n');
      const fallback = () => {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch (err) { /* ignore */ }
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          }).catch(fallback);
        } else fallback();
      } catch (err) { fallback(); }
    };

    const stabilityBadge = result.ok ? (() => {
      const s = result.summary;
      if (s.closedStable) return h(Badge, { kind: 'ok' }, tr('stable', '稳定'));
      if (s.closedRhp === 0) return h(Badge, { kind: 'warn' }, tr('marginal', '临界'));
      return h(Badge, { kind: 'bad' }, tr('unstable', '不稳定'));
    })() : null;

    return h('div', {
      className: 'cl-backdrop',
      onMouseDown: (e) => { if (e.target === e.currentTarget) Store.setOpen(false); },
    },
      h('style', null, CSS),
      h('div', { className: 'cl-panel', onMouseDown: (e) => e.stopPropagation() },
        h('div', { className: 'cl-header' },
          h('div', { className: 'cl-brand' },
            h('div', { className: 'cl-logo' }, h(Logo)),
            h('div', { style: { minWidth: 0 } },
              h('div', { className: 'cl-title' }, tr('title', '控制工程绘图台')),
              h('div', { className: 'cl-subtitle' }, tr('subtitle', '传递函数 · Bode · Nyquist · 根轨迹'))
            )
          ),
          h('div', { className: 'cl-head-right' },
            result.ok && result.tf.delay > 0 ? h(Badge, { kind: 'warn' }, `${tr('delayDetected', '检测到纯滞后')} τ=${fmt(result.tf.delay, 3)}s`) : null,
            result.ok && result.tf.hasK ? h(Badge, null, tr('kDetected', '检测到参数 K')) : null,
            stabilityBadge,
            h('button', {
              type: 'button', className: 'cl-iconbtn', title: tr('close', '关闭'),
              'aria-label': tr('close', '关闭'),
              onClick: () => Store.setOpen(false),
            }, h('svg', { viewBox: '0 0 24 24', width: 17, height: 17, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', 'aria-hidden': true },
              h('path', { d: 'M6 6l12 12M18 6L6 18' })
            ))
          )
        ),
        h('div', { className: 'cl-body' },
          h('aside', { className: 'cl-left' },
            h('div', { className: 'cl-section' }, tr('inputLabel', '传递函数 G(s)')),
            h('textarea', {
              ref: inputRef,
              className: 'cl-textarea',
              value: expr,
              spellCheck: false,
              placeholder: tr('placeholder', '例如：10/(s*(s+1)*(s+2))'),
              onChange: (e) => setExpr(e.target.value),
            }),
            h('div', { className: 'cl-examples' },
              EXAMPLES.map((ex) => h('button', {
                key: ex.expr, type: 'button',
                className: 'cl-chipbtn' + (expr === ex.expr ? ' active' : ''),
                onClick: () => {
                  setExpr(ex.expr);
                  if (ex.expr.includes('K')) setKValue('1');
                },
              }, ex.label))
            ),
            result.ok && result.tf.hasK ? h('div', null,
              h('div', { className: 'cl-krow' },
                h('label', { htmlFor: 'cl-k-input' }, tr('kLabel', '参数 K')),
                h('input', {
                  id: 'cl-k-input', type: 'number', step: 'any', value: kValue,
                  onChange: (e) => setKValue(e.target.value),
                })
              ),
              h('p', { className: 'cl-note' }, tr('kHint', 'Bode/Nyquist 使用该 K 值；根轨迹会自动扫描 K。'))
            ) : null,
            result.ok && result.tf.delay > 0 ? h('div', { className: 'cl-infobox' },
              h('div', null, `${tr('delayLabel', '纯滞后 τ')} = ${fmt(result.tf.delay, 4)} s`),
              h('div', { style: { marginTop: '3px' } }, tr('delayHint', 'Bode/Nyquist 使用精确 e^(−τs)；根轨迹使用二阶 Padé 近似。'))
            ) : null,
            h('div', { className: 'cl-section' }, tr('options', '绘图选项')),
            h('div', { className: 'cl-toggles' },
              h('label', { className: 'cl-toggle' },
                h('input', { type: 'checkbox', checked: showAsymptotes, onChange: (e) => setShowAsymptotes(e.target.checked) }),
                tr('showAsymptotes', '显示渐近线')
              ),
              h('label', { className: 'cl-toggle' },
                h('input', { type: 'checkbox', checked: showGrid, onChange: (e) => setShowGrid(e.target.checked) }),
                tr('showGrid', '显示网格')
              )
            ),
            result.ok ? h('div', { className: 'cl-note', style: { marginTop: '10px' } },
              result.tf.hasK ? tr('paramK', '已检测到符号 K，根轨迹以该 K 为变化参数。') : tr('noK', '传递函数中没有符号 K，按标准反馈增益 K 绘制根轨迹。')
            ) : null,
            h('div', { className: 'cl-tip' }, tr('syntaxHint', '支持 s、K、数字、括号和 + − * / ^。乘号可省略，例如 s(s+1)。纯滞后写成 e^(-0.5s) 或 exp(-0.5s)。'))
          ),
          h('main', { className: 'cl-center' },
            h('div', { className: 'cl-tabs', role: 'tablist' },
              [['bode', tr('bode', 'Bode 图')], ['nyquist', tr('nyquist', 'Nyquist 图')], ['rootLocus', tr('rootLocus', '根轨迹')]].map(([key, label]) =>
                h('button', {
                  key, type: 'button', role: 'tab', 'aria-selected': tab === key,
                  className: 'cl-tab' + (tab === key ? ' active' : ''),
                  onClick: () => setTab(key),
                }, label)
              )
            ),
            result.ok ? h(Summary, { result }) : null,
            !result.ok ? h(ErrorCard, { error: result.error }) : (
              showNoLocus ? h(NoLocusCard, { error: rootLocus.error }) : (
                tab === 'bode' ? h(BodeChart, { data: result.bode, showAsymptotes, showGrid }) :
                  tab === 'nyquist' ? h(NyquistChart, { data: result.nyquist, showGrid }) :
                    h(RootLocusChart, { data: result.rootLocus, showGrid })
              )
            )
          ),
          h('aside', { className: 'cl-right' },
            result.ok && !showNoLocus ? h(Steps, { steps, copied, onCopy: copySteps }) :
              h('div', { className: 'cl-empty' }, result.ok ? tr('noSteps', '当前页面没有可显示的步骤。') : tr('error', '无法解析'))
          )
        )
      )
    );
  }

  return {
    Launcher,
    Overlay,
    Store,
    locales: { zh: CONTROL_LAB_ZH, en: CONTROL_LAB_EN },
    __components: { BodeChart, NyquistChart, RootLocusChart, Summary, Steps, ErrorCard, NoLocusCard },
  };
}

if (typeof globalThis !== 'undefined') {
  globalThis.createControlLabUI = createControlLabUI;
  globalThis.CONTROL_LAB_ZH = CONTROL_LAB_ZH;
  globalThis.CONTROL_LAB_EN = CONTROL_LAB_EN;
}
