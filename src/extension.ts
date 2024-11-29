import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const log = vscode.window.createOutputChannel("VSCedric");

export function activate(context: vscode.ExtensionContext) {
  log.appendLine(`Activating VSCedric...`);

  const copyFileName = () => {
    if (!vscode.window.activeTextEditor) {
      vscode.window.setStatusBarMessage("No file is currently open", 3000);
      return;
    }

    const document = vscode.window.activeTextEditor.document;
    const baseName = document.uri.path.split("/").pop();

    if (!baseName) {
      vscode.window.setStatusBarMessage("Failed to get file name", 3000);
      return;
    }

    vscode.env.clipboard.writeText(baseName).then(() => {
      vscode.window.setStatusBarMessage(
        `${baseName} copied to clipboard`,
        3000
      );
    });
  };

  const getVisibleTerminals = () => {
    const terminals = vscode.window.terminals;
    return terminals.filter((t) => {
      const hiddenFromUser = (t as any).creationOptions?.hideFromUser;
      return !hiddenFromUser;
    });
  };

  const getActiveTerminalIndex = () => {
    const visibleTerminals = getVisibleTerminals();
    const activeTerminal = vscode.window.activeTerminal;
    const index = activeTerminal
      ? visibleTerminals.indexOf(activeTerminal)
      : -1;

    return index === -1 ? null : index;
  };

  const isFirstTerminalActive = () => {
    return getActiveTerminalIndex() === 0;
  };

  const isLastTerminalActive = () => {
    return getActiveTerminalIndex() === getVisibleTerminals().length - 1;
  };

  const focusEditor = () => {
    if (vscode.window.activeTerminal) {
      vscode.window.activeTerminal.hide();
    }
    vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
  };

  const focusFirstTerminal = async () => {
    vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex1");
  };

  const focusLastTerminal = () => {
    const visibleTerminals = getVisibleTerminals();

    if (visibleTerminals.length === 0) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex1");
    } else if (visibleTerminals.length === 1) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex1");
    } else if (visibleTerminals.length === 2) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex2");
    } else if (visibleTerminals.length === 3) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex3");
    } else if (visibleTerminals.length === 4) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex4");
    } else if (visibleTerminals.length === 5) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex5");
    } else if (visibleTerminals.length === 6) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex6");
    } else if (visibleTerminals.length === 7) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex7");
    } else if (visibleTerminals.length === 8) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex8");
    } else if (visibleTerminals.length === 9) {
      vscode.commands.executeCommand("workbench.action.terminal.focusAtIndex9");
    }
  };

  const focusTerminalLeft = () => {
    vscode.commands.executeCommand("workbench.action.terminal.focusPrevious");
  };

  const focusTerminalRight = () => {
    vscode.commands.executeCommand("workbench.action.terminal.focusNext");
  };

  const moveTerminalFocusLeft = () => {
    if (isFirstTerminalActive()) {
      focusEditor();
    } else {
      focusTerminalLeft();
    }
  };

  const moveTerminalFocusRight = () => {
    if (isLastTerminalActive()) {
      focusEditor();
    } else {
      focusTerminalRight();
    }
  };

  const moveEditorFocusLeft = () => {
    focusLastTerminal();
  };

  const moveEditorFocusRight = () => {
    focusFirstTerminal();
  };

  const createTsComponentDirectory = async () => {
    const componentNameRaw = await vscode.window.showInputBox({
      placeHolder: "Enter component name...",
      value: ``,
    });

    const componentName = componentNameRaw?.trim();

    if (!componentName) {
      return;
    }

    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;

    if (!filePath) {
      return;
    }

    const parentDirPath = path.dirname(filePath);
    const componentDirPath = path.join(parentDirPath, componentName);

    const componentTsxFilePath = path.join(
      componentDirPath,
      `${componentName}.tsx`
    );
    const componentTsxFileContent = `const ${componentName} = (): React.ReactElement => {
  //
};

export default ${componentName};
`;

    const indexFilePath = path.join(componentDirPath, `index.ts`);
    const indexFileContent = `import ${componentName} from './${componentName}';

export default ${componentName};
`;

    fs.mkdirSync(componentDirPath);
    fs.writeFileSync(componentTsxFilePath, componentTsxFileContent);
    fs.writeFileSync(indexFilePath, indexFileContent);
  };

  const createTsIndexFile = () => {
    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;

    if (!filePath) {
      return;
    }

    const dirPath = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const componentName = fileName.split(".")[0];
    const indexFilePath = path.join(dirPath, "index.ts");

    const fileContent = `import ${componentName} from './${componentName}';

export default ${componentName};
`;

    fs.writeFileSync(indexFilePath, fileContent);
  };

  const emptyLineBelow = (editor: vscode.TextEditor) => {
    const document = editor.document;
    let line = editor.selection.active.line;
    const max = document.lineCount - 1;
    while (line < max && !document.lineAt(++line).isEmptyOrWhitespace) {}
    return document.lineAt(line);
  };

  const emptyLineAbove = (editor: vscode.TextEditor) => {
    const document = editor.document;
    let line = editor.selection.active.line;
    const min = 0;
    while (line > min && !document.lineAt(--line).isEmptyOrWhitespace) {}
    return document.lineAt(line);
  };

  const changeActive = (
    editor: vscode.TextEditor,
    newPosition: vscode.Position
  ) => {
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    editor.revealRange(new vscode.Range(newPosition, newPosition));
  };

  const changeActiveSelect = (
    editor: vscode.TextEditor,
    newPosition: vscode.Position
  ) => {
    const anchor = editor.selection.anchor;
    const newSelection = new vscode.Selection(anchor, newPosition);
    editor.selection = newSelection;
    editor.revealRange(new vscode.Range(newPosition, newPosition));
  };

  const blockTravelDown = (editor: vscode.TextEditor) => {
    const line = emptyLineBelow(editor);
    const newPosition = new vscode.Position(line.lineNumber, line.text.length);
    changeActive(editor, newPosition);
  };

  const blockSelectDown = (editor: vscode.TextEditor) => {
    const line = emptyLineBelow(editor);
    const newPosition = new vscode.Position(line.lineNumber, line.text.length);
    changeActiveSelect(editor, newPosition);
  };

  const blockTravelUp = (editor: vscode.TextEditor) => {
    const line = emptyLineAbove(editor);
    const newPosition = new vscode.Position(line.lineNumber, 0);
    changeActive(editor, newPosition);
  };

  const blockSelectUp = (editor: vscode.TextEditor) => {
    const line = emptyLineAbove(editor);
    const newPosition = new vscode.Position(line.lineNumber, 0);
    changeActiveSelect(editor, newPosition);
  };

  // Add commands to package.json as well
  const commandsToRegister: Array<[string, () => void]> = [
    ["extension.vscedric.copyFileName", copyFileName],
    [
      "extension.vscedric.createTsComponentDirectory",
      createTsComponentDirectory,
    ],
    ["extension.vscedric.createTsIndexFile", createTsIndexFile],
    ["extension.vscedric.moveTerminalFocusLeft", moveTerminalFocusLeft],
    ["extension.vscedric.moveTerminalFocusRight", moveTerminalFocusRight],
    ["extension.vscedric.moveEditorFocusLeft", moveEditorFocusLeft],
    ["extension.vscedric.moveEditorFocusRight", moveEditorFocusRight],
  ];

  const textEditorCommandsToRegister: Array<
    [string, (editor: vscode.TextEditor) => void]
  > = [
    ["extension.vscedric.blockTravelDown", blockTravelDown],
    ["extension.vscedric.blockSelectDown", blockSelectDown],
    ["extension.vscedric.blockTravelUp", blockTravelUp],
    ["extension.vscedric.blockSelectUp", blockSelectUp],
  ];

  commandsToRegister.forEach(([cmd, handler]) => {
    context.subscriptions.push(vscode.commands.registerCommand(cmd, handler));
  });

  textEditorCommandsToRegister.forEach(([cmd, handler]) => {
    context.subscriptions.push(
      vscode.commands.registerTextEditorCommand(cmd, handler)
    );
  });
}
