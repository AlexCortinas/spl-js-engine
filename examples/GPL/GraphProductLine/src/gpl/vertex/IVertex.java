package gpl.vertex;

import java.util.Collection;

import gpl.workspace.IWorkspace;

public interface IVertex {
	String getName();

	/*% if (feature.gNoEdges) { %*/
	void addAdjacent(IVertex vertex
			/*% if (feature.weighted) { %*/, float weight/*% } %*/);

	Collection<IVertex> getAdjacents();
		/*% if (feature.weighted) { %*/
	float getWeight(String adjacent);
		/*% } %*/
	/*% } else { %*/
	void addNeighbor(IVertex vertex
			/*% if (feature.weighted) { %*/, float weight/*% } %*/);
	
	Collection<gpl.neighbor.INeighbor> getNeighbors();
	/*% } %*/
	
	/*% if (feature.search) { %*/
	void initToSearch(IWorkspace workspace);
	void search(IWorkspace workspace);
	boolean isVisited();
	void setVisited(boolean visited);
	/*% } %*/
	
	/*% if (feature.number) { %*/
	void setVertexNumber(int number);
	/*% } %*/
	
	/*% if (feature.connected) { %*/
	void setComponentNumber(int number);
	/*% } %*/

	/*% if (feature.stronglyConnected) { %*/
	int getStrongComponentNumber();
	void setStrongComponentNumber(int number);
	int getFinishTime();
	void setFinishTime(int number);
	/*% } %*/
	
	/*% if (feature.cycle) { %*/
	int getVertexCycle();
	void setVertexCycle(int cycle);
	int getVertexColor();
	void setVertexColor(int color);
	/*% } %*/

	/*% if (feature.mstPrim) { %*/
	String getPred();
	void setPred(String pred);
	float getKey();
	void setKey(float key);
	/*% } %*/
	
	/*% if (feature.shortest) { %*/
	String getShortestPredecessor();
	void setShortestPredecessor(String predecessor);
	float getShortestDistance();
	void setShortestDistance(float distance);
	/*% } %*/
}
