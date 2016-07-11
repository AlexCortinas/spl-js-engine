/*% if (feature.genEdges || feature.mst || feature.shortest) { %*/
package gpl.edge;

import gpl.vertex.IVertex;

public interface IEdge {

	IVertex getStart();
	IVertex getEnd();

	/*% if (feature.weighted) { %*/
	float getWeight();
	/*% } %*/
}
/*% } %*/