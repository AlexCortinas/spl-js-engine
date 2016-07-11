package gpl.vertex;

/*% if (!feature.gNoEdges) { %*/
import gpl.neighbor.INeighbor;
import gpl.neighbor.Neighbor;
/*% } %*/
import gpl.workspace.IWorkspace;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Vertex implements IVertex {
	private String name;

	/*% if (feature.gNoEdges) { %*/
	private final List<IVertex> adjacents = new ArrayList<IVertex>();
		/*% if (feature.weighted) { %*/
	private final Map<String, Float> weights = new HashMap<String, Float>();
		/*% } %*/
	/*% } else { %*/
	private final List<INeighbor> neighbors = new ArrayList<INeighbor>();
	/*% } %*/
	
	public Vertex(String name) {
		this.name = name;
	}

	@Override
	public String getName() {
		return name;
	}

	/*% if (feature.gNoEdges) { %*/
	@Override
	public void addAdjacent(IVertex vertex
			/*% if (feature.weighted) { %*/, float weight/*% } %*/) {
		adjacents.add(vertex);
		
		/*% if (feature.weighted) { %*/
		weights.put(vertex.getName(), weight);
		/*% } %*/
	}
	
	@Override
	public Collection<IVertex> getAdjacents() {
		return adjacents;
	}
	
		/*% if (feature.weighted) { %*/
	@Override
	public float getWeight(String adjacent) {
		return weights.get(adjacent);
	}
		/*% } %*/
	
	/*% } else { %*/
	
	@Override
	public void addNeighbor(IVertex vertex
			/*% if (feature.weighted) { %*/, float weight/*% } %*/) {
		
		neighbors.add(new Neighbor(this, vertex
				/*% if (feature.weighted) { %*/, weight/*% } %*/));
	}
	
	@Override
	public Collection<INeighbor> getNeighbors() {
		return neighbors;
	}
	
	/*% } %*/


	@Override
	public String toString() {
		StringBuffer str = new StringBuffer(name);
		
		/*% if (feature.number) { %*/str.append(" | #").append(number);/*% } %*/
		/*% if (feature.connected) { %*/str.append(" | group ").append(componentNumber);/*% } %*/
		/*% if (feature.stronglyConnected) { %*/str.append(" | strongGroup ").append(strongComponentNumber).append(" finishTime ").append(finishTime);/*% } %*/
		/*% if (feature.cycle) { %*/str.append(" | cycle ").append(vertexCycle);/*% } %*/
		/*% if (feature.mstPrim) { %*/str.append(" | pred ").append(pred).append(" key ").append(key);/*% } %*/
		/*% if (feature.shortest) { %*/str.append(" | shortest pred ").append(shortestPredecessor).append(" distance ").append(shortestDistance);/*% } %*/
		
		/*% if (feature.gNoEdges) { %*/
		str.append(" | adjacents:");
		adjacents.forEach(v -> {
			str.append(" ").append(v.getName())
				/*% if (feature.weighted) { %*/
					.append("[").append(weights.get(v.getName())).append("]")
				/*% } %*/
					.append(",");
		});
		/*% } else { %*/
		str.append(" | neighbors:");
		neighbors.forEach(n -> {
			str.append(" ").append(n.getNeighbor().getName())
			/*% if (feature.weighted) { %*/
				.append("[")
				/*% if (feature.gnOnlyNeighbors) { %*/
					.append(n.getWeight())
				/*% } else if (feature.genEdges) { %*/
					.append(n.getEdge().getWeight())
				/*% } %*/
				.append("]")
			/*% } %*/
			.append(",");
		});
		/*% } %*/
		str.deleteCharAt(str.length() - 1);
		return str.toString();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) return true;
		if (obj == null) return false;
		if (getClass() != obj.getClass()) return false;
		Vertex other = (Vertex) obj;
		if (name == null) {
			if (other.name != null) return false;
		} else if (!name.equals(other.name)) return false;
		return true;
	}
	
	/*% if (feature.search) { %*/
	private boolean visited; 
	
	@Override
	public void initToSearch(IWorkspace workspace) {
		this.visited = false;
		workspace.initVertex(this);
	}

	@Override
	public void search(IWorkspace workspace) {
		workspace.preVisitAction(this);

		if (visited) {
			return;
		}

		visited = true;
		/*% if (feature.dfs) { %*/
		nodeSearchDFS(workspace);
		/*% } else if (feature.bfs) { %*/
		nodeSearchBFS(workspace);
		/*% } %*/
	}

		/*% if (feature.bfs) { %*/
	private void nodeSearchBFS(IWorkspace workspace) {

		workspace.postVisitAction(this);
		
			/*% if (feature.gNoEdges) { %*/
		adjacents.stream()
			.filter(v -> !v.isVisited())
			.forEach(v -> gpl.util.BFSHelper.getQueue().add(v));
			/*% } else { %*/
		neighbors.stream()
			.map(INeighbor::getNeighbor)
			.filter(v -> !v.isVisited())
			.forEach(v -> gpl.util.BFSHelper.getQueue().add(v));
			/*% } %*/

		while (!gpl.util.BFSHelper.getQueue().isEmpty()) {
			gpl.util.BFSHelper.getQueue().poll().search(workspace);
		}
	}
		/*% } else if (feature.dfs) { %*/
	private void nodeSearchDFS(IWorkspace workspace) {
			/*% if (feature.gNoEdges) { %*/
		adjacents
			.forEach(v -> {
				workspace.checkNeighborAction(this, v);
				v.search(workspace);
			});
			/*% } else { %*/
		neighbors.stream()
			.map(INeighbor::getNeighbor)
			.forEach(v -> {
				workspace.checkNeighborAction(this, v);
				v.search(workspace);
			});
			/*% } %*/

		workspace.postVisitAction(this);
	}
		/*% } %*/

	@Override
	public boolean isVisited() {
		return visited;
	}

	@Override
	public void setVisited(boolean visited) {
		this.visited = visited;
	}
	/*% } %*/

	/*% if (feature.number) { %*/
	private int number;
	
	@Override
	public void setVertexNumber(int number) {
		this.number  = number;
	}
	/*% } %*/
	
	/*% if (feature.connected) { %*/
	private int componentNumber;
	
	@Override
	public void setComponentNumber(int number) {
		this.componentNumber  = number;
	}
	/*% } %*/

	/*% if (feature.stronglyConnected) { %*/
	private int strongComponentNumber;
	private int finishTime;
	
	@Override
	public int getStrongComponentNumber() {
		return strongComponentNumber;
	}

	@Override
	public void setStrongComponentNumber(int number) {
		this.strongComponentNumber = number;
	}

	@Override
	public int getFinishTime() {
		return finishTime;
	}

	@Override
	public void setFinishTime(int number) {
		this.finishTime = number;
	}
	/*% } %*/

	/*% if (feature.cycle) { %*/
	private int vertexCycle;
	private int vertexColor;

	@Override
	public int getVertexCycle() {
		return vertexCycle;
	}

	@Override
	public void setVertexCycle(int cycle) {
		this.vertexCycle = cycle;
	}

	@Override
	public int getVertexColor() {
		return vertexColor;
	}
	
	@Override
	public void setVertexColor(int color) {
		this.vertexColor = color;
	}
	/*% } %*/

	/*% if (feature.mstPrim) { %*/
	private String pred;
	private float key;
	
	@Override
	public String getPred() {
		return pred;
	}

	@Override
	public void setPred(String pred) {
		this.pred = pred;
	}

	@Override
	public float getKey() {
		return key;
	}

	@Override
	public void setKey(float key) {
		this.key = key;
	}
	/*% } %*/

	/*% if (feature.shortest) { %*/
	private String shortestPredecessor;
	private float shortestDistance;
	
	@Override
	public String getShortestPredecessor() {
		return shortestPredecessor;
	}

	@Override
	public void setShortestPredecessor(String predecessor) {
		this.shortestPredecessor = predecessor;		
	}

	@Override
	public float getShortestDistance() {
		return shortestDistance;
	}

	@Override
	public void setShortestDistance(float distance) {
		this.shortestDistance = distance;
	}
	/*% } %*/
}
