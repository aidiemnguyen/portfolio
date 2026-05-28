export type RoadStopId = "about" | "projects" | "stack" | "contact";

export type RoadStopNavKey = "about" | "projects" | "stack" | "contact";

export type RoadStopLane = "above" | "below";

export interface RoadStop {
  id: RoadStopId;
  /** Position on the map SVG (viewBox 0 0 1200 240) */
  x: number;
  y: number;
  lane: RoadStopLane;
  navKey: RoadStopNavKey;
}

/** Stops along the road — left (start) to right (contact). */
export const ROAD_STOPS: RoadStop[] = [
  { id: "about", x: 80, y: 102, lane: "above", navKey: "about" },
  { id: "projects", x: 300, y: 78, lane: "below", navKey: "projects" },
  { id: "stack", x: 720, y: 142, lane: "below", navKey: "stack" },
  { id: "contact", x: 1140, y: 114, lane: "above", navKey: "contact" },
];

export const ROAD_VIEWBOX = { width: 1200, height: 240 } as const;

/** Smooth horizontal wave — tangents aligned at each join (no sharp V). */
export const ROAD_PATH_D =
  "M 12 114 C 148 114, 168 78, 300 78 C 460 78, 480 142, 720 142 C 960 142, 980 114, 1152 114";
