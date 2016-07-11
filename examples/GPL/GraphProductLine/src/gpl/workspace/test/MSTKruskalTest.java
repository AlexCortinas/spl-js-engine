/*% if (feature.mstKruskal) { %*/
package gpl.workspace.test;

import gpl.graph.Graph;
import gpl.graph.GraphSearch;
import gpl.graph.IGraph;
import gpl.vertex.IVertex;
import gpl.vertex.Vertex;

public class MSTKruskalTest {

	public static void test() {
		test1();
		test2();
		test3();
		test4();
	}

	private static void test4() {
		IGraph graph = new Graph();
		IVertex a, b, c, f;
		a = new Vertex("a");
		b = new Vertex("b");
		c = new Vertex("c");
		f = new Vertex("f");

		graph.addVertex(a);
		graph.addVertex(b);
		graph.addVertex(c);
		graph.addVertex(f);

		graph.addEdge(a, b, 4);
		graph.addEdge(a, f, 2);
		graph.addEdge(b, f, 5);
		graph.addEdge(c, b, 6);
		graph.addEdge(f, c, 1);

		GraphSearch.instance(graph).runMstKruskalAlgorithm();
	}

	private static void test3() {
		IGraph graph = new Graph();

		IVertex a, b, c, d, e, f, g;
		a = new Vertex("A");
		b = new Vertex("B");
		c = new Vertex("C");
		d = new Vertex("D");
		e = new Vertex("E");
		f = new Vertex("F");
		g = new Vertex("G");

		graph.addVertex(a);
		graph.addVertex(b);
		graph.addVertex(c);
		graph.addVertex(d);
		graph.addVertex(e);
		graph.addVertex(f);
		graph.addVertex(g);

		graph.addEdge(a, b, 7);
		graph.addEdge(a, d, 5);
		graph.addEdge(b, c, 8);
		graph.addEdge(b, d, 9);
		graph.addEdge(b, e, 7);
		graph.addEdge(c, e, 5);
		graph.addEdge(d, e, 15);
		graph.addEdge(d, f, 6);
		graph.addEdge(e, f, 8);
		graph.addEdge(e, g, 9);
		graph.addEdge(f, g, 11);

		GraphSearch.instance(graph).runMstKruskalAlgorithm();
	}

	private static void test1() {
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

		GraphSearch.instance(g).runMstKruskalAlgorithm();
	}

	private static void test2() {
		IGraph g = new Graph();
		IVertex v0 = new Vertex("v0");
		IVertex v1 = new Vertex("v1");
		IVertex v2 = new Vertex("v2");
		IVertex v3 = new Vertex("v3");
		IVertex v4 = new Vertex("v4");
		IVertex v5 = new Vertex("v5");
		IVertex v6 = new Vertex("v6");
		IVertex v7 = new Vertex("v7");

		g.addVertex(v0);
		g.addVertex(v1);
		g.addVertex(v2);
		g.addVertex(v3);
		g.addVertex(v4);
		g.addVertex(v5);
		g.addVertex(v6);
		g.addVertex(v7);

		g.addEdge(v0, v2, 0.26f);
		g.addEdge(v0, v4, 0.38f);
		g.addEdge(v1, v3, 0.29f);
		g.addEdge(v2, v7, 0.34f);
		g.addEdge(v3, v6, 0.52f);
		g.addEdge(v4, v5, 0.35f);
		g.addEdge(v4, v7, 0.37f);
		g.addEdge(v5, v1, 0.32f);
		g.addEdge(v5, v4, 0.35f);
		g.addEdge(v5, v7, 0.28f);
		g.addEdge(v6, v0, 0.58f);
		g.addEdge(v6, v2, 0.40f);
		g.addEdge(v6, v4, 0.93f);
		g.addEdge(v7, v3, 0.39f);
		g.addEdge(v7, v5, 0.28f);

		GraphSearch.instance(g).runMstKruskalAlgorithm();
	}
}
/*% } %*/