/*% if (feature.number) { %*/
package gpl.workspace;

import gpl.vertex.IVertex;

public class NumberWorkspace implements IWorkspace {
	int vertexCounter = 0;

	@Override
	public void preVisitAction(IVertex v) {

		if (!v.isVisited()) {
			v.setVertexNumber(vertexCounter++);
		}
	}
}
/*% } %*/