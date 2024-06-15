import * as xml2js from 'xml2js';

import { Data } from '../interfaces/Data';
import { Boundary } from '../interfaces/Boundary';
import { Figure } from '../interfaces/Figure';
import { Text } from '../interfaces/Text';
import { Line } from '../interfaces/Line';
import { Point } from '../interfaces/Point';

import { addBezierPoints } from '../draw/addBezierPoints';
import { organizePoints } from '../draw/organizePoints';
                                                           
/*╭─────────────────────────────────────────────────────╮  
  │ Parse the selected .xml file into the required form │  
  ╰─────────────────────────────────────────────────────╯  */
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
                        let origux = parseFloat(geometry.x) || 0;
                        let origuy = parseFloat(geometry.y) || 0;
                        let upperLeft_x = Math.round(origux / scale_x);
                        let upperLeft_y = Math.round(origuy / scale_y);

                        let orig_width = parseFloat(geometry.width) || -1;
                        let orig_height = parseFloat(geometry.height) || -1;
                        let width = Math.round(orig_width / scale_x);
                        let height = Math.round(orig_height / scale_y);    
                        
                        
                        if(parent !== '' && parent !== '1') {
                            let this_parent = parentMap.get(parent);
                            if(this_parent?.upperLeft_x && this_parent.upperLeft_y) {
                                upperLeft_x += this_parent.upperLeft_x;
                                upperLeft_y += this_parent.upperLeft_y;
                            }
                        }
                        /////////////////////////////////////////////////////////////////////////////////
                        
                        /////////////////////////////////////////////////////////////////////////////////
                        let linePath: Point[] = [];
                        let originalPath: Point[] = [];
                        if(cell.mxGeometry[0].mxPoint) {
                            if(type !== "curved") {
                                type = "line";
                            }
                            cell.mxGeometry[0].mxPoint.forEach((point: any) => {
                                const px = Math.round((parseFloat(point.$.x)) / scale_x);
                                const py = Math.round((parseFloat(point.$.y)) / scale_y);

                                if(type === "curved") {
                                    originalPath.push({x: point.$.x, y: point.$.y});
                                } else {
                                    linePath.push({x: px, y: py});
                                }

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

                                    if(type === "curved") {
                                        originalPath.push({x: parseFloat(point.$.x), y: parseFloat(point.$.y)});
                                    } else {
                                        linePath.push({x: px, y: py});
                                    }

                                    bounds.x_max = Math.max(bounds.x_max, px);
                                    bounds.x_min = Math.min(bounds.x_min, px);

                                    bounds.y_max = Math.max(bounds.y_max, py);
                                    bounds.y_min = Math.min(bounds.y_min, py);
                                });
                            }
                        }
                        /////////////////////////////////////////////////////////////////////////////////

                        /////////////////////////////////////////////////////////////////////////////////                        
                        if(type === "line") {
                            line_int.path = organizePoints(linePath);

                        } else if(type === "curved") {
                            originalPath = organizePoints(originalPath);
                            
                            let source_id = line_int.source || '';
                            if(source_id !== '') {
                                let source_fig = parentMap.get(source_id);

                                let exitX = Number(line_int.exitX) || 0;
                                let exitY = Number(line_int.exitY) || 0;
                                
                                if(source_fig) {
                                    let relX = source_fig.origux + Math.round(exitX * source_fig.origWidth);
                                    let relY = source_fig.origuy + Math.round(exitY * source_fig.origHeight);

                                    originalPath[0].x = relX;
                                    originalPath[0].y = relY; 
                                } 
                                line_int.source = '';
                            }

                            let target_id = line_int.target || '';
                            if(target_id !== '') {
                                let target_fig = parentMap.get(target_id);

                                let entryX = Number(line_int.entryX) || 0;
                                let entryY = Number(line_int.entryY) || 0;
                                
                                if(target_fig) {
                                    let relX = target_fig.origux + entryX * target_fig.origWidth;
                                    let relY = target_fig.origuy + entryY * target_fig.origHeight;

                                    originalPath[originalPath.length - 1].x = relX;
                                    originalPath[originalPath.length - 1].y = relY; 
                                } 
                                line_int.target = '';
                            }


                            line_int.originalPath = originalPath;
                            
                            linePath = addBezierPoints(originalPath);
                            for(let i = 0; i < linePath.length; i++) {
                                const px = Math.round(linePath[i].x / scale_x);
                                const py = Math.round(linePath[i].y / scale_y);

                                linePath[i] = {x: px, y: py};

                                bounds.x_max = Math.max(bounds.x_max, px);
                                bounds.x_min = Math.min(bounds.x_min, px);

                                bounds.y_max = Math.max(bounds.y_max, py);
                                bounds.y_min = Math.min(bounds.y_min, py);
                            }   

                            line_int.path = linePath;
                            type = "line";
                        }
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
                        figures.push({ type, id, text: text_int, line: line_int, origux, origuy, upperLeft_x, upperLeft_y, width, height, origWidth: orig_width, origHeight: orig_height, parent });

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





             
