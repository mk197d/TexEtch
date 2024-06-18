import { Point } from "../interfaces/Point";

export function addBezierPoints(points: Point[]): Point[] {
    let new_points: Point[] = [];

    let start_point = points[0];
    let control_point: Point, end_point: Point;
    let end_index = points.length - 1;
    // Iterate over the points to create Bezier points
    for (let i = 1; i < end_index; i += 1) {
        control_point = points[i];

        
        if(i === end_index - 1) {
            end_point = points[end_index];
        } else {
            let ex: number = (Number(points[i].x) + Number(points[i + 1].x)) / 2;
            let ey: number = (Number(points[i].y) + Number(points[i + 1].y)) / 2;
            end_point = {x: ex, y: ey};
        }

        let curr_x = 0, curr_y = 0;
        for (let t = 0; t < 1; t += 0.20) {
            const ix = Math.pow(1 - t, 2) * start_point.x + 2 * (1 - t) * t * control_point.x + Math.pow(t, 2) * end_point.x;
            const iy = Math.pow(1 - t, 2) * start_point.y + 2 * (1 - t) * t * control_point.y + Math.pow(t, 2) * end_point.y;

            let this_x = Math.round(ix / 5);
            let this_y = Math.round(iy / 10);

            if(curr_x !== this_x || curr_y !== this_y) {
                new_points.push({ x: ix, y: iy });
                curr_x = this_x;
                curr_y = this_y;
            }
            
        }
        // new_points.push(end_point);
        start_point = end_point;
    }
    new_points.push(points[end_index]);

    return new_points;
}
