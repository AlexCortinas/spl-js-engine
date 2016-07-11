package gpl.graph;

import gpl.vertex.IVertex;
import gpl.vertex.Vertex;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Graph implements IGraph {
	private static Logger logger = Logger.getLogger(Graph.class.getName());

	private List<IVertex> vertices = new ArrayList<IVertex>();

	@Override
	public Collection<IVertex> getVertices() {
		return vertices;
	}
	
	/*% if (feature.stronglyConnected) { %*/
	@Override
	public void sortVertices(Comparator<IVertex> comparator) {
		vertices.sort(comparator);
	}
	/*% } %*/
	
	@Override
	public void addVertex(IVertex vertex) {
		vertices.add(vertex);
	}

	@Override
	public IVertex getVertex(String name) {
		return vertices.stream().filter(v -> name.equals(v.getName())).findFirst().get();
	}

	@Override
	public void addEdge(IVertex start, IVertex end
			/*% if (feature.weighted) { %*/, float weight/*% } %*/) {

		if (!vertices.contains(start) || !vertices.contains(end)) {
			logger.log(Level.WARNING, "One of the vertex does not exists in the graph");
			return;
		}

		addAnEdge(start, end/*% if (feature.weighted) { %*/,weight/*% } %*/);

		/*% if (feature.undirected) { %*/
		addAnEdge(end, start/*% if (feature.weighted) { %*/,weight/*% } %*/);
		/*% } %*/
	}
	
	private void addAnEdge(IVertex start, IVertex end
			/*% if (feature.weighted) { %*/, float weight/*% } %*/) {

		/*% if (feature.gNoEdges) { %*/
		start.addAdjacent(end/*% if (feature.weighted) { %*/,weight/*% } %*/);
		/*% } else { %*/
		start.addNeighbor(end/*% if (feature.weighted) { %*/,weight/*% } %*/);
		/*% } %*/
	}

	@Override
	public String toString() {
		StringBuffer str = new StringBuffer();

		vertices.stream()
				.forEach(v -> str.append(v.toString() + "\n"));

		return str.toString();
	}

	/*% if (feature.transpose) { %*/
	@Override
	public IGraph getTranspose() {
		IGraph newGraph = new Graph();
		
		vertices.forEach(v -> newGraph.addVertex(new Vertex(v.getName())));
		vertices.forEach(oldVertex -> {
			/*% if (feature.gNoEdges) { %*/
			oldVertex.getAdjacents().forEach(
					adjacent -> newGraph.addEdge(
									newGraph.getVertex(oldVertex.getName()),
									newGraph.getVertex(adjacent.getName())
							/*% if (feature.weighted) { %*/, oldVertex.getWeight(adjacent.getName())/*% } %*/));
			/*% } else if (feature.gnOnlyNeighbors) { %*/
			oldVertex.getNeighbors().forEach(
					neighbor -> newGraph.addEdge(
									newGraph.getVertex(oldVertex.getName()), 
									newGraph.getVertex(neighbor.getNeighbor().getName())
							/*% if (feature.weighted) { %*/, neighbor.getWeight()/*% } %*/));
			/*% } else if (feature.genEdges) { %*/
			oldVertex.getNeighbors().forEach(
					neighbor -> newGraph.addEdge(
									newGraph.getVertex(oldVertex.getName()), 
									newGraph.getVertex(neighbor.getNeighbor().getName())
							/*% if (feature.weighted) { %*/, neighbor.getEdge().getWeight()/*% } %*/));
			/*% } %*/
		});
		return newGraph;
	}
	/*% } %*/
	
	/*% if (feature.benchmark) { %*/
	private Reader inFile; // File handler for reading
	
	@Override
	public void runBenchmark(String fileName) {
		try {
			inFile = new FileReader(fileName);
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Your file " + fileName + " cannot be read", e);
		}
	}
	
	@Override
	public int readNumber() {
		try {
			int index = 0;
			char[] word = new char[80];
			int ch = 0;

			ch = inFile.read();
			while (ch == 32) {
				ch = inFile.read(); // skips extra whitespaces
			}

			while (ch != -1 && ch != 32 && ch != 10) { // while it is not EOF, WS, NL
				word[index++] = (char) ch;
				ch = inFile.read();
			}
			word[index] = 0;

			String theString = new String(word);

			theString = new String(theString.substring(0, index)).trim();
			return Integer.parseInt(theString, 10);
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Number cannot be read", e);
			return 0;
		}
	}

	@Override
	public void stopBenchmark() {
		try {
			inFile.close();
		} catch (IOException e) {
			logger.log(Level.WARNING, "Error closing file", e);
		}
	}
	/*% } %*/
}
