# ChatApp Design System

This file is the visual source of truth for ChatApp. Apply it to the landing page, authentication, inbox, direct messages, group conversations, settings, dialogs, empty states, loading states, and errors.

## 1. Product direction

ChatApp should feel quiet, capable, private, and fast. The interface is a mature dark productivity product—not a gaming UI, crypto dashboard, or decorative concept shot.

Design principles:

1. Content and conversation are always the visual focus.
2. Emerald communicates selection, presence, success, focus, and primary action.
3. Surfaces are separated mainly by tone and 1px borders, not large shadows.
4. Density is compact but breathable. Use the 8px spacing system consistently.
5. Every control needs a clear hover, focus, active, disabled, and error state.
6. Prefer familiar patterns over novel interactions.

Do not use neon glow, glassmorphism, gradient text, giant gradient blobs, floating decoration, 3D illustrations, gradient message bubbles, oversized headings inside the app, or excessive rounded cards.

## 2. Design tokens

Use semantic variables in components. Do not paste raw colors repeatedly.

```css
:root {
  color-scheme: dark;

  /* Background and surfaces */
  --bg-canvas: #080c0e;
  --bg-app: #0c1114;
  --surface-1: #10161a;
  --surface-2: #151c20;
  --surface-3: #1a2227;
  --surface-hover: #1d272c;
  --surface-active: #173d2d;
  --overlay: rgb(0 0 0 / 72%);

  /* Borders */
  --border-subtle: #202a2f;
  --border-default: #2b353b;
  --border-strong: #3a464c;

  /* Text */
  --text-primary: #f1f5f3;
  --text-secondary: #a9b4af;
  --text-muted: #718079;
  --text-disabled: #505c57;
  --text-inverse: #06130d;

  /* Brand and status */
  --green-50: #e9fff4;
  --green-100: #c9f9df;
  --green-300: #63e6a5;
  --green-400: #35d07f;
  --green-500: #20bd70;
  --green-600: #079455;
  --green-700: #087443;
  --green-soft: rgb(32 189 112 / 12%);
  --green-border: rgb(53 208 127 / 34%);

  --danger: #ff6673;
  --danger-soft: rgb(255 102 115 / 10%);
  --warning: #f5b942;
  --info: #4da3ff;

  /* Geometry */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 999px;

  /* Effects */
  --shadow-card: 0 12px 32px rgb(0 0 0 / 28%);
  --shadow-dialog: 0 24px 64px rgb(0 0 0 / 48%);
  --focus-ring: 0 0 0 3px rgb(53 208 127 / 22%);

  /* Motion */
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --duration-fast: 120ms;
  --duration-base: 180ms;
}
```

### Color rules

- `--bg-canvas` is used outside the product shell and on the landing page.
- `--bg-app` is the main chat canvas.
- `--surface-1` is for sidebars and headers; `--surface-2` for controls and received messages; `--surface-3` for selected rows or elevated regions.
- Use emerald on no more than roughly 10% of a screen.
- Sent messages use a dark green surface such as `#123d2c`; they do not use a bright green fill.
- Red is reserved for destructive operations and errors.
- Avatar colors may vary, but keep saturation moderate and always maintain readable initials.

## 3. Typography

Use **Geist Sans** as the first choice and **Inter** as the fallback.

```css
font-family:
  'Geist',
  'Inter',
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
font-synthesis: none;
text-rendering: optimizeLegibility;
```

| Token       | Size / line-height | Weight | Use                           |
| ----------- | -----------------: | -----: | ----------------------------- |
| Display     |        56px / 1.06 |    650 | Landing hero only             |
| H1          |        40px / 1.12 |    650 | Marketing page heading        |
| H2          |         30px / 1.2 |    620 | Marketing sections            |
| H3          |         22px / 1.3 |    600 | Cards and dialogs             |
| Title       |        16px / 1.35 |    600 | Conversation and panel titles |
| Body        |        14px / 1.55 |    400 | Default product copy          |
| Body strong |        14px / 1.45 |    560 | Names and controls            |
| Small       |        12px / 1.45 |    400 | Metadata and timestamps       |
| Label       |         12px / 1.3 |    560 | Form labels and tabs          |
| Micro       |         11px / 1.3 |    500 | Badges only                   |

Use sentence case. Avoid all caps except very short technical badges. Use tabular numbers for timestamps and unread counts. Do not use pure white for secondary copy.

## 4. Spacing and layout

Base spacing unit: `4px`. Preferred rhythm: `4, 8, 12, 16, 24, 32, 48, 64, 96`.

### Desktop app shell

- Minimum supported width: `1024px`.
- Navigation rail: `72px` wide.
- Conversation sidebar: `320–344px`; default `330px`.
- Optional details panel: `300–328px`; default `320px`.
- Top bar: `64px` high.
- Composer region: `72px` high with a `48px` control.
- Content dividers: 1px using `--border-subtle`.
- Message column content: maximum `760px`, with at least `24px` horizontal gutters.
- Message bubble: maximum `68%` of available message column width.

### Marketing pages

- Content maximum: `1200px`.
- Horizontal padding: `24px` mobile, `40px` tablet, `64px` desktop.
- Navigation height: `64px`.
- Hero desktop: two columns, approximately `42% / 58%`.
- Hero product preview should carry the visual interest; do not add decorative artwork.

### Responsive behavior

- Below `1024px`, hide the optional details panel.
- Below `768px`, show either conversation list or active conversation, not both. Use navigation history/back action.
- Mobile rail becomes a bottom navigation or is removed when redundant.
- Dialogs become bottom sheets below `640px`, with safe-area padding.
- Preserve a minimum `44×44px` touch target even when the visible icon is smaller.

