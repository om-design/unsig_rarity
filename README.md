# unsigned_algorithms Rarity Observatory — Pass 2

Public site: https://om-design.github.io/unsig_rarity/

Serve `dist/` as a static website. GitHub Pages publishes it through `.github/workflows/pages.yml`. No installation or build step is required. JavaScript/CSS URLs are content-versioned to avoid mixed cached versions.

## Overall ranking score

Approved ordering: special origin #00000 first, then Props rarity, ordered Values rarity, ordered Colors rarity. Each frequency remains a separate measure: no full-configuration uniqueness or multiplied probabilities are used. Props has absolute priority; Values can only order items tied on Props, and Colors can only order those still tied. Numeric ID only orders display within genuine ties.

- Props compares layer-count population across 31,118 nonzero records.
- Values compares ordered `(distribution, rotation, multiplier)` triples, ignoring color, within the same property count.
- Colors compares ordered RGB assignments, ignoring Values, within that count. Published palette clusters are not scored.

Collection competition rank is 1 for the origin, and 2 plus the count of strictly preceding eligible items for every other unsig. Overall points = `100 × (31119 − collection rank) / 31118`, rounded to four decimals. #00000 alone receives 100. Ties have identical points. The lowest tied group may be slightly above 0. Points describe rank position, not frequency, market value, probability, or a ratio of rarity. There are 549 distinct score groups in this snapshot.

The overall score does not change in wallet/filter views. Rank in view reflects the displayed subset; Collection rank remains global. The simplified table shows these two ranks, unsig ID, property count and one overall score. Frequency fractions are removed from the table. The three cards keep separate facet measurements. Checkboxes affect the optional selected-facet frequency details only, not the fixed overall score.

#00000 remains excluded from all frequency counts. It is included as a special first-ranked entry in overall lists and receives score 100 in its lookup. A wallet holding it will display it first. Full ordered Values + Colors are unique for every eligible record; those full combinations are not used for the overall score.

Data rows: `[id, geometry, propertyCount, publishedColorCluster, properties, referenceGeometry]`; each property is `[multiplier, color, distribution, rotation]`. The dataset and geometry references are unchanged by Pass 2. Artwork is a labeled parameter reconstruction adapted from the creator's Apache-2.0 notebook; see `dist/LICENSE-RENDERER.txt`.

## Wallet lookup

Accepts checksum-valid mainnet `https://pool.pm/addr1…` or `https://pool.pm/stake1…` links, optionally with `/assets/<unsig-policy>`. Policy-only links, other hosts, invalid addresses and incorrect policies produce a re-entry error. The browser reads pool.pm's policy-filtered assets endpoint, follows cursors to completion, validates response shape and asset names, retains zero with its explicit special score, and applies the same global overall scores. No API key, signature or wallet connection is needed.

The endpoint was discovered in pool.pm's public application code and tested directly and through the browser. It is a third-party interface without a verified stability contract; changes, rate limits, CORS restrictions or outages may interrupt lookup. Timeout/HTTP/pagination errors do not silently replace a complete list with a partial one. The input address view is not a claim to discover every account controlled by an owner. User wallet addresses are not embedded in the published source or stored by this app.

Capstone records are in `capstone/`; detailed screenshots and evidence are preserved in the local submission packet.
