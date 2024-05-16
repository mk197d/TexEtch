// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { xmlRead } from './file_io/xml_read';
import { jsonWrite } from './file_io/json_write';

import { parseXml } from './xml_processor/xml_processor';

import { writeToFile } from './interpreter/interpreter';
import { readJsonFile } from './interpreter/interpreter';

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

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codevisuafy" is now active!');


	const inputFilePath = '/home/mknined/Desktop/test_ext/demo2.xml';
	const outputFilePath = '/home/mknined/Desktop/test_ext/figures.json';

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('codevisuafy.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		
		vscode.window.showInformationMessage('Hello VS Code from CodeVisuafy!');
		xmlRead(inputFilePath)
		.then((xmlData) => parseXml(xmlData, data))
		.then((figures) => {

			data['fig'] = figures;
			jsonWrite(outputFilePath, data);
		})
		.then(() => {        
			vscode.window.showInformationMessage(`Output written to ${outputFilePath}`);
		})
		.catch((error) => {
			console.error(error);
		});

		const nodes: Data = readJsonFile(outputFilePath);

		let rows = nodes['limit'].y_max - nodes['limit'].y_min + 1;
		let cols = nodes['limit'].x_max - nodes['limit'].x_min + 1;

		console.log('rows: ', rows, '| cols: ', cols);

		const charArray: string[][] = Array.from({ length: rows }, () => Array(cols).fill(' '));

		for(let i = 0; i < nodes['numFigures']; i++) {
			let type = nodes['fig'][i].type;
			switch(type) {
				case "small_circle":
					drawCircleSmall(charArray, nodes, nodes['limit'], i);
					break;
				case "large_circle":
					drawCircleLarge(charArray, nodes, nodes['limit'], i);
					break;
				case "rectangle":
					drawRectangle(charArray, nodes, nodes['limit'], i);
					break;
				case "text":
					putText(charArray, nodes, nodes['limit'], i);
					break;
				case "ellipse":
					drawEllipse(charArray, nodes, nodes['limit'], i);
					break;
				case "line":
					drawStraightLine(charArray, nodes, nodes['limit'], i);
					break;
				default:
					console.log("Unknown figure");
			}
		}	

		const outPath = '/home/mknined/Desktop/test_ext/output.txt';
		(async () => {
			try {
				for (let i = 0; i < rows; i++) {
					const rowData = charArray[i].join('');
					await writeToFile(outPath, rowData + '\n');
				}
				console.log('File write completed.');
			} catch (err) {
				console.error('Error writing to file:', err);
			}
		})();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
