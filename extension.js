const vscode = require('vscode');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('cakephp4-open-testcase.openTestCase', function () {
		let currentTextEditor = vscode.window.activeTextEditor;
		if ( typeof currentTextEditor == "undefined"){
			console.log('Current text editor is undefined.');
			return;
		}

		let currentFilename = currentTextEditor.document.fileName;
		console.log('Current filename: ' + currentFilename);

		// 現在のファイルが TestCase であれば処理しない
		if ( currentFilename.match(/Test\.php$/) ){
			vscode.window.showInformationMessage('Current file is TestCase.');
			return;
		}

		// 編集中ファイル名をもとに CakePHP4 のルールに則り TestCase のファイル名を生成する
		// src/ 配下の同じディレクトリ構成が tests/TestCase 配下にあるものとする
		let testCaseFilename = currentFilename.replace(/src\//, 'tests/TestCase/').replace(/\.php$/, 'Test.php');
		console.log('TestCase filename: ' + testCaseFilename);

		// ファイルが存在するか確認する。なければ終了
		// できれば bake するか confirm したいけど..
		if ( ! fs.existsSync(testCaseFilename)){
			//vscode.window.showInformationMessage('Hello World from cakephp4-open-testcase!');
			vscode.window.showWarningMessage('TestCase file not found: ' + testCaseFilename);
			return;
		}

		// TestCase ファイルが存在する場合は、縦分割して下に TestCase ファイルを表示する
		// ※本当は自動的に下に開きたかったができないぽい
		// `"workbench.editor.openSideBySideDirection": "down"` とすることで下に開くが、
		// すべてのファイルが下に開くのでいまいち
		vscode.window.showTextDocument(vscode.Uri.file(testCaseFilename), {
			preview: false, 
			viewColumn: vscode.ViewColumn.Beside
		});
		//vscode.window.showInformationMessage('TestCase opened: ' + testCaseFilename);

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}