import { Point } from "./Point";

export interface Line {
    startArrow?: boolean;
    endArrow?: boolean;
    dashed?: boolean;
    dashPattern?: string;
    curved?: number;

    exitX?: number;
    exitY?: number;
    entryX?: number;
    entryY?: number;

    source?: string;
    target?: string;

    path?: Point[];
    originalPath?: Point[];
}