## 5. Component specifications

### Buttons

- Heights: `32px` compact, `40px` default, `48px` prominent auth/marketing.
- Horizontal padding: `12px`, `16px`, `20px` respectively.
- Radius: `8px`; do not make all buttons pills.
- Primary: green-600 background, primary text, green-500 on hover.
- Secondary: surface-2 background and default border.
- Ghost: transparent; surface-hover on hover.
- Destructive: transparent or danger-soft with danger border/text.
- Focus: visible `--focus-ring`; never remove focus outlines without replacement.

### Inputs and search

- Default height: `44px`; composer: `48px`.
- Background: `--surface-2`; border: `--border-default`.
- Focus border: `--green-400` plus `--focus-ring`.
- Placeholder uses `--text-muted`.
- Labels appear above inputs with an 8px gap.
- Validation copy appears below with a 6px gap; never rely on color alone.

### Conversation rows

- Height: `64–72px`.
- Padding: `10px 12px`.
- Avatar: `40px`; group avatar may be `42px`.
- Name and time share the first row; preview and unread badge share the second.
- Selected state: `--surface-3`, a `2px` emerald indicator at the left, and no bright full-row green fill.
- Unread badge: `18–20px`, green fill, dark text, tabular number.

### Message bubbles

- Padding: `10px 12px`.
- Radius: `10px`; slightly reduce the corner nearest the sender if desired.
- Received: `--surface-2` plus subtle border.
- Sent: `#123d2c` plus `#22513d` border.
- Group sender name sits above the received bubble in 12px medium text.
- Timestamp and delivery state sit outside or at the lower edge without dominating.
- Consecutive messages from the same sender may omit repeated avatar/name when sent within five minutes.

### Avatars and presence

- Sizes: `24, 32, 40, 48px`.
- Presence dot: 25% of avatar diameter, bottom-right, with a 2px app-background outline.
- Initials use 12–14px weight 600.
- Use uploaded photos when available; do not generate artificial profile photos.

### Dialogs

- Width: `480–560px`; group settings default `560px`.
- Background: `--surface-1`; border: `--border-default`; radius `12px`.
- Header and footer use separators.
- Backdrop uses `--overlay`; avoid strong blur.
- Destructive actions are separated spatially from routine actions.
- Prefer row overflow menus for member actions instead of repeated Promote/Remove button pairs.

### Toasts

- Width: `280–360px`; minimum height `48px`.
- Bottom-right desktop; bottom-center mobile.
- Success uses a dark neutral surface, emerald icon/border, and white text—not a full bright-green block.

### Icons

- Use Lucide icons with `1.75px` stroke where possible.
- Sizes: `16px` inside compact controls, `18px` default, `20–22px` primary navigation.
- Do not mix filled, outlined, and hand-drawn icon families.
- Use `chatapp-navbar-logo.svg`, `chatapp-hero-icon.svg`, and `chatapp-interface-icon.svg` for brand/product artwork.

## 6. Page-specific composition

### Landing page

- Compact navigation with logo left, quiet links centered/right, primary CTA right.
- Hero message should be direct and no more than two lines at desktop width.
- Pair copy with a real product preview; do not use illustration placeholders.
- Follow with three restrained capability columns and one final CTA.

### Login

- Desktop uses a two-column composition: product assurance on the left and a `400–440px` authentication card on the right.
- Keep the form short. Phone, name, primary action, and account note are sufficient.
- On mobile, remove the marketing column and center the form with 20px gutters.

### Chat app

- The active conversation owns the largest area.
- Keep navigation and sidebar visually quieter than message content.
- New conversations may show a compact identity/start block, but messages should remain near the lower reading area.
- The composer is always reachable and never covered by browser safe areas.

### Group settings

- Show group identity first, member search second, member management third, leave action last.
- Roles must be explicit: Owner, Admin, Member.
- Require confirmation for remove member, leave group, and ownership-sensitive changes.

## 7. Accessibility and behavior

- Meet WCAG AA: 4.5:1 normal text and 3:1 large text/UI boundaries.
- Full keyboard operation is required.
- Every icon-only button needs an accessible name and tooltip.
- Do not communicate unread, online, success, or error states by color alone.
- Respect `prefers-reduced-motion`.
- Keep transitions to opacity, color, and small transforms; `120–180ms`.
- Use skeletons shaped like final content. Avoid indefinite spinners for page loading.

## 8. Implementation rules for agents

1. Inspect the existing framework, styling approach, routes, and reusable components before editing.
2. Preserve working data flow, authentication, sockets, APIs, and state management.
3. Introduce the semantic tokens once at the theme/root level.
4. Refactor shared primitives before applying one-off page styles.
5. Do not hardcode desktop-only widths or create unnecessary component duplication.
6. Reuse existing accessible primitives if they can match this system.
7. After implementation, test at `1440×900`, `1024×768`, `768×1024`, and `390×844`.
8. Verify loading, empty, error, hover, focus, selected, unread, disconnected, and disabled states.
9. Remove obsolete styles only after confirming they are unused.
10. Do not change product behavior unless explicitly requested.

## 9. Visual acceptance checklist

- [ ] Emerald is restrained and used semantically.
- [ ] Surfaces are distinguishable without heavy shadows.
- [ ] No purple remains as the primary brand color.
- [ ] Typography follows the defined scale and weights.
- [ ] Sidebar and conversation geometry match the desktop shell specification.
- [ ] Message bubbles never stretch across the full conversation pane.
- [ ] Buttons and inputs have complete interaction states.
- [ ] Responsive layouts avoid compressed multi-column UI.
- [ ] Keyboard focus is always visible.
- [ ] The result looks like a real product, not a generic generated dashboard.
