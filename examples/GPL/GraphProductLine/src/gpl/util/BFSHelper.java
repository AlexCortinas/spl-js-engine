/*% if (feature.bfs) { %*/
package gpl.util;

import gpl.vertex.IVertex;

import java.util.LinkedList;
import java.util.Queue;

public class BFSHelper {
	private static final Queue<IVertex> queue = new LinkedList<IVertex>();

	public static Queue<IVertex> getQueue() {
		return queue;
	}
}
/*% } %*/
