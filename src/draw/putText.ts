export function putText(charArray: string[][], data: any, index: number): void {
    const limit = data['limit'];

    let upperLeft_x = data['fig'][index].upperLeft_x;
    let upperLeft_y = data['fig'][index].upperLeft_y;

    let height = data['fig'][index].height;
    let width = data['fig'][index].width;

    let divisons = data['fig'][index].text.divisons;

    let tokens: string[] = [];

    let verticalAlign = data['fig'][index].text.verticalAlign;
    let align = data['fig'][index].text.align;

    let col_start = upperLeft_x - limit['x_min'];
    let col_end = col_start + width;

    let row_start = upperLeft_y - limit['y_min'];
    let row_end = row_start + height;

    // console.log('Text dimensions: (', row_start, ', ', col_start, '), (', row_end, ', ', col_end, ')');

    let token_rows: number[] = [];
    let token_cols: number[] = [];

    let num_calc = 0;
    let curr_row = row_start, curr_col = col_start;
    for(let i = 0; i < divisons.length; i++) {
        for(let j = 0; j < divisons[i].length; j++) {
            if(divisons[i][j].length + curr_col + 1 < col_end) {
                token_rows.push(curr_row);
                token_cols.push(curr_col);

                curr_col += divisons[i][j].length + 1;
            } else {
                curr_row += 1;
                curr_col = col_start;
                
                token_rows.push(curr_row);
                token_cols.push(col_start);

                curr_col += divisons[i][j].length + 1;
            }

            tokens.push(divisons[i][j]);
        }
        curr_row += 1;
        curr_col = col_start;
    }
    
    let num_tokens = tokens.length;
    let verticalShift = 0;
    if(verticalAlign === "middle") {
        verticalShift = Math.floor((row_end - token_rows[num_tokens - 1] - 1) / 2);
    } else if(verticalAlign === "bottom") {
        verticalShift = row_end - token_rows[num_tokens - 1] - 1;
    }

    for(let i = 0; i < num_tokens; i++) {
        token_rows[i] += verticalShift;
    }

    num_calc = 0;
    let row_end_token, horizontal_shift;
    while(num_calc < num_tokens) {
        row_end_token = num_calc;
        while(token_rows[row_end_token] === token_rows[num_calc]) {
            row_end_token += 1;
            if(row_end_token === num_tokens) {
                break;
            }
        }

        horizontal_shift = 0;
        if(align === 'center') {
            horizontal_shift = Math.floor((col_end - token_cols[row_end_token - 1] - tokens[row_end_token - 1].length) / 2);
        } else if(align === 'right') {
            horizontal_shift = col_end - token_cols[row_end_token - 1] - tokens[row_end_token - 1].length;
        }
        
        for(let i = num_calc; i < row_end_token; i++) {
            token_cols[i] += horizontal_shift;
        }

        num_calc = row_end_token;
    }

    for(let i = 0; i < num_tokens; i++) {
        for(let j = 0; j < tokens[i].length; j++) {
            charArray[token_rows[i] + 1][token_cols[i] + j] = tokens[i][j];
        }
    }
}