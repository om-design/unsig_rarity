# Run 2 — Props, Values, Colors and wallet lookup

Date: October 23, 2026 (America/New_York).
Public site: https://om-design.github.io/unsig_rarity/
Status: source committed; public deployment and final browser verification pending.

## Approved changes and meaning

The user requested distinct Props, Values and Colors, kept layer order significant, and selected “Rank by Values within the same property count; show Colors separately.” The user supplied a wallet URL for lookup testing and requested continuation.

Props compares the layer count against 31,118 eligible records. Values compares ordered (distribution, rotation, multiplier) triples within that property count. Colors separately compares ordered RGB assignments within that count. Each reports matches, its comparison population, share and the complementary rarity percentage. Colors is unchecked by default. Geometry and published color clusters remain preserved in data but are not scored.

The default list ranks hierarchically: property-count frequency across the collection first, then Values frequency within the property group. Exact integer comparisons occur before rounding. A rarer configuration in a common property group cannot outrank any member of a rarer property group. A property-count filter and independent Props/Colors ranking are available. Ties share competition ranks; numeric ID only determines stable display order within ties. Ranking positions refer to the displayed scope/filter; wallet scores continue using full collection comparison populations. The table offers pagination, unsig lookup buttons and CSV download.

Total rarity retains the approved overall intersection calculation for checked attributes, with denominator 31,118. Every complete ordered Values+Colors configuration is unique, so all three selected produces a tie at one match for every item; the interface explains this instead of inventing distinction. This is not a percentile rank or generating probability.

Example #00052: Props 246/31,118 (0.7905% share); Values 3/246 (1.2195%); Colors 49/246 (19.9187%). Default total Props+Values is 3/31,118, 99.9904% complement.

## Wallet result and constraints

The supplied policy-filtered pool.pm address view returned 113 matching unsigs with has_more=false. Its sidebar's 135 assets was not used as the unsig count. The actual browser lookup retrieved the complete list and its sorted IDs matched independent calculations. The app accepts checksum-valid mainnet addr1/stake1 pool.pm URLs, with optional matching policy filter. It rejects other hosts, policy-only URLs, invalid checksum and incorrect policy routes. It handles cursors, timeout/HTTP/schema errors and completion before replacing the prior list. Zero is separately reported/excluded if held. No wallet connection, signing or API key is involved. User wallet addresses are not embedded in source or stored by the app.

The endpoint was found in pool.pm's current public application code, /assets/index-FTbaoLXb.js, then tested at /api/assets/{subject}/{policy}; CORS allowed browser requests. No verified stability contract was found. The third-party service can change or become unavailable. Address-view scope is not a guarantee to find every account belonging to a person. Tests do not establish all provider error conditions, a real empty-wallet response, or multi-page live API behavior; cursor/error paths are implemented but those cases were not exercised against a live wallet requiring pagination.

## Verification

- 311,180 independent Python checks reconciled all seven matching combinations and three facet metrics for all 31,118 eligible records with the JavaScript model. All passed.
- Portable test script checks 110 independently counted examples, complete ranking order/ties, zero exclusion and full-configuration uniqueness. Passed.
- Browser: 77 total selections and 33 facet results (110 checks) passed across 11 IDs.
- Wallet: complete 113-ID ordered list matched; four invalid URLs rejected; zero and empty selection passed.
- CSV: 31,118 data rows plus header, leading-zero IDs retained in the file. Spreadsheet importers may need text column type to preserve the display.
- Responsive: 1440/375/320px layouts have no document overflow after fixing decorative-edge overflow observed during testing. Each checkbox measured exactly 18px below its card and horizontally centered within 0.004px. Mobile cards stack, with 14px descriptions and readable parameter text. Unchecked cards retain full-opacity text and show explicit exclusion status.
- Existing digit-only number entry and leading-zero behavior retained. Unknown/zero handling retained. Full formal accessibility/screen-reader certification is not claimed.

Evidence files: ordered-model-verification.json, ordered-browser-scoring.json, wallet-browser-checks.json, layout-checks.json, values-ranking.csv, pass-two-1440.jpg, pass-two-375.jpg, pass-two-320.jpg. Public verification will be recorded separately.

## Comparison with Run 1

| Aspect | Run 1 | Run 2 |
| --- | --- | --- |
| Facets | Geometry / property count / palette cluster | Props / ordered Values / ordered Colors |
| Comparison population | Entire collection for every score | Props overall; Values/Colors independently nested within property count |
| Total | Actual selected intersection, overall complement | Same overall semantics, applied to new distinct facets |
| Ranking | None | Choose basis and property group; true ties preserved; CSV |
| Wallet | None | Validate pool.pm URL; retrieve complete policy-filtered holdings; score with collection data |
| Narrow layout | 6–9px support text in tiny adjacent cards | Stacked readable cards; checkbox spacing preserved |
| Unchecked text | Dimmed to 0.57 opacity | Full opacity plus explicit exclusion text |
| Input | Initially permissive; then digit-only correction | Digit-only, range-limited, leading-zero preserving; ready after data loads |

Run 1 source and screenshots are preserved separately. The previous proposed comparative-percentile method was not adopted. Data rows and reference geometry assignments are unchanged.

## Wallet-priority diagnosis and correction

User clarified that #00236 should lead their wallet and confirmed: the rarest five-property unsig is less rare than the most common three-property unsig. The initial pass-two default compared conditional frequencies across property groups, putting #00236 last. This lost the intended hierarchy. The corrected order makes collection-wide property-count scarcity an absolute primary key; within-group Values (or independently chosen Colors) is secondary. This is not a weighted sum.

Verified wallet order now begins #00236 (rank 1), then all eight three-property holdings, then six-, four-, and five-property groups in their actual scarcity order. All 93,693 collection/wallet rank positions and tie ranks were independently verified. Facet percentages still describe their explicitly labeled comparison groups and are not a combined hierarchical score.

Original pass-two source at c1f09effcf8171828f3e371ca08268ce25abbc3d and its evidence remain in Git history and the earlier source snapshot. This correction is part of Run 2, not a newly invented third full run.
