import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import store from "../stores/store";
import Store from "electron-store";
import generateKey from "./helper";
import windowStateKeeper from "electron-window-state";
import fs from "fs";

if (process.env.NODE_ENV !== "development") {
	global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\");
}

let win;
let winState;
const winURL = process.env.NODE_ENV === "development" ? "http://localhost:9080" : `file://${__dirname}/index.html`;
let config;

function createWindow() {
	win = new BrowserWindow({
		"x": winState.x,
		"y": winState.y,
		"width": winState.width,
		"height": winState.height,
		minWidth: 700,
		minHeight: 500,
		frame: false,
		backgroundColor: "#262626",
		icon: `${__dirname}/logo.png`,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	win.loadURL(winURL);

	win.on("closed", () => {
		win = null;
	});
}

let tray = null;
if (!fs.existsSync("./data")) {
	fs.mkdirSync("./data");
}

let envPath = fs.realpathSync("./data");
app.setPath("userData", envPath);

function init() {
	config = new Store();
	store.dispatch("test");

	if (!config.has("username")) {
		let username = `user#${(Math.random() * 10000).toString().substring(0, 4)}`;
		config.set("username", username);
	}
	store.dispatch("username", config.get("username"));

	if (!config.has("private_key") || config.get("private_key") === "" || !config.has("public_key") || config.get("public_key") === "") {
		config.set("private_key", generateKey());
		config.set("public_key", generateKey());
	}
	store.dispatch("privateKey", config.get("private_key"));
	store.dispatch("publicKey", config.get("public_key"));
}

app.on("ready", () => {
	winState = windowStateKeeper({
		defaultWidth: 1200,
		defaultHeight: 900,
		fullScreen: true,
	});
	createWindow();
	init();
	tray = new Tray(path.join(__dirname, "logo.png"));
	const contextMenu = Menu.buildFromTemplate([
		{
			label: `verion ${app.getVersion()}`,
		},
		{
			label: "quit quarck",
			click: function() {
				app.quit();
			},
		},
	]);
	tray.setToolTip("quarck");
	tray.setContextMenu(contextMenu);
	tray.on("click", () => {
		if (win === null) {
			createWindow();
		} else {
			win.focus();
		}
	});
	winState.manage(win);
});

app.on("window-all-closed", () => {
	app.quit();
});

app.on("activate", () => {
	if (win === null) {
		createWindow();
	}
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
	autoUpdater.quitAndInstall()
})

app.on('ready', () => {
	if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
