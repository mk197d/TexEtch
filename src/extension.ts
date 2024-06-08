import * as vscode from 'vscode';

import { xmlRead } from './file_io/xml_read';
import { xmlProcessor } from './process/xml_processor';
import { produceOutput } from './process/produce_output';
import { placeBlock } from './draw/place_block';

import { Data } from './interfaces/Data';

// This method is called when extension is activated
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('texetch.convert', () => {

		vscode.window.showInformationMessage("Please select the .xml file as input from the open dialog box to proceed.");
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
		
		(vscode.window.showOpenDialog())
		.then((inputFile) => {
			if(inputFile) {
				try {				
					xmlRead(inputFile[0].fsPath)
					.then((xmlData) => xmlProcessor(xmlData, data))
					.then((figures) => {
						data['fig'] = figures;
					})
					.then(() => {
						produceOutput(data);	
					})
					.then(() => { 						
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
