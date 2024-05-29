import * as vscode from 'vscode';

export async function placeBlock(charMat: string[][]) {
    let separating_str = await vscode.window.showInputBox({
        placeHolder: "Comment string OR Separating character",
        prompt: "Please enter the desired characters",
        value: ""
    });

    if(!separating_str) {
        separating_str = '';
    }

    const ActiveEditor = vscode.window.activeTextEditor;
    let selected_text = ActiveEditor?.selection;
    let out_text: string = '';

    if(selected_text?.isEmpty === true) {
        console.log(charMat.length);
        for(let i = 0; i < charMat.length; i++) {

            out_text = out_text.concat(separating_str);
            out_text = out_text.concat(charMat[i].join(''));
            out_text = out_text.concat('\n');
        }

        const start_line_num = selected_text?.start.line || 0;
        ActiveEditor?.insertSnippet(new vscode.SnippetString(out_text), new vscode.Position(start_line_num, 0));
    } else {
        const start_line_num = selected_text?.start.line || 0;
        const end_line_num = selected_text?.end.line || 0;
        const num_lines = end_line_num - start_line_num + 1;

        let max_line_length = 0;
        for(let i = start_line_num; i < end_line_num; i++) {
            const curr_line = ActiveEditor?.document.lineAt(i).text || '';
            max_line_length = Math.max(max_line_length, curr_line.length);
        }

        if(num_lines >= charMat.length) {
            for(let i = 0; i < charMat.length; i++) {
                const curr_line = ActiveEditor?.document.lineAt(i + start_line_num).text || '';

                out_text = out_text.concat(curr_line);
                for(let j = curr_line.length; j < max_line_length + 3; j++) {
                    out_text = out_text.concat(" ");
                }
                out_text = out_text.concat(separating_str);
                out_text = out_text.concat(charMat[i].join(''));
                out_text = out_text.concat('\n');
            }
            for(let i = charMat.length; i < num_lines; i++) {
                const curr_line = ActiveEditor?.document.lineAt(i + start_line_num).text || '';

                out_text = out_text.concat(curr_line);
                out_text = out_text.concat('\n');
            }
        } else {
            for(let i = 0; i < num_lines; i++) {
                const curr_line = ActiveEditor?.document.lineAt(i + start_line_num).text || '';

                out_text = out_text.concat(curr_line);
                for(let j = curr_line.length; j < max_line_length + 3; j++) {
                    out_text = out_text.concat(" ");
                }
                out_text = out_text.concat(separating_str);
                out_text = out_text.concat(charMat[i].join(''));
                out_text = out_text.concat('\n');
            }
            for(let i = num_lines; i < charMat.length; i++) {
                for(let j = 0; j < max_line_length + 3; j++) {
                    out_text = out_text.concat(" ");
                }
                out_text = out_text.concat(separating_str);
                out_text = out_text.concat(charMat[i].join(''));
                out_text = out_text.concat('\n');
            }
        }

        if(ActiveEditor) {
            ActiveEditor.edit((TextEditor: vscode.TextEditorEdit): void => {     
                TextEditor.replace(ActiveEditor.selection, out_text);
            });
        }
    }
}