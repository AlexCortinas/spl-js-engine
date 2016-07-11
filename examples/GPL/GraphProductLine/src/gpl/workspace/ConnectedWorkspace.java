/*% if (feature.connected) { %*/
package gpl.workspace;

import gpl.vertex.IVertex;

public class ConnectedWorkspace implements IWorkspace {
	private int counter = 0;

	@Override
	public void initVertex(IVertex v) {
		v.setComponentNumber(-1);
	}

	@Override
	public void postVisitAction(IVertex v) {
		v.setComponentNumber(counter);
	}

	@Override
	public void nextRegionAction(IVertex v) {
		counter++;
	}
}
/*% } %*/