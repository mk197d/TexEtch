//  █▀▀▀▀▀▀▀▀▀▀█          ø,X/XZ            █▀▀▀▀▀▀▀▀▀▀█
// █   State 1  █------------------------->█   State 2  █ 
//  █▄▄▄▄▄▄▄▄▄▄█                            █▄▄▄▄▄▄▄▄▄▄█

//       ▄▄▀▀▀▀▄▄
//    ▄▀▀        ▀▀▄
//   █              █
//  █     I am a     █                      
// █      CIRCLE      █            10x10 {20 x 9}
//  █                █
//   █   --____--   █
//    ▀▄▄        ▄▄▀
//       ▀▀▄▄▄▄▀▀


export function drawCircleSmall(data: any, index: number): void {
    const limit = data['limit'];

    let upperLeft_x = data['fig'][index].upperLeft_x;
    let upperLeft_y = data['fig'][index].upperLeft_y;

    let diameter = data['fig'][index].height;
    let height = diameter - 1;
    let width = data['fig'][index].width;

    let col_start = upperLeft_x - limit['x_min'];   
    let col_end = col_start + width;

    let row_start = upperLeft_y - limit['y_min'];
    let row_end = row_start + height;
    
    let num_main_blocks = Math.floor((height - 3) / 3);
    let num_1x1 = -1;

    let modulo = (diameter) % 3;
    if(modulo === 0) {
        num_1x1 = 3;
    } else {
        num_1x1 = modulo;
    }
    
    let i: number, j: number;

    // even diameter
    if(diameter % 2 === 0) {
        let left_curr_col = num_1x1 + num_main_blocks + 1 + col_start;
        let right_curr_col = col_end - (num_1x1 + num_main_blocks + 2);
        
        let upper_curr_row = -1, lower_curr_row = -1;
        let even_block = 0;
        if(num_1x1 % 2 === 0) {
            upper_curr_row = row_start + (num_main_blocks + 1) / 2 - 1;
            lower_curr_row = row_end - ((num_main_blocks + 1) / 2); 

            for(i = 0; i < num_main_blocks; i++) {
                if(even_block === 0) {
                    for(j = 0; j < 2; j++) {
                        data['charMat'][upper_curr_row][left_curr_col + j] = "▄";
                        data['charMat'][upper_curr_row][right_curr_col - j] = "▄";
                        data['charMat'][lower_curr_row][left_curr_col + j] = "▀";
                        data['charMat'][lower_curr_row][right_curr_col - j] = "▀"; 
                    }
                    left_curr_col += 2;
                    right_curr_col -= 2;
                    even_block = 1;
                } else {
                    for(j = 0; j < 2; j++) {
                        data['charMat'][upper_curr_row][left_curr_col + j] = "▀";
                        data['charMat'][upper_curr_row][right_curr_col - j] = "▀";
                        data['charMat'][lower_curr_row][left_curr_col + j] = "▄";
                        data['charMat'][lower_curr_row][right_curr_col - j] = "▄"; 
                    }
                    left_curr_col += 2;
                    right_curr_col -= 2;
                    upper_curr_row -= 1;
                    lower_curr_row += 1;
                    even_block = 0;
                }
            }
        } else {
            upper_curr_row = row_start + (num_main_blocks + 2) / 2 - 1;
            lower_curr_row = row_end - ((num_main_blocks + 2) / 2); 

            for(i = 0; i < num_main_blocks; i++) {
                if(even_block === 0) {
                    for(j = 0; j < 2; j++) {
                        data['charMat'][upper_curr_row][left_curr_col + j] = "▀";
                        data['charMat'][upper_curr_row][right_curr_col - j] = "▀";
                        data['charMat'][lower_curr_row][left_curr_col + j] = "▄";
                        data['charMat'][lower_curr_row][right_curr_col - j] = "▄"; 
                    }
                    left_curr_col += 2;
                    right_curr_col -= 2;
                    upper_curr_row -= 1;
                    lower_curr_row += 1;
                    even_block = 1;
                } else {
                    for(j = 0; j < 2; j++) {
                        data['charMat'][upper_curr_row][left_curr_col + j] = "▄";
                        data['charMat'][upper_curr_row][right_curr_col - j] = "▄";
                        data['charMat'][lower_curr_row][left_curr_col + j] = "▀";
                        data['charMat'][lower_curr_row][right_curr_col - j] = "▀"; 
                    }
                    left_curr_col += 2;
                    right_curr_col -= 2;
                    even_block = 0;
                }
            }
        }

        for(i = 0; i < 4; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = "▀";
            data['charMat'][lower_curr_row][left_curr_col + i] = "▄";
        }

        upper_curr_row = row_start + (num_main_blocks + num_1x1 + 1) / 2 - 1;
        lower_curr_row = row_end - (num_main_blocks + num_1x1 + 1) / 2;
        left_curr_col = num_main_blocks + col_start + 1;
        right_curr_col = col_end - num_main_blocks - 2;
        even_block = 0;
        for(i = 0; i < num_1x1; i++) {
            if(even_block === 0) {
                data['charMat'][upper_curr_row][left_curr_col] = "▄";
                data['charMat'][upper_curr_row][right_curr_col] = "▄";
                data['charMat'][lower_curr_row][left_curr_col] = "▀";
                data['charMat'][lower_curr_row][right_curr_col] = "▀"; 
                
                left_curr_col += 1;
                right_curr_col -= 1;
                even_block = 1;
            } else {
                data['charMat'][upper_curr_row][left_curr_col] = "▀";
                data['charMat'][upper_curr_row][right_curr_col] = "▀";
                data['charMat'][lower_curr_row][left_curr_col] = "▄";
                data['charMat'][lower_curr_row][right_curr_col] = "▄"; 

                left_curr_col += 1;
                right_curr_col -= 1;
                upper_curr_row -= 1;
                lower_curr_row += 1;
                even_block = 0;
            }
        }


        let middle_block_row = num_main_blocks + (num_main_blocks + num_1x1 + 1) / 2 + row_start; 
        for(i = 1; i <= num_main_blocks; i++) {
            data['charMat'][middle_block_row - i][col_start + i] = "█";
            data['charMat'][middle_block_row - i][col_end - 1 - i] = "█";
            data['charMat'][middle_block_row + i][col_start + i] = "█";
            data['charMat'][middle_block_row + i][col_end - 1 - i] = "█";
        }

        data['charMat'][middle_block_row][col_start] = "█";
        data['charMat'][middle_block_row][col_end - 1] = "█";

        
    } else {

        // odd diameter
        let left_curr_col = num_1x1 + num_main_blocks + 1 + col_start;
        let right_curr_col = col_end - (num_1x1 + num_main_blocks + 2);
        
        let upper_curr_row = -1, lower_curr_row = -1;
        let even_block = 0;
        if(num_1x1 % 2 === 0) {
            upper_curr_row = row_start + (num_main_blocks) / 2 - 1;
            lower_curr_row = row_end - ((num_main_blocks) / 2) - 1; 

            for(i = 0; i < num_main_blocks; i++) {
                if(even_block === 0) {
                    for(j = 0; j < 2; j++) {
                        data['charMat'][upper_curr_row][left_curr_col + j] = "▄";
                        data['charMat'][upper_curr_row][right_curr_col - j] = "▄";
                        data['charMat'][lower_curr_row][left_curr_col + j] = "▀";
                        data['charMat'][lower_curr_row][right_curr_col - j] = "▀"; 
                    }
                    left_curr_col += 2;
                    right_curr_col -= 2;
                    even_block = 1;
                } else {
                    for(j = 0; j < 2; j++) {
                        data['charMat'][upper_curr_row][left_curr_col + j] = "▀";
                        data['charMat'][upper_curr_row][right_curr_col - j] = "▀";
                        data['charMat'][lower_curr_row][left_curr_col + j] = "▄";
                        data['charMat'][lower_curr_row][right_curr_col - j] = "▄"; 
                    }
                    left_curr_col += 2;
                    right_curr_col -= 2;
                    upper_curr_row -= 1;
                    lower_curr_row += 1;
                    even_block = 0;
                }
            }
        } else {
            upper_curr_row = row_start + (num_main_blocks + 1) / 2 - 1;
            lower_curr_row = row_end - ((num_main_blocks + 1) / 2) - 1; 

            for(i = 0; i < num_main_blocks; i++) {
                if(even_block === 0) {
                    for(j = 0; j < 2; j++) {
                        data['charMat'][upper_curr_row][left_curr_col + j] = "▀";
                        data['charMat'][upper_curr_row][right_curr_col - j] = "▀";
                        data['charMat'][lower_curr_row][left_curr_col + j] = "▄";
                        data['charMat'][lower_curr_row][right_curr_col - j] = "▄"; 
                    }
                    left_curr_col += 2;
                    right_curr_col -= 2;
                    upper_curr_row -= 1;
                    lower_curr_row += 1;
                    even_block = 1;
                } else {
                    for(j = 0; j < 2; j++) {
                        data['charMat'][upper_curr_row][left_curr_col + j] = "▄";
                        data['charMat'][upper_curr_row][right_curr_col - j] = "▄";
                        data['charMat'][lower_curr_row][left_curr_col + j] = "▀";
                        data['charMat'][lower_curr_row][right_curr_col - j] = "▀"; 
                    }
                    left_curr_col += 2;
                    right_curr_col -= 2;
                    even_block = 0;
                }
            }
        }

        for(i = 0; i < 4; i++) {
            data['charMat'][upper_curr_row][left_curr_col + i] = "▄";
            data['charMat'][lower_curr_row][left_curr_col + i] = "▀";
        }

        upper_curr_row = row_start + (num_main_blocks + num_1x1) / 2 - 1;
        lower_curr_row = row_end - (num_main_blocks + num_1x1) / 2 - 1;
        left_curr_col = num_main_blocks + col_start + 1;
        right_curr_col = col_end - num_main_blocks - 2;
        even_block = 0;
        for(i = 0; i < num_1x1; i++) {
            if(even_block === 0) {
                data['charMat'][upper_curr_row][left_curr_col] = "▄";
                data['charMat'][upper_curr_row][right_curr_col] = "▄";
                data['charMat'][lower_curr_row][left_curr_col] = "▀";
                data['charMat'][lower_curr_row][right_curr_col] = "▀"; 
                
                left_curr_col += 1;
                right_curr_col -= 1;
                even_block = 1;
            } else {
                data['charMat'][upper_curr_row][left_curr_col] = "▀";
                data['charMat'][upper_curr_row][right_curr_col] = "▀";
                data['charMat'][lower_curr_row][left_curr_col] = "▄";
                data['charMat'][lower_curr_row][right_curr_col] = "▄"; 

                left_curr_col += 1;
                right_curr_col -= 1;
                upper_curr_row -= 1;
                lower_curr_row += 1;
                even_block = 0;
            }
        }


        let middle_block_row = num_main_blocks + (num_main_blocks + num_1x1) / 2 + row_start; 
        for(i = 1; i <= num_main_blocks; i++) {
            data['charMat'][middle_block_row - i][col_start + i] = "█";
            data['charMat'][middle_block_row - i][col_end - 1 - i] = "█";
            data['charMat'][middle_block_row + i][col_start + i] = "█";
            data['charMat'][middle_block_row + i][col_end - 1 - i] = "█";
        }

        data['charMat'][middle_block_row][col_start] = "█";
        data['charMat'][middle_block_row][col_end - 1] = "█";
    }
    
}