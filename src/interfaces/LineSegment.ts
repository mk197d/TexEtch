import { Point } from "./Point";

export interface LineSegment {
    source: Point;
    target: Point;
    source_index: number;
    direction?: String;
}