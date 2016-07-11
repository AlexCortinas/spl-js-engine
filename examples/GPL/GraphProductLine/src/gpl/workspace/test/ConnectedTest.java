/*% if (feature.connected) { %*/
package gpl.workspace.test;

import gpl.graph.Graph;
import gpl.graph.GraphSearch;
import gpl.graph.IGraph;
import gpl.vertex.IVertex;
import gpl.vertex.Vertex;

public class ConnectedTest extends AlgorithmTest {

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
		addEdge(g, v1, v2);
		addEdge(g, v3, v6);
		addEdge(g, v6, v4);

		GraphSearch.instance(g).runConnectedAlgorithm();
	}

}
/*% } %*/