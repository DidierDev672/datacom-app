import sys, json
from graphify.build import build_from_json
from pathlib import Path
import networkx as nx
from collections import Counter

g = json.loads(Path("graphify-out/graph.json").read_text(encoding="utf-8"))
G = build_from_json(g)
communities = g.get("communities", {})
labels = g.get("labels", {})

community_map = {}
for cid, members in communities.items():
    for m in members:
        community_map[m] = cid

bc = nx.betweenness_centrality(G)
top_hubs = sorted(bc.items(), key=lambda x: x[1], reverse=True)[:15]

deg = dict(G.degree())
top_degree = sorted(deg.items(), key=lambda x: x[1], reverse=True)[:15]

community_counts = Counter()
for cid, members in communities.items():
    community_counts[cid] = len(members)

print("=== DATA FLOW ANALYSIS ===")
print()
print("--- Top 15 Nodes by Betweenness Centrality (Data Flow Hubs) ---")
for node, score in top_hubs:
    cid = community_map.get(node, "?")
    label = labels.get(str(cid), f"Community {cid}")
    print(f"  {node:50s}  centrality={score:.4f}  community={label}")

print()
print("--- Top 15 Nodes by Degree (Most Connected) ---")
for node, d in top_degree:
    cid = community_map.get(node, "?")
    label = labels.get(str(cid), f"Community {cid}")
    print(f"  {node:50s}  degree={d}  community={label}")

print()
print("--- Community Sizes ---")
for cid, count in community_counts.most_common(10):
    label = labels.get(str(cid), f"Community {cid}")
    print(f"  {label:40s}  {count} nodes")

print()
print("--- Potential Data Flow Paths (longest shortest paths) ---")
nodes = list(G.nodes())
if len(nodes) > 2:
    import random
    random.seed(42)
    pairs = [(random.choice(nodes), random.choice(nodes)) for _ in range(200)]
    longest = []
    for u, v in pairs:
        try:
            path = nx.shortest_path(G, u, v)
            longest.append((len(path), path))
        except nx.NetworkXNoPath:
            pass
    longest.sort(reverse=True)
    seen = set()
    for length, path in longest[:10]:
        key = tuple(path)
        if key not in seen:
            seen.add(key)
            display = " -> ".join(path[:8])
            if length > 8:
                display += " ..."
            print(f"  Length {length}: {display}")
