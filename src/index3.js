const { app, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { version } = require(path.join(__dirname, '..', 'package.json'));

console.log(`App version: ${version}`);

autoUpdater.autoDownload = false; // Set to false for manual download control

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info);
  const dialogOpts = {
    type: 'info',
    buttons: ['Download', 'Later'],
    title: 'Update Available',
    message: 'A new version is available. Do you want to download it now?'
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available:', info);
});

autoUpdater.on('error', (error) => {
  console.error('Error in auto-updater:', error);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = `Download speed: ${progressObj.bytesPerSecond}`;
  log_message += ` - Downloaded ${progressObj.percent}%`;
  log_message += ` (${progressObj.transferred}/${progressObj.total})`;
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info);
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: 'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 10000); // Check for updates every 10 seconds
});
