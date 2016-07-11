package gpl.workspace;

import gpl.vertex.IVertex;

public interface IWorkspace {
	default void initVertex(IVertex v) {

	}

	default void preVisitAction(IVertex v) {

	}

	default void postVisitAction(IVertex v) {

	}

	default void nextRegionAction(IVertex v) {

	}

	default void checkNeighborAction(IVertex vsource, IVertex vtarget) {

	}
}
