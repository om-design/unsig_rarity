# Approved rarity specification

Approved 2026-10-23. User confirmed that the display and behavior match the desired result after reviewing the meaning of 99.9904%. This approves the scoring method; Site Run 1 construction/publication is the next approval step.

## Meaning and calculation

Let N = 31,118 eligible unsigs. Let n be the number sharing the searched item's values for all selected facets.

**Rarity percentage = 100 × (1 − n/N).**

Display four decimal places and the underlying count. Example:

**Total rarity: 99.9904%**

*3 of 31,118 unsigs share the selected combination.*

This percentage means the proportion of the eligible collection that does not share the selected combination. It is not a percentile rank, market-value estimate, or probability of generating a future unsig. Tied frequencies have tied rarity percentages. No unique “most rare” item is required.

## Facets and population

- Geometry code is primary. Use PrimaryGeometry from reviewed project taxonomy v2, with published reference codes retained as provenance.
- All 84 members of 3F-075 remain one geometry group. Internal boundary signatures do not split rarity classes. The five other project reassignments have original-page review evidence.
- Property count is the number of populated Property 1–6 fields.
- Color cluster is the published unsig.info assignment; all 132 clusters and every eligible ID have verified coverage.
- Named forms are excluded from scoring and fairness comparisons.
- Exclude #00000 from every rarity count and denominator. Show its special status without ordinary rarity percentages or Total rarity.

## Selected-column behavior

Each column uses its own matching count and the same formula. Total rarity counts the actual eligible records sharing all checked attributes, rather than adding or multiplying separate scores. This handles observed overlap without assuming independence.

One selected column must produce the same total as that column. Adding a selected facet cannot lower the rarity percentage, because the matching group cannot grow. Changing selections changes the combination being measured; it does not create a universal percentile ranking.

With no selected columns, show “Select a rarity facet.” For valid nonzero searches, n must be at least one. Missing values are reported and unavailable facets disabled; unknowns never become a rare class. Keep full precision until final display rounding.

## Required presentation

Use deep navy ocean blue, an “unsig number” text field and “search” button, and three vertical columns for geometry, property count, and color cluster. Every column has a select checkbox centered horizontally with its top 18px below the column bottom. Total rarity reacts to checkbox changes and includes the matching count beneath the percentage. Geometry code is prominent.

Support keyboard search and accessible checkbox labels, visible focus, readable contrast, and narrow screens. Validate empty, malformed, and out-of-range input. Accept integers and leading zeros; prefixes may be accepted only with explicit parsing.

## Run verification

Check all seven nonempty checkbox combinations for representative items, plus empty selection and zero. Verify counts and four-decimal percentages independently. Include both 3F-075 examples and all five reviewed reassignments. Preserve Run 1, diagnose failures and user feedback, then correct and repeat full evaluation in Run 2. These two website runs remain separate from research iterations.
