import { Text } from "./Text";
import { Line } from "./Line";

export interface Figure {
    type: string;
    id: string;
    
    text: Text;
    line?: Line;
    // connector?: Connector;
    
    upperLeft_x: number;
    upperLeft_y: number;
    width: number;
    height: number;

    origux: number;
    origuy: number;
    origWidth: number;
    origHeight: number;

    parent?: string;
    startSize?: number;
}