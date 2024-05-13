import { StyleObject } from "./StyleObject";

export interface Figure {
    id: string;
    value: string;
    style: StyleObject;
    upperLeft_x?: number;
    upperLeft_y?: number;
    width?: number;
    height?: number;
}