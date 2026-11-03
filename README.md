# Elite Design & Engineering OS

A portable instruction system for Cursor and Claude Code.

## Install

Copy the contents of this folder into the root of your project. Keep existing project instructions; merge carefully rather than overwriting useful rules.

- `AGENTS.md`: shared project-wide operating principles (Cursor and compatible agents).
- `CLAUDE.md`: Claude Code entry point; points to the shared core and adds Claude-specific session discipline. The core is deliberately not duplicated here.
- `.cursor/rules/*.mdc`: focused Cursor rules for design, frontend implementation, accessibility, and QA.

`AGENTS.md` and `.cursor/` must sit at the **repository root**, or Cursor will not load them. Rules in a
subdirectory only apply to files within that subtree.

Rule loading: `qa-review.mdc` is always applied, because verification and handoff discipline must be
present at the end of every task regardless of which files were touched. The design, frontend, and
accessibility rules auto-attach on UI file extensions. None of them rely on the agent choosing to
fetch them by description.
- `docs/`: detailed standards and checklists to consult for substantial work.
- `templates/`: reusable project brief and design review templates.

## Recommended usage

1. Add these files to version control.
2. Ask the agent to inspect the current repository and map the existing architecture before making changes.
3. For a new project, complete `templates/project-brief.md`.
4. For significant UI work, use the design workflow and QA checklist in `docs/`.
5. After a correction, add a focused rule only if it prevents a repeatable mistake. Avoid turning the instruction set into an unmaintainable encyclopedia.

## Important

Instructions guide behavior; they do not enforce correctness by themselves. Pair them with real linting, type checks, tests, accessibility checks, browser inspection, code review, and protected deployment workflows.
