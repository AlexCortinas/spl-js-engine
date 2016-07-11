/*% if (feature.shortest) { %*/
package gpl.util;

import gpl.edge.Edge;
import gpl.edge.IEdge;
import gpl.graph.IGraph;
import gpl.vertex.IVertex;

import java.util.ArrayList;
import java.util.List;

public class ShortestHelper {
	private static float INFINITE = Integer.MAX_VALUE;

	public static void shortest(IGraph graph, IVertex root) {
		List<IEdge> edges = new ArrayList<IEdge>();

		graph.getVertices().forEach(v -> {

			/*% if (feature.gNoEdges) { %*/
			v.getAdjacents().forEach(adj -> edges.add(new Edge(v, adj, v.getWeight(adj.getName()))));
			/*% } else if (feature.gnOnlyNeighbors) { %*/
			v.getNeighbors().forEach(n -> edges.add(new Edge(v, n.getNeighbor(), n.getWeight())));
			/*% } else if (feature.genEdges) { %*/
			v.getNeighbors().forEach(n -> edges.add(n.getEdge()));
			/*% } %*/

			if (v.equals(root)) {
				v.setShortestDistance(0f);
				v.setShortestPredecessor(v.getName());
			} else {
				v.setShortestPredecessor(null);
				v.setShortestDistance(INFINITE);
			}
		});

		for (int i = 0; i < graph.getVertices().size(); i++) {
			edges.stream().filter(edge -> edge.getStart().getShortestDistance() + edge.getWeight() < edge.getEnd()
					.getShortestDistance()).forEach(edge -> {
						edge.getEnd().setShortestDistance(edge.getStart().getShortestDistance() + edge.getWeight());
						edge.getEnd().setShortestPredecessor(edge.getStart().getName());
					});
		}

		edges.stream().filter(
				edge -> edge.getStart().getShortestDistance() + edge.getWeight() < edge.getEnd().getShortestDistance())
				.forEach(edge -> {
					throw new RuntimeException("Graph contains a negative-weight cycle");
				});
	}
}
/*% } %*/