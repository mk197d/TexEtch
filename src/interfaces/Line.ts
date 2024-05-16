export interface Line {
    startArrow?: boolean;
    endArrow?: boolean;
    dashed?: boolean;
    dashPattern?: string;

    path?: [number, number][];
}