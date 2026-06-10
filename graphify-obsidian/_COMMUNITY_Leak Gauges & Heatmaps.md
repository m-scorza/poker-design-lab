---
type: community
members: 12
---

# Leak Gauges & Heatmaps

**Members:** 12 nodes

## Members
- [[GAUGE_LEAKS]] - code - archive/lab/src/modules/leaks.js
- [[HM_COLS]] - code - archive/lab/src/modules/leaks.js
- [[HM_ROWS]] - code - archive/lab/src/modules/leaks.js
- [[HM_SEV_LABEL]] - code - archive/lab/src/modules/leaks.js
- [[METRICS]] - code - archive/lab/src/modules/leaks.js
- [[POS]] - code - archive/lab/src/modules/leaks.js
- [[buildLeakGauges()]] - code - archive/lab/src/modules/leaks.js
- [[buildLeakHeatmap()]] - code - archive/lab/src/modules/leaks.js
- [[buildPositionalStatsHeatmap()]] - code - archive/lab/src/modules/leaks.js
- [[initLeaks()]] - code - archive/lab/src/modules/leaks.js
- [[leaks.js]] - code - archive/lab/src/modules/leaks.js
- [[leaksData]] - code - archive/lab/src/modules/leaks.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Leak_Gauges__Heatmaps
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_3D Card Tilt  Cursor Effects]]
- 2 edges to [[_COMMUNITY_Hands & Background Data]]

## Top bridge nodes
- [[leaks.js]] - degree 14, connects to 2 communities
- [[initLeaks()]] - degree 6, connects to 1 community