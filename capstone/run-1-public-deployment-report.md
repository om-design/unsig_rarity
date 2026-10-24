# Run 1 public deployment and verification

Date: October 23, 2026 (America/New_York)

Public URL: https://om-design.github.io/unsig_rarity/
Source: https://github.com/om-design/unsig_rarity
Deployed commit: dd21b3703906f029591de8f1c936b33b98f91965
GitHub Actions run: https://github.com/om-design/unsig_rarity/actions/runs/40050184219 (retry succeeded)

The public page loaded in a signed-out browser. All 70 browser scoring cases passed against the independent expectations already preserved for Run 1. Default #00052 displays 99.9904%, with 3 of 31,118 sharing the combination. The denominator excludes #00000.

Additional public checks passed: no selected facets prompts Select a rarity facet; #00000 displays its special origin panel and hides Total rarity; #31119 is marked invalid. All three checkboxes measured 18px below card bottoms and within 0.004px of horizontal centers.

Evidence: public-browser-scoring-checks.json, public-interaction-checks.json, public-desktop.jpg. Prior local desktop/mobile checks remain in this folder. Public mobile behavior has not been separately retested. Formal contrast and exhaustive accessibility review remain open.

Diagnosis for the next approved stage: application behavior meets the core verified search/scoring/placement requirements. Sites publishing was blocked by session policy; GitHub Pages succeeded after the user enabled GitHub Actions as its publishing source. Run 2 has not begun. Collect user feedback and approve a concrete correction scope before changing the site. The geometry model's earlier correction is research history, not a second full website run.
