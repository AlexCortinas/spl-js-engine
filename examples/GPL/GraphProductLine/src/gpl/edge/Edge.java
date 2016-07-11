/*% if (feature.genEdges || feature.mst || feature.shortest) { %*/
package gpl.edge;

import gpl.vertex.IVertex;

public class Edge implements IEdge {
	private IVertex start;
	private IVertex end;

	/*% if (feature.weighted) { %*/
	private float weight;
	/*% } %*/

	public Edge(IVertex start, IVertex end
			/*% if (feature.weighted) { %*/, float weight/*% } %*/) {
		this.start = start;
		this.end = end;
		/*% if (feature.weighted) { %*/
		this.weight = weight;
		/*% } %*/
	}

	@Override
	public IVertex getStart() {
		return start;
	}

	@Override
	public IVertex getEnd() {
		return end;
	}

	/*% if (feature.weighted) { %*/
	@Override
	public float getWeight() {
		return weight;
	}
	/*% } %*/

	@Override
	public String toString() {
		return "Edge (" + start.getName() + ", " + end.getName()
				/*% if (feature.weighted) { %*/ + " [" + weight + "]"/*% } %*/+ ")";
	}

}
/*% } %*/