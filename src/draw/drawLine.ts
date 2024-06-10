import { LineConnect } from "../interfaces/LineConnect";
import { LineSegment } from "../interfaces/LineSegment";
import { Point } from "../interfaces/Point";
import characters from "./characters";
import { connectorMap } from "./connectorMap";

export function drawLine(data: any, index: number): void {
    const limit = data['limit'];

    let points: Point[] = data['fig'][index].line.path;
    let end_index = points.length - 1;

    let forward_segs: LineSegment[] = [];
    let backward_segs: LineSegment[] = [];

    let hz_segs: LineSegment[] = [];
    let vc_segs: LineSegment[] = [];                                                                                     
                                               
    let connectors: LineConnect[] = Array.from({ length: points.length }, () => ({
        line_in: {x: 0, y: 0},
        line_out: {x: 0, y: 0},
        connectChar: ''
    }));         
                                               
    let startArrow = data['fig'][index].line.startArrow;     //                                                                                             
    let endArrow = data['fig'][index].line.endArrow;         //                                                                                             
                                                             //          <─────────────╮ ──────>connector                                                   
    for(let i = 0; i < points.length; i++) {                 //                        │                                       ╭-----------------------     
        points[i].x -= limit.x_min;                          //          │             │             endArrow  <─────  ▲       ¦      dashed                
        points[i].y -= (limit.y_min + 1);                    //          │             │                               │       ¦                            
    }                                                        //          ▼             │                               │                                    
                                                             //      startArrow        │                               │       ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍   
    let start_shift = false;                                 //                        |                    ___________|                 dotted             
    let end_shift = false;                                   //                         \        __________/                                                
    if(startArrow === "classic") {                           //                          \       |                             <═════════════════════════>  
        start_shift = true;                                  //                           \     /   point on path                                           
    }                                                        //                            \   /           ▲                          flexArrow             
    if(endArrow === "classic") {                             //                             \ /            │                                                
        end_shift = true;                                    //                              ⎺ ────────────╯                                                
    }                                                        //                                                                                             

    let source = data['fig'][index].line.source;
    if(source !== '') {
        let exitX = data['fig'][index].line.exitX;
        let exitY = data['fig'][index].line.exitY;
        for(let i = 0; i < data['numFigures']; i++) {
            if(data['fig'][i].id === source) {
                let relX = data['fig'][i].upperLeft_x + Math.round(exitX * data['fig'][i].width) - limit.x_min;
                let relY = data['fig'][i].upperLeft_y + Math.round(exitY * data['fig'][i].height) - limit.y_min - 1;

                points[0].x = relX;
                points[0].y = relY;
                break;
            }
        }
    }

    let target = data['fig'][index].line.target;
    if(target !== '') {
        let entryX = data['fig'][index].line.entryX;
        let entryY = data['fig'][index].line.entryY;
        for(let i = 0; i < data['numFigures']; i++) {
            if(data['fig'][i].id === target) {
                let relX = data['fig'][i].upperLeft_x + Math.round(entryX * data['fig'][i].width) - limit.x_min;
                let relY = data['fig'][i].upperLeft_y + Math.round(entryY * data['fig'][i].height) - limit.y_min - 1;

                points[end_index].x = relX;
                points[end_index].y = relY;
                break;
            }
        }
    }

    // Selecting the line characters according to the pattern
    let hz_char = characters.LINE_N_H;                                           
    let vc_char = characters.LINE_N_V; 
    if(data['fig'][index].line.dashPattern === "flexArrow") {
        hz_char = characters.LINE_DOUBLE_H;
        vc_char = characters.LINE_DOUBLE_V;
    } else if(data['fig'][index].line.dashPattern === "1 3") {
        hz_char = characters.LINE_DOT_H;
        vc_char = characters.LINE_DOT_V;
    } else if(data['fig'][index].line.dashPattern === "dotted" && data['fig'][index].line.dashed) {
        hz_char = characters.LINE_DASH_H;
        vc_char = characters.LINE_DASH_V;
    }

    // Separating the segments 
    for(let i = 0; i < end_index; i++) {                                                                                                              
        if(points[i].x === points[i + 1].x) {                                                                                                             
            vc_segs.push({source: points[i], target: points[i + 1], source_index: i});   //                 ▄▄▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄▄▄                          
                                                                                         //                █  Types of Segments   █                       
            if(points[i].y > points[i + 1].y) {                                          //                 ▀▀▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀▀▀                          
                connectors[i].line_out.x = 0.5;                                          //                                                         _       
                connectors[i].line_out.y = 0;                                            //                                                        /        
                                                                                         //                                                       /         
                connectors[i + 1].line_in.x = 0.5;                                       //        Horizontal                                   _/          
                connectors[i + 1].line_in.y = 1;                                         //  ╭-----------------------/\                        /            
                                                                                         //  ¦                         \_                     /             
            } else {                                                                     //  ¦                           \_                 _/Forward       
                connectors[i].line_out.x = 0.5;                                          //  ¦                             \_              /  Slanting      
                connectors[i].line_out.y = 1;                                            //  ¦                               \_           /                 
                                                                                         //  ¦                      Backward   \_       _/                  
                connectors[i + 1].line_in.x = 0.5;                                       //  ¦ Vertical             Slanting     \_    /                    
                connectors[i + 1].line_in.y = 0;                                         //  ¦                                     \__/                     
                                                                                         //  ¦                                                             
            }                                                                                                                                             
                                                                                                                                                          
        } else if(points[i].y === points[i + 1].y) {                                                                                                      
            hz_segs.push({source: points[i], target: points[i + 1], source_index: i});
            
            if(points[i].x > points[i + 1].x) {
                connectors[i].line_out.x = 0;
                connectors[i].line_out.y = 0.5;

                connectors[i + 1].line_in.x = 1;
                connectors[i + 1].line_in.y = 0.5;
                
            } else {
                connectors[i].line_out.x = 1;
                connectors[i].line_out.y = 0.5;

                connectors[i + 1].line_in.x = 0;
                connectors[i + 1].line_in.y = 0.5;
                
            }


        } else if(points[i].x < points[i + 1].x && points[i].y > points[i + 1].y) {
            forward_segs.push({source:points[i], target: points[i + 1], source_index: i, direction: "U"});

        } else if(points[i].x > points[i + 1].x && points[i].y < points[i + 1].y) {
            forward_segs.push({source:points[i + 1], target: points[i], source_index: i, direction: "D"});

        } else if(points[i].x < points[i + 1].x && points[i].y < points[i + 1].y) {
            backward_segs.push({source:points[i], target: points[i + 1], source_index: i, direction: "D"});

        } else if(points[i].x > points[i + 1].x && points[i].y > points[i + 1].y) {
            backward_segs.push({source:points[i + 1], target: points[i], source_index: i, direction: "U"});
        }
    }

    // Placing the horizontal segments
    hz_segs.forEach((segment: LineSegment) => {
        let py = segment.source.y;
        let sx = Math.min(segment.source.x, segment.target.x);
        let ex = Math.max(segment.source.x, segment.target.x);

        for(let i = sx + 1; i < ex; i++) {
            data['charMat'][py][i] = hz_char;
        }
    });

    // Placing the vertical segments
    vc_segs.forEach((segment: LineSegment) => {
        let px = segment.source.x;
        let sy = Math.min(segment.source.y, segment.target.y);
        let ey = Math.max(segment.source.y, segment.target.y);

        for(let i = sy + 1; i < ey; i++) {
            data['charMat'][i][px] = vc_char;
        }
    });

    // Placing the forward segments and setting the connecting points
    forward_segs.forEach((segment: LineSegment) => {
        let start_point = points[segment.source_index];
        let end_point = points[segment.source_index + 1];
        
        let sx = Math.min(segment.source.x, segment.target.x);
        let ex = Math.max(segment.source.x, segment.target.x);
        let sy = Math.max(segment.source.y, segment.target.y);
        let ey = Math.min(segment.source.y, segment.target.y);

        let v_change = sy - ey + 1;
        let h_change = ex - sx + 1;
        
        let stride = -1;
        let curr_stride = -1;
        let leftover = -1;
        let total_pieces = -1;

        let curr_y = sy;
        let curr_x = sx;

        // | /
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
                            data['charMat'][curr_y][curr_x] = characters.LEFT_BAR;
                            if(i === 1) {
                                if(segment.direction === "U") {
                                    if(curr_x === start_point.x) {
                                        connectors[segment.source_index].line_out.x = 0;
                                        connectors[segment.source_index].line_out.y = 0;
                                    } else {
                                        connectors[segment.source_index].line_out.x = 1;
                                        connectors[segment.source_index].line_out.y = 0;
                                    }
                                    
                                } else if(segment.direction === "D") {
                                    if(curr_x === end_point.x) {
                                        connectors[segment.source_index + 1].line_in.x = 0;
                                        connectors[segment.source_index + 1].line_in.y = 0;
                                    } else {
                                        connectors[segment.source_index + 1].line_in.x = 1;
                                        connectors[segment.source_index + 1].line_in.y = 0;
                                    }
                                }

                            } 
                            
                            if(i === total_pieces - 1) {
                                if(segment.direction === "U") {
                                    if(curr_x === end_point.x) {
                                        connectors[segment.source_index + 1].line_in.x = 0;
                                        connectors[segment.source_index + 1].line_in.y = 1;
                                    } else {

                                    }
                                    
                                } else if(segment.direction === "D") {
                                    if(curr_x === start_point.x) {
                                        connectors[segment.source_index].line_out.x = 0;
                                        connectors[segment.source_index].line_out.y = 1;
                                    } else {

                                    }
                                }
                            }
                        }
                        curr_y -= 1;
                        i += 1;
                    }
                }

                if(i < total_pieces) {
                    if(i !== 0) {
                        data['charMat'][curr_y][curr_x] = characters.BIG_F_SLASH;
                        if(i === 1) {
                            if(segment.direction === "U") {
                                if(curr_x === start_point.x) {
                                    connectors[segment.source_index].line_out.x =0;
                                    connectors[segment.source_index].line_out.y = 0;
                                } else {
                                    connectors[segment.source_index].line_out.x = 1;
                                    connectors[segment.source_index].line_out.y = 0;
                                }
                                
                            } else if(segment.direction === "D") {
                                if(curr_x === end_point.x) {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 0;
                                } else {
                                    connectors[segment.source_index + 1].line_in.x = 1;
                                    connectors[segment.source_index + 1].line_in.y = 0;
                                }
                            }

                        }
                        
                        if(i === total_pieces - 1) {
                            if(segment.direction === "U") {
                                if(curr_x === end_point.x) {
                                    connectors[segment.source_index + 1].line_in.x = 1;
                                    connectors[segment.source_index + 1].line_in.y = 1;
                                } else {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 1;
                                }
                                
                            } else if(segment.direction === "D") {
                                if(curr_x === start_point.x) {
                                    connectors[segment.source_index].line_out.x = 1;
                                    connectors[segment.source_index].line_out.y = 1;
                                } else {
                                    connectors[segment.source_index].line_out.x = 0;
                                    connectors[segment.source_index].line_out.y = 1;
                                }
                            }
                        }
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
                            data['charMat'][curr_y][curr_x] = characters.N_HB_WALL;
                            if(i === 1) {
                                if(segment.direction === "U") {
                                    if(curr_y === start_point.y) {
                                        connectors[segment.source_index].line_out.x = 1;
                                        connectors[segment.source_index].line_out.y = 1;
                                    } else {
                                        connectors[segment.source_index].line_out.x = 1;
                                        connectors[segment.source_index].line_out.y = 0;
                                    }
                                    
                                } else if(segment.direction === "D"){
                                    if(curr_y === end_point.y) {
                                        connectors[segment.source_index + 1].line_in.x = 1;
                                        connectors[segment.source_index + 1].line_in.y = 1;
                                    } else {
                                        connectors[segment.source_index + 1].line_in.x = 1;
                                        connectors[segment.source_index + 1].line_in.y = 0;
                                    }
                                }

                            }
                            
                            if(i === total_pieces - 1) {
                                if(segment.direction === "U") {
                                    if(curr_y === end_point.y) {
                                        connectors[segment.source_index + 1].line_in.x = 0;
                                        connectors[segment.source_index + 1].line_in.y = 1;
                                    } else {
                                    }
                                    
                                } else if(segment.direction === "D") {
                                    if(curr_y === start_point.y) {
                                        connectors[segment.source_index].line_out.x = 0;
                                        connectors[segment.source_index].line_out.y = 1;
                                    } else {
                                    }
                                }
                            }
                        }
                        curr_x += 1;
                        i += 1;
                    }
                }
                if(i < total_pieces) {
                    if(i !== 0) {
                        data['charMat'][curr_y][curr_x] = characters.BIG_F_SLASH;
                        if(i === 1 && i) {
                            if(segment.direction === "U") {
                                if(curr_y === start_point.y) {
                                    connectors[segment.source_index].line_out.x = 1;
                                    connectors[segment.source_index].line_out.y = 1;
                                } else {
                                    connectors[segment.source_index].line_out.x = 1;
                                    connectors[segment.source_index].line_out.y = 0;
                                }
                                
                            } else if(segment.direction === "D") {
                                if(curr_y === end_point.y) {
                                    connectors[segment.source_index + 1].line_in.x = 1;
                                    connectors[segment.source_index + 1].line_in.y = 1;
                                } else {
                                    connectors[segment.source_index + 1].line_in.x = 1;
                                    connectors[segment.source_index + 1].line_in.y = 0;
                                }
                            }

                        }
                        
                        if(i === total_pieces - 1) {
                            if(segment.direction === "U") {
                                if(curr_y === end_point.y) {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 0;
                                } else {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 1;
                                }
                                
                            } else if(segment.direction === "D") {
                                if(curr_y === start_point.y) {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 0;
                                } else {
                                    connectors[segment.source_index].line_out.x = 0;
                                    connectors[segment.source_index].line_out.y = 1;
                                }
                            }
                        }
                    }
                    i += 1;
                    curr_y -= 1;
                    curr_x += 1;
                }
            }
            
        }

    });

    // Placing the backward segments and setting the connecting points
    backward_segs.forEach((segment: LineSegment) => {
        let start_point = points[segment.source_index];
        let end_point = points[segment.source_index + 1];

        let sx = Math.min(segment.source.x, segment.target.x);
        let ex = Math.max(segment.source.x, segment.target.x);
        let sy = Math.min(segment.source.y, segment.target.y);
        let ey = Math.max(segment.source.y, segment.target.y);

        let v_change = ey - sy + 1;
        let h_change = ex - sx + 1;
        
        let stride = -1;
        let curr_stride = -1;
        let leftover = -1;
        let total_pieces = -1;

        let curr_x = ex;
        let curr_y = ey;

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
                            data['charMat'][curr_y][curr_x] = characters.RIGHT_BAR;
                            if(i === 1) {
                                if(segment.direction === "U") {
                                    if(curr_x === start_point.x) {
                                        connectors[segment.source_index].line_out.x = 1;
                                        connectors[segment.source_index].line_out.y = 0;
                                    } else {
                                        connectors[segment.source_index].line_out.x = 0;
                                        connectors[segment.source_index].line_out.y = 0;
                                    }
                                    
                                } else if(segment.direction === "D") {
                                    if(curr_x === end_point.x) {
                                        connectors[segment.source_index + 1].line_in.x = 1;
                                        connectors[segment.source_index + 1].line_in.y = 0;
                                    } else {
                                        connectors[segment.source_index + 1].line_in.x = 0;
                                        connectors[segment.source_index + 1].line_in.y = 0;
                                    }
                                }
    
                            } 
                            
                            if(i === total_pieces - 1) {
                                if(segment.direction === "U") {
                                    if(curr_x === end_point.x) {
                                        connectors[segment.source_index + 1].line_in.x = 1;
                                        connectors[segment.source_index + 1].line_in.y = 1;
                                    } else {

                                    }
                                    
                                } else if(segment.direction === "D") {
                                    if(curr_x === start_point.x) {
                                        connectors[segment.source_index].line_out.x = 1;
                                        connectors[segment.source_index].line_out.y = 1;
                                    } else {

                                    }
                                }
                            }
                        }
                        curr_y -= 1;
                        i += 1;
                    }
                }
                if(i < total_pieces) {
                    if(i !== 0) {
                        data['charMat'][curr_y][curr_x] = characters.BIG_B_SLASH;
                        if(i === 1) {
                            if(segment.direction === "U") {
                                if(curr_x === start_point.x) {
                                    connectors[segment.source_index].line_out.x = 1;
                                    connectors[segment.source_index].line_out.y = 0;
                                } else {
                                    connectors[segment.source_index].line_out.x = 0;
                                    connectors[segment.source_index].line_out.y = 0;
                                }
                                
                            } else if(segment.direction === "D") {
                                if(curr_x === end_point.x) {
                                    connectors[segment.source_index + 1].line_in.x = 1;
                                    connectors[segment.source_index + 1].line_in.y = 0;
                                } else {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 0;
                                }
                            }

                        } 
                        
                        if(i === total_pieces - 1) {
                            if(segment.direction === "U") {
                                if(curr_x === end_point.x) {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 1;
                                } else {
                                    connectors[segment.source_index + 1].line_in.x = 1;
                                    connectors[segment.source_index + 1].line_in.y = 1;
                                }
                                
                            } else if(segment.direction === "D") {
                                if(curr_x === start_point.x) {
                                    connectors[segment.source_index].line_out.x = 0;
                                    connectors[segment.source_index].line_out.y = 1;
                                } else {
                                    connectors[segment.source_index].line_out.x = 1;
                                    connectors[segment.source_index].line_out.y = 1;
                                }
                            }
                        }
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
                            data['charMat'][curr_y][curr_x] = characters.N_HB_WALL;
                            if(i === 1) {
                                if(segment.direction === "U") {
                                    if(curr_y === start_point.y) {
                                        connectors[segment.source_index].line_out.x = 0;
                                        connectors[segment.source_index].line_out.y = 1;
                                    } else {
                                        connectors[segment.source_index].line_out.x = 0;
                                        connectors[segment.source_index].line_out.y = 0;
                                    }
                                    
                                } else if(segment.direction === "D") {
                                    if(curr_y === end_point.y) {
                                        connectors[segment.source_index + 1].line_in.x = 0;
                                        connectors[segment.source_index + 1].line_in.y = 1;
                                    } else {
                                        connectors[segment.source_index + 1].line_in.x = 0;
                                        connectors[segment.source_index + 1].line_in.y = 0;
                                    }
                                }
    
                            } 
                            
                            if(i === total_pieces - 1) {
                                if(segment.direction === "U") {
                                    if(curr_y === end_point.y) {
                                        connectors[segment.source_index + 1].line_in.x = 1;
                                        connectors[segment.source_index + 1].line_in.y = 1;
                                    } else {

                                    }
                                    
                                } else if(segment.direction === "D") {
                                    if(curr_y === start_point.y) {
                                        connectors[segment.source_index].line_out.x = 1;
                                        connectors[segment.source_index].line_out.y = 1;
                                    } else {

                                    }
                                }
                            }
                        }
                        curr_x -= 1;
                        i += 1;
                    }
                }

                if(i < total_pieces) {
                    if(i !== 0) {
                        data['charMat'][curr_y][curr_x] = characters.BIG_B_SLASH;
                        if(i === 1) {
                            if(segment.direction === "U") {
                                if(curr_y === start_point.y) {
                                    connectors[segment.source_index].line_out.x = 0;
                                    connectors[segment.source_index].line_out.y = 1;
                                } else {
                                    connectors[segment.source_index].line_out.x = 0;
                                    connectors[segment.source_index].line_out.y = 0;
                                }
                                
                            } else if(segment.direction === "D") {
                                if(curr_y === end_point.y) {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 1;
                                } else {
                                    connectors[segment.source_index + 1].line_in.x = 0;
                                    connectors[segment.source_index + 1].line_in.y = 0;
                                }
                            }

                        } 
                        
                        if(i === total_pieces - 1) {
                            if(segment.direction === "U") {
                                if(curr_y === end_point.y) {
                                } else {
                                    connectors[segment.source_index + 1].line_in.x = 1;
                                    connectors[segment.source_index + 1].line_in.y = 1;
                                }
                                
                            } else if(segment.direction === "D") {
                                if(curr_y === start_point.y) {
                                    connectors[segment.source_index].line_out.x = 1;
                                    connectors[segment.source_index].line_out.y = 0;
                                } else {
                                    connectors[segment.source_index].line_out.x = 1;
                                    connectors[segment.source_index].line_out.y = 1;

                                }
                            }
                        }
                    }
                    i += 1;
                    curr_y -= 1;
                    curr_x -= 1;
                }

            }
            
        }

    });

    // Placing the connectors
    for(let i = 1; i < points.length - 1; i++) {
        let px = points[i].x;
        let py = points[i].y;

        let inx = connectors[i].line_in.x.toPrecision(1).toString();
        let iny = connectors[i].line_in.y.toPrecision(1).toString();
        let outx = connectors[i].line_out.x.toPrecision(1).toString();
        let outy = connectors[i].line_out.y.toPrecision(1).toString();

        let connectString = inx + characters.N_HB_WALL + iny + characters.N_HB_WALL + outx + characters.N_HB_WALL + outy;
        connectors[i].connectChar = connectorMap.get(connectString);

        if(connectors[i].connectChar) {
            data['charMat'][py][px] = connectors[i].connectChar;
        }
    }

    // Placing the endArrow
    if(endArrow === "classic") {
        let px = points[end_index].x;
        let py = points[end_index].y;

        const inPoint = connectors[end_index].line_in;
        const in_string = inPoint.x.toPrecision(1).toString() + characters.N_HB_WALL + inPoint.y.toPrecision(1).toString();
        switch(in_string.valueOf()) {
            case "0.5_0":
                data['charMat'][py][px] = characters.DOWN_ARROW;
                break;

            case "0.5_1":
                data['charMat'][py][px] = characters.UP_ARROW;
                break;

            case "1_0.5":
                data['charMat'][py][px] = characters.LEFT_ARROW;
                break;
            
            case "0_0.5":
                data['charMat'][py][px] = characters.RIGHT_ARROW;
                break;

            default:
                break;
        }
    }

    // Placing the startArrow
    if(startArrow === "classic") {
        let px = points[0].x;
        let py = points[0].y;

        const outPoint = connectors[0].line_out;
        const out_string = outPoint.x.toPrecision(1).toString() + characters.N_HB_WALL + outPoint.y.toPrecision(1).toString();
        switch(out_string.valueOf()) {
            case "0.5_0":
                data['charMat'][py][px] = characters.DOWN_ARROW;
                break;

            case "0.5_1":
                data['charMat'][py][px] = characters.UP_ARROW;
                break;

            case "1_0.5":
                data['charMat'][py][px] = characters.LEFT_ARROW;
                break;
            
            case "0_0.5":
                data['charMat'][py][px] = characters.RIGHT_ARROW;
                break;

            default:
                break;
        }
    }

    // Placing the start character
    if(!start_shift && data['charMat'][points[0].y][points[0].x] === " ") {
        let px = points[0].x;
        let py = points[0].y;

        const outPoint = connectors[0].line_out;
        const out_string = outPoint.x.toPrecision(1).toString() + characters.N_HB_WALL + outPoint.y.toPrecision(1).toString();
        switch(out_string.valueOf()) {
            case "0.5_0" || "0.5_1":
                data['charMat'][py][px] = vc_char;
                break;

            case "1_0.5" || "0_0.5":
                data['charMat'][py][px] = hz_char;
                break;

            case "0_0" || "1_1":
                data['charMat'][py][px] = characters.BIG_B_SLASH;
                break;
            
            case "1_0" || "0_1":
                data['charMat'][py][px] = characters.BIG_F_SLASH;
                break;

            default:
                break;
        }
    }

    // Placing the end character
    if(!end_shift && data['charMat'][points[end_index].y][points[end_index].x] === " ") {
        let px = points[end_index].x;
        let py = points[end_index].y;

        const inPoint = connectors[end_index].line_in;
        const in_string = inPoint.x.toPrecision(1).toString() + characters.N_HB_WALL + inPoint.y.toPrecision(1).toString();
        switch(in_string.valueOf()) {
            case "0.5_0" || "0.5_1":
                data['charMat'][py][px] = vc_char;
                break;

            case "1_0.5" || "0_0.5":
                data['charMat'][py][px] = hz_char;
                break;

            case "0_0" || "1_1":
                data['charMat'][py][px] = characters.BIG_B_SLASH;
                break;
            
            case "1_0" || "0_1":
                data['charMat'][py][px] = characters.BIG_F_SLASH;
                break;

            default:
                break;
        }
    }
}