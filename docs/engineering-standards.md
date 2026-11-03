# Engineering Standards

## Repository discovery
Before editing, identify framework, package manager, scripts, routing, styling, component patterns, state management, data flow, tests, and build process. Read nearby implementations and follow established conventions.

## Component design
- Components should have a clear responsibility and stable interface.
- Extract shared components when reuse is real and semantics are consistent.
- Keep one-off components simple.
- Avoid giant components, deeply nested conditionals, and unnecessary prop drilling.
- Keep business logic out of purely presentational components where practical.

## CSS and styling
- Reuse tokens and existing styling conventions.
- Avoid unexplained magic numbers and conflicting overrides.
- Scope styles to avoid leaking across unrelated pages.
- Prefer layout systems (grid/flex) over brittle positioning.
- Avoid fixed heights for dynamic content.
- Keep responsive rules understandable and grouped logically.

## Data and behavior
- Preserve API contracts and data models.
- Validate data at trust boundaries.
- Handle loading, empty, error, and success states.
- Prevent duplicate submissions where relevant.
- Keep state transitions predictable.
- Do not simulate real backend behavior with fake success messages.

## Performance
- Optimize image size, format, and loading priority.
- Avoid unnecessary client-side JavaScript and dependencies.
- Avoid layout shifts from images, fonts, and dynamic content.
- Use code splitting and lazy loading where appropriate.
- Measure before applying speculative optimization.

## Security and privacy
- Never commit secrets or credentials.
- Do not expose private data in logs or client bundles.
- Sanitize or safely render untrusted content.
- Follow least-privilege and existing authentication/authorization boundaries.
- Do not weaken security controls to make a UI flow appear to work.

## SEO and discoverability
When relevant, verify page title, meta description, canonical URL, heading structure, image alt text, indexability, structured data, and social sharing metadata. Do not add misleading structured data or keyword-stuffed content.

## Platform-specific caution
For Shopify, WordPress, or another CMS/eCommerce platform:
- Prefer supported native capabilities and documented extension points.
- Preserve checkout, payment, customer, order, inventory, and integration behavior.
- Respect editor-managed content and avoid hardcoding content that should be configurable.
- Confirm platform-specific constraints before choosing an implementation.
- Test critical commerce flows in a safe environment; never perform live transactions without authorization.
