/*% if (feature.cycle) { %*/
package gpl.workspace;

import gpl.vertex.IVertex;

public class CycleWorkspace implements IWorkspace {
	private boolean cyclic = false;

	private int counter = 0;

	public static final int WHITE = 0;
	public static final int GRAY = 1;
	public static final int BLACK = 2;

	@Override
	public void initVertex(IVertex v) {
		v.setVertexCycle(Integer.MAX_VALUE);
		v.setVertexColor(WHITE);
	}

	@Override
	public void preVisitAction(IVertex v) {
		if (!v.isVisited()) {
			v.setVertexCycle(counter++);
			v.setVertexColor(GRAY);
		}
	}

	@Override
	public void postVisitAction(IVertex v) {
		v.setVertexColor(BLACK);
		counter--;
	}

	@Override
	public void checkNeighborAction(IVertex vsource, IVertex vtarget) {
		if (vsource.getVertexColor() == GRAY && vtarget.getVertexColor() == GRAY) {
			/*% if (feature.undirected) { %*/
			if (vsource.getVertexCycle() != vtarget.getVertexCycle() + 1)
			/*% } %*/
			cyclic = true;

		}
	}

	public boolean isCyclic() {
		return cyclic;
	}
}
/*% } %*/