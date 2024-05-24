
//          ▄▄▄▄▄▄▄▄
//     ▄▄▀▀▀        ▀▀▀▄▄                               
//   ▄▀                  ▀▄  
//  █                      █                      
// █     I am a ellipse     █            13x9 {26 x 8}
//  █                      █ 
//   ▀▄                  ▄▀
//     ▀▀▄▄▄        ▄▄▄▀▀    
//          ▀▀▀▀▀▀▀▀  


export function drawEllipse(data: any, index: number): void {
    const limit = data['limit'];

    let upperLeft_x = data['fig'][index].upperLeft_x;
    let upperLeft_y = data['fig'][index].upperLeft_y;

    let vertical_axis = data['fig'][index].height;
    let height = vertical_axis - 1;
    let width = data['fig'][index].width;

    let col_start = upperLeft_x - limit['x_min'];   
    let col_end = col_start + width;

    let row_start = upperLeft_y - limit['y_min'];
    let row_end = row_start + height;
    
    let num_main_blocks = -1;
    
    let num_1x1 = 2 + height % 2;
    if(height < 6) {
        num_1x1 = 0;
        num_main_blocks = 0;
    } else if(height === 6) {
        num_main_blocks = 0;
        num_1x1 = 2;
    } else if(height > 6) {
        num_main_blocks = Math.floor((height - 6) / 2);
    }
    
    let len_m1, len_m2, len_m;
    len_m1 = 2;
    len_m2 = 2;
    len_m = width - 2 * (1 + num_main_blocks + num_1x1 + len_m1 + len_m2);
    if(len_m >= 6) {
        len_m2 = 3;
        len_m -= 2;
    }
        
    let i: number, j: number;

    // even vertical_axis
    if(vertical_axis % 2 === 0) {
        let left_curr_col = num_1x1 + num_main_blocks + 1 + col_start;
        let right_curr_col = col_end - (num_1x1 + num_main_blocks + len_m1);
        
        let upper_curr_row = -1, lower_curr_row = -1;
        upper_curr_row = row_start + 1;
        lower_curr_row = row_end - 2;

        for(i = 0; i < len_m1; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = "▀";
            data['charMat'][upper_curr_row][right_curr_col - i] = "▀";
            data['charMat'][lower_curr_row][left_curr_col + i] = "▄";
            data['charMat'][lower_curr_row][right_curr_col - i] = "▄";
        }

        upper_curr_row -= 1;
        lower_curr_row += 1;
        left_curr_col += len_m1;
        right_curr_col -= len_m1;

        for(i = 0; i < len_m2; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = "▄";
            data['charMat'][upper_curr_row][right_curr_col - i] = "▄";
            data['charMat'][lower_curr_row][left_curr_col + i] = "▀";
            data['charMat'][lower_curr_row][right_curr_col - i] = "▀";
        }

        left_curr_col += len_m2;

        for(i = 0; i < len_m; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = "▀";
            data['charMat'][lower_curr_row][left_curr_col + i] = "▄";
        }

        left_curr_col = num_1x1 + num_main_blocks + col_start;
        right_curr_col = col_end - (num_1x1 + num_main_blocks + 1);

        upper_curr_row = row_start + 1;
        lower_curr_row = row_end - 2;

        let odd_block: Boolean = true;
        for(i = 0; i < num_1x1; i++) {
            if(odd_block) {
                data['charMat'][upper_curr_row][left_curr_col] = "▄";
                data['charMat'][upper_curr_row][right_curr_col] = "▄";
                data['charMat'][lower_curr_row][left_curr_col] = "▀";
                data['charMat'][lower_curr_row][right_curr_col] = "▀";

                upper_curr_row += 1;
                lower_curr_row -= 1;
                left_curr_col -= 1;
                right_curr_col += 1;

                odd_block = false;
            } else {
                data['charMat'][upper_curr_row][left_curr_col] = "▀";
                data['charMat'][upper_curr_row][right_curr_col] = "▀";
                data['charMat'][lower_curr_row][left_curr_col] = "▄";
                data['charMat'][lower_curr_row][right_curr_col] = "▄";

                left_curr_col -= 1;
                right_curr_col += 1;

                odd_block = true;
            }
        }

        let middle_block_row = Math.floor(num_main_blocks + (2 + num_1x1 + 1) / 2 + row_start); 
        for(i = 1; i <= num_main_blocks; i++) {
            data['charMat'][middle_block_row - i][col_start + i] = "█";
            data['charMat'][middle_block_row - i][col_end - 1 - i] = "█";
            data['charMat'][middle_block_row + i][col_start + i] = "█";
            data['charMat'][middle_block_row + i][col_end - 1 - i] = "█";
        }

        if(vertical_axis < 14) {
            data['charMat'][middle_block_row][col_start] = "█";
            data['charMat'][middle_block_row][col_end - 1] = "█";
        } else {
            data['charMat'][middle_block_row][col_start + 1] = "█";
            data['charMat'][middle_block_row][col_end - 2] = "█";
        }

        
    } else {

        // odd vertical-axis
        let left_curr_col = num_1x1 + num_main_blocks + 1 + col_start;
        let right_curr_col = col_end - (num_1x1 + num_main_blocks + len_m1);
        
        let upper_curr_row = -1, lower_curr_row = -1;
        upper_curr_row = row_start;
        lower_curr_row = row_end - 2;

        for(i = 0; i < len_m1; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = "▄";
            data['charMat'][upper_curr_row][right_curr_col - i] = "▄";
            data['charMat'][lower_curr_row][left_curr_col + i] = "▀";
            data['charMat'][lower_curr_row][right_curr_col - i] = "▀";
        }

        left_curr_col += len_m1;
        right_curr_col -= len_m1;

        for(i = 0; i < len_m2; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = "▀";
            data['charMat'][upper_curr_row][right_curr_col - i] = "▀";
            data['charMat'][lower_curr_row][left_curr_col + i] = "▄";
            data['charMat'][lower_curr_row][right_curr_col - i] = "▄";
        }

        upper_curr_row -= 1;
        lower_curr_row += 1;
        left_curr_col += len_m2;

        for(i = 0; i < len_m; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = "▄";
            data['charMat'][lower_curr_row][left_curr_col + i] = "▀";
        }

        left_curr_col = num_1x1 + num_main_blocks + col_start;
        right_curr_col = col_end - (num_1x1 + num_main_blocks + 1);

        upper_curr_row = row_start + 1;
        lower_curr_row = row_end - 3;

        let even_block: boolean = false;
        for(i = 0; i < num_1x1; i++) {
            if(even_block) {
                data['charMat'][upper_curr_row][left_curr_col] = "▄";
                data['charMat'][upper_curr_row][right_curr_col] = "▄";
                data['charMat'][lower_curr_row][left_curr_col] = "▀";
                data['charMat'][lower_curr_row][right_curr_col] = "▀";

                               left_curr_col -= 1;
                right_curr_col += 1;
                upper_curr_row += 1;
                lower_curr_row -= 1;

                even_block = false;
            } else {
                data['charMat'][upper_curr_row][left_curr_col] = "▀";
                data['charMat'][upper_curr_row][right_curr_col] = "▀";
                data['charMat'][lower_curr_row][left_curr_col] = "▄";
                data['charMat'][lower_curr_row][right_curr_col] = "▄";

                left_curr_col -= 1;
                right_curr_col += 1;
                
                even_block = true;
            }
        }


        let middle_block_row = Math.floor(num_main_blocks + (2 + num_1x1) / 2 + row_start); 
        for(i = 1; i <= num_main_blocks; i++) {
            data['charMat'][middle_block_row - i][col_start + i] = "█";
            data['charMat'][middle_block_row - i][col_end - 1 - i] = "█";
            data['charMat'][middle_block_row + i][col_start + i] = "█";
            data['charMat'][middle_block_row + i][col_end - 1 - i] = "█";
        }

        if(vertical_axis < 14) {
            data['charMat'][middle_block_row][col_start] = "█";
            data['charMat'][middle_block_row][col_end - 1] = "█";
        } else {
            data['charMat'][middle_block_row][col_start + 1] = "█";
            data['charMat'][middle_block_row][col_end - 2] = "█";
        }

    }
    
}