import * as xml2js from 'xml2js';

import { Data } from '../interfaces/Data';
import { Boundary } from '../interfaces/Boundary';
import { Figure } from '../interfaces/Figure';
import { Text } from '../interfaces/Text';
import { Line } from '../interfaces/Line';
import { Point } from '../interfaces/Point';
import characters from '../draw/characters';
// import { Connector } from '../interfaces/Connector';


/*  ╔═════════════════════════════════════════════════════╗  
    ║Parse the selected .xml file into the required form. ║  
    ╚═════════════════════════════════════════════════════╝   */
    
export function xmlProcessor(xmlData: string, data: Data): Promise<Figure[]> {
    return new Promise((resolve, reject) => {
        const bounds: Boundary = data['limit'];       // stores the region of interest (ROI) in the drawing
        const scale_x = 5;                            // dimensions are scaled down by this factor
        const scale_y = 10;                           // x -> horizontal && y -> vertical

        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                reject(err);
            } else {
                data['numFigures'] = 0;

                const figures: Figure[] = [];
                const cells = result.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell;
                const parentMap: Map<string, Figure> = new Map<string, Figure>();
                cells.forEach((cell: any) => {
                    if (cell.$.id && cell.$.id !== '0' && cell.$.id !== '1') {
                        /////////////////////////////////////////////////////////////////////////////////
                        const id = cell.$.id;
                        const value = cell.$.value || '';
                        let type: string = "";
                        const styleAttr = cell.$.style || '';

                        const parent = cell.$.parent || '';

                        const text_int: Text = {};
                        text_int.value = value;
                        // let spacingRight = 0;
                        // let spacingLeft = 0;

                        const line_int: Line = {};
                        line_int.dashed = false;

                        line_int.source = cell.$.source || '';
                        line_int.target = cell.$.target || '';
                        if(line_int.source !== '' || line_int.target !== '') {
                            type = "line";
                        }

                        let startSize = 3;
                        const fields = styleAttr.split(';');
                        fields.forEach((field: any) => {
                            if(field === "ellipse") {
                                type = "ellipse";
                            } else if(field === "text") {
                                type = "text";
                            } else if(field === "swimlane") {
                                type = "swimlane";
                            }
                            const [key, val] = field.split('=');
                            if (key && val !== undefined) {
                                switch(key){

                                    case "align":
                                        text_int.align = val;
                                        break;

                                    case "verticalAlign":
                                        text_int.verticalAlign = val;
                                        break;

                                    case "startArrow":
                                        line_int.startArrow = val;
                                        break;

                                    case "endArrow":
                                        line_int.endArrow = val;
                                        break;

                                    case "dashPattern":
                                        line_int.dashPattern = val;
                                        break;

                                    case "dashed":
                                        if(val === "1") {
                                            line_int.dashed = true;
                                            line_int.dashPattern = "dotted";
                                        }
                                        break;

                                    case "curved":
                                        line_int.curved = val;
                                        type = "curved";
                                        break;
                                        
                                    case "shape":
                                        line_int.dashPattern = val;
                                        break;

                                    case "exitX":
                                        line_int.exitX = val;
                                        break;
                                    
                                    case "exitY":
                                        line_int.exitY = val;
                                        break;

                                    case "entryX":
                                        line_int.entryX = val;
                                        break;

                                    case "entryY":
                                        line_int.entryY = val;
                                        break;

                                    default:
                                        break;
                                }
                            }
                        });
                        /////////////////////////////////////////////////////////////////////////////////
                        
                        /////////////////////////////////////////////////////////////////////////////////
                        let bare_value = value.replace(/&[a-z]+;/g, ' ');             //                                                             
                        const regex = /(<[^>]*>.*?<\/[^>]*>)|([^<>]+)/g;              //                                                             
                        const regex_html_tags = /<[^>]+>/g;                           //   Text with HTML tags                                       
                                                                                      //       in .xml file                                          
                        let match;                                                    //                                                             
                        const blocks: string[] = [];                                  //            │ bare_value: text without character             
                        while ((match = regex.exec(bare_value)) !== null) {           //            │ entities                                       
                            if (match[1]) {                                           //            │                                                
                                blocks.push(match[1].replace(regex_html_tags, ''));   //            │ regex: extracts the text present between       
                            } else if (match[2]) {                                    //            │ opening and closing tags + text present        
                                blocks.push(match[2]);                                //            │ without any tags                               
                            }                                                         //            │                                                
                        }                                                             //            │ regex _html_tags: removes any leftover         
                                                                                      //            │ tags                                           
                        let prev_tab: Boolean = false;                                //            │                                            
                        const divisons: any[] = [];                                   //            │                                                
                        for(let i = 0; i < blocks.length; i++) {                      //            │                                                
                            if(blocks[i].length === 1 && blocks[i] === "\t") {        //            ▼                                                
                                prev_tab = true;                                      //   Extracted characters                                      
                            } else {                                                  //                                                             
                                divisons.push(blocks[i].split(' '));                  //                                                             
                                if(prev_tab) {                                        //                                                             
                                    divisons[divisons.length - 1].unshift(' ');
                                    prev_tab = false;
                                }
                            }
                        }
                        
                        text_int.divisons = divisons;

                        /////////////////////////////////////////////////////////////////////////////////

                        /////////////////////////////////////////////////////////////////////////////////                        
                        const geometry = cell.mxGeometry ? cell.mxGeometry[0].$ : {};
                        let upperLeft_x = Math.round((parseFloat(geometry.x)) / scale_x) || 0;
                        let upperLeft_y = Math.round((parseFloat(geometry.y)) / scale_y) || 0;
                        let width = Math.round((parseFloat(geometry.width)) / scale_x) || -1;
                        let height = Math.round(parseFloat(geometry.height) / scale_y) || -1;    
                        
                        if(parent !== '' && parent !== '1') {
                            let this_parent = parentMap.get(parent);
                            if(this_parent?.upperLeft_x && this_parent.upperLeft_y) {
                                upperLeft_x += this_parent.upperLeft_x;
                                upperLeft_y += this_parent.upperLeft_y;
                            }
                        }
                        /////////////////////////////////////////////////////////////////////////////////
                        
                        /////////////////////////////////////////////////////////////////////////////////
                        const linePath: Point[] = [];
                        if(cell.mxGeometry[0].mxPoint) {
                            if(type !== "curved") {
                                type = "line";
                            }
                            cell.mxGeometry[0].mxPoint.forEach((point: any) => {
                                const px = Math.round((parseFloat(point.$.x)) / scale_x);
                                const py = Math.round((parseFloat(point.$.y)) / scale_y);

                                linePath.push({x: px, y: py});

                                bounds.x_max = Math.max(bounds.x_max, px);
                                bounds.x_min = Math.min(bounds.x_min, px);

                                bounds.y_max = Math.max(bounds.y_max, py);
                                bounds.y_min = Math.min(bounds.y_min, py);
                            });
                        }
                        if (cell.mxGeometry[0].Array) {
                            if(cell.mxGeometry[0].Array[0].mxPoint) {
                                cell.mxGeometry[0].Array[0].mxPoint.forEach((point: any) => {
                                    const px = Math.round((parseFloat(point.$.x)) / scale_x);
                                    const py = Math.round((parseFloat(point.$.y)) / scale_y);

                                    linePath.push({x: px, y: py});

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
                        figures.push({ type, id, text: text_int, line: line_int, upperLeft_x, upperLeft_y, width, height, parent });

                        parentMap.set(id, figures[data['numFigures']]);
                        data['idMap'].set(id, data['numFigures']);
                        
                        data['numFigures'] += 1;
                        /////////////////////////////////////////////////////////////////////////////////

                        
                    }
                });
                resolve(figures);
            }
            bounds.y_min -= 2;          // Extra space has been reserved as 
            bounds.x_min -= 2;          // a precautionary measure
            bounds.y_max += 2;
            bounds.x_max += 2;
            data['limit'] = bounds;
        });
    });
}





             
