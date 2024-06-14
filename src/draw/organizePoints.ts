import { Point } from "../interfaces/Point";

export function organizePoints(points: Point[]): Point[] {
    let temp_pair = points[1];
    for(let i = 1; i < points.length - 1; i++) {
        points[i] = points[i + 1];
    }
    points[points.length - 1] = temp_pair;

    return points;
}