import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const getActiveTerminalIndex = () => {
    const terminals = vscode.window.terminals;
    const activeTerminal = vscode.window.activeTerminal;
    const index = activeTerminal ? terminals.indexOf(activeTerminal) : -1;

    return index === -1 ? null : index;
  };

  const isFirstTerminalActive = () => {
    return getActiveTerminalIndex() === 0;
  };

  const isLastTerminalActive = () => {
    return getActiveTerminalIndex() === vscode.window.terminals.length - 1;
  };

  const focusEditor = () => {
    vscode.commands.executeCommand('workbench.action.closePanel');
    vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
  };

  const focusFirstTerminal = () => {
    vscode.commands.executeCommand('workbench.action.toggleMaximizedPanel');
    if (vscode.window.terminals.length > 0) {
      vscode.window.terminals[0].show();
    }
  };

  const focusTerminalLeft = () => {
    vscode.commands.executeCommand('workbench.action.terminal.focusPrevious');
  };

  const focusTerminalRight = () => {
    vscode.commands.executeCommand('workbench.action.terminal.focusNext');
  };

  const focusLastTerminal = () => {
    vscode.commands.executeCommand('workbench.action.toggleMaximizedPanel');
    if (vscode.window.terminals.length > 0) {
      vscode.window.terminals.slice(-1)[0].show();
    }
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

  const commandsToRegister: Array<[string, () => void]> = [
    ['extension.vscedric.moveTerminalFocusLeft', moveTerminalFocusLeft],
    ['extension.vscedric.moveTerminalFocusRight', moveTerminalFocusRight],
    ['extension.vscedric.moveEditorFocusLeft', moveEditorFocusLeft],
    ['extension.vscedric.moveEditorFocusRight', moveEditorFocusRight],
  ];

  commandsToRegister.forEach(([cmd, handler]) => {
    context.subscriptions.push(vscode.commands.registerCommand(cmd, handler));
  });
}

