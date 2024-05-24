import * as vscode from 'vscode';

import { xmlRead } from './file_io/xml_read';
import { parseXml } from './process/xml_processor';
import { writeOutput_channel } from './file_io/writeOutput_channel';
import { produceOutput } from './process/produce_output';
import { placeBlock } from './draw/place_block';

import { Data } from './interfaces/Data';

let data: Data = {
	limit: {
		x_max: 0,
		x_min: Number.MAX_VALUE,
		y_max: 0,
		y_min: Number.MAX_VALUE,
	},
	fig: [],
	numFigures: 0,
	charMat: []
};


// This method is called when extension is activated
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('texetch.convert', () => {
		// let charMat: string[][] = [];

		vscode.window.showInformationMessage("Please select the .xml file as input from the open dialog box to proceed.");

		(vscode.window.showOpenDialog())
		.then((inputFile) => {
			if(inputFile) {
				try {				
					xmlRead(inputFile[0].fsPath)
					.then((xmlData) => parseXml(xmlData, data))
					.then((figures) => {
						data['fig'] = figures;
					})
					.then(() => {
						produceOutput(data);	
					})
					.then(() => { 						
						// writeOutput_channel(data['charMat']);
						placeBlock(data['charMat']);
					});		
				} catch(err) {
					vscode.window.showErrorMessage("File input and parsing failed. Please check the selected file format.");
				}
			}
		});
		
	});

	context.subscriptions.push(disposable);
}

// This method is called when extension is deactivated
export function deactivate() {}
