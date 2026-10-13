'use strict';
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin';
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f172a',
    title: 'SchaltLab',
    icon: path.join(__dirname, 'build', 'icon.png'),
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Externe Links immer im Standardbrowser öffnen, nie im Editor-Fenster
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://')) { e.preventDefault(); shell.openExternal(url); }
  });
  win.on('closed', () => { win = null; });
}

/* Menü:
   Windows/Linux: keine Menüleiste, damit Strg+Z/C/V/A und Co. ungestört bei der Zeichenfläche ankommen.
   macOS: braucht ein Menü (Cmd+Q, Kopieren/Einfügen in Textfeldern). Die Bearbeiten-Befehle
   gehen in Textfeldern an das Feld, sonst an den Editor (window.__menuCmd). */
function editCmd(cmd, wcMethod) {
  return () => {
    if (!win) return;
    const wc = win.webContents;
    wc.executeJavaScript("(()=>{const a=document.activeElement;return !!a&&/INPUT|TEXTAREA/.test(a.tagName);})()")
      .then(inField => {
        if (inField) wc[wcMethod]();
        else wc.executeJavaScript("window.__menuCmd&&window.__menuCmd(" + JSON.stringify(cmd) + ")");
      })
      .catch(() => {});
  };
}
function buildMenu() {
  if (!isMac) { Menu.setApplicationMenu(null); return; }
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { role: 'appMenu' },
    { label: 'Bearbeiten', submenu: [
      { label: 'Rückgängig', accelerator: 'Cmd+Z', click: editCmd('undo', 'undo') },
      { label: 'Wiederholen', accelerator: 'Cmd+Shift+Z', click: editCmd('redo', 'redo') },
      { type: 'separator' },
      { label: 'Ausschneiden', accelerator: 'Cmd+X', click: editCmd('cut', 'cut') },
      { label: 'Kopieren', accelerator: 'Cmd+C', click: editCmd('copy', 'copy') },
      { label: 'Einfügen', accelerator: 'Cmd+V', click: editCmd('paste', 'paste') },
      { label: 'Alles auswählen', accelerator: 'Cmd+A', click: editCmd('selectall', 'selectAll') }
    ] },
    { role: 'windowMenu' }
  ]));
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    buildMenu();
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on('window-all-closed', () => { if (!isMac) app.quit(); });
}
