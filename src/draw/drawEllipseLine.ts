import { Point } from "../interfaces/Point";
import characters from "./characters";
import { drawLine } from "./drawLine";

export function drawEllipseLine(data: any, index: number): void {   
  
    const limit = data['limit'];                        //                                                                                     
                                                        //  ╔═══════════════════════════════════════════════════════════════════════════╗      
    let upperLeft_x = data['fig'][index].upperLeft_x;   //  ║       ¦                 │                                Drawing Space    ║      
    let upperLeft_y = data['fig'][index].upperLeft_y;   //  ║       ¦                 │                                                 ║      
                                                        //  ║       ¦                 │                                                 ║      
    let vertical_axis = data['fig'][index].height;      //  ║-------¦-------------------------------------------------------------------║      
    let height = vertical_axis - 1;                     //  ║       ¦                 │                                                 ║      
    let width = data['fig'][index].width;               //  ║       ¦                 │                                   │             ║      
                                                        //  ║       ¦                 │                                   │             ║      
    let col_start = upperLeft_x - limit['x_min'];       //  ║       ¦                 │ upperLeft_y                       │             ║      
    let col_end = col_start + width;                    //  ║       ¦                 ▼                                   ▼             ║      
                                                        //  ║───────¦───────────────> ╔═══════════════╗            limit['y_min]        ║      
    let row_start = upperLeft_y - limit['y_min'];       //  ║       ¦   upperLeft_x   ║       Figure  ║       (minimum y of any fig.)   ║      
    let row_end = row_start + height;                   //  ║       ¦                 ║               ║                                 ║         
                                                        //  ║       ¦                 ╚═══════════════╝                                 ║      
                                                        //  ║       ¦                                                                   ║      
                                                        //  ║       ¦                      limit['x_min]                                ║      
                                                        //  ║       ¦  ────────>(minimum x coordinate of any figure)                    ║      
                                                        //  ║       ¦                                                                   ║      
                                                        //  ╚═══════════════════════════════════════════════════════════════════════════╝     
                                                        
    let a = Math.round(width / 2);
    let b = Math.round(height / 2);     

    const shift_y = upperLeft_y + b;
    const shift_x = upperLeft_x + a;

    
    let ellipse_points: Point[] = [];
    let angle = 0;
    let curr_x = 0, curr_y = 0;
    for(; angle <= 360; angle += 15) {
        let angle_rad = angle * (Math.PI / 180);
        
        let this_x = Math.round(a * Math.cos(angle_rad)) + shift_x;
        let this_y = Math.round(b * Math.sin(angle_rad)) + shift_y;

        if(this_x !== curr_x || this_y !== curr_y) {
            ellipse_points.push({x: this_x, y: this_y});
            curr_x = this_x;
            curr_y = this_y;
        }
    }

    data['fig'][index].line.path = ellipse_points;
    drawLine(data, index);
}