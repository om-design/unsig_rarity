# Run 1 — local verification record

Date: 2026-10-23 (America/New_York).

Status: built and locally verified; public deployment remains incomplete. This is not yet a completed public website run. Run 2 has not begun.

## Implemented result

Deep navy static site with unsig search, three vertical columns (geometry code, property count, published color cluster), selectable facets, and Total rarity. The approved calculation is 100 × (1 − matches / 31,118), with actual selected-facet intersection counts and four decimal places. Zero has a separate origin display and is excluded from all populations.

## Verified evidence

- All 31,119 packaged records matched the reviewed CSV.
- All possible matching counts were checked against independent four-decimal rounding expectations.
- 70 browser scoring cases passed: 10 IDs across all seven nonempty selections; see browser-scoring-checks.json.
- 12 interaction checks passed; see browser-interaction-checks.json. These include invalid input, zero, no selection, keyboard search and checkbox operation, narrow screens, and random nonzero selection.
- Checkbox control tops measured exactly 18px below cards; horizontal center differences below 0.004px. Checked desktop 1440px and mobile 375px. No overflow at 320px.
- JavaScript syntax check passed. Labels and result announcements inspected. Formal contrast and exhaustive accessibility audit remain pending.
- Screenshots: desktop-default.jpg, desktop-geometry.jpg, mobile-default.jpg, genesis-desktop.jpg.

## Limitations and diagnosis pending

The local artwork preview is a labeled reconstruction; original item links are provided. Five geometry reassignments are project judgments with references preserved. The withdrawn 3F-075 A/B split is absent.

The Sites project was registered with public audience, but its source upload was rejected by automatic approval review: the required execution approval is disabled in this session. No deployed URL has been verified. User approved GitHub source storage and created the public repository om-design/unsig_rarity. Source and verification evidence are being preserved there. Public website hosting remains to be configured and verified.

Next: preserve source in the repository, publish and verify anonymous access, collect Run 1 feedback, then approve and perform Run 2 corrections and full repeat evaluation.
