---
name: KAVACH360 AI Safety Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  code-num:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an authoritative, high-reliability command center tailored for heavy civil engineering, industrial contracting, and site safety directors. It fuses high-density telemetry and computer vision feeds with executive clarity.

The visual style is **Corporate / Modern Industrial Technical**:
- **Operational Precision**: Data-dense grid structures, precise tabular layouts, and clear status communication built for high-stakes environments where oversight translates directly to physical worker safety.
- **Bi-modal Shell Architecture**: High-contrast dark operational control frames (deep navy sidebar and telemetry navigation) paired with an ultra-crisp, light gray slate workspace to minimize optical fatigue under field-office lighting.
- **Engineered Restraint**: Functional utility supersedes ornamentation. Color is deployed strictly as semantic status intelligence (detection, warning, critical breach, verified compliance) alongside high-contrast electric engineering blue anchors.

## Colors

The color palette is engineered around instant perceptual recognition and field safety hierarchies.

### Brand & Interactive Colors
- **Primary Safety Blue (`#2563EB`)**: Interactive primary controls, active selection rings, and core system telemetry. Darkens to `#1D4ED8` on press/hover.
- **Command Deep Navy (`#0F172A`)**: Root navigational surface, tool anchors, and header badges. Steps down to Slate Navy (`#1E293B`) for nested navigation and sub-panels.
- **Hazard Amber / Orange (`#F59E0B`)**: Non-immediate safety risks, missing PPE warnings, zone incursions, and telemetry anomalies. Accent hover states use `#D97706`.

### Operational Semantics & Workspace Canvas
- **Critical Red (`#EF4444`)**: Immediate structural or personnel danger, machinery proximity lockouts, and emergency stop events. Pressed/active state uses `#DC2626`.
- **Resolved Emerald (`#10B981`)**: Clear zones, verified compliance, calibrated sensors, and resolved audit checklists. Accent hover uses `#059669`.
- **Workspace Canvas (`#F8FAFC`)**: Base working area background for all telemetry feeds, analytical charts, and incident management boards.
- **Card & Component Surfaces (`#FFFFFF`)**: Foreground panels set on canvas. Sub-surfaces and table headers use `#F1F5F9`.
- **Structural Outlines (`#E2E8F0`)**: Subtle panel borders, dividers, and table boundaries.

## Typography

The typography couples the architectural, contemporary geometry of **Plus Jakarta Sans** for headlines and high-level analytical counters with the ultra-legible utilitarian clarity of **Inter** for dense tabular logs, telemetry metadata, and input systems.

- **Tabular Figures**: Force tabular numerals (`font-variant-numeric: tabular-nums`) across all analytical dashboards, safety score readouts, and timestamp tracks to prevent horizontal jitter during real-time streaming updates.
- **Labels & Micro-data**: `label-sm` is reserved for camera identification badges, safety vest classification tags, and sensor state chips. All uppercase micro-copy requires `letter-spacing: 0.05em`.

## Layout & Spacing

The layout is built upon a high-efficiency 12-column adaptive fluid grid structured for multi-panel telemetry and operations dashboards.

### Shell Architecture & Grid Breakpoints
- **Desktop (≥ 1280px)**: Persistent left command bar (fixed 260px or collapsed 72px) framed against the light slate workspace. 12-column dashboard layout with `gutter-lg` (2rem) and `margin` (2rem). Elements scale across 3, 4, 6, 8, or 12 column cards.
- **Tablet (768px – 1279px)**: Collapsed icon rail (72px), dynamic main workspace utilizing an 8-column layout with `gutter` (1.5rem) and `margin-tablet` (1.5rem). Multi-feed camera matrices stack into 2-column modules.
- **Mobile (< 768px)**: Bottom bar / off-canvas sheet navigation, single-column full-bleed layout with `margin-mobile` (1rem) and `gutter-sm` (1rem). High-priority incident notification cards prioritize vertical stacked scanning.

### Spacing Model
- Interior padding and gap relations strictly align to a 4px/8px rhythm (`space-xs` through `space-xl`).
- High-density data tables compress to `space-sm` vertical cell padding, while high-level analytical safety KPI cards expand to `space-lg` inner padding to maintain airy distinction.

## Elevation & Depth

