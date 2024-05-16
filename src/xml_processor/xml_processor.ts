import * as xml2js from 'xml2js';

import { Data } from '../interfaces/Data';
import { Boundary } from '../interfaces/Boundary';
import { Figure } from '../interfaces/Figure';
import { Text } from '../interfaces/Text';
import { Line } from '../interfaces/Line';

export function parseXml(xmlData: string, data: Data): Promise<Figure[]> {
    return new Promise((resolve, reject) => {
        const bounds: Boundary = data['limit'];

        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                reject(err);
            } else {
                data['numFigures'] = 0;

                const figures: Figure[] = [];
                const cells = result.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell;
                cells.forEach((cell: any) => {
                    if (cell.$.id && cell.$.id !== '0' && cell.$.id !== '1') {
                        /////////////////////////////////////////////////////////////////////////////////
                        const id = cell.$.id;
                        const value = cell.$.value || '';
                        let type: string = "";
                        const styleAttr = cell.$.style || '';
                        const text_int: Text = {};

                        const line_int: Line = {};
                        line_int.dashed = false;

                        const fields = styleAttr.split(';');
                        fields.forEach((field: any) => {
                            if(field === "ellipse") {
                                type = "ellipse";
                            } else if(field === "text") {
                                type = "text";
                            }
                            const [key, value] = field.split('=');
                            if (key && value !== undefined) {
                                if (key === "text") {
                                    text_int.value = value;
                                } else if (key === "align") {
                                    text_int.align = value;
                                } else if (key === "verticalAlign") {
                                    text_int.verticalAlign = value;
                                } else if (key === "startArrow") {
                                    line_int.startArrow = value;
                                } else if (key === "endArrow") {
                                    line_int.endArrow = value;
                                } else if (key === "dashPattern") {
                                    line_int.dashPattern = value;
                                } else if (key === "dashed" && value === "1") {
                                    line_int.dashed = true;
                                }
                            }
                        });
                        /////////////////////////////////////////////////////////////////////////////////
                        
                        /////////////////////////////////////////////////////////////////////////////////
                        let bare_value = value;
                        bare_value = bare_value.replace(/&[a-z]+;/g, ' ');
                        const regex = /(<[^>]*>.*?<\/[^>]*>)|([^<>]+)/g;
                        const regex_html_tags = /<[^>]+>/g;
                        
                        let match;
                        const blocks: string[] = [];
                        while ((match = regex.exec(bare_value)) !== null) {
                            if (match[1]) {
                                blocks.push(match[1].replace(regex_html_tags, ''));
                            } else if (match[2]) {
                                blocks.push(match[2]);
                            }
                        }
                        
                        let prev_tab: Boolean = false;
                        const divisons: any[] = [];
                        for(let i = 0; i < blocks.length; i++) {
                            if(blocks[i].length === 1 && blocks[i] === "\t") {
                                console.log("here");
                                prev_tab = true;
                            } else {
                                divisons.push(blocks[i].split(' '));
                                if(prev_tab) {
                                    divisons[divisons.length - 1].unshift('\t');
                                    prev_tab = false;
                                }
                            }
                        }
                        
                        text_int.divisons = divisons;
                        /////////////////////////////////////////////////////////////////////////////////

                        /////////////////////////////////////////////////////////////////////////////////                        
                        const geometry = cell.mxGeometry ? cell.mxGeometry[0].$ : {};
                        const upperLeft_x = Math.ceil((parseFloat(geometry.x)) / 6);
                        const upperLeft_y = Math.ceil((parseFloat(geometry.y)) / 12);
                        let width = Math.ceil(parseFloat(geometry.width) / 6);
                        let height = Math.ceil(parseFloat(geometry.height) / 12);      
                        /////////////////////////////////////////////////////////////////////////////////
                        
                        /////////////////////////////////////////////////////////////////////////////////
                        const linePath: [number, number][] = [];
                        // console.log(cell.mxGeometry[0].mxPoint);
                        if(cell.mxGeometry[0].mxPoint) {
                            type = "line";
                            cell.mxGeometry[0].mxPoint.forEach((point: any) => {
                                const px = Math.ceil((parseFloat(point.$.x)) / 6);
                                const py = Math.ceil((parseFloat(point.$.y)) / 12);

                                linePath.push([px, py]);

                                bounds.x_max = Math.max(bounds.x_max, px);
                                bounds.x_min = Math.min(bounds.x_min, px);

                                bounds.y_max = Math.max(bounds.y_max, py);
                                bounds.y_min = Math.min(bounds.y_min, py);
                            });
                        }
                        if (cell.mxGeometry[0].Array) {
                            if(cell.mxGeometry[0].Array[0].mxPoint) {
                                cell.mxGeometry[0].Array[0].mxPoint.forEach((point: any) => {
                                    const px = Math.ceil((parseFloat(point.$.x)) / 6);
                                    const py = Math.ceil((parseFloat(point.$.y)) / 12);

                                    linePath.push([px, py]);

                                    bounds.x_max = Math.max(bounds.x_max, px);
                                    bounds.x_min = Math.min(bounds.x_min, px);

                                    bounds.y_max = Math.max(bounds.y_max, py);
                                    bounds.y_min = Math.min(bounds.y_min, py);
                                });
                            }
                        }

                        let temp_pair = linePath[1];
                        for(let i = 1; i < linePath.length - 1; i++) {
                            linePath[i] = linePath[i + 1];
                        }
                        linePath[linePath.length - 1] = temp_pair;

                        line_int.path = linePath;
                        /////////////////////////////////////////////////////////////////////////////////

                        /////////////////////////////////////////////////////////////////////////////////
                        if(type === "") {
                            type = "rectangle";
                        } else if(type === "ellipse" && geometry.width === geometry.height) {
                            width = 2 * height;
                            if(height >= 14) {
                                type = "large_circle";
                            } else {
                                type = "small_circle";
                            }
                        }
                        /////////////////////////////////////////////////////////////////////////////////

                        /////////////////////////////////////////////////////////////////////////////////
                        if (upperLeft_x && upperLeft_y && width && height) {
                            bounds.x_max = Math.max(bounds.x_max, upperLeft_x + width);
                            bounds.x_min = Math.min(bounds.x_min, upperLeft_x);

                            bounds.y_max = Math.max(bounds.y_max, upperLeft_y + height);
                            bounds.y_min = Math.min(bounds.y_min, upperLeft_y);
                        }
                        /////////////////////////////////////////////////////////////////////////////////

                        /////////////////////////////////////////////////////////////////////////////////
                        figures.push({ type, id, text: text_int, line: line_int, upperLeft_x, upperLeft_y, width, height });
                        data['numFigures'] += 1;
                        /////////////////////////////////////////////////////////////////////////////////
                    }
                });
                resolve(figures);
            }
            bounds.y_min -= 3;
            bounds.x_min -= 5;
            bounds.y_max += 3;
            bounds.x_max += 5;
            data['limit'] = bounds;
        });
    });
}





             
