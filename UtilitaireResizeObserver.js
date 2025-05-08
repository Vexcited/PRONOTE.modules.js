exports.UtilitaireResizeObserver = UtilitaireResizeObserver;
function UtilitaireResizeObserver() {}
const c_idData = "data_resizeObbserver";
UtilitaireResizeObserver.observe = function (aParams) {
  const lParams = Object.assign(
    { node: null, nodeObserve: null, callback: null, timeoutCallback: 100 },
    aParams,
  );
  const lNodeObserve = lParams.nodeObserve || lParams.node;
  if (!lParams.node || !lNodeObserve || !lParams.callback) {
    return;
  }
  const lData = { timeout: null, surInit: true };
  UtilitaireResizeObserver.unobserve(lParams.node);
  try {
    const lRect = $.extend({}, lNodeObserve.getBoundingClientRect());
    lData.surInit = true;
    lData.observer = new ResizeObserver((aObservers) => {
      if (lData.surCallback) {
        delete lData.surCallback;
        clearTimeout(lData.timeoutReinit);
        return;
      }
      if (aObservers[0] && aObservers[0].contentRect) {
        const lWidthCurrent = aObservers[0].contentRect.width;
        const lHeightCurrent = aObservers[0].contentRect.height;
        if (
          lWidthCurrent > 0 &&
          lHeightCurrent > 0 &&
          (Math.abs(lWidthCurrent - lRect.width) > 1 ||
            Math.abs(lHeightCurrent - lRect.height) > 1)
        ) {
          lRect.width = lWidthCurrent;
          lRect.height = lHeightCurrent;
          const lFunc = function () {
            lData.surCallback = true;
            lParams.callback();
            lData.timeoutReinit = setTimeout(() => {
              delete lData.surCallback;
            }, 10);
          };
          if (lData.surInit) {
            if (lData.timeout) {
              return;
            }
            lData.timeout = setTimeout(() => {
              lData.surInit = false;
              lData.timeout = null;
              lFunc();
            }, lParams.timeoutCallback);
          } else {
            lFunc();
          }
        }
      }
    });
    lData.observer.observe(lNodeObserve);
    lData.element = lNodeObserve;
    $(lParams.node).data(c_idData, lData);
  } catch (e) {}
  $(lParams.node)
    .off("destroyed.resizeobserver")
    .on("destroyed.resizeobserver", function () {
      UtilitaireResizeObserver.unobserve(this);
    });
};
UtilitaireResizeObserver.unobserve = function (aNode) {
  const lData = $(aNode).data(c_idData);
  if (lData) {
    $(aNode).data(c_idData, null);
    if (lData.timeout) {
      clearTimeout(lData.timeout);
      lData.timeout = null;
    }
    if (lData.observer && lData.element) {
      lData.observer.unobserve(lData.element);
    }
  }
};
