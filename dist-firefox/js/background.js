(()=>{"use strict";chrome.runtime.onMessage.addListener(((o,n)=>{var e,i,d;"open_extension_popup"===o&&(null===(i=null===(e=chrome.action)||void 0===e?void 0:e.openPopup)||void 0===i||i.call(e,{windowId:null===(d=n.tab)||void 0===d?void 0:d.windowId}))}))})();