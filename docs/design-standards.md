# Design Standards

## 1. Start with the product, not decoration

Establish:
- Primary audience and their context.
- User problem and desired outcome.
- Primary conversion or task.
- Supporting actions and information.
- Brand personality and constraints.
- Content hierarchy and page purpose.

Every section should answer a user question, support a task, build trust, or move the journey forward.

## 2. Visual system

Define or reuse tokens for:
- Typography: families, scale, weights, line heights, letter spacing.
- Spacing: a coherent scale rather than arbitrary values.
- Layout: page gutters, max content widths, grid columns, breakpoints.
- Color roles: canvas, surface, elevated surface, text, muted text, border, primary, accent, status.
- Shape: control heights, radii, borders, shadows.
- Motion: duration, easing, reduced-motion behavior.

Do not invent tokens that conflict with the established system. If the project has no system, create a small one and document it.

## 3. Composition and hierarchy

- Give each viewport a clear focal point.
- Use alignment and grouping to communicate relationships.
- Use whitespace intentionally; whitespace is not a substitute for missing content.
- Control visual density and avoid competing calls to action.
- Make headings informative and scannable.
- Use varied compositions only when they strengthen the story; variation for its own sake creates noise.
- Design with realistic text, images, and data lengths.

## 4. Typography

- Establish a semantic heading hierarchy.
- Keep body text readable at normal viewing distances.
- Use comfortable line length and line height.
- Avoid too many font families and weights.
- Avoid low-contrast muted text for essential information.
- Do not choose display typography that harms readability or localization.

## 5. Color and imagery

- Use color consistently by role.
- Check contrast for text, icons, controls, and focus indicators.
- Use images that support the content and brand; preserve useful focal points when cropping.
- Avoid generic stock imagery when real product or brand imagery is available.
- Avoid gradients, glassmorphism, blur, glow, and heavy shadows unless they serve a clear design rationale.

## 6. Interaction design

Specify and implement relevant states:
- Default, hover, focus-visible, active, selected, disabled.
- Loading, success, error, empty, and validation.
- Open/closed states for menus, dialogs, drawers, and accordions.
- Keyboard and touch interaction.

Use clear action labels. Avoid ambiguous labels such as "Click here" or "Submit" when a more descriptive label is possible.

## 7. Responsive design

Plan behavior at:
- Wide desktop.
- Typical laptop.
- Tablet.
- Narrow mobile.

At each width, review:
- Navigation and information priority.
- Grid changes and stacking order.
- Typography and line wrapping.
- Image crop and aspect ratio.
- Button size and placement.
- Touch interactions.
- Overflow and sticky elements.

Do not blindly preserve desktop composition on mobile. Keep essential content and actions available.

## 8. Avoid design clichés

Do not automatically add:
- Gradient hero backgrounds.
- Floating decorative blobs.
- Three identical feature cards.
- Excessive pill-shaped controls.
- Huge rounded containers around every section.
- Arbitrary icons beside every heading.
- Scroll animations on every element.
- Fake dashboards or meaningless statistics.
- Large empty hero areas with vague copy.

These patterns are not forbidden, but each use must be justified by the brand and user goal.

## 9. Design critique questions

- Can a first-time visitor identify the page purpose quickly?
- Is the primary action obvious without overpowering everything else?
- Does the visual language feel specific to this product?
- Are typography, spacing, alignment, imagery, and surfaces coherent?
- Is the content easy to scan and understand?
- Does the mobile layout feel designed rather than compressed?
- Are all states and interactions considered?
- What is the weakest section, and what specific change would improve it?
