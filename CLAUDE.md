# Elite Design & Engineering Operating System — Claude Code

The shared operating principles, workflow, design rules, engineering rules, and definition of done
live in **[AGENTS.md](./AGENTS.md)**. Read that file first and treat it as binding. It is the single
source of truth; this file only adds Claude Code specifics.

Supporting detail:

- `docs/design-standards.md` — visual and UX standard.
- `docs/engineering-standards.md` — architecture, styling, performance, security, platform caution.
- `docs/qa-workflow.md` — the six verification gates, severity scale, and handoff format.
- `templates/` — project brief, task prompt, design review.

## Claude Code session discipline

Use plan/read-only exploration for large or risky changes before editing. Keep changes scoped.
Before finishing, inspect your diff and summarize verification truthfully. If the user corrects a
repeated design or engineering mistake, propose the exact durable rule update and apply it when
appropriate.
