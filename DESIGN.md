# DESIGN.md — SkillCortex Design System

## Brand palette (authoritative)

| Token | Value | Usage |
|---|---|---|
| --color-1 | #2E2C2A | Primary text |
| --color-2 | #0000EE | Links and selected text emphasis |
| --color-3 | #4F4945 | Supporting strong text |
| --color-4 | #166434 | Success and positive states |
| --color-5 | #6B6561 | Dark surfaces |
| --color-6 | #E35013 | Main brand accent and CTA |
| --color-7 | #9E9894 | Secondary text |
| --color-9 | #F4F2F1 | Main warm background |
| --color-10 | #F8F7F7 | Secondary background |
| --color-11 | #FFFFFF | White surfaces |
| --color-border | #E6E2E0 | Borders and separators |

## Typography

Fonts: Instrument Sans (brand/marketing headings), Inter (UI/body), Times New Roman (editorial accents), sans-serif fallback.

Semantic sizes: display 3rem, h1 2.25rem, h2 1.875rem, h3 1.5rem, h4 1.25rem, body-lg 1.125rem, body 1rem, body-sm 0.875rem, label 0.8125rem, caption 0.75rem, button 0.875rem.

## Spacing

Base unit 4px. Tokens space-1..space-16 as defined in index.css.

## Radius

sm 4px, md 6px, lg 8px, xl 10px, 2xl 16px, card 20px, pill 999px, circle 100%.

## Shadows

outline, soft, card, elevated, dropdown, modal, focus-ring.

## Motion

fast 140ms, normal 220ms, slow 380ms, emphasis 550ms; ease-standard, ease-enter, ease-exit; stagger 60ms. Respect prefers-reduced-motion.

## Rules

- No hardcoded hex in components; use tokens.
- No arbitrary spacing or font sizes.
- Accessibility target WCAG 2.2 AA.
