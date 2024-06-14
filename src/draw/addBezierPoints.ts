import { Point } from "../interfaces/Point";

export function addBezierPoints(points: Point[]): Promise<Point[]> {
    return new Promise((resolve, reject) => {
        if (points.length < 3) {
            // Not enough points to form a Bezier curve
            return reject(new Error("At least 3 points are required to form a curve."));
        }

        let new_points: Point[] = [];

        let start_point = points[0];
        let control_point, end_point;
        // Iterate over the points to create Bezier points
        for (let i = 1; i < points.length - 1; i += 1) {
            control_point = points[i];
            end_point = {x: (points[i].x + points[i + 1].x) / 2, y: (points[i].y + points[i + 1].y) / 2};

            for (let t = 0; t <= 1; t += 0.25) {
                const ix = Math.pow(1 - t, 2) * start_point.x + 2 * (1 - t) * t * control_point.x + Math.pow(t, 2) * end_point.x;
                const iy = Math.pow(1 - t, 2) * start_point.y + 2 * (1 - t) * t * control_point.y + Math.pow(t, 2) * end_point.y;
                new_points.push({ x: Math.round(ix), y: Math.round(iy) });
            }

            start_point = end_point;
        }
        new_points.push(points[points.length - 1]);
        console.log(new_points);

        resolve(new_points);
    });
}
