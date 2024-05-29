const { app, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { version } = require(path.join(__dirname, '..', 'package.json'));

console.log(`App version: ${version}`);

// Configure the updater
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'mandeepsng',
  repo: 'screenshort-app',
  autoDownload: true
});

autoUpdater.on('update-available', () => {
  console.log('Update available');
});

autoUpdater.on('update-not-available', () => {
  console.log('Update not available');
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

autoUpdater.on('update-downloaded', (event) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: event.releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
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
