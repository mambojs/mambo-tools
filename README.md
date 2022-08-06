# Mambo Tools Development Web App
### Installation
1. Clone Repository
2. Install Dependencies _(requires Node.js version 16+)_
```bash
npm install
```
3. Run the Node.js Web Server _(Express.js)_
```bash
npm start
```
4. To run a new Build process _(./build)_
```bash
npm run build
```
5. Configure and Run VS Code internal IDE Debugger
   1. **Name:** [Deprecated] Debugger for Chrome.<br>
      **Description:** Debug your JavaScript code in the Chrome browser, or any other target that supports the Chrome Debugger protocol.<br>
      **Publisher:** Microsoft<br>
      **VS Marketplace Link:** https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome<br><br>
   2. While the Node.js Web Server is running _(npm start)_<br>
      In VS Code Press the **F5** Key or go to the **Run & Debug** tab and run the **Debug in Chrome** configuration and a new Chrome Browser window will open automatically.<br><br>
   3. Set your breakpoints in any JavaScript file and they should fire accordingly.
