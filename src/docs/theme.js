import { readFileSync } from 'node:fs';

// The original skill hover layer is kept intact; only the Swagger presentation changes.
const motionCss = readFileSync(new URL('./assets/motion.css', import.meta.url), 'utf8');
export const docsTheme = motionCss + `
@font-face { font-family: Outfit; font-style: normal; font-weight: 400; font-display: swap; src: url('/api/docs/assets/outfit-400.ttf') format('truetype'); }
@font-face { font-family: Outfit; font-style: normal; font-weight: 500; font-display: swap; src: url('/api/docs/assets/outfit-500.ttf') format('truetype'); }
@font-face { font-family: Outfit; font-style: normal; font-weight: 600; font-display: swap; src: url('/api/docs/assets/outfit-600.ttf') format('truetype'); }
@font-face { font-family: 'DM Mono'; font-style: normal; font-weight: 400; font-display: swap; src: url('/api/docs/assets/dm-mono-400.ttf') format('truetype'); }
@font-face { font-family: 'DM Mono'; font-style: normal; font-weight: 500; font-display: swap; src: url('/api/docs/assets/dm-mono-500.ttf') format('truetype'); }
:root {
  --p-bg: #0f0f0f; --p-surface: #1a1a1a; --p-ink: #ffffff; --p-muted: #8f8f8f;
  --p-accent: #dafa9c; --p-accent-ink: #0f0f0f; --p-action: #dafa9c; --p-action-ink: #0f0f0f;
  --p-inv-bg: #ffffff; --p-inv-surface: #ececec; --p-inv-ink: #0f0f0f; --p-inv-muted: #5f5f5f;
  --p-inv-accent: #0f0f0f; --p-inv-accent-ink: #ffffff; --p-inv-action: #0f0f0f; --p-inv-action-ink: #ffffff;
  --font-display: "Outfit", system-ui, sans-serif;
  --font-text: "Outfit", system-ui, sans-serif;
  --font-mono: "DM Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --display-weight: 400; --display-tracking: -.03em; --display-tracking-xl: -.04em;
  --docs-line: #414141; --docs-muted: #b7bbb4;
  color-scheme: dark;
}
* { box-sizing: border-box; }
html { background: var(--p-bg); scroll-padding-top: 24px; }
body { margin: 0; background: var(--p-bg); }
.swagger-ui { color: var(--p-ink); font-family: var(--font-text); font-size: 16px; line-height: 1.6; }
.swagger-ui .wrapper { max-width: 1200px; padding-inline: 32px; }
.swagger-ui .topbar { padding: 20px 0; background: var(--p-surface); border-bottom: 1px solid var(--docs-line); }
.swagger-ui .info { margin: 56px 0 40px; }
.swagger-ui .info .title { color: var(--p-ink); font: 500 clamp(32px, 4vw, 56px)/1.12 var(--font-display); letter-spacing: -.035em; }
.swagger-ui .info .title small { top: 0; vertical-align: middle; margin: 8px; padding: 4px 8px; border-radius: 4px; background: var(--docs-line); }
.swagger-ui .info .title small.version-stamp { background: var(--p-accent); color: var(--p-accent-ink); }
.swagger-ui .info .title small.version-stamp pre { color: inherit; }
.swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info table { color: var(--docs-muted); font-family: var(--font-text); font-size: 16px; }
.swagger-ui .info a, .swagger-ui a { color: var(--p-accent); text-underline-offset: 4px; overflow-wrap: anywhere; }
.swagger-ui a:hover { text-decoration: underline; }
.swagger-ui .scheme-container { margin: 0 0 40px; padding: 24px 0; background: var(--p-surface); border-block: 1px solid var(--docs-line); box-shadow: none; }
.swagger-ui .servers > label { color: var(--docs-muted); font: 500 14px/1.6 var(--font-text); }
.swagger-ui select, .swagger-ui input[type=text], .swagger-ui input[type=password], .swagger-ui input[type=email], .swagger-ui input[type=file], .swagger-ui textarea {
  max-width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid #62675d; border-radius: 4px;
  background: #22251f; color: var(--p-ink); font: 400 16px/1.5 var(--font-text); box-shadow: none;
}
.swagger-ui textarea { min-height: 160px; font-family: var(--font-mono); }
.swagger-ui input::placeholder, .swagger-ui textarea::placeholder { color: var(--docs-muted); }
.swagger-ui .opblock-tag { margin: 0 0 16px; padding: 20px 0; border-bottom: 1px solid var(--docs-line); color: var(--p-ink); font: 500 24px/1.3 var(--font-display); gap: 16px; }
.swagger-ui .opblock-tag small { color: var(--docs-muted); font-size: 14px; }
.swagger-ui .opblock { margin-bottom: 12px; border-radius: 6px; background: var(--p-surface); box-shadow: none; overflow: hidden; }
.swagger-ui .opblock .opblock-summary { padding: 12px 16px; gap: 12px; min-height: 64px; }
.swagger-ui .opblock .opblock-summary-control { align-items: center; gap: 12px; min-width: 0; min-height: 44px; text-align: left; }
.swagger-ui .opblock .opblock-summary-method { min-width: 76px; padding: 8px; border-radius: 4px; text-shadow: none; font: 600 13px/1.5 var(--font-mono); }
.swagger-ui .opblock .opblock-summary-path { color: var(--p-ink); font: 500 16px/1.5 var(--font-mono); overflow-wrap: anywhere; }
.swagger-ui .opblock .opblock-summary-description { color: var(--docs-muted); font: 400 14px/1.6 var(--font-text); }
.swagger-ui .opblock.opblock-get { border-color: #397ca1; background: #14232a; }
.swagger-ui .opblock.opblock-get .opblock-summary-method { background: #98d7fa; color: #10212b; }
.swagger-ui .opblock.opblock-post { border-color: #407b63; background: #17261e; }
.swagger-ui .opblock.opblock-post .opblock-summary-method { background: #9ae0b7; color: #10261a; }
.swagger-ui .opblock.opblock-put, .swagger-ui .opblock.opblock-patch { border-color: #8d753b; background: #292416; }
.swagger-ui .opblock.opblock-put .opblock-summary-method, .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #efd28a; color: #2d240e; }
.swagger-ui .opblock.opblock-delete { border-color: #9b5656; background: #2b1c1c; }
.swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #f3b2ac; color: #351713; }
.swagger-ui .opblock .opblock-section-header { padding: 16px 24px; background: #232820; box-shadow: none; gap: 16px; flex-wrap: wrap; }
.swagger-ui .opblock .opblock-section-header h4, .swagger-ui .opblock .opblock-section-header label { color: var(--p-ink); }
.swagger-ui .opblock-body { padding-bottom: 16px; }
.swagger-ui .opblock-description-wrapper, .swagger-ui .opblock-external-docs-wrapper, .swagger-ui .opblock-title_normal { padding: 16px 24px; }
.swagger-ui .opblock-description-wrapper p, .swagger-ui .opblock-external-docs-wrapper p, .swagger-ui .opblock-title_normal p { color: var(--p-ink); font: 400 16px/1.6 var(--font-text); }
.swagger-ui .parameters-container, .swagger-ui .responses-wrapper { min-width: 0; }
.swagger-ui table thead tr td, .swagger-ui table thead tr th { color: var(--docs-muted); border-bottom-color: var(--docs-line); }
.swagger-ui table tbody tr td, .swagger-ui .response-col_status, .swagger-ui .response-col_links { color: var(--p-ink); }
.swagger-ui .parameter__name, .swagger-ui .parameter__type, .swagger-ui .parameter__in, .swagger-ui .parameter__deprecated, .swagger-ui .prop-type, .swagger-ui .model-title, .swagger-ui .model { color: var(--p-ink); }
.swagger-ui .parameter__name.required:after, .swagger-ui .parameter__name.required span { color: #ffb5ac; }
.swagger-ui .parameter__in, .swagger-ui .prop-format { color: var(--docs-muted); }
.swagger-ui .btn { min-height: 44px; padding: 10px 16px; border: 1px solid #8e9685; border-radius: 4px; color: var(--p-ink); background: #252b20; box-shadow: none; font: 500 14px/1.5 var(--font-text); }
.swagger-ui .btn:hover { background: #35402b; box-shadow: none; }
.swagger-ui .btn.execute { background: var(--p-action); color: var(--p-action-ink); border-color: var(--p-action); }
.swagger-ui .btn.cancel { color: #ffb5ac; border-color: #b77570; }
.swagger-ui .btn:disabled { opacity: .55; }
.swagger-ui :is(a,button,input,select,textarea):focus-visible { outline: 3px solid var(--p-accent); outline-offset: 3px; }
.swagger-ui button svg { fill: var(--p-ink); }
.swagger-ui .tab li, .swagger-ui .tab li button { color: var(--p-ink); }
.swagger-ui .tab li button { min-height: 44px; }
.swagger-ui .highlight-code, .swagger-ui .microlight { max-width: 100%; overflow: auto; }
.swagger-ui .highlight-code > .microlight, .swagger-ui .model-example { background: #0f1410 !important; border-radius: 4px; }
.swagger-ui section.models { margin: 40px 0; border: 1px solid var(--docs-line); border-radius: 6px; }
.swagger-ui section.models h4 { color: var(--p-ink); padding: 12px; }
.swagger-ui section.models .model-container { background: #22251f; border-radius: 4px; }
.swagger-ui .model-box { background: transparent; }
.swagger-ui .model-toggle:after { filter: invert(1); }
.swagger-ui .model-box-control, .swagger-ui .models-control, .swagger-ui .expand-operation { min-height: 44px; }
.swagger-ui .dialog-ux .modal-ux { background: var(--p-surface); border-color: var(--docs-line); }
.swagger-ui .dialog-ux .modal-ux-header h3, .swagger-ui .dialog-ux .modal-ux-content p { color: var(--p-ink); }
/* Swagger's own dark-mode rules are more specific than its standard theme. */
html .swagger-ui .info .title small.version-stamp { background: var(--p-accent); color: var(--p-accent-ink); }
html .swagger-ui .info .title small.version-stamp pre { color: var(--p-accent-ink); }
html.dark-mode .swagger-ui .info .title small.version-stamp { background: var(--p-accent); }
html .swagger-ui .opblock .opblock-summary .opblock-summary-control:focus-visible,
html.dark-mode .swagger-ui .opblock .opblock-summary .opblock-summary-control:focus-visible { outline: 3px solid var(--p-accent); outline-offset: -3px; }
.swagger-ui .opblock-summary .view-line-link { opacity: 1; visibility: visible; }
.swagger-ui .opblock-summary .view-line-link button { min-width: 32px; min-height: 44px; }
@media(max-width: 767px) {
  .swagger-ui .wrapper { padding-inline: 20px; }
  .swagger-ui .info { margin: 32px 0; }
  .swagger-ui .info .title small { display: inline-block; margin: 8px 8px 0 0; }
  .swagger-ui .opblock-tag { align-items: flex-start; flex-wrap: wrap; }
  .swagger-ui .opblock-tag small { flex-basis: 100%; }
  .swagger-ui .opblock .opblock-summary { padding: 12px; gap: 8px; }
  .swagger-ui .opblock .opblock-summary-control { flex-wrap: wrap; gap: 8px; }
  .swagger-ui .opblock .opblock-summary-method { min-width: 66px; }
  .swagger-ui .opblock .opblock-summary-path { flex: 1; min-width: 100px; font-size: 14px; }
  .swagger-ui .opblock .opblock-summary-description { flex-basis: 100%; }
  .swagger-ui .opblock .opblock-section-header, .swagger-ui .opblock-description-wrapper { padding: 16px; }
  .swagger-ui .parameters-col_name { width: 35%; overflow-wrap: anywhere; }
  .swagger-ui .parameters-col_description { width: 65%; min-width: 0; }
  .swagger-ui .parameters-col_description input { width: 100%; min-width: 0; }
  .swagger-ui .btn-group { flex-wrap: wrap; gap: 8px; }
  .swagger-ui .btn-group .btn { width: 100%; }
  .swagger-ui .responses-inner { padding: 16px; }
  .swagger-ui .response-control-media-type { max-width: 100%; }
}
`;
