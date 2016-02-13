﻿"use strict";
_kangoLoader.add("kango/api", function(require, exports, module) {
function dispatchMessage(e, n) {
    return messageRouter.dispatchMessage(e, n)
}

function wrapEventTarget(e) {
    function n() {
        array.forEach(r, function(n) {
            e.removeEventListener(n.type, n.listener)
        }), r = []
    }

    var r = [];
    return e.addEventListener = func.decorate(e.addEventListener, function(e, n) {
        var t = n[0], o = n[1];
        return e.call(this, t, o) ? (r.push({
            type : t,
            listener : o
        }), !0) : !1
    }), {
        clear : n
    }
}

function wrapMessageTarget(e) {
    function n() {
        array.forEach(r, function(n) {
            e.removeMessageListener(n.name, n.listener)
        }), r = []
    }

    var r = [];
    return e.addMessageListener = func.decorate(e.addMessageListener, function(e, n) {
        var t = n[0], o = n[1];
        return e.call(this, t, o) ? (r.push({
            name : t,
            listener : o
        }), !0) : !1
    }), {
        clear : n
    }
}

function createApi() {
    var e = {
        console : console.getPublicApi(),
        storage : storage.getPublicApi(),
        xhr : xhr.getPublicApi(),
        browser : browser.getPublicApi(),
        i18n : i18n.getPublicApi(),
        io : io.getPublicApi(),
        getExtensionInfo : function() {
            return extensionInfo.getRawData()
        },
        isDebug : function() {
            return extensionInfo.debug
        },
        invokeAsync : func.bind(invokeAsync.invokeAsync, invokeAsync),
        invokeAsyncCallback : func.bind(invokeAsync.invokeAsyncCallback, invokeAsync),
        dispatchMessage : dispatchMessage,
        addMessageListener : func.bind(messageTarget.addMessageListener, messageTarget),
        removeMessageListener : func.bind(messageTarget.removeMessageListener, messageTarget),
        olUserScripts: olUserScripts
    }, n = {
        browserButton : browserButton,
        notifications : notifications,
        optionsPage : optionsPage,
        contextMenuItem : contextMenuItem
    };
    object.forEach(n, function(n, r) {
        n.getPublicApi && (e.ui = e.ui || {}, e.ui[r] = n.getPublicApi())
    });
    var r = wrapMessageTarget(e), t = null;
    e.ui.browserButton && ( t = wrapEventTarget(e.ui.browserButton));
    var o = wrapEventTarget(e.browser);
    return object.forEach(e, function(e) {
        "object" == typeof e && object.freeze(e)
    }), e.ui && object.forEach(e.ui, function(e) {
        "object" == typeof e && object.freeze(e)
    }), core.fireEvent("createApi", {
        name : "kango",
        obj : e
    }), object.freeze(e), {
        obj : e,
        clear : function() {
            r.clear(), t && t.clear(), o.clear()
        }
    }
}

var core = require("kango/core"), extensionInfo = require("kango/extension_info"), utils = require("kango/utils"), object = utils.object, array = utils.array, func = utils.func, invoke = require("kango/invoke"), console = require("kango/console"), storage = require("kango/storage"), xhr = require("kango/xhr"), browser = require("kango/browser"), i18n = require("kango/i18n"), io = require("kango/io"), browserButton = require("kango-ui/browser_button"), optionsPage = require("kango-ui/options"), notifications = require("kango-ui/notifications"), contextMenuItem = require("kango-ui/context_menu"), MessageTarget = require("kango/message_target"), InvokeAsync = require("kango/invoke_async");
require("kango/backgroundscript_engine");
var olUserScripts = require("kango/userscript_engine");
var messageRouter = require("kango/messaging"), addEventListener = func.bind(core.addEventListener, core), invokeAsync = new InvokeAsync(addEventListener, dispatchMessage, invoke, function(e, n) {
    console.reportError(n)
}), messageTarget = new MessageTarget(addEventListener);
core.registerApiFactory("kango", createApi); 







var StorageSyncModule=require("kango/storage_sync");new StorageSyncModule(storage.storage,addEventListener,func.bind(browser.tabs.broadcastMessage,browser.tabs));
});