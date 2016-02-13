var core = require('kango/core');
    var olKangoChromeWindows = require('kango/chrome_windows');

//chromeWindows
function createOlKangoChromeWindowsApi() {
    var listeners = [];

    var api = {
        onUnload: function(listener) {
            if (olKangoChromeWindows.addEventListener(olKangoChromeWindows.event.WINDOW_UNLOAD, listener)) {
                listeners.push(listener);
            }
        }
    };

    function clear() {
        for (var i = 0; i < listeners.length; i++) {
            olKangoChromeWindows.removeEventListener(olKangoChromeWindows.event.WINDOW_UNLOAD, listener);
        }
    }

    return {
        obj: api,
        clear: clear
    };
}
core.registerApiFactory('olKangoChromeWindows', createOlKangoChromeWindowsApi);