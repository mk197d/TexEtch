import * as vscode from 'vscode';

export function writeOutput_channel(charMat: string[][]) {
    const outChannel = vscode.window.createOutputChannel("TexEtch_out");
    (async () => {
        try {
            for (let i = 0; i < charMat.length; i++) {
                outChannel.appendLine(charMat[i].join(''));	
            }
            outChannel.show(true);
            vscode.window.showInformationMessage(`Output written to output channel in the bottom pannel.`);
        } catch (err) {
            vscode.window.showErrorMessage("Output write failed!!");
        }
    })();
}