/*% if (feature.number) { %*/
package gpl.workspace.test;

import gpl.graph.Graph;
import gpl.graph.GraphSearch;
import gpl.graph.IGraph;
import gpl.vertex.IVertex;
import gpl.vertex.Vertex;

public class NumberTest extends AlgorithmTest {

	public static void test() {
		IGraph g = new Graph();

		IVertex pre = null;
		for (int i = 0; i < 10; i++) {
			IVertex v = new Vertex("v" + i);
			g.addVertex(v);
			if (pre != null) {
				addEdge(g, pre, v);
			}
			pre = v;
		}

		GraphSearch search = new GraphSearch(g);
		search.runNumberAlgorithm();
	}
}
/*% } %*/