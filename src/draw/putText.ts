
export function putText(charArray: string[][], nodes: any, limit:any, index: number): void {
    let len = nodes['fig'][index].value.length;
    let xt = nodes['fig'][index].upperLeft_x - limit.x_min;
    let yt = nodes['fig'][index].upperLeft_y - limit.y_min;

    let start = Math.floor(xt);
    let end = start + len;
    for(let i = start; i < end; i++) {
        charArray[yt][i] = nodes['fig'][index].value[i - start];
    }
}