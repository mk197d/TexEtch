// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { xmlRead } from './file_io/xml_read';

import { parseXml } from './xml_processor/xml_processor';

import { writeToFile } from './file_io/writeToFile';

import { Data } from './interfaces/Data';

import { drawRectangle } from './draw/drawRectangle';
import { putText } from './draw/putText';
import { drawCircleSmall } from './draw/drawCircleSmall';
import { drawCircleLarge } from './draw/drawCircleLarge';
import { drawEllipse } from './draw/drawEllipse';
import { drawStraightLine } from './draw/drawStraightLine';

let data: Data = {
	limit: {
		x_max: 0,
		x_min: Number.MAX_VALUE,
		y_max: 0,
		y_min: Number.MAX_VALUE,
	},
	fig: [],
	numFigures: 0
};


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// let outPath = '';

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('texetch.convert', () => {
		let charArray: string[][] = [];

		vscode.window.showInformationMessage("Please select the .xml file as input from the open dialog box to proceed.");

		(vscode.window.showOpenDialog())
		.then((inputFile) => {
			if(inputFile) {
				// outPath = inputFile[0].fsPath;
				xmlRead(inputFile[0].fsPath)
				.then((xmlData) => parseXml(xmlData, data))
				.then((figures) => {

					data['fig'] = figures;
				})
				.then(() => {
					let rows = data['limit'].y_max - data['limit'].y_min + 1;
					let cols = data['limit'].x_max - data['limit'].x_min + 1;

					charArray = Array.from({ length: rows }, () => Array(cols).fill(' '));

					for(let i = 0; i < data['numFigures']; i++) {
						let type = data['fig'][i].type;
						switch(type) {
							case "small_circle":
								drawCircleSmall(charArray, data, i);
								break;
							case "large_circle":
								drawCircleLarge(charArray, data, i);
								break;
							case "rectangle":
								drawRectangle(charArray, data, i);
								break;
							case "text":
								putText(charArray, data, i);
								break;
							case "ellipse":
								drawEllipse(charArray, data, i);
								break;
							case "line":
								drawStraightLine(charArray, data, i);
								break;
							default:
								vscode.window.showWarningMessage("Unknown Figure Detected!!");
						}
					}	
				})
				.then(() => {  
					const outChannel = vscode.window.createOutputChannel("TexEtch_out");
					// outPath = outPath.replace(/\/[^\/]+$/g, "/dr_to_txt");
					
					// console.log(outPath);
					(async () => {
						try {
							for (let i = 0; i < charArray.length; i++) {
								outChannel.appendLine(charArray[i].join(''));	
								// const rowData = charArray[i].join('');
								// await writeToFile(outPath, rowData + '\n');
							}
							outChannel.show(true);
							vscode.window.showInformationMessage(`Output written to output channel in the bottom pannel.`);
						} catch (err) {
							vscode.window.showWarningMessage("File write failed!!");
						}
					})();
				});		
			}
		});
		
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
