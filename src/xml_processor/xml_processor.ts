import * as xml2js from 'xml2js';

import { Data } from '../interfaces/Data';
import { Boundary } from '../interfaces/Boundary';
import { Figure } from '../interfaces/Figure';
import { StyleObject } from '../interfaces/StyleObject';

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
                        const id = cell.$.id;
                        const value = cell.$.value || '';
                        let type: string = "";
                        const styleAttr = cell.$.style || '';
                        const styleObj: StyleObject = {};
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
                                    styleObj.text = value;
                                } else if (key === "align") {
                                    styleObj.align = value;
                                } else if (key === "verticalAlign") {
                                    styleObj.verticalAlign = value;
                                } else if (key === "rounded") {
                                    styleObj.rounded = value;
                                }
                            }
                        });

                        // value.replace(/<[^>]+>/g, '');
                        let bare_value = value;
                        // bare_value = value.replace(/<(?!\/?div.*?\b)[^>]+>/gi, '');
                        // console.log(bare_value);
                        // const without_div = bare_value.split('<div>')
                        // bare_value = value.replace(/<\/?[^>]+>/g, '');
                        bare_value = bare_value.replace(/&[a-z]+;/g, ' ');
                        // console.log(bare_value);
                        // const div_regex = /<.*>(.*?)<\/.*>/g;


                        let match;
                        // const regex = /<[^>]*>([^<]*)<\/[^>]*>/g;
                        const regex = /(<[^>]*>.*?<\/[^>]*>)|([^<>]+)/g;
                        // console.log(bare_value)
                        const blocks: string[] = [];
                        // blocks.push(without_div[0]);
                        // while ((match = regex.exec(bare_value)) !== null) {
                        //     console.log(match[1])
                        //     blocks.push(match[1]);
                        // }
                        const regex_html_tags = /<[^>]+>/g;
                        // const regex_html_tags = /^(?:<[^>]*>\s*)*/;

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
                        
                        // divisons.push(bare_value.split(' '));
                        // const tokens = bare_value.split('div>');

                        const geometry = cell.mxGeometry ? cell.mxGeometry[0].$ : {};
                        const upperLeft_x = Math.ceil((parseFloat(geometry.x)) / 6);
                        const upperLeft_y = Math.ceil((parseFloat(geometry.y)) / 12);
                        let width = Math.ceil(parseFloat(geometry.width) / 6);
                        let height = Math.ceil(parseFloat(geometry.height) / 12);      
                        
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
                        
                        figures.push({ type, id, value, divisons, style: styleObj, upperLeft_x, upperLeft_y, width, height });
                        data['numFigures'] += 1;

                        if (upperLeft_x && upperLeft_y && width && height) {
                            bounds.x_max = Math.max(bounds.x_max, upperLeft_x + width);
                            bounds.x_min = Math.min(bounds.x_min, upperLeft_x);

                            bounds.y_max = Math.max(bounds.y_max, upperLeft_y + height);
                            bounds.y_min = Math.min(bounds.y_min, upperLeft_y);
                        }
                    }
                });
                resolve(figures);
            }
            bounds.y_min -= 3;
            // bounds.x_min -= 3;
            data['limit'] = bounds;
        });
    });
}





             
