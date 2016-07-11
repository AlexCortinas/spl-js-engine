package gpl.workspace.test;

import gpl.graph.IGraph;
import gpl.vertex.IVertex;

public abstract class AlgorithmTest {
	
	protected static void addEdge(IGraph g, IVertex start, IVertex end) {
		g.addEdge(start, end/*% if (feature.weighted) { %*/, (int) (Math.random() * 10)/*% } %*/);
	}
}
