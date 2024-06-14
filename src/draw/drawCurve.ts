import * as vscode from 'vscode';
import { addBezierPoints } from "./addBezierPoints";
import { drawLine } from './drawLine';

export function drawCurve(data: any, index: number): void {
    if(data['fig'][index].line.curved === "1") {
        addBezierPoints(data['fig'][index].line.path)
        .then(newPoints => {
            data['fig'][index].line.path = newPoints;
        })
        .then(() => {
            drawLine(data, index);
        })
        .catch(error => {
            vscode.window.showErrorMessage("Error: ", error);
        });
    }
}