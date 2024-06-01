export function drawLine(data: any, index: number): void {
    const limit = data['limit'];

    let points = data['fig'][index].line.path;
    let end_index = points.length - 1;

    let forward_segs: [[number, number], [number, number]][] = [];
    let backward_segs: [[number, number], [number, number]][] = [];

    let hz_segs: [[number, number], [number, number]][] = []; 
    let vc_segs: [[number, number], [number, number]][] = [];
                                                   
    let connectors: [string, [number, number]][] = []; 
    let orientation: string[] = [];            
                                               
    let startArrow = data['fig'][index].line.startArrow;  
    let endArrow = data['fig'][index].line.endArrow;
                                           
    for(let i = 0; i < points.length; i++) { 
        points[i][0] -= limit.x_min; 
        points[i][1] -= (limit.y_min + 1); 
    }                                                            

    let hz_char = "─";                                           
    let vc_char = "│";                                                                                                                                      

    let start_shift = false;
    let end_shift = false;
    if(startArrow === "classic") {
        start_shift = true;
    }
    if(endArrow === "classic") {
        end_shift = true;
    }

    // Adjusting the line characters according to the pattern
    if(data['fig'][index].line.dashPattern === "flexArrow") {                                                                                               
        hz_char = "═";                                                                                                                                     
        vc_char = "║";
    } else if(data['fig'][index].line.dashPattern === "1 3") {
        hz_char = "-";
        vc_char = "¦";
    } else if(data['fig'][index].line.dashed) {
        hz_char = "╍";
        vc_char = "┋";
    }


    for(let i = 0; i < end_index; i++) {
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

        } else if(points[i][0] < points[i + 1][0] && points[i][1] > points[i + 1][1]) {
            forward_segs.push([points[i], points[i + 1]]);
            orientation.push("FU");

        } else if(points[i][0] > points[i + 1][0] && points[i][1] < points[i + 1][1]) {
            forward_segs.push([points[i + 1], points[i]]);
            orientation.push("FD");

        } else if(points[i][0] < points[i + 1][0] && points[i][1] < points[i + 1][1]) {
            backward_segs.push([points[i], points[i + 1]]);
            orientation.push("BD");

        } else if(points[i][0] > points[i + 1][0] && points[i][1] > points[i + 1][1]) {
            backward_segs.push([points[i + 1], points[i]]);
            orientation.push("BU");

        }
    }

    // Placing the connectors at the points where line changes direction 
    // calculated from the orientation of initial and final segments
    for(let i = 0; i < orientation.length; i++) {
        switch(orientation[i]) {
            case "D":
                if(orientation[i + 1] === "L") {
                    connectors.push(["╯", points[i + 1]]);
                } else if(orientation[i + 1] === "R") {
                    connectors.push(["╰", points[i + 1]]);
                }
                break;

            case "U":
                if(orientation[i + 1] === "L") {
                    connectors.push(["╮", points[i + 1]]);
                } else if(orientation[i + 1] === "R") {
                    connectors.push(["╭", points[i + 1]]);
                }
                break;

            case "L":
                if(orientation[i + 1] === "D") {
                    connectors.push(["╭", points[i + 1]]);
                } else if(orientation[i + 1] === "U") {
                    connectors.push(["╰", points[i + 1]]);
                }
                break;
                
            case "R":
                if(orientation[i + 1] === "D") {
                    connectors.push(["╮", points[i + 1]]);
                } else if(orientation[i + 1] === "U") {
                    connectors.push(["╯", points[i + 1]]);
                }
                break;
                
            // case "FU":
            //     if(orientation[i + 1] === "BD") {
            //         connectors.push(["◠", points[i + 1]]);
            //     } else if(orientation[i + 1] === "BU") {
            //         connectors.push([")", points[i + 1]]);
            //     }
            //     break;

            // case "FD":
            //     if(orientation[i + 1] === "BD") {
            //         connectors.push(["(", points[i + 1]]);
            //     } else if(orientation[i + 1] === "BU") {
            //         connectors.push(["◡", points[i + 1]]);
            //     }
            //     break;
            
            // case "BD":
            //     if(orientation[i + 1] === "FD") {
            //         connectors.push([")", points[i + 1]]);
            //     } else if(orientation[i + 1] === "FU") {
            //         connectors.push(["◡", points[i + 1]]);
            //     }
            //     break;
            
            // case "BU":
            //     if(orientation[i + 1] === "FD") {
            //         connectors.push(["◠", points[i + 1]]);
            //     } else if(orientation[i + 1] === "FU") {
            //         connectors.push(["(", points[i + 1]]);
            //     }
            //     break;

            default:
                break;
        }
    }

    // Placing the horizontal segments
    hz_segs.forEach((segment: any) => {
        let py = segment[0][1];
        let sx = Math.min(segment[0][0], segment[1][0]);
        let ex = Math.max(segment[0][0], segment[1][0]);

        for(let i = sx + 1; i < ex; i++) {
            data['charMat'][py][i] = hz_char;
        }
    });

    // Placing the vertical segments
    vc_segs.forEach((segment: any) => {
        let px = segment[0][0];
        let sy = Math.min(segment[0][1], segment[1][1]);
        let ey = Math.max(segment[0][1], segment[1][1]);

        for(let i = sy + 1; i < ey; i++) {
            data['charMat'][i][px] = vc_char;
        }
    });

    //
    forward_segs.forEach((segment: any) => {
        let sx = Math.min(segment[0][0], segment[1][0]);
        let ex = Math.max(segment[0][0], segment[1][0]);
        let sy = Math.max(segment[0][1], segment[1][1]);
        let ey = Math.min(segment[0][1], segment[1][1]);

        let v_change = sy - ey + 1;
        let h_change = ex - sx + 1;
        
        let stride = -1;
        let curr_stride = -1;
        let leftover = -1;
        let total_pieces = -1;

        let curr_y = sy;
        let curr_x = sx;

        // ▏ ╱
        if(v_change >= h_change) {
            let num_vc_lines = v_change - h_change;
            stride = num_vc_lines / h_change;
            total_pieces = num_vc_lines + h_change - 1;

            let i = 0;
            let next_stride = stride;
            while(i < total_pieces) {
                curr_stride = Math.floor(next_stride);
                leftover = next_stride - curr_stride;
                next_stride = stride + leftover;

                for(let j = 0; j < curr_stride; j++) {
                    if(i < total_pieces) {
                        if(i !== 0) {
                            data['charMat'][curr_y][curr_x] = "▏";
                        }
                        curr_y -= 1;
                        // curr_x += 1;
                        i += 1;
                    }
                }
                if(i < total_pieces) {
                    if(i !== 0) {
                        data['charMat'][curr_y][curr_x] = "╱";
                    }
                    i += 1;
                    curr_y -= 1;
                    curr_x += 1;    
                }

            }
            
        } else {
            let num_hz_lines = h_change - v_change;
            stride = num_hz_lines / v_change;
            total_pieces = num_hz_lines + v_change - 1;

            let i = 0;
            let next_stride = stride;
            while(i < total_pieces) {
                curr_stride = Math.floor(next_stride);
                leftover = next_stride - curr_stride;
                next_stride = stride + leftover;

                for(let j = 0; j < curr_stride; j++) {
                    if(i < total_pieces) {
                        if(i !== 0) {
                            data['charMat'][curr_y][curr_x] = "_";
                        }
                        curr_x += 1;
                        i += 1;
                    }
                }
                if(i < total_pieces) {
                    if(i !== 0) {
                        data['charMat'][curr_y][curr_x] = "╱";
                    }
                    i += 1;
                    curr_y -= 1;
                    curr_x += 1;
                }
            }
            
        }

    });

    //
    backward_segs.forEach((segment: any) => {
        let sx = Math.min(segment[0][0], segment[1][0]);
        let ex = Math.max(segment[0][0], segment[1][0]);
        let sy = Math.min(segment[0][1], segment[1][1]);
        let ey = Math.max(segment[0][1], segment[1][1]);

        let v_change = ey - sy + 1;
        let h_change = ex - sx + 1;
        
        let stride = -1;
        let curr_stride = -1;
        let leftover = -1;
        let total_pieces = -1;

        let curr_x = ex;
        let curr_y = ey;

        // ╲ ▕
        if(v_change >= h_change) {
            let num_vc_lines = v_change - h_change;
            stride = num_vc_lines / h_change;
            total_pieces = num_vc_lines + h_change - 1;

            let i = 0;
            let next_stride = stride;
            while(i < total_pieces) {
                curr_stride = Math.floor(next_stride);
                leftover = next_stride - curr_stride;
                next_stride = stride + leftover;

                for(let j = 0; j < curr_stride; j++) {
                    if(i < total_pieces) {
                        if(i !== 0) {
                            data['charMat'][curr_y][curr_x] = "▕";
                        }
                        curr_y -= 1;
                        // curr_x -= 1;
                        i += 1;
                    }
                }
                if(i < total_pieces) {
                    if(i !== 0) {
                        data['charMat'][curr_y][curr_x] = "╲";
                    }
                    i += 1;
                    curr_y -= 1;
                    curr_x -= 1;
                }
            }
            
        } else {
            let num_hz_lines = h_change - v_change;
            stride = num_hz_lines / v_change;
            total_pieces = num_hz_lines + v_change - 1;

            let i = 0;
            let next_stride = stride;
            while(i < total_pieces) {
                curr_stride = Math.floor(next_stride);
                leftover = next_stride - curr_stride;
                next_stride = stride + leftover;

                for(let j = 0; j < curr_stride; j++) {
                    if(i < total_pieces) {
                        if(i !== 0) {
                            data['charMat'][curr_y][curr_x] = "_";
                        }
                        curr_x -= 1;
                        i += 1;
                    }
                }

                if(i < total_pieces) {
                    if(i !== 0) {
                        data['charMat'][curr_y][curr_x] = "╲";
                    }
                    i += 1;
                    curr_y -= 1;
                    curr_x -= 1;
                }

            }
            
        }

    });

    // Placing the connectors
    connectors.forEach((entry: any) => {
        data['charMat'][entry[1][1]][entry[1][0]] = entry[0];
    });

    for(let i = 0; i < points.length; i++) {
        let px = points[i][0];
        let py = points[i][1];
        // connector.connectChar = "+";
        if(data['charMat'][py][px] === " ") {
            data['charMat'][py][px] = "+";
        }
    }

    // Placing the endArrow
    if(endArrow === "classic") {
        let px = points[end_index][0];
        let py = points[end_index][1];

        switch(orientation[end_index - 1]) {
            case "D":
                data['charMat'][py][px] = "▼";
                break;

            case "U":
                data['charMat'][py][px] = "▲";
                break;

            case "L":
                data['charMat'][py][px] = "<";
                break;
            
            case "R":
                data['charMat'][py][px] = ">";
                break;

            default:
                break;
        }
    }

    // Placing the startArrow
    if(startArrow === "classic") {
        let px = points[0][0];
        let py = points[0][1];

        switch(orientation[0]) {    
            case "D":
                data['charMat'][py][px] = "▲";
                break;

            case "U":
                data['charMat'][py][px] = "▼";
                break;

            case "L":
                data['charMat'][py][px] = ">";
                break;
            
            case "R":
                data['charMat'][py][px] = "<";
                break;

            default:
                break;
        }
    }

    if(!start_shift && data['charMat'][points[0][1]][points[0][0]] === " ") {
        let px = points[0][0];
        let py = points[0][1];

        switch(orientation[0]) {    
            case ("D" || "U"):
                data['charMat'][py][px] = vc_char;
                break;

            case ("L" || "R"):
                data['charMat'][py][px] = hz_char;
                break;

            default:
                break;
        }
    }

    if(!end_shift && data['charMat'][points[end_index][1]][points[end_index][0]] === " ") {
        let px = points[end_index][0];
        let py = points[end_index][1];

        switch(orientation[end_index - 1]) {    
            case ("D" || "U"):
                data['charMat'][py][px] = vc_char;
                break;

            case ("L" || "R"):
                data['charMat'][py][px] = hz_char;
                break;

            default:
                break;
        }
    }
}