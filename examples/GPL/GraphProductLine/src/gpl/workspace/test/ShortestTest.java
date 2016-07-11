/*% if (feature.shortest) { %*/
package gpl.workspace.test;

import gpl.graph.Graph;
import gpl.graph.GraphSearch;
import gpl.graph.IGraph;
import gpl.vertex.IVertex;
import gpl.vertex.Vertex;

public class ShortestTest extends AlgorithmTest {

	public static void test() {
		IGraph g = new Graph();

		IVertex v1 = new Vertex("v1");
		IVertex v2 = new Vertex("v2");
		IVertex v3 = new Vertex("v3");
		IVertex v4 = new Vertex("v4");
		IVertex v5 = new Vertex("v5");
		IVertex v6 = new Vertex("v6");

		g.addVertex(v1);
		g.addVertex(v2);
		g.addVertex(v3);
		g.addVertex(v4);
		g.addVertex(v5);
		g.addVertex(v6);

		g.addEdge(v1, v2, 7);
		g.addEdge(v1, v3, 9);
		g.addEdge(v1, v4, 2);
		g.addEdge(v1, v5, 5);

		g.addEdge(v2, v6, 7);
		g.addEdge(v3, v6, 5);
		g.addEdge(v4, v6, 7);
		g.addEdge(v5, v6, 9);

		GraphSearch.instance(g).runShortestAlgorithm(v1);
	}
}
/*% } %*/