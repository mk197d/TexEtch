import characters from "./characters";

export function drawEllipse(data: any, index: number): void {   
  
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
                                                        
                                                                                                                
    let num_main_blocks = -1;                                                //                                                                                                           
                                                                             //                                                                                                           
    let num_1x1 = 2 + height % 2;                                            //                                                                                                           
    if(height < 6) {                                                         //                ╭───── m : top block                                                                       
        num_1x1 = 0;                                                         //                │     m1: first layer                                                                      
        num_main_blocks = 0;                                                 //                ▼     m2: second layer                                                                     
    } else if(height === 6) {                                                //                                                                                                       
        num_main_blocks = 0;                                                 //         ▄▄▄▀▀▀▀▀▀▀▀▀▀▄▄▄                                                                                  
        num_1x1 = 2;                                                         //      ▄▀▀                ▀▀▄                                                                               
    } else if(height > 6) {                                                  //    ▄▀                      ▀▄    ▲                                                                        
        num_main_blocks = Math.floor((height - 6) / 2);                      //   █                          █   │                                                                        
    }                                                                        //  █          ELLIPSE           █  │ main_blocks                                                            
                                                                             //   █                          █   │                                                                        
    let len_m1, len_m2, len_m;                                               //    ▀▄                      ▄▀    ▼                                                                        
    len_m1 = 2;                                                              //      ▀▄▄                ▄▄▀  ▲                                                                            
    len_m2 = 2;                                                              //         ▀▀▀▄▄▄▄▄▄▄▄▄▄▀▀▀     │                                                                            
    len_m = width - 2 * (1 + num_main_blocks + num_1x1 + len_m1 + len_m2);   //                              │                                                                            
    if(len_m >= 6) {                                                         //                              ╰─── 1x1 blocks                                                              
        len_m2 = 3;                                                          //                                                                                                           
        len_m -= 2;                                                          //                                                                                                           
    }                                                                        //                                                                                                           

    let i: number;

    // Positioning of the blocks differ when the length of vertical axis is even and odd:
    // even vertical_axis
    if(vertical_axis % 2 === 0) {

        let left_curr_col = num_1x1 + num_main_blocks + 1 + col_start;
        let right_curr_col = col_end - (num_1x1 + num_main_blocks + len_m1);
        
        let upper_curr_row = -1, lower_curr_row = -1;
        upper_curr_row = row_start + 1;
        lower_curr_row = row_end - 2;
        
        // Placing the first layer: m1
        for(i = 0; i < len_m1; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = characters.TOP_BLOCK;
            data['charMat'][upper_curr_row][right_curr_col - i] = characters.TOP_BLOCK;
            data['charMat'][lower_curr_row][left_curr_col + i] = characters.BOTTOM_BLOCK;
            data['charMat'][lower_curr_row][right_curr_col - i] = characters.BOTTOM_BLOCK;
        }

        upper_curr_row -= 1;
        lower_curr_row += 1;
        left_curr_col += len_m1;
        right_curr_col -= len_m1;

        // Placing the second layer: m2
        for(i = 0; i < len_m2; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = characters.BOTTOM_BLOCK;
            data['charMat'][upper_curr_row][right_curr_col - i] = characters.BOTTOM_BLOCK;
            data['charMat'][lower_curr_row][left_curr_col + i] = characters.TOP_BLOCK;
            data['charMat'][lower_curr_row][right_curr_col - i] = characters.TOP_BLOCK;
        }

        left_curr_col += len_m2;

        // Placing the top layer: m
        for(i = 0; i < len_m; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = characters.TOP_BLOCK;
            data['charMat'][lower_curr_row][left_curr_col + i] = characters.BOTTOM_BLOCK;
        }

        left_curr_col = num_1x1 + num_main_blocks + col_start;
        right_curr_col = col_end - (num_1x1 + num_main_blocks + 1);

        upper_curr_row = row_start + 1;
        lower_curr_row = row_end - 2;

        // Placing the 1x1 blocks
        let odd_block: Boolean = true;
        for(i = 0; i < num_1x1; i++) {
            if(odd_block) {
                data['charMat'][upper_curr_row][left_curr_col] = characters.BOTTOM_BLOCK;
                data['charMat'][upper_curr_row][right_curr_col] = characters.BOTTOM_BLOCK;
                data['charMat'][lower_curr_row][left_curr_col] = characters.TOP_BLOCK;
                data['charMat'][lower_curr_row][right_curr_col] = characters.TOP_BLOCK;

                upper_curr_row += 1;
                lower_curr_row -= 1;
                left_curr_col -= 1;
                right_curr_col += 1;

                odd_block = false;
            } else {
                data['charMat'][upper_curr_row][left_curr_col] = characters.TOP_BLOCK;
                data['charMat'][upper_curr_row][right_curr_col] = characters.TOP_BLOCK;
                data['charMat'][lower_curr_row][left_curr_col] = characters.BOTTOM_BLOCK;
                data['charMat'][lower_curr_row][right_curr_col] = characters.BOTTOM_BLOCK;

                left_curr_col -= 1;
                right_curr_col += 1;

                odd_block = true;
            }
        }

        // Placing the main blocks
        let middle_block_row = Math.floor(num_main_blocks + (2 + num_1x1 + 1) / 2 + row_start); 
        for(i = 1; i <= num_main_blocks; i++) {
            data['charMat'][middle_block_row - i][col_start + i] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row - i][col_end - 1 - i] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row + i][col_start + i] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row + i][col_end - 1 - i] = characters.FULL_BLOCK;
        }

        if(vertical_axis < 14) {
            data['charMat'][middle_block_row][col_start] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row][col_end - 1] = characters.FULL_BLOCK;
        } else {
            data['charMat'][middle_block_row][col_start + 1] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row][col_end - 2] = characters.FULL_BLOCK;
        }

        
    } else {

        // odd vertical-axis
        let left_curr_col = num_1x1 + num_main_blocks + 1 + col_start;
        let right_curr_col = col_end - (num_1x1 + num_main_blocks + len_m1);
        
        let upper_curr_row = -1, lower_curr_row = -1;
        upper_curr_row = row_start;
        lower_curr_row = row_end - 2;

        // Placing the first layer: m1
        for(i = 0; i < len_m1; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = characters.BOTTOM_BLOCK;
            data['charMat'][upper_curr_row][right_curr_col - i] = characters.BOTTOM_BLOCK;
            data['charMat'][lower_curr_row][left_curr_col + i] = characters.TOP_BLOCK;
            data['charMat'][lower_curr_row][right_curr_col - i] = characters.TOP_BLOCK;
        }

        left_curr_col += len_m1;
        right_curr_col -= len_m1;

        // Placing the second layer: m2
        for(i = 0; i < len_m2; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = characters.TOP_BLOCK;
            data['charMat'][upper_curr_row][right_curr_col - i] = characters.TOP_BLOCK;
            data['charMat'][lower_curr_row][left_curr_col + i] = characters.BOTTOM_BLOCK;
            data['charMat'][lower_curr_row][right_curr_col - i] = characters.BOTTOM_BLOCK;
        }

        upper_curr_row -= 1;
        lower_curr_row += 1;
        left_curr_col += len_m2;

        // Placing the top layer: m
        for(i = 0; i < len_m; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = characters.BOTTOM_BLOCK;
            data['charMat'][lower_curr_row][left_curr_col + i] = characters.TOP_BLOCK;
        }

        left_curr_col = num_1x1 + num_main_blocks + col_start;
        right_curr_col = col_end - (num_1x1 + num_main_blocks + 1);

        upper_curr_row = row_start + 1;
        lower_curr_row = row_end - 3;

        // Placing the 1x1 blocks
        let even_block: boolean = false;
        for(i = 0; i < num_1x1; i++) {
            if(even_block) {
                data['charMat'][upper_curr_row][left_curr_col] = characters.BOTTOM_BLOCK;
                data['charMat'][upper_curr_row][right_curr_col] = characters.BOTTOM_BLOCK;
                data['charMat'][lower_curr_row][left_curr_col] = characters.TOP_BLOCK;
                data['charMat'][lower_curr_row][right_curr_col] = characters.TOP_BLOCK;

                               left_curr_col -= 1;
                right_curr_col += 1;
                upper_curr_row += 1;
                lower_curr_row -= 1;

                even_block = false;
            } else {
                data['charMat'][upper_curr_row][left_curr_col] = characters.TOP_BLOCK;
                data['charMat'][upper_curr_row][right_curr_col] = characters.TOP_BLOCK;
                data['charMat'][lower_curr_row][left_curr_col] = characters.BOTTOM_BLOCK;
                data['charMat'][lower_curr_row][right_curr_col] = characters.BOTTOM_BLOCK;

                left_curr_col -= 1;
                right_curr_col += 1;
                
                even_block = true;
            }
        }

        // Placing the main blocks
        let middle_block_row = Math.floor(num_main_blocks + (2 + num_1x1) / 2 + row_start); 
        for(i = 1; i <= num_main_blocks; i++) {
            data['charMat'][middle_block_row - i][col_start + i] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row - i][col_end - 1 - i] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row + i][col_start + i] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row + i][col_end - 1 - i] = characters.FULL_BLOCK;
        }

        if(vertical_axis < 14) {
            data['charMat'][middle_block_row][col_start] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row][col_end - 1] = characters.FULL_BLOCK;
        } else {
            data['charMat'][middle_block_row][col_start + 1] = characters.FULL_BLOCK;
            data['charMat'][middle_block_row][col_end - 2] = characters.FULL_BLOCK;
        }

    }
    
}