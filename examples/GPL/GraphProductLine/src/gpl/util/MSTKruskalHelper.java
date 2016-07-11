/*% if (feature.mstKruskal) { %*/
package gpl.util;

import gpl.edge.Edge;
import gpl.edge.IEdge;
import gpl.graph.IGraph;
import gpl.vertex.IVertex;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class MSTKruskalHelper {

	public static List<IEdge> kruskal(IGraph graph) {
		List<IEdge> mst = new ArrayList<IEdge>();
		List<IEdge> edges = new ArrayList<IEdge>();
		
		// map to save the disjoint sets for each vertex
		Map<IVertex, Set<IVertex>> sets = new HashMap<IVertex, Set<IVertex>>();

		graph.getVertices().forEach(v -> {
			
			/*% if (feature.gNoEdges) { %*/
			v.getAdjacents().forEach(adj -> edges.add(new Edge(v, adj, v.getWeight(adj.getName()))));
			/*% } else if (feature.gnOnlyNeighbors) { %*/
			v.getNeighbors().forEach(nei -> edges.add(new Edge(v, nei.getNeighbor(), nei.getWeight())));
			/*% } else if (feature.genEdges) { %*/
			v.getNeighbors().forEach(n -> edges.add(n.getEdge()));
			/*% } %*/
			
			sets.put(v, new HashSet<IVertex>());
			// each vertex should be a disjoint set at first
			sets.get(v).add(v);
		});

		edges.stream()
				.filter(e -> sets.get(e.getStart()) != sets.get(e.getEnd())) // only if sets are not the same
				.sorted((e1, e2) -> e1.getWeight() < e2.getWeight() ? -1 : 1) // sorting edges by weight
				.forEach(edge -> {
					mst.add(edge);
					Set<IVertex> aux = new HashSet<IVertex>();
					aux.addAll(sets.get(edge.getStart()));
					aux.addAll(sets.get(edge.getEnd()));
					aux.forEach(setMember -> sets.put(setMember, aux));
				});
		
		return mst;
	}
}
/*% } %*/