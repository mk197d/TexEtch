import { Text } from "./Text";
import { Line } from "./Line";
import { Connector } from "./Connector";

export interface Figure {
    type: string;
    id: string;
    
    text: Text;
    line?: Line;
    // connector?: Connector;
    
    upperLeft_x?: number;
    upperLeft_y?: number;
    width?: number;
    height?: number;
}