import * as fs from 'fs';
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
                    if (cell.$.id && cell.$.id !== 0 && cell.$.id !== 1) {
                        const id = cell.$.id;
                        const value = cell.$.value || '';

                        const styleAttr = cell.$.style || '';
                        const styleObj: StyleObject = {};
                        const fields = styleAttr.split(';');
                        fields.forEach((field: any) => {    
                            const [key, value] = field.split('=');
                            if (key && value !== undefined) {
                                if(key === "text") {
                                    styleObj.text = value;
                                } else if(key === "html") {
                                    styleObj.html = value;
                                } else if(key === "align") {
                                    styleObj.align = value;
                                } else if(key === "verticalAlign") {
                                    styleObj.verticalAlign = value;
                                } else if(key === "whiteSpace") {
                                    styleObj.whiteSpace = value;
                                } else if(key === "rounded") {
                                    styleObj.rounded = value;
                                }
                            }
                        });

                        const geometry = cell.mxGeometry ? cell.mxGeometry[0].$ : {};
                        const upperLeft_x = Math.ceil((parseFloat(geometry.x)) / 6);
                        const upperLeft_y = Math.ceil((parseFloat(geometry.y)) / 12);
                        const width = Math.ceil(parseFloat(geometry.width) / 6);
                        const height = Math.ceil(parseFloat(geometry.height) / 12);
                        
                        figures.push({ id, value, style: styleObj, upperLeft_x, upperLeft_y, width, height });
                        data['numFigures'] += 1;

                        if(upperLeft_x && upperLeft_y && width && height) {
                            bounds.x_max = Math.max(bounds.x_max, upperLeft_x + width);
                            bounds.x_min = Math.min(bounds.x_min, upperLeft_x);

                            bounds.y_max = Math.max(bounds.y_max, upperLeft_y + height);
                            bounds.y_min = Math.min(bounds.y_min, upperLeft_y);
                        }
                    }
                });
                resolve(figures);
            }
            data['limit'] = bounds;
        });
    });
}





             
