# Quality Assurance Workflow

## Gate 1: Scope and regression
- Confirm the requested acceptance criteria.
- Inspect the diff for unrelated changes.
- Check that existing routes, integrations, and business behavior remain intact.

## Gate 2: Visual inspection
Where browser or screenshot tools are available:
- Inspect the actual rendered page, not just source code.
- Review wide desktop, laptop/tablet, and narrow mobile.
- Check alignment, spacing rhythm, typography, color contrast, image crop, content density, and section transitions.
- Test realistic content lengths and empty/long states.
- Capture screenshots when useful for comparison.

## Gate 3: Functional inspection
Test:
- Navigation and links.
- Primary and secondary calls to action.
- Forms, validation, submission, and feedback.
- Menus, drawers, tabs, accordions, modals, filters, and search.
- Keyboard-only operation.
- Loading, error, empty, success, disabled, and selected states.

## Gate 4: Technical verification
Run applicable commands discovered in the repository:
- Formatter/linter.
- Type checker.
- Unit and integration tests.
- Production build.
- Platform validation or browser tests.

Inspect browser console and network failures when tools permit.

## Gate 5: Accessibility
Check:
- Semantic landmarks and heading order.
- Accessible names and labels.
- Keyboard reachability and visible focus.
- Focus management for overlays.
- Contrast and non-color status cues.
- Reduced motion.
- Image alternatives.
- Touch usability.

## Gate 6: Final critique
Act as a strict independent reviewer. List material defects, fix them, and rerun affected checks. A numerical score never overrides a critical defect.

## Severity
- Blocker: security/data loss, broken core journey, failed build, inaccessible essential action.
- High: major layout break, broken primary CTA, serious mobile defect, significant regression.
- Medium: inconsistent component, confusing secondary interaction, visible spacing/typography defect.
- Low: minor polish issue with little impact.

## Release decision
- Approve: no known blockers or high-severity defects; required checks pass.
- Conditional: no blocker, but a disclosed non-critical check or issue remains.
- Reject: any blocker, unresolved high-severity defect, or failed required check.

## Handoff format
1. Implemented.
2. Design and technical decisions.
3. Verification performed (commands and outcomes).
4. Visual/browser checks performed and viewports.
5. Known limitations and unverified areas.
6. Required next action, if any.
