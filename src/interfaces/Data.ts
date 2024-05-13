import { Boundary } from "./Boundary";
import { Figure } from "./Figure";

export interface Data {
    limit: Boundary;
    fig: Figure[];
    numFigures: number;
}