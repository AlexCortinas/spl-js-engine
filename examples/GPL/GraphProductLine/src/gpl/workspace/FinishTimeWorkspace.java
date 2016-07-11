/*% if (feature.stronglyConnected) { %*/
package gpl.workspace;

import gpl.vertex.IVertex;

public class FinishTimeWorkspace implements IWorkspace {
	private int finishCounter = 1;

	@Override
	public void preVisitAction(IVertex v) {
		if (!v.isVisited()) {
			finishCounter++;
		}
	}

	@Override
	public void postVisitAction(IVertex v) {
		v.setFinishTime(finishCounter++);
	}
}
/*% } %*/