This design system uses a technical low-elevation system combining subtle slate boundaries (`#E2E8F0`) with diffused ambient shadows to maintain clear separation between layers while avoiding visual clutter.

- **Level 0 (Flat Canvas)**: `#F8FAFC` base application surface. No shadow, no border.
- **Level 1 (Card & Module Layer)**: `#FFFFFF` background with a crisp border (`1px solid #E2E8F0`) and ambient diffusion (`box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`). Used for static telemetry cards, video grid containers, and inspection logs.
- **Level 2 (Active & Floating Modules)**: Elevates on card hover, dropdown menus, filter trays, and table sorting drawers (`box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` with `1px solid #CBD5E1`).
- **Level 3 (Command Overlays & Modals)**: Incident review overlays, worker safety logs, and critical site broadcast dialogs (`box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)` with backdrop blur filter `blur(4px)` over `#0F172A` at 40% opacity).
- **Dark Navigation Elevation**: Sidebar `#0F172A` sits structurally flat on the Z-plane, demarcated strictly by a vertical border (`1px solid #1E293B`) to preserve stark terminal authority.

## Shapes

The shape system employs roundedness level **2**, striking a balance between industrial software rigor and modern product design.

- **Micro Controls & Tags**: Badges, status pills, and micro incident chips use full pill shapes (`rounded-full` / 9999px) to communicate status indicators quickly.
- **Inputs & Standard Controls**: Form inputs, standard buttons, dropdown triggers, and search bars use regular corner curvature (`0.5rem` / 8px).
- **Structural Panels & Media**: Analytical cards, video surveillance feeds, maps, and safety scoreboards use `rounded-xl` (16px) or `rounded-2xl` (24px) for prominent modular framing.

## Components

### Buttons
- **Primary**: Solid Electric Blue (`#2563EB`), text `#FFFFFF`, font `label-md`. Hover: `#1D4ED8`. Focus ring: 2px `#2563EB` offset by 2px `#FFFFFF`. Corner radius: `0.5rem`.
- **Secondary / Neutral**: Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`. Hover: Background `#F1F5F9`.
- **Critical / Danger**: Background `#EF4444`, text `#FFFFFF`. Hover: `#DC2626`. Used strictly for hazard protocol confirmation and automated machinery shutdowns.

### Status Chips & Badges
- Built with a pill shape (`rounded-full`), `space-xs` vertical padding, `space-sm` horizontal padding, and a semantic pulsating lead dot indicator (6px).
- **Hazard Warning**: Background `#FEF3C7`, border `1px solid #FDE68A`, text `#92400E`.
- **Critical Breach**: Background `#FEE2E2`, border `1px solid #FECACA`, text `#991B1B`.
- **Verified Clear**: Background `#D1FAE5`, border `1px solid #A7F3D0`, text `#065F46`.
- **AI Processing**: Background `#DBEAFE`, border `1px solid #BFDBFE`, text `#1E40AF`.

### Telemetry & Inspection Cards
- Surface `#FFFFFF`, border `1px solid #E2E8F0`, rounded corner `1rem` (`rounded-xl`).
- High-level metric header separated by a 1px border divider. Real-time vision detection streams within cards must display camera ID, confidence rating (`98.4% Precision`), and real-time bounding box annotations with contrasting `#EF4444` or `#F59E0B` 2px borders.

### Data Tables & Event Logs
- Header: `#F8FAFC`, uppercase `label-sm`, text `#64748B`, border bottom `1px solid #E2E8F0`.
- Rows: Background `#FFFFFF`, alternating hover state `#F1F5F9` (transition 150ms). Cell border bottom `1px solid #F1F5F9`. Monospaced tabular numerals for timestamps, worker IDs, and geospatial coordinates.

### Inputs & Search Bars
- Background `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`, placeholder `#94A3B8`.
- Focus state: Border color `#2563EB`, outer glow shadow ring of `0 0 0 3px rgba(37, 99, 235, 0.15)`.

### Checkboxes & Toggle Controls
- Custom technical checkbox: 18x18px box, border `2px solid #CBD5E1`, radius `4px`. Checked state: `#2563EB` with white checkmark.
- Safety Override Switch: Heavy toggle track (`#CBD5E1`), active state `#2563EB` (or `#EF4444` for emergency safety lockouts).