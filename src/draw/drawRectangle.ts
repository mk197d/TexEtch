//             ╔┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╗                                  
//             ┊                   ┊                                  
//             ┊  Draws Rectangles ┊ 
//             ┊                   ┊                                  
//             ╚┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╝ 
//  ╗  ╝  ╔  ╚ ║ ═

export function drawRectangle(charArray: string[][], data: any, index: number): void {
    const limit = data['limit'];

    let upperLeft_x = data['fig'][index].upperLeft_x;
    let upperLeft_y = data['fig'][index].upperLeft_y;
    let height = data['fig'][index].height;
    let width = data['fig'][index].width;

    let col_start = upperLeft_x - limit['x_min'];
    let col_end = col_start + width;

    let row_start = upperLeft_y - limit['y_min'];
    let row_end = row_start + height;

    console.log('Box dimensions: (', row_start, ', ', col_start, '), (', row_end, ', ', col_end, ')');

    charArray[row_start][col_start] = '╔';
    charArray[row_end][col_end] = '╝';
    charArray[row_start][col_end] = '╗';
    charArray[row_end][col_start] = '╚';

    for(let i = row_start + 1; i < row_end; i++) {
        charArray[i][col_start] = '║';
        charArray[i][col_end] = '║';
    }
    
    for(let i = col_start + 1; i < col_end; i++) {
        charArray[row_start][i] = '═';
        charArray[row_end][i] = '═';    
    }
}