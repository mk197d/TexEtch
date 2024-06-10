import { Point } from "./Point";

export interface Line {
    startArrow?: boolean;
    endArrow?: boolean;
    dashed?: boolean;
    dashPattern?: string;

    exitX?: string;
    exitY?: string;
    entryX?: string;
    entryY?: string;

    source?: string;
    target?: string;

    path?: Point[];
}