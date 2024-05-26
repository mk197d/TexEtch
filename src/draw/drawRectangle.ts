export function drawRectangle(data: any, index: number): void {
                                                        //                                                                                     
    const limit = data['limit'];                        //  ╔═══════════════════════════════════════════════════════════════════════════╗      
                                                        //  ║       ¦                 │                                Drawing Space    ║      
    let upperLeft_x = data['fig'][index].upperLeft_x;   //  ║       ¦                 │                                                 ║      
    let upperLeft_y = data['fig'][index].upperLeft_y;   //  ║       ¦                 │                                                 ║      
    let height = data['fig'][index].height;             //  ║-------¦-------------------------------------------------------------------║      
    let width = data['fig'][index].width;               //  ║       ¦                 │                                                 ║      
                                                        //  ║       ¦                 │                                   │             ║      
    let col_start = upperLeft_x - limit['x_min'];       //  ║       ¦                 │                                   │             ║      
    let col_end = col_start + width;                    //  ║       ¦                 │ upperLeft_y                       │             ║      
                                                        //  ║       ¦                 ▼                                   ▼             ║      
    let row_start = upperLeft_y - limit['y_min'] - 1;   //  ║───────¦───────────────> ╔═══════════════╗            limit['y_min']       ║      
    let row_end = row_start + height;                   //  ║       ¦                 ║       Figure  ║       (minimum y of any fig.)   ║      
                                                        //  ║       ¦   upperLeft_x   ║               ║                                 ║      
                                                        //  ║       ¦                 ║               ║                                 ║      
                                                        //  ║       ¦                 ║               ║                                 ║      
                                                        //  ║       ¦                 ║               ║                                 ║      
                                                        //  ║       ¦                 ║               ║                                 ║      
                                                        //  ║       ¦                 ╚═══════════════╝                                 ║      
                                                        //  ║       ¦                                                                   ║      
                                                        //  ║       ¦                      limit['x_min']                               ║      
                                                        //  ║       ¦  ────────>(minimum x coordinate of any figure)                    ║      
                                                        //  ║       ¦                                                                   ║      
                                                        //  ╚═══════════════════════════════════════════════════════════════════════════╝      

    // Placing the corners of rectangle
    data['charMat'][row_start][col_start] = '╔';
    data['charMat'][row_end][col_end] = '╝';
    data['charMat'][row_start][col_end] = '╗';
    data['charMat'][row_end][col_start] = '╚';

    // Placing the side walls
    for(let i = row_start + 1; i < row_end; i++) {
        data['charMat'][i][col_start] = '║';
        data['charMat'][i][col_end] = '║';
    }
    
    // Placing the bottom and top wall
    for(let i = col_start + 1; i < col_end; i++) {
        data['charMat'][row_start][i] = '═';
        data['charMat'][row_end][i] = '═';    
    }
}