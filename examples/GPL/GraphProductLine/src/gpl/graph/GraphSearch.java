package gpl.graph;

import gpl.vertex.IVertex;
import gpl.workspace.IWorkspace;

public class GraphSearch {
	private IGraph graph;
	
	/*% if (feature.mstPrim || feature.shortest) { %*/
	private IVertex start;
	
	public static GraphSearch instance(IGraph graph, IVertex start) {
		return new GraphSearch(graph, start);
	}
	
	public GraphSearch(IGraph graph, IVertex start) {
		this.graph = graph;
		this.start = start;
	}
	/*% } %*/
	
	public static GraphSearch instance(IGraph graph) {
		return new GraphSearch(graph);
	}
	
	public GraphSearch(IGraph graph) {
		this.graph = graph;
	}
	
	/*% if (feature.search) { %*/
	private void search(IWorkspace workspace) {
		for (IVertex v : graph.getVertices()) {
			v.initToSearch(workspace);
		}

		for (IVertex v : graph.getVertices()) {
			if (!v.isVisited()) {
				workspace.nextRegionAction(v);
				v.search(workspace);
			}
		}
	}
	/*% } %*/
	
	/*% if (feature.prog) { %*/
	public void run() {
		/*% if (feature.number) { %*/runNumberAlgorithm();/*% } %*/
		/*% if (feature.connected) { %*/runConnectedAlgorithm();/*% } %*/
		/*% if (feature.stronglyConnected) { %*/runStronglyConnectedAlgorithm();/*% } %*/
		/*% if (feature.cycle) { %*/runCycleAlgorithm();/*% } %*/
		/*% if (feature.mstPrim) { %*/runMstPrimAlgorithm(start);/*% } %*/
		/*% if (feature.mstKruskal) { %*/runMstKruskalAlgorithm();/*% } %*/
		/*% if (feature.shortest) { %*/runShortestAlgorithm(start);/*% } %*/
	}
	/*% } %*/

	/*% if (feature.number) { %*/
	public void runNumberAlgorithm() {
		System.out.println("Number Algorithm");
		search(new gpl.workspace.NumberWorkspace());
		System.out.println(graph.toString());
	}
	/*% } %*/
	
	/*% if (feature.connected) { %*/
	public void runConnectedAlgorithm() {
		System.out.println("Connected Algorithm");
		search(new gpl.workspace.ConnectedWorkspace());
		System.out.println(graph.toString());
	}
	/*% } %*/

	/*% if (feature.stronglyConnected) { %*/
	public void runStronglyConnectedAlgorithm() {
		System.out.println("Strongly Connected Algorithm");
		
		search(new gpl.workspace.FinishTimeWorkspace());
		graph.sortVertices((o1, o2) -> {
			if (o1.getFinishTime() > o2.getFinishTime())
				return -1;
			if (o1.getFinishTime() == o2.getFinishTime())
				return 0;
			return 1;
		});

		System.out.println(graph.toString());
		this.graph = graph.getTranspose();
		search(new gpl.workspace.TransposeWorkspace());
		System.out.println(graph.toString());
	}
	/*% } %*/

	/*% if (feature.cycle) { %*/
	public void runCycleAlgorithm() {
		System.out.println("Cycle Algorithm");
		gpl.workspace.CycleWorkspace c = new gpl.workspace.CycleWorkspace();
		search(c);
		System.out.println("Cyclic graph: " + c.isCyclic());
		System.out.println(graph.toString());
	}
	/*% } %*/

	/*% if (feature.mstPrim) { %*/
	public void runMstPrimAlgorithm(IVertex primStart) {
		System.out.println("MST Prim Algorithm");
		gpl.util.MSTPrimHelper.prim(graph, primStart);
		System.out.println(graph.toString());
	}
	/*% } %*/

	/*% if (feature.mstKruskal) { %*/
	public void runMstKruskalAlgorithm() {
		System.out.println("MST Kruskal Algorithm");
		gpl.util.MSTKruskalHelper.kruskal(graph).forEach(System.out::println);
		System.out.println(graph.toString());
	}
	/*% } %*/
	
	/*% if (feature.shortest) { %*/
	public void runShortestAlgorithm(IVertex start) {
		System.out.println("MST Shortest Algorithm");
		gpl.util.ShortestHelper.shortest(graph, start);
		System.out.println(graph.toString());
	}
	/*% } %*/
	
	/*% if (feature.benchmark) { %*/
	private static long last = 0, current = 0, accum = 0;

	public static void startProfile() {
		accum = 0;
		current = System.currentTimeMillis();
		last = current;
	}

	public static void stopProfile() {
		current = System.currentTimeMillis();
		accum = accum + (current - last);
	}

	public static void resumeProfile() {
		current = System.currentTimeMillis();
		last = current;
	}

	public static void endProfile() {
		current = System.currentTimeMillis();
		accum = accum + (current - last);
		System.out.println("Time elapsed: " + accum + " milliseconds");
	}
	/*% } %*/
}
