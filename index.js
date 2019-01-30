const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } =  electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => { app.quit()});

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function addNewWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('close', () => addWindow = null );
}

function clearTOdos() {
    mainWindow.webContents.send('clear_todos');
}

ipcMain.on('add_todo', (event, todo) => {
    mainWindow.webContents.send('add_todo', todo);
    addWindow.close();
})

const menuTemplate = [ 
    {
        label: "File",
        submenu: [
            { 
                label: "New Todo",
                click() {
                    addNewWindow()
                }
            },
            {
                label: 'Clear Todos',
                click() {
                    clearTOdos()
                }
            },
            { 
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform === "darwin") {
    menuTemplate.unshift({label: ''})
}

if(process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Command+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}