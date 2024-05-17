export function drawStraightLine(charArray: string[][], data: any, index: number): void {
    const limit = data['limit'];

    let points = data['fig'][index].line.path;
    let hz_segs: [[number, number], [number, number]][] = [];
    let vc_segs: [[number, number], [number, number]][] = [];

    let connectors: [string, [number, number]][] = [];
    let orientation: string[] = [];

    let startArrow = data['fig'][index].line.startArrow;
    let endArrow = data['fig'][index].line.endArrow;

    for(let i = 0; i < points.length; i++) {
        points[i][0] -= limit.x_min;
        points[i][1] -= limit.y_min;
    }

    let hz_char = "─";
    let vc_char = "│";

    if(data['fig'][index].line.dashPattern === "flexArrow") {
        hz_char = "═";
        vc_char = "║";
    } else if(data['fig'][index].line.dashPattern === "1 3") {
        hz_char = "-";
        vc_char = "┊";
    } else if(data['fig'][index].line.dashed) {
        hz_char = "┈";
        vc_char = ":";
    }

    for(let i = 0; i < points.length - 1; i++) {
        if(points[i][0] === points[i + 1][0]) {
            vc_segs.push([points[i], points[i + 1]]);

            if(points[i][1] > points[i + 1][1]) {
                orientation.push("U");
            } else {
                orientation.push("D");
            }
        } else if(points[i][1] === points[i + 1][1]) {
            hz_segs.push([points[i], points[i + 1]]);
            
            if(points[i][0] > points[i + 1][0]) {
                orientation.push("L");
            } else {
                orientation.push("R");
            }
        }
    }

    for(let i = 0; i < orientation.length; i++) {
        switch(orientation[i]) {
            case "D":
                if(orientation[i + 1] === "L") {
                    connectors.push(["┘", points[i + 1]]);
                } else if(orientation[i + 1] === "R") {
                    connectors.push(["└", points[i + 1]]);
                }
                break;

            case "U":
                if(orientation[i + 1] === "L") {
                    connectors.push(["┐", points[i + 1]]);
                } else if(orientation[i + 1] === "R") {
                    connectors.push(["┌", points[i + 1]]);
                }
                break;

            case "L":
                if(orientation[i + 1] === "D") {
                    connectors.push(["┌", points[i + 1]]);
                } else if(orientation[i + 1] === "U") {
                    connectors.push(["└", points[i + 1]]);
                }
                break;
                
            case "R":
                if(orientation[i + 1] === "D") {
                    connectors.push(["┐", points[i + 1]]);
                } else if(orientation[i + 1] === "U") {
                    connectors.push(["┘", points[i + 1]]);
                }
                break;
                
            default:
                break;
        }
    }

    hz_segs.forEach((segment: any) => {
        let py = segment[0][1];
        let sx = Math.min(segment[0][0], segment[1][0]);
        let ex = Math.max(segment[0][0], segment[1][0]);

        for(let i = sx + 1; i < ex; i++) {
            charArray[py][i] = hz_char;
        }
    });

    vc_segs.forEach((segment: any) => {
        let px = segment[0][0];
        let sy = Math.min(segment[0][1], segment[1][1]);
        let ey = Math.max(segment[0][1], segment[1][1]);

        for(let i = sy + 1; i < ey; i++) {
            charArray[i][px] = vc_char;
        }
    });

    connectors.forEach((entry: any) => {
        charArray[entry[1][1]][entry[1][0]] = entry[0];
    });


    if(endArrow === "classic") {
        let end_index = points.length - 1;
        let px = points[end_index][0];
        let py = points[end_index][1];

        switch(orientation[end_index - 1]) {
            case "D":
                charArray[py][px] = "▼";
                break;

            case "U":
                charArray[py][px] = "▲";
                break;

            case "L":
                charArray[py][px] = "<";
                break;
            
            case "R":
                charArray[py][px] = ">";
                break;

            default:
                break;
        }
    }

    if(startArrow === "classic") {
        let px = points[0][0];
        let py = points[0][1];

        switch(orientation[0]) {    
            case "D":
                charArray[py][px] = "▲";
                break;

            case "U":
                charArray[py][px] = "▼";
                break;

            case "L":
                charArray[py][px] = ">";
                break;
            
            case "R":
                charArray[py][px] = "<";
                break;

            default:
                break;
        }
    }
}