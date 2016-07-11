/*% if (feature.prog) { %*/
package gpl;

import gpl.graph.Graph;
import gpl.graph.GraphSearch;
import gpl.graph.IGraph;
import gpl.vertex.Vertex;

public class Main {
	private static Vertex vertices[];
	private static int startVertices[];
	private static int endVertices[];
	/*% if (feature.weighted){ %*/
	private static float weights[];
	/*% } %*/
	
	public static void main(String[] args) {
		if (args.length == 0) {
			test();
			return;
		}

		long beginning = System.currentTimeMillis();

		IGraph g = new Graph();

		g.runBenchmark(args[0]);

		int num_vertices = 0;
		int num_edges = 0;
		num_vertices = g.readNumber();
		num_edges = g.readNumber();
		g.readNumber();
		g.readNumber();
		g.readNumber();

		vertices = new Vertex[num_vertices];
		startVertices = new int[num_edges];
		endVertices = new int[num_edges];

		int i = 0;
		for (i = 0; i < num_vertices; i++) {
			vertices[i] = new Vertex("v" + i);
			g.addVertex(vertices[i]);
		}

		for (i = 0; i < num_edges; i++) {
			startVertices[i] = g.readNumber();
			endVertices[i] = g.readNumber();
		}

		/*% if (feature.weighted){ %*/
		weights = new float[num_edges];
		for (i = 0; i < num_edges; i++) {
			weights[i] = g.readNumber();
		}
		/*% } %*/

		g.stopBenchmark();

		for (i = 0; i < num_edges; i++) {
			g.addEdge(vertices[startVertices[i]], vertices[endVertices[i]]
			/*% if (feature.weighted) { %*/, weights[i]/*% } %*/);
		}
		
		GraphSearch gs = GraphSearch.instance(g
				/*% if (feature.mstPrim || feature.shortest) { %*/, g.getVertex(args[1])/*% } %*/);	
		GraphSearch.startProfile();
		gs.run();
		GraphSearch.stopProfile();
		long totalTime = System.currentTimeMillis() - beginning;
		GraphSearch.endProfile();
		System.out.println("Total Time: " + totalTime);
	}

	private static void test() {
		/*% if (feature.number) { %*/gpl.workspace.test.NumberTest.test();/*% } %*/
		/*% if (feature.connected) { %*/gpl.workspace.test.ConnectedTest.test();/*% } %*/
		/*% if (feature.stronglyConnected) { %*/gpl.workspace.test.StronglyConnectedTest.test();/*% } %*/
		/*% if (feature.cycle) { %*/gpl.workspace.test.CycleTest.test();/*% } %*/
		/*% if (feature.mstPrim) { %*/gpl.workspace.test.MSTPrimTest.test();/*% } %*/
		/*% if (feature.mstKruskal) { %*/gpl.workspace.test.MSTKruskalTest.test();/*% } %*/
		/*% if (feature.shortest) { %*/gpl.workspace.test.ShortestTest.test();/*% } %*/
	}
}
/*% } %*/