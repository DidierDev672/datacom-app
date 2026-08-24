var showDialogCallback = null;
var isDialogVisible = false;

export function registerSessionExpiredHandler(callback) {
  showDialogCallback = callback;
}

export function notifySessionExpired(options) {
  if (isDialogVisible) {
    return;
  }

  if (typeof showDialogCallback !== "function") {
    console.warn(
      "[sessionExpired] Modal no registrado. Origen:",
      options && options.source
    );
    return;
  }

  isDialogVisible = true;
  showDialogCallback(options || {});
}

export function resetSessionExpiredDialog() {
  isDialogVisible = false;
}
