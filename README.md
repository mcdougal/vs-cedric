# vs-cedric

Publishing:

```sh
npx vsce publish minor
```

Development:

1. Compile the extension to `vs-cedric-x.x.x.vsix`

   ```sh
   npm run build
   ```

2. In VSCode, open the command palette (`Ctrl+Shift+P`) and select `Extensions: Install from VSIX...` and select the `vs-cedric-x.x.x.vsix` file.
