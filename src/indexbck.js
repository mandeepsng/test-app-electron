"use strict";

const { app, autoUpdater, dialog } = require('electron');
const path = require('path');
const { version } = require(path.join(__dirname,'..', 'package.json'));

const server = "https://update.electronjs.org";
const feed = `${server}/your-username/your-repo/${process.platform}-${process.arch}/${version}`;

app.on('ready', () => {
  autoUpdater.setFeedURL({ url: feed });
  autoUpdater.checkForUpdates();

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available.', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.', info);
  });

  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater.', err);
  });

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    console.log('Update downloaded.');
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  });
});
