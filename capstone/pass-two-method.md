# unsigned_algorithms Rarity Observatory — Pass 2

Public site: https://om-design.github.io/unsig_rarity/

Serve `dist/` as a static website. GitHub Pages publishes it through `.github/workflows/pages.yml`. No installation or build step is required. JavaScript/CSS URLs are content-versioned to avoid mixed cached versions.

## Approved ordered facets

- **Props:** number of layers; comparison population is 31,118.
- **Values:** ordered `(distribution, rotation, multiplier)` triples, ignoring color. Compare within the same property count.
- **Colors:** ordered Red/Green/Blue layer sequence, ignoring values. Compare independently within the same property count. Published palette clusters are retained in the source dataset but not scored.

Share is `100 × matches / comparison population`. Rarity is its complement, four decimal places. This is frequency, not a percentile. Default ranking is Values within property count, smallest share first. Cross-products compare exact fractions before numeric-ID ordering; ties retain the same competition rank. Ranks refer to the currently displayed scope/filter. Scores always use the collection populations, including for wallet lists.

Total rarity separately uses actual overall matches for checked facets, with denominator 31,118. Props and Values are initially checked; Colors is initially unchecked. Full Values + Colors uniquely identify every eligible record, so full-combination rarity is tied for all items. No artificial tiebreaking score is introduced. #00000 is excluded from scoring and lists, with a special lookup display.

Data rows: `[id, geometry, propertyCount, publishedColorCluster, properties, referenceGeometry]`; each property is `[multiplier, color, distribution, rotation]`. The dataset and geometry references are unchanged by Pass 2. Artwork is a labeled parameter reconstruction adapted from the creator's Apache-2.0 notebook; see `dist/LICENSE-RENDERER.txt`.

## Wallet lookup

Accepts checksum-valid mainnet `https://pool.pm/addr1…` or `https://pool.pm/stake1…` links, optionally with `/assets/<unsig-policy>`. Policy-only links, other hosts, invalid addresses and incorrect policies produce a re-entry error. The browser reads pool.pm's policy-filtered assets endpoint, follows cursors to completion, validates response shape and asset names, excludes zero, and applies the same collection-based metrics. No API key, signature or wallet connection is needed.

The endpoint was discovered in pool.pm's public application code and tested directly and through the browser. It is a third-party interface without a verified stability contract; changes, rate limits, CORS restrictions or outages may interrupt lookup. Timeout/HTTP/pagination errors do not silently replace a complete list with a partial one. The input address view is not a claim to discover every account controlled by an owner. User wallet addresses are not embedded in the published source or stored by this app.

Capstone records are in `capstone/`; detailed screenshots and evidence are preserved in the local submission packet.
