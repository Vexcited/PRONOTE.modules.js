exports.getApp = getApp;
exports.setApp = setApp;
setApp(null);
function getApp() {
	return global.GApplication;
}
function setApp(aApp) {
	global.GApplication = aApp;
}
