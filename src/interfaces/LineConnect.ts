import { Point } from "./Point";

export interface LineConnect {
    line_in: Point;
    line_out: Point;
    connectChar?: string;
}