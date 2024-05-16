export function drawStraightLine(charArray: string[][], nodes: any, limit:any, index: number): void {
    let points = nodes['fig'][index].line.path;
    let hz_segs: [[number, number], [number, number]][] = [];
    let vc_segs: [[number, number], [number, number]][] = [];

    for(let i = 0; i < points.length; i++) {
        points[i][0] -= limit.x_min;
        points[i][1] -= limit.y_min;
    }

    let hz_char = "─";
    let vc_char = "│";

    if(nodes['fig'][index].line.dashPattern === "1 3") {
        hz_char = "…";
        vc_char = "┊";
    } else if(nodes['fig'][index].line.dashed) {
        hz_char = "┈";
        vc_char = ":";
    }

    for(let i = 0; i < points.length - 1; i++) {
        if(points[i][0] === points[i + 1][0]) {
            vc_segs.push([points[i], points[i + 1]]);
        } else if(points[i][1] === points[i + 1][1]) {
            hz_segs.push([points[i], points[i + 1]]);
        }
    }

    hz_segs.forEach((segment: any) => {
        let py = segment[0][1];
        let sx = Math.min(segment[0][0], segment[1][0]);
        let ex = Math.max(segment[0][0], segment[1][0]);

        for(let i = sx; i < ex; i++) {
            charArray[py][i] = hz_char;
        }
    });

    vc_segs.forEach((segment: any) => {
        let px = segment[0][0];
        let sy = Math.min(segment[0][1], segment[1][1]);
        let ey = Math.max(segment[0][1], segment[1][1]);

        for(let i = sy; i < ey; i++) {
            charArray[i][px] = vc_char;
        }
    });
}