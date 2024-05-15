import { StyleObject } from "./StyleObject";

export interface Node {
    id: string;
    value: string;
    divisons: any[];
    style: StyleObject;
    upperLeft_x?: number;
    upperLeft_y?: number;
    width?: number;
    height?: number;
}