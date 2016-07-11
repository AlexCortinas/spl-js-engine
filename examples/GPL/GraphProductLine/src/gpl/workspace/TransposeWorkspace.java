/*% if (feature.stronglyConnected) { %*/
package gpl.workspace;

import gpl.vertex.IVertex;

public class TransposeWorkspace implements IWorkspace {
	private int counter = 0;
	
	@Override
	public void preVisitAction(IVertex v) {
		if (!v.isVisited()) {
			v.setStrongComponentNumber(counter);
		}
	}
	
	@Override
	public void nextRegionAction(IVertex v) {
		counter++;
	}

}
/*% } %*/