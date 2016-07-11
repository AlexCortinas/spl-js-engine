/*% if (feature.gnOnlyNeighbors || feature.genEdges) { %*/
package gpl.neighbor;

/*% if (feature.genEdges) { %*/
import gpl.edge.Edge;
import gpl.edge.IEdge;
/*% } %*/
import gpl.vertex.IVertex;

public class Neighbor implements INeighbor {
	private IVertex end;
	
	/*% if (feature.genEdges) { %*/
	private IEdge edge;
	/*% } else if (feature.weighted) { %*/
	private float weight;
	/*% } %*/
	

	public Neighbor(IVertex start, IVertex end
			/*% if (feature.weighted) { %*/, float weight/*% } %*/) {
		this.end = end;
		
		/*% if (feature.genEdges) { %*/
		this.edge = new Edge(start, end
				/*% if (feature.weighted) { %*/, weight/*% } %*/);
		/*% } else if (feature.weighted) { %*/
		this.weight = weight;
		/*% } %*/
	}

	@Override
	public IVertex getNeighbor() {
		return end;
	}

	/*% if (feature.genEdges) { %*/
	@Override
	public IEdge getEdge() {
		return edge;
	}
	/*% } else if (feature.weighted) { %*/
	@Override
	public float getWeight() {
		return weight;
	}
	/*% } %*/
}
/*% } %*/