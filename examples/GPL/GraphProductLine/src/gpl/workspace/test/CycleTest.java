/*% if (feature.cycle) { %*/
package gpl.workspace.test;

import gpl.graph.Graph;
import gpl.graph.GraphSearch;
import gpl.graph.IGraph;
import gpl.vertex.IVertex;
import gpl.vertex.Vertex;

public class CycleTest extends AlgorithmTest {

	public static void test() {
		IGraph g = new Graph();
		IVertex v1 = new Vertex("v1");
		IVertex v2 = new Vertex("v2");
		IVertex v3 = new Vertex("v3");
		g.addVertex(v1);
		g.addVertex(v2);
		g.addVertex(v3);
		addEdge(g, v1, v2);
		addEdge(g, v2, v3);
		GraphSearch.instance(g).runCycleAlgorithm();
		
		addEdge(g, v3, v1);
		GraphSearch.instance(g).runCycleAlgorithm();
	}
}
/*%  } %*/