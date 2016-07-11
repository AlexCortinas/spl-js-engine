package gpl.graph;

import java.util.Collection;
import java.util.Comparator;

import gpl.vertex.IVertex;

public interface IGraph {
	
	Collection<IVertex> getVertices();

	/*% if (feature.stronglyConnected) { %*/
	void sortVertices(Comparator<IVertex> comparator);
	/*% } %*/
	void addVertex(IVertex vertex);
	IVertex getVertex(String name);

	void addEdge(IVertex start, IVertex end
			/*% if (feature.weighted) { %*/, float weight/*% } %*/);
	

	/*% if (feature.transpose) { %*/
	IGraph getTranspose();
	/*% } %*/
	
	/*% if (feature.benchmark) { %*/
	void runBenchmark(String string);
	int readNumber();
	void stopBenchmark();
	/*% } %*/
}
