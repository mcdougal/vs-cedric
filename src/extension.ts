import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const log = vscode.window.createOutputChannel("VSCedric");

export function activate(context: vscode.ExtensionContext) {
  log.appendLine(`Activating VSCedric...`);

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

  const commandsToRegister: Array<[string, () => void]> = [
    ["extension.vscedric.createTsIndexFile", createTsIndexFile],
    ["extension.vscedric.moveTerminalFocusLeft", moveTerminalFocusLeft],
    ["extension.vscedric.moveTerminalFocusRight", moveTerminalFocusRight],
    ["extension.vscedric.moveEditorFocusLeft", moveEditorFocusLeft],
    ["extension.vscedric.moveEditorFocusRight", moveEditorFocusRight],
  ];

  commandsToRegister.forEach(([cmd, handler]) => {
    context.subscriptions.push(vscode.commands.registerCommand(cmd, handler));
  });
}
