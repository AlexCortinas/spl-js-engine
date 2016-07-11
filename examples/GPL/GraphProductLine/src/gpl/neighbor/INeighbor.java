/*% if (!feature.gNoEdges) { %*/
package gpl.neighbor;

/*% if (feature.genEdges) { %*/import gpl.edge.IEdge;/*% } %*/
import gpl.vertex.IVertex;

public interface INeighbor {
	IVertex getNeighbor();
	/*% if (feature.genEdges) { %*/
	IEdge getEdge();
	/*% } else if (feature.weighted) { %*/
	float getWeight();
	/*% } %*/
}
/*% } %*/