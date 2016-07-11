/*% if (feature.mstPrim) { %*/
package gpl.util;

import gpl.graph.IGraph;
import gpl.vertex.IVertex;

import java.util.HashSet;
import java.util.Set;

public class MSTPrimHelper {
	private static int INFINITE = Integer.MAX_VALUE;

	private static IVertex pop(Set<IVertex> queue) {
		IVertex min = queue.stream().sorted((v1, v2) -> v1.getKey() < v2.getKey() ? -1 : 1).findFirst().orElse(null);
		queue.remove(min);
		return min;
	}

	public static void prim(IGraph graph, IVertex root) {
		Set<IVertex> queue = new HashSet<IVertex>();

		root.setPred(null);
		root.setKey(0.0f);
		queue.add(root);

		graph.getVertices().stream().filter(v -> !v.equals(root)).forEach(v -> {
			v.setPred(null);
			v.setKey(INFINITE);
			queue.add(v);
		});

		while (!queue.isEmpty()) {
			IVertex auxVertex = pop(queue);
			
			/*% if (feature.gNoEdges) { %*/
			auxVertex.getAdjacents().stream()
					.filter(adj -> queue.contains(adj) && adj.getKey() > auxVertex.getWeight(adj.getName()))
					.forEach(adj -> {
						adj.setPred(auxVertex.getName());
						adj.setKey(auxVertex.getWeight(adj.getName()));
						queue.add(adj);
					});
			/*% } else if (feature.gnOnlyNeighbors) { %*/
			auxVertex.getNeighbors().stream()
			.filter(n -> queue.contains(n.getNeighbor()) && n.getNeighbor().getKey() > n.getWeight())
			.forEach(n -> {
				n.getNeighbor().setPred(auxVertex.getName());
				n.getNeighbor().setKey(n.getWeight());
				queue.add(n.getNeighbor());
			});
			/*% } else if (feature.genEdges) { %*/
			auxVertex.getNeighbors().stream()
					.filter(n -> queue.contains(n.getNeighbor()) && n.getNeighbor().getKey() > n.getEdge().getWeight())
					.forEach(n -> {
						n.getNeighbor().setPred(auxVertex.getName());
						n.getNeighbor().setKey(n.getEdge().getWeight());
						queue.add(n.getNeighbor());
					});
			/*% } %*/
		}
	}

}
/*% } %*/