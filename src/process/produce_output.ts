import * as vscode from 'vscode';


import { Data } from '../interfaces/Data';

import { drawRectangle } from '../draw/drawRectangle';
import { putText } from '../draw/putText';
import { drawCircleSmall } from '../draw/drawCircleSmall';
import { drawCircleLarge } from '../draw/drawCircleLarge';
import { drawEllipseLine } from '../draw/drawEllipseLine';
import { drawEllipse } from '../draw/drawEllipse';
import { drawLine } from '../draw/drawLine';
// import { drawCurve } from '../draw/drawCurve';

export function produceOutput(data: Data) {
    let rows = data['limit'].y_max - data['limit'].y_min + 1;
    let cols = data['limit'].x_max - data['limit'].x_min + 1;

    data['charMat'] = Array.from({ length: rows }, () => Array(cols).fill(' '));

    for(let i = 0; i < data['numFigures']; i++) {
        let type = data['fig'][i].type;
        let text_done: boolean = false;
        try{
            switch(type) {
                case "text":
                    putText(data, i);
                    text_done = true;
                    break;
                case "small_circle":
                    // drawEllipseLine(data, i);
                    drawCircleSmall(data, i);
                    break;
                case "large_circle":
                    // drawEllipseLine(data, i);
                    drawCircleLarge(data, i);
                    break;
                case "rectangle":
                    drawRectangle(data, i);
                    break;
                case "ellipse":
                    drawEllipseLine(data, i);
                    break;
                case "line":
                    drawLine(data, i);
                    break;
                case "swimlane":
                    drawRectangle(data, i);
                    // drawLine();
                    break;
 
                default:
                    vscode.window.showWarningMessage("Unknown Figure Detected!!");
                    break;
            }

            // if the figure contains text also
            if(!text_done && data['fig'][i].text.value !== '') {
                if(!data['fig'][i].text.align) {
                    data['fig'][i].text.align = "center";
                }

                if(!data['fig'][i].text.verticalAlign) {
                    data['fig'][i].text.verticalAlign = "middle";
                }
                
                putText(data, i);
                text_done = true;
            }
        } catch(err) {
            vscode.window.showWarningMessage("Invalid known figure detected. Please try redrawing.");
        }
    }
}