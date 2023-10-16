const vscode = require('vscode');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let moveToTestCaseEditorGroup = function(){
		// 現在エディタグループ２が存在しているか確認するなければ作成する
		if ( editorGroupCount < 2 ){
			vscode.commands.executeCommand('workbench.action.editorLayoutTwoRows');
		}
		// TestCase の場合はエディタグループ２（下のグループ）に開く
		vscode.commands.executeCommand('workbench.action.moveEditorToLastGroup');
	}

	let openInSecondEditorGroup = function(filename){
		vscode.workspace.openTextDocument(vscode.Uri.file(filename)).then( function(document) {
			vscode.window.showTextDocument(document).then( function(editor) {
				moveToTestCaseEditorGroup();
			});
		});
	};

	let isTarget = function(filename){
		return filename.match(/\.php$/);
	}

	let isTestCase = function(filename){
		return filename.match(/Test\.php$/);
	}

	let isFixture = function(filename){
		return filename.match(/Fixture\.php$/);
	}

	let editorGroupCount = vscode.window.visibleTextEditors.length;

	/*
	 * openTestCase イベントでは、現在のファイル名をもとに TestCase を開く
	 */
	let disposable = vscode.commands.registerCommand('cakephp4-open-testcase.openTestCase', function () {
		let currentTextEditor = vscode.window.activeTextEditor;
		if ( typeof currentTextEditor == "undefined"){
			console.log('Current text editor is undefined.');
			return;
		}

		let currentFilename = currentTextEditor.document.fileName;
		if (! isTarget(currentFilename) ){
			return;
		}
		console.log('Current filename: ' + currentFilename);

		// 現在のファイルが TestCase であれば処理しない
		if ( isTestCase(currentFilename) ){
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
			vscode.window.showWarningMessage('TestCase file not found: ' + testCaseFilename);
			return;
		}

		// TestCase ファイルが存在する場合は、縦分割して下に TestCase ファイルを表示する
		// 開いたあとに２行表示にする
		openInSecondEditorGroup(testCaseFilename);

	});
	context.subscriptions.push(disposable);

	vscode.window.onDidChangeVisibleTextEditors(function () {
		editorGroupCount = vscode.window.visibleTextEditors.length;
	});

	// ファイルを開くとき、TestCase ファイルはエディタグループ２に開く
	vscode.workspace.onDidOpenTextDocument(function (document) {
		let currentFilename = document.fileName;
		if (! isTarget(currentFilename) ){
			return;
		}
		console.log('Opening filename: ' + currentFilename);

		// このファイル名が TestCase, Fixture かどうかを判定する
		if ( ! isTestCase(currentFilename) && ! isFixture(currentFilename)){
			// TestCase ではない場合はくエディタグループ１に開く
			vscode.commands.executeCommand('workbench.action.moveEditorToFirstGroup');
		} else {
			moveToTestCaseEditorGroup();
		}
	});

	/*
	 * openFixture イベントでは、現在開いている TestCase 内の $fixtures に記載されている Fixture を開く
	 * $fixtures は以下のように定義されている。
	 * 
	 * protected $fixtures = [
     *   'app.Contents',
	 * ];
	 */
	let disposable2 = vscode.commands.registerCommand('cakephp4-open-testcase.openFixture', function () {
		let currentTextEditor = vscode.window.activeTextEditor;
		let document = currentTextEditor.document;

		// 現在のファイル名が TestCase であるか確認する
		let currentFilename = document.fileName;
		if (! isTestCase(currentFilename) ){
			vscode.window.showInformationMessage("Current file isn't TestCase.");
			return;
		}
		let documentRoot = currentFilename.replace(/tests\/TestCase\/.*$/, '');
	
		// $fixtures が記載されている行を取得する
		let text = document.getText();
		// 改行を半角スペースに置換して、連続する半角スペースを１つにする
		let textPlain = text.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\t/g, ' ').replace(/ +/g, ' ').replace(/'/g, '"');
		console.log(textPlain);
		let fixturesDefinition = textPlain.match(/protected \$fixtures = \[.*?\];/);
		if ( fixturesDefinition == null ){
			vscode.window.showInformationMessage("TestCase doesn't contain $fixtures.");
			return;
		}
		console.log(fixturesDefinition);
		let fixtures = fixturesDefinition[0].match(/"[^"]+"/g).map(function(value){
			return value.replace(/"/g, '');
		});
		console.log(fixtures);
		// fixtures をもとにユーザー選択で開く
		vscode.window.showQuickPick(fixtures, {
			placeHolder: 'Select Fixture'
		}).then(function (selectedFixture) {
			if ( typeof selectedFixture == "undefined" ){
				return;
			}
			let fixtureFilename = documentRoot + selectedFixture.replace('app.', 'tests/Fixture/') + 'Fixture.php';
			console.log(fixtureFilename);

			// ファイルが存在するか確認する。なければ終了
			// できれば bake するか confirm したいけど..
			if ( ! fs.existsSync(fixtureFilename)){
				vscode.window.showWarningMessage('Fixture file not found: ' + fixtureFilename);
				return;
			}

			openInSecondEditorGroup(fixtureFilename);
		});

	});
	context.subscriptions.push(disposable2);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
