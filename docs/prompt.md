# Cursor implementation prompt: ChatApp redesign

Use this prompt together with `design-style.md`.

## Task

Redesign and implement the existing ChatApp project using the design system in `design-style.md`. Apply the system consistently to the landing page, login page, chat shell, direct-message view, group conversation view, group settings, empty/loading/error states, and responsive layouts.

The target is a mature dark messaging product with graphite surfaces and restrained emerald accents. It must feel implementation-ready and intentionally designed—not like a generic AI-generated SaaS template.

## Required workflow

1. First inspect the repository and report:
   - framework and version;
   - routing structure;
   - styling system;
   - shared UI components;
   - authentication and socket/data flow;
   - all pages and states affected by this redesign.
2. Create a short implementation plan organized by shared foundations, components, pages, responsiveness, and verification.
3. Preserve all existing functionality. Do not rewrite API, authentication, WebSocket, or state-management logic unless a UI integration requires a minimal change.
4. Add semantic design tokens from `design-style.md` to the global theme. Avoid scattered raw hex values.
5. Build or refactor reusable primitives before styling pages:
   - Button and IconButton;
   - Input and SearchInput;
   - Avatar and PresenceDot;
   - Badge;
   - ConversationRow;
   - MessageBubble and MessageGroup;
   - Tabs;
   - Dialog/Sheet;
   - Toast;
   - EmptyState and Skeleton.
6. Implement pages in this order:
   - application shell and responsive navigation;
   - conversation sidebar;
   - direct and group threads;
   - composer and message states;
   - group settings;
   - login;
   - landing page.
7. Use the supplied SVG assets where appropriate:
   - `chatapp-navbar-logo.svg` for compact branding;
   - `chatapp-hero-icon.svg` for login/empty states;
   - `chatapp-interface-icon.svg` for the landing product preview.
8. Run the existing formatter, type checker, linter, and tests. Fix problems caused by the redesign.
9. Visually verify at 1440×900, 1024×768, 768×1024, and 390×844.
10. Finish with a concise report of changed files, reusable components added, tests run, and any remaining limitations.

## Visual requirements

- Use Geist Sans, with Inter and system sans-serif fallbacks.
- Use the exact semantic tokens and component measurements in `design-style.md`.
- Dark canvas: near-black graphite, never pure flat black across every surface.
- Separate regions using tonal layering and subtle 1px borders.
- Emerald is limited to actions, focus, selection, presence, unread state, and success.
- Sent messages use dark forest-green surfaces, not bright gradients.
- Received messages use charcoal surfaces with subtle borders.
- Keep app typography compact: 14px default, 12px metadata, 16px panel titles.
- Use a 72px navigation rail, approximately 330px conversation sidebar, 64px top bar, and 48px composer control on desktop.
- Keep message bubbles at a maximum of 68% of the available message column.
- Use Lucide icons consistently at the sizes defined in `design-style.md`.
- Use restrained radii: usually 6–12px. Do not turn every element into a pill.
- Use subtle shadows only for dialogs and meaningful elevation.

## Interaction requirements

- Implement hover, focus-visible, active, selected, unread, disabled, loading, success, and error states.
- Maintain 44×44px minimum touch targets.
- Provide tooltips and accessible names for icon-only buttons.
- Make dialogs focus-trapped and return focus to their trigger after closing.
- Confirm destructive group actions.
- Respect reduced-motion preferences.
- Keep the composer reachable with mobile safe-area padding.
- Below 768px, show the conversation list or active thread as separate navigable views instead of compressing both columns.

## Preserve these behaviors

- phone/name authentication;
- direct-message and group distinction;
- real-time messages and reconnect behavior;
- optimistic sending and delivery status;
- unread indicators;
- search and conversation selection;
- group creation, rename, add, promote, remove, leave, and management permissions;
- session restoration;
- existing API payload shapes and route contracts.

## Explicitly avoid

- purple as the primary brand accent;
- neon or glowing green;
- glassmorphism and blurred transparent cards;
- gradient text, gradient borders, or gradient message bubbles;
- giant decorative blobs or empty hero space;
- fake 3D objects or generated profile photos;
- excessive rounded cards and pills;
- oversized dashboard metrics unrelated to chat;
- placeholder-only UI that disconnects working features;
- hardcoded static message data replacing live data;
- desktop-only layouts;
- accessibility regressions.

## Definition of done

The work is complete when every existing page uses one coherent token-based system, the chat features still work, responsive layouts are usable at the required widths, all core interaction states are implemented, keyboard focus is visible, contrast meets WCAG AA, and the project passes its existing validation commands.

Do not stop after creating mock components. Implement the design in the existing production routes and connect it to the current data and behavior.
