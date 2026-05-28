import type { RoadStopId } from "@/data/road-stops";

export type FullPageSectionId = RoadStopId | "road";

export const FULLPAGE_SCROLL_ROOT_ID = "fullpage-scroll";

const SECTION_IDS: FullPageSectionId[] = [
  "road",
  "about",
  "projects",
  "stack",
  "contact",
];

export function isFullPageSectionId(id: string): id is FullPageSectionId {
  return (SECTION_IDS as string[]).includes(id);
}

export function getFullPageScrollRoot(): HTMLElement | null {
  return document.getElementById(FULLPAGE_SCROLL_ROOT_ID);
}

export function scrollToSection(
  id: FullPageSectionId,
  behavior: ScrollBehavior = "smooth",
) {
  const root = getFullPageScrollRoot();
  const target = document.getElementById(id);
  if (!root || !target) return;

  root.scrollTo({
    top: target.offsetTop,
    behavior,
  });
}

export function scrollToRoad(behavior: ScrollBehavior = "smooth") {
  scrollToSection("road", behavior);
}
