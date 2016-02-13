/* global chrome */
// Required for Opera and IE
// var $ = window.$.noConflict(true);
// $.support.cors = true;

/**
 *  Onelog extension
 */

var olExtension = {
    Log: function(message) {
        if(false) {
            switch(olData.BrowserName) {
                case 'iejs':
                    kango.console.log('ExtLOG: ');
                    kango.console.log(message);
                    break;
            default:
                    console.info(message);
                    break;
            }
        }
    },
    Functions : {
        Guid : function() {
            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            return guid;
        },
        Sleep : function(ms) {
            try {
                var dt = new Date();
                dt.setTime(dt.getTime() + ms);
                while (new Date().getTime() < dt.getTime()) {
                }
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('Sleep', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        UniqueArray : function(array) {
            var uniqueArray_ = array.concat();
            for (var i = 0; i < uniqueArray_.length; ++i) {
                for (var j = i + 1; j < uniqueArray_.length; ++j) {
                    if (uniqueArray_[i] === uniqueArray_[j])
                        uniqueArray_.splice(j--, 1);
                }
            }
            return uniqueArray_;
        },
        GetDomainFromUrl : function(url) {
            var matches_ = url.match(/:\/\/(.[^/:]+)/);
            return ((matches_ !== null && typeof matches_[1] != 'undefined') ? matches_[1] : null);
        },
        fixIEObjectToArray : function(objectToTrasformToArray, destinationArray) {
            try {
                for (var c = 0; c < objectToTrasformToArray.length; c++) {
                    destinationArray.push(olFunctions.Clone(objectToTrasformToArray[c]));
                }
                return destinationArray;
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('fixIEObjectToArray', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        _parseEventDataExtension : function(event) {
            try {
                if (event && event.data) {
                    event.data = JSON.parse(event.data);
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('_parseEventData', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        CloseTabFunction : function(targetTab, delay) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Close tab message', 'Recevied by extension\nTab id: ' + targetTab.getId());
                setTimeout(function() {
                    var alertErrorContent_;
                    try {
                        olExtension._internal.LogoutWindowsNumber--;
                        // TODO check if this is needed
                        // olExtension._internal.TabMember.RemoveLogout(tabMembers_[i]);
                        targetTab.close();
                    } catch (e) {
                        alertErrorContent_ = new olFunctions.AlertContent('CloseTabFunction failed to close tab', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    } finally {
                        if (olExtension._internal.LogoutWindowsNumber <= 0) {
                            olExtension._internal.LogoutWindowsNumber = 0;
                            try {
                                switch (olData.BrowserName) {
                                    case 'iejs':
                                    if (olExtension._internal.tabObjectReference !== null) {
                                            olExtension._internal.tabObjectReference.close();
                                        }
                                        //TODO Videti sa Vojkanom
                                        break;
                                default:
                                    if (olExtension._internal.windowObjectReference !== null) {
                                            olExtension._internal.windowObjectReference.close();
                                        }
                                        break;
                                }
                            } catch (e) {
                                alertErrorContent_ = new olFunctions.AlertContent('CloseTabFunction failed to close windowObjectReference object', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            } finally {
                                if (olExtension._internal.windowObjectReference !== null) {
                                    olExtension._internal.windowObjectReference = null;
                                }

                                olExtension._internal.tabObjectReference = null;
                            }
                        }
                    }
                }, delay);
                olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.CloseTab(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('CloseTab', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        HandleCookiesArray : function() {
            try {
                switch (olData.BrowserName) {
                    case 'chrome':
                    if (olFunctions.IsFilledArray(olData.CookiesInfoArray.TabMembers)) {
                            var allDomainsToBeRemoved_ = [];
                        for (var i in olData.CookiesInfoArray.TabMembers) {

                                // Get all domains which cookies should be removed
                                allDomainsToBeRemoved_ = olExtension.Functions.UniqueArray(allDomainsToBeRemoved_.concat(olData.CookiesInfoArray.TabMembers[i].Domains));
                            }
                            olExtension.Functions.RemoveDomainCookies(allDomainsToBeRemoved_);
                            olData.CookiesInfoArray.TabMembers = [];
                            olData.CookiesInfoArray.TabMembersLocked = false;
                        }
                        break;
                default:
                        break;
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('HandleCookiesArray', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        RemoveDomainCookies : function(resourceDomains) {
            try {
                var removeCookies_ = {};
                if (!chrome.cookies) {
                    chrome.cookies = chrome.experimental.cookies;
                }
                chrome.cookies.getAll({}, function(cookies) {
                    if (cookies) {
                        for (var i in cookies) {
                            var currentCookie_ = cookies[i];

                            if (!currentCookie_.expirationDate) {
                                // delete cookies that don't have expiration date only
                                for (var j in resourceDomains) {
                                    var currentResourceDomain_ = resourceDomains[j];
                                    if (("." + currentResourceDomain_).indexOf(currentCookie_.domain) != -1) {
                                        var key_ = currentCookie_.name + currentCookie_.domain + currentCookie_.hostOnly + currentCookie_.path + currentCookie_.secure + currentCookie_.httpOnly + currentCookie_.session + currentCookie_.storeId;
                                        removeCookies_[key_] = currentCookie_;
                                        break;
                                    }
                                }
                            }
                        }
                        for (var k in removeCookies_) {
                            var removeCookie_ = removeCookies_[k];
                            var url_ = "http" + (removeCookie_.secure ? "s" : "") + "://" + removeCookie_.domain + removeCookie_.path;
                            var name_ = removeCookie_.name;
                            chrome.cookies.remove({
                                "url" : url_,
                                "name" : name_
                            });
                        }
                    } else {
                        var alertErrorContent_ = new olFunctions.AlertContent('RemoveDomainCookies ', ' NO COOKIES!');
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('RemoveDomainCookies', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        RemoveCookies : function(tabMember) {
            try {
                switch (olData.BrowserName) {
                    case 'chrome':
                        var tabMembers_ = olExtension._internal.TabMember.Filter(tabMember.WindowHandle, null, null, tabMember.ApplicationsSessionId);
                    if (tabMembers_.length === 0) {
                            olData.CookiesInfoArray.TabMembers.push(tabMember);
                        }
                        break;
                default:
                        break;
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('RemoveCookies', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                switch (olData.BrowserName) {
                    case 'chrome':
                        olData.CookiesInfoArray.TabMembers.push(tabMember);
                        break;
                default:
                        break;
                }
            }
        }
    },
    _internal : {
        TabMember : {
            _internal : {
                FreeTabMembers : function() {
                    try {
                        olData.TabInfoArray.TabMembersLocked = false;
                    } catch (e) {
                        var alertContent_ = new olFunctions.AlertContent('FreeTabMembers', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    }
                },
                LockTabMembers : function() {
                    try {
                        while (olData.TabInfoArray.TabMembersLocked) {
                            olExtension.Functions.Sleep(olOptions.General.Extension.TabInfoArraySleepInterval());
                        }
                        olData.TabInfoArray.TabMembersLocked = true;
                    } catch (e) {
                        var alertContent_ = new olFunctions.AlertContent('LockTabMembers', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    }
                },
                FreeLogoutTabMembers : function() {
                    try {
                        olData.LogoutInfoArray.TabMembersLocked = false;
                    } catch (e) {
                        var alertContent_ = new olFunctions.AlertContent('FreeLogoutTabMembers', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    }
                },
                LockLogoutTabMembers : function() {
                    try {
                        while (olData.LogoutInfoArray.TabMembersLocked) {
                            olExtension.Functions.Sleep(olOptions.General.Extension.TabInfoArraySleepInterval());
                        }
                        olData.LogoutInfoArray.TabMembersLocked = true;
                    } catch (e) {
                        var alertContent_ = new olFunctions.AlertContent('LockLogoutTabMembers', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    }
                }
            },
            Add : function(tabMember) {
                try {
                    olExtension._internal.TabMember._internal.LockTabMembers();
                    var tabMembers_ = $.grep(olData.TabInfoArray.TabMembers, function(member) {
                        return (member.Id == tabMember.Id);
                    });
                    if (!olFunctions.IsFilledArray(tabMembers_)) {
                        olData.TabInfoArray.TabMembers.push(tabMember);
                    }
                    olExtension._internal.TabMember._internal.FreeTabMembers();
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Add', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            Create : function(tabId, url) {
                try {
                    var tabMember_ = new olExtension.DataConstructors.TabMember(tabId, url);
                    olExtension._internal.TabMember.Add(tabMember_);
                    return tabMember_;
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Create', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            ChangeApplicationIdAndStartTime : function(fromAppId, toAppId, bnrStartTime, tmPauseDuration) {
                try {
                    olExtension._internal.TabMember._internal.LockTabMembers();
                    var tabMembers_ = $.grep(olData.TabInfoArray.TabMembers, function(member) {
                        return (member.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId == fromAppId);
                    });
                    for (var i = 0; i < tabMembers_.length; i++) {
                        tabMembers_[i].PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId = toAppId;
                        tabMembers_[i].ApplicationsSessionId = toAppId;
                        tabMembers_[i].PageInfo.Response.BeforeNavigateResponses[0].StartTime = bnrStartTime;
                        if (tmPauseDuration) {
                            tabMembers_[i].PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = tmPauseDuration;
                        } else {
                            tabMembers_[i].PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = 0;
                        }
                    }
                    olExtension._internal.TabMember._internal.FreeTabMembers();
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('ChangeApplicationIdAndStartTime', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            _getLocked : false,
            Filter : function(windowHandle, tabId, url, applicationsSessionId) {
                if (!olExtension._internal.TabMember._getLocked) {
                    olExtension._internal.TabMember._getLocked = true;
                    olExtension._internal.TabMember._internal.LockTabMembers();
                    var tabMembers_ = $.grep(olData.TabInfoArray.TabMembers, function(member) {
                        return ((!windowHandle || member.WindowHandle == windowHandle) && (!url || url == member.PageInfo.Url) && (!tabId || member.TabId == tabId) && (!applicationsSessionId || (olFunctions.IsFilledArray(member.PageInfo.Response.BeforeNavigateResponses) && member.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId == applicationsSessionId)));
                    });
                    olExtension._internal.TabMember._internal.FreeTabMembers();
                    olExtension._internal.TabMember._getLocked = false;

                    return tabMembers_;
                } else {
                    setTimeout(function() {
                        olExtension._internal.TabMember.Filter(windowHandle, tabId, url, applicationsSessionId);
                    }, olOptions.General.Extension.TabInfoArraySleepInterval());
                }
            },
            Remove : function(tabMember, deleteCookies) {
                if ( typeof (deleteCookies) === 'undefined')
                    deleteCookies = true;
                try {
                    if (!olExtension._internal.TabMember._getLocked) {
                        olExtension._internal.TabMember._getLocked = true;
                        olExtension._internal.TabMember._internal.LockTabMembers();

                        if (tabMember._internal.ExtensionFlags.ServiceResponded) {
                            olData.TabInfoArray.TabMembers = $.grep(olData.TabInfoArray.TabMembers, function(member) {
                                try {
                                    return ((member.ApplicationsSessionId || !member._internal.ExtensionFlags.ServiceResponded) && (member.PageInfo.Url !== null) && (member.Id != tabMember.Id));
                                } catch (e) {
                                    return false;
                                }
                            });
                        }
                        olExtension._internal.TabMember._internal.FreeTabMembers();
                        olExtension._internal.TabMember._getLocked = false;

                        if (deleteCookies && tabMember.PageInfo.Response.BeforeNavigateResponses && tabMember.PageInfo.Response.BeforeNavigateResponses[0].AppIdSpecified && !tabMember.PageInfo.Response.BeforeNavigateResponses[0].LogoutScriptExists) {
                            olExtension.Functions.RemoveCookies(tabMember);
                        }
                    } else {
                        setTimeout(function() {
                            olExtension._internal.TabMember.Remove(tabMember, deleteCookies);
                        }, olOptions.General.Extension.TabInfoArraySleepInterval());
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Remove', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    olExtension._internal.TabMember._internal.FreeTabMembers();
                }
            },
            RemoveOnErrorState : function(tabMember) {
                try {
                    if (tabMember._internal.ExtensionFlags.ErrorState && tabMember._internal.ExtensionFlags.DocumentReady) {
                        olExtension._internal.TabMember.Remove(tabMember);
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('RemoveOnErrorState', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    olExtension._internal.TabMember._internal.FreeTabMembers();
                }
            },
            _getLogoutTMLocked : false,
            FilterLogoutInfoArray : function(windowHandle, tabId, applicationsSessionId) {
                if (!olExtension._internal.TabMember._getLogoutTMLocked) {
                    olExtension._internal.TabMember._getLogoutTMLocked = true;
                    olExtension._internal.TabMember._internal.LockLogoutTabMembers();
                    var tabMembers_ = $.grep(olData.LogoutInfoArray.TabMembers, function(member) {
                        return ((!windowHandle || member.WindowHandle == windowHandle) && (!tabId || member.TabId == tabId) && (!applicationsSessionId || member.ApplicationsSessionId == applicationsSessionId));
                    });
                    olExtension._internal.TabMember._internal.FreeLogoutTabMembers();

                    olExtension._internal.TabMember._getLogoutTMLocked = false;
                    return tabMembers_;
                } else {
                    setTimeout(function() {
                        olExtension._internal.TabMember.FilterLogoutInfoArray(windowHandle, tabId, applicationsSessionId);
                    }, olOptions.General.Extension.TabInfoArraySleepInterval());
                }
            },
            GetLogoutTM : function(logoutWindowAttached, windowHandle, tabId) {
                if (!olExtension._internal.TabMember._getLogoutTMLocked) {
                    olExtension._internal.TabMember._getLogoutTMLocked = true;
                    var returnValue_;
                    var tabMembers_ = new Array();

                    if (logoutWindowAttached) {
                        tabMembers_ = $.grep(olData.LogoutInfoArray.TabMembers, function(member) {
                            return ((member._internal.ExtensionFlags.LogoutWindowAttached == logoutWindowAttached) && (!windowHandle || member.WindowHandle == windowHandle) && (!tabId || member.TabId == tabId));
                        });
                    } else {
                        tabMembers_ = $.grep(olData.LogoutInfoArray.TabMembers, function(member) {
                            return ((!logoutWindowAttached || member._internal.ExtensionFlags.LogoutWindowAttached == logoutWindowAttached));
                        });
                    }

                    if (olFunctions.IsFilledArray(tabMembers_)) {
                        returnValue_ = tabMembers_[0];
                        if (!returnValue_._internal.ExtensionFlags.LogoutWindowAttached) {
                            returnValue_._internal.ExtensionFlags.LogoutWindowAttached = true;
                            returnValue_._internal.ExtensionFlags.LogoutWindowAttachTime = new Date().getTime();
                        }
                        returnValue_.TabId = tabId;
                        returnValue_.WindowHandle = windowHandle;
                    } else {
                        returnValue_ = null;
                    }
                    olExtension._internal.TabMember._getLogoutTMLocked = false;

                    return returnValue_;
                } else {
                    setTimeout(function() {
                        olExtension._internal.TabMember.GetLogoutTM(logoutWindowAttached, windowHandle, tabId);
                    }, olOptions.General.Extension.TabInfoArraySleepInterval());
                }
            },
            RemoveLogout : function(tabMember) {
                try {
                    if (!olExtension._internal.TabMember._getLogoutTMLocked) {
                        olExtension._internal.TabMember._getLogoutTMLocked = true;
                        olExtension._internal.TabMember._internal.LockLogoutTabMembers();

                        olExtension.Functions.RemoveCookies(tabMember);

                        olData.LogoutInfoArray.TabMembers = $.grep(olData.LogoutInfoArray.TabMembers, function(member) {
                            try {
                                return ((member.PageInfo.Url !== null) && (member.Id != tabMember.Id));
                            } catch (e) {
                                return false;
                            }
                        });
                        olExtension._internal.TabMember._getLogoutTMLocked = false;
                        olExtension._internal.TabMember._internal.FreeLogoutTabMembers();
                    } else {
                        setTimeout(function() {
                            olExtension._internal.TabMember.RemoveLogout(tabMember);
                        }, olOptions.General.Extension.TabInfoArraySleepInterval());
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Remove', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            RemoveFromCookieArray : function(tabMember) {
                try {
                    if (!olData.CookiesInfoArray.TabMembersLocked) {
                        olData.CookiesInfoArray.TabMembersLocked = true;
                        olData.CookiesInfoArray.TabMembers = $.grep(olData.CookiesInfoArray.TabMembers, function(member) {
                            try {
                                return ((member.PageInfo.Url !== null) && (member.Id != tabMember.Id));
                            } catch (e) {
                                return false;
                            }
                        });
                        olData.CookiesInfoArray.TabMembersLocked = false;
                    } else {
                        setTimeout(function() {
                            olExtension._internal.TabMember.RemoveFromCookieArray(tabMember);
                        }, olOptions.General.Extension.TabInfoArraySleepInterval());
                    }
                } catch (e) {
                    olData.CookiesInfoArray.TabMembersLocked = false;
                    var alertContent_ = new olFunctions.AlertContent('RemoveFromCookieArray', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            GetElementVaribleReplacement : function(definedNamesArray, variables) {
                var elValue_ = null;
                if (olFunctions.IsFilledArray(variables)) {
                    for (var i = 0; i < variables.length; i++) {
                        var currentVariable_ = variables[i];
                        if ($.inArray(currentVariable_.DefinedName, definedNamesArray) > -1) {
                            elValue_ = currentVariable_.Value;
                            break;
                        }
                    }
                }
                return elValue_;
            },
            HandleResourceEnd : function(tabMember) {
                try {
                    if (tabMember.ApplicationsSessionId) {
                        var tabMembers_ = olExtension._internal.TabMember.Filter(tabMember.WindowHandle, null, null, tabMember.ApplicationsSessionId);
                        if (tabMembers_.length == 1) {
                            //instead of quitting we now check if there is logout script
                            var requestContent_;
                            if (tabMember.PageInfo.Response.BeforeNavigateResponses[0].LogoutScriptExists) {
                                //if there is a logout script we need tab info stored in separate array for logouts
                                //also we need closing responses
                                if (tabMember.PageInfo.ClosingResponse) {
                                    //we have closing responses from window closing request
                                    olData.LogoutInfoArray.TabMembers.push(tabMember);
                                    olExtension._internal.TabMember.Remove(tabMember, false);

                                    requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember);
                                    olExtension.Service.NewWindowRequestSend(requestContent_);
                                } else {
                                    requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember);
                                    olExtension.Service.QuittingResourceSessionRequestSend(requestContent_);
                                }
                            } else {
                                requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember);
                                olExtension.Service.QuittingResourceSessionRequestSend(requestContent_);
                            }
                        } else {
                            olExtension._internal.TabMember.Remove(tabMember);
                            if (tabMember.CloseTab) {
                                tabMember.TargetTab.close();
                            }
                        }
                    } else {
                        olExtension._internal.TabMember.Remove(tabMember, false);
                    }
                } catch (e) {
                    olExtension._internal.TabMember.Remove(tabMember);
                    var alertContent_ = new olFunctions.AlertContent('HandleResourceEnd', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            }
        },
        GetUrlForResource : function(resourceInitialURL) {
            var resourceURL = '';

            switch (olData.BrowserName) {
                case 'iejs':
                    resourceURL = olExtension.Data.ResourcesUrlPrefix + resourceInitialURL;
                    break;
                default:
                    resourceURL = kango.io.getResourceUrl(resourceInitialURL);
                    break;
            }
            return resourceURL;
        },
        _escapeRegExp : function(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        },
        _replaceAll : function(string, find, replace) {
            return string.replace(new RegExp(olExtension._internal._escapeRegExp(find), 'g'), replace);
        },
        StoreOneLogForms : function() {
            try {
                var resourcesUrlPrefix_ = '',
                    resourceXmlolStyle_,
                    resourceXmlBody_;
                switch (olData.BrowserName) {
                    case 'iejs':
                        resourcesUrlPrefix_ = olExtension.Data.ResourcesUrlPrefix;
                        resourceXmlolStyle_ = kango.xhr.getXMLHttpRequest();
                        resourceXmlBody_ = kango.xhr.getXMLHttpRequest();
                        break;
                    default:
                        resourceXmlolStyle_ = new XMLHttpRequest();
                        resourceXmlBody_ = new XMLHttpRequest();
                        break;
                }

                var ExtensionInfo_ = kango.getExtensionInfo();
                resourceXmlolStyle_.open('GET', resourcesUrlPrefix_ + 'onelogStyles.css?version=' + ExtensionInfo_.version, false);

                resourceXmlolStyle_.send(null);
                var responseOlStyle_ = resourceXmlolStyle_.responseText;
                var responseOlStyleIE7Fix_ = null;

                switch (olData.BrowserName) {
                    case 'iejs':
                        var resourceXmlolStyleIE7Fix_ = kango.xhr.getXMLHttpRequest();
                        resourceXmlolStyleIE7Fix_.open('GET', resourcesUrlPrefix_ + 'onelogStylesIE7compatibilityFix.css?version=' + ExtensionInfo_.version, false);
                        resourceXmlolStyleIE7Fix_.send(null);
                        responseOlStyleIE7Fix_ = resourceXmlolStyleIE7Fix_.responseText;
                        break;
                    default:
                        break;
                }

                var style_ = '<style id= "olStyle" type="text/css">' + responseOlStyle_ + '</style>';

                if (responseOlStyleIE7Fix_) {
                    var styleIE7_ = '<style id= "olStyleIE7" type="text/css">' + responseOlStyleIE7Fix_ + '</style>';
                }

                //fix urls of png files
                style_ = olExtension._internal._replaceAll(style_, 'url(res/ui-icons_222222_256x240.png)', 'url(' + olExtension._internal.GetUrlForResource('res/ui-icons_222222_256x240.png') + ')');

                style_ = olExtension._internal._replaceAll(style_, 'url(res/smallLeft.png)', 'url(' + olExtension._internal.GetUrlForResource('res/smallLeft.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/olRefresh16.png)', 'url(' + olExtension._internal.GetUrlForResource('res/olRefresh16.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/smallRight.png)', 'url(' + olExtension._internal.GetUrlForResource('res/smallRight.png') + ')');

                style_ = olExtension._internal._replaceAll(style_, 'url(res/button_blue.png)', 'url(' + olExtension._internal.GetUrlForResource('res/button_blue.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/button_green.png)', 'url(' + olExtension._internal.GetUrlForResource('res/button_green.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/button_gray.png)', 'url(' + olExtension._internal.GetUrlForResource('res/button_gray.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/button_unauth.png)', 'url(' + olExtension._internal.GetUrlForResource('res/button_unauth.png') + ')');

                style_ = olExtension._internal._replaceAll(style_, 'url(res/icon32_blue.png)', 'url(' + olExtension._internal.GetUrlForResource('res/icon32_blue.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/icon32_green.png)', 'url(' + olExtension._internal.GetUrlForResource('res/icon32_green.png') + ')');

                style_ = olExtension._internal._replaceAll(style_, 'url(res/close.png)', 'url(' + olExtension._internal.GetUrlForResource('res/close.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/olSearch16.png)', 'url(' + olExtension._internal.GetUrlForResource('res/olSearch16.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/olList16.png)', 'url(' + olExtension._internal.GetUrlForResource('res/olList16.png') + ')');
                style_ = olExtension._internal._replaceAll(style_, 'url(res/olCancel16.png)', 'url(' + olExtension._internal.GetUrlForResource('res/olCancel16.png') + ')');

                style_ = olExtension._internal._replaceAll(style_, 'url(res/olSmallDown.png)', 'url(' + olExtension._internal.GetUrlForResource('res/olSmallDown.png') + ')');

                kango.storage.setItem('olStyle', style_);

                if (responseOlStyleIE7Fix_)
                    kango.storage.setItem('olStyleIE7', styleIE7_);

                resourceXmlBody_.open('GET', resourcesUrlPrefix_ + 'resource.html?version=' + ExtensionInfo_.version, false);
                resourceXmlBody_.send(null);
                var response_ = resourceXmlBody_.responseText;
                response_ = olExtension._internal.Translate(response_);

                // var bodyEvalScripts_ = response_.match(/<div id="olEnvelopeEvalScripts"[^>]*>[\s\S]*<\/div id="olEnvelopeEvalScripts">/gi)[0].replace(/<div id="olEnvelopeEvalScripts"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeEvalScripts">/gi, '');
                // kango.storage.setItem('olEvalScripts', bodyEvalScripts_);

                var bodyMisc_ = response_.match(/<div id="olEnvelopeMisc"[^>]*>[\s\S]*<\/div id="olEnvelopeMisc">/gi)[0].replace(/<div id="olEnvelopeMisc"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeMisc">/gi, '');
                kango.storage.setItem('olMisc', bodyMisc_);

                var body_ = response_.match(/<div id="olEnvelopeResources"[^>]*>[\s\S]*<\/div id="olEnvelopeResources">/gi)[0].replace(/<div id="olEnvelopeResources"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeResources">/gi, '');
                kango.storage.setItem('olHtml', body_);

                var bodyToolbar_ = response_.match(/<div id="olEnvelopeToolbar"[^>]*>[\s\S]*<\/div id="olEnvelopeToolbar">/gi)[0].replace(/<div id="olEnvelopeToolbar"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeToolbar">/gi, '');
                kango.storage.setItem('olToolbarDiv', bodyToolbar_);

                var bodyTimeout_ = response_.match(/<div id="olEnvelopeResourceTimeout"[^>]*>[\s\S]*<\/div id="olEnvelopeResourceTimeout">/gi)[0].replace(/<div id="olEnvelopeResourceTimeout"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeResourceTimeout">/gi, '');
                kango.storage.setItem('olTimeout', bodyTimeout_);

                var bodyError_ = response_.match(/<div id="olEnvelopeError"[^>]*>[\s\S]*<\/div id="olEnvelopeError">/gi)[0].replace(/<div id="olEnvelopeError"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeError">/gi, '');
                kango.storage.setItem('olError', bodyError_);

                var bodyStorePassword_ = response_.match(/<div id="olEnvelopeStorePassword"[^>]*>[\s\S]*<\/div id="olEnvelopeStorePassword">/gi)[0].replace(/<div id="olEnvelopeStorePassword"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeStorePassword">/gi, '');
                kango.storage.setItem('olStorePassword', bodyStorePassword_);

                var bodyWebControlMessage_ = response_.match(/<div id="olEnvelopeWebControlMessage"[^>]*>[\s\S]*<\/div id="olEnvelopeWebControlMessage">/gi)[0].replace(/<div id="olEnvelopeWebControlMessage"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeWebControlMessage">/gi, '');
                kango.storage.setItem('olWebControlMessage', bodyWebControlMessage_);

                var bodyChooseApplication_ = response_.match(/<div id="olEnvelopeChooseApplication"[^>]*>[\s\S]*<\/div id="olEnvelopeChooseApplication">/gi)[0].replace(/<div id="olEnvelopeChooseApplication"[^>]*>/gi, '').replace(/<\/div id="olEnvelopeChooseApplication">/gi, '');
                kango.storage.setItem('olChooseApplication', bodyChooseApplication_);
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('StoreOneLogForms', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        LanguageItems : [],
        DefaultLanguageItems : [{
            Key : 'JS_AddMatterDetails',
            Value : 'Add matter details'
            }, {
            Key : 'JS_ManageMatter',
            Value : 'Manage matter details'
            }, {
            Key : 'JS_ChoosePassword',
            Value : 'Choose password account'
            }, {
            Key : 'JS_ChooseResource',
            Value : 'Choose application'
            }, {
            Key : 'JS_CommentLabelText',
            Value : 'Comment'
            }, {
            Key : 'JS_CommentLengthWrong',
            Value : 'Comment needs to be at least {rep1} characters'
            }, {
            Key : 'JS_EditPassword',
            Value : 'Edit password account'
            }, {
            Key : 'JS_LabelOf',
            Value : 'Of'
            }, {
            Key : 'JS_LabelPage',
            Value : 'Page'
            }, {
            Key : 'JS_ManagePasswords',
            Value : 'Manage password accounts'
            }, {
            Key : 'JS_MatterNameLabel',
            Value : 'Matter name'
            }, {
            Key : 'JS_MatterNumberLabel',
            Value : 'Matter number'
            }, {
            Key : 'JS_MatterSearch',
            Value : 'Matter search'
            }, {
            Key : 'JS_OKLabel',
            Value : 'OK'
            }, {
            Key : 'JS_PersonalCodeLengthWrong',
            Value : 'The timekeeper number needs to be at least {rep1} characters'
            }, {
            Key : 'JS_PersonalCodeLabelText',
            Value : 'Timekeeper number'
            }, {
            Key : 'JS_ResourceTimeoutLabel',
            Value : 'Resource timeout'
            }, {
            Key : 'JS_AccountTitle',
            Value : 'Account title:'
            }, {
            Key : 'JS_YesLabel',
            Value : 'Yes'
            }, {
            Key : 'JS_NoLabel',
            Value : 'No'
            }, {
            Key : 'JS_InactivityText',
            Value : 'It appears that you are no longer using this resource. Do you wish to be disconnected now?'
            }, {
            Key : 'JS_LicenceLimitReachedMessage',
            Value : 'There are no licences left for this resource'
            }, {
            Key : 'JS_LicenceLimitReachedSubMessage',
            Value : 'Onelog will still record usage but not fill in any login information'
            }, {
            Key : 'JS_LicenceLimitReachedHeading',
            Value : 'Licence limit reached'
            }, {
            Key : 'JS_PooledLicenceLimitReachedSubMessage',
            Value : 'There are currently no pooled licences available for this resource, please try again later.'
            }, {
            Key : 'JS_PooledLicenceLimitReachedMessage',
            Value : 'There are no pooled licences left for this resource'
            }, {
            Key : 'JS_TimekeeperWrong',
            Value : 'Timekeeper number did not validate'
            }, {
            Key : 'JS_MatterNumberWrong',
            Value : 'Matter number did not validate'
            }, {
            Key : 'JS_PleaseInsert',
            Value : 'Please insert {rep1}'
            }, {
            Key : 'JS_PasswordsWrong',
            Value : 'Passwords({rep1}) do not match'
            }, {
            Key : 'JS_AccountExist',
            Value : 'Account with this name already exists'
            }, {
            Key : 'JS_NoChange',
            Value : 'There is no change'
            }, {
            Key : 'JS_InsertMatterNumber',
            Value : 'Please insert matter number'
            }, {
            Key : 'JS_TimekeeperShort',
            Value : 'Timekeeper number is not long enough'
            }, {
            Key : 'JS_SelectComment',
            Value : 'Select predefined comment'
            }, {
            Key : 'JS_CommentShort',
            Value : 'Comment is not long enough'
            }, {
            Key : 'JS_DeleteAccount',
            Value : 'Delete account'
            }, {
            Key : 'JS_DeletePasswordAccount',
            Value : 'Delete password account'
            }, {
            Key : 'JS_CancelDeletePasswordAccount',
            Value : 'Cancel delete password account'
            }, {
            Key : 'JS_NoChangeField',
            Value : 'This field cannot be changed!'
            }, {
            Key : 'JS_Confirm',
            Value : 'Confirm'
            }, {
            Key : 'JS_Default',
            Value : 'Default'
            }, {
            Key : 'JS_EditCommon',
            Value : 'Edit common account'
            }, {
            Key : 'JS_InsertAccountName',
            Value : 'Please insert a name for this account'
            }, {
            Key : 'JS_NewAccount',
            Value : 'New password account'
            }, {
            Key : 'JS_MatterNumberSearch',
            Value : 'Search for matter number'
            }, {
            Key : 'JS_NoMatterDetailsFound',
            Value : 'No matter details found'
            }, {
            Key : 'JS_Search',
            Value : 'Search'
            }, {
            Key : 'JS_ResponseInfo',
            Value : 'If a response is not received within {rep1} seconds you will be automatically logged off'
            }, {
            Key : 'JS_ConnectionError',
            Value : 'Connection error'
            }, {
            Key : 'JS_ConnectionProblemText',
            Value : 'There is currently a problem with the connection. Onelog will resume operation once connection is re-established.'
            }, {
            Key : 'JS_Reset',
            Value : 'Reset'
            }, {
            Key : 'JS_MinimiseToolbar',
            Value : 'Minimise toolbar'
            }, {
            Key : 'JS_MaximiseToolbar',
            Value : 'Maximise toolbar'
            }, {
            Key : 'JS_FillInLoginDetails',
            Value : 'Fill in login details'
            }, {
            Key : 'JS_StayConnected',
            Value : 'Stay connected'
            }, {
            Key : 'JS_Disconnect',
            Value : 'Disconnect'
            }, {
            Key : 'JS_Validating',
            Value : 'Validating'
            }, {
            Key : 'JS_ClickNewAccount',
            Value : 'Click here to add new password account'
            }, {
            Key : 'JS_Common',
            Value : 'Common'
            }, {
            Key : 'JS_DoNotShow',
            Value : 'Do not show this message again'
            }, {
            Key : 'JS_StorePasswordDetailsTitle',
            Value : 'Store password details?'
            }, {
            Key : 'JS_StorePasswordDetailsBody',
            Value : 'Store your password for {rep1}?'
            }, {
            Key : 'JS_UpdatePasswordDetailsTitle',
            Value : 'Update password details?'
            }, {
            Key : 'JS_UpdatePasswordDetailsBody',
            Value : 'Update your stored password for {rep1}?'
            }],
        Translate : function(text) {
            if (olExtension._internal.LanguageItems && olFunctions.IsFilledArray(olExtension._internal.LanguageItems)) {
                for (var i = 0; i < olExtension._internal.LanguageItems.length; i++) {
                    var languageItem_ = olExtension._internal.LanguageItems[i];
                    text = text.replace(new RegExp(String(languageItem_.Key), 'g'), String(languageItem_.Value));
                }
            }
            return text;
        },
        _logoffLocked : false,
        windowObjectReference : null,
        tabObjectReference : null,
        LogoutWindowsNumber : 0,
        OpenLogoutWindowCover : function(parameters) {
            olExtension.Cleaner._CloseCoverWindow = false;
            var url_ = '';
            switch (olData.BrowserName) {
                case 'iejs':
                    url_ = olExtension.Data.LogoutInfoUrl;
                    break;
            default:
                    url_ = kango.io.getResourceUrl("logoutInfo.html");
                    break;
            }
            var logoutCoverWindowClosed_ = false;
            try {
                logoutCoverWindowClosed_ = (!olExtension._internal.windowObjectReference || olExtension._internal.windowObjectReference.closed);
            } catch (e) {
                logoutCoverWindowClosed_ = true;
            }
            olExtension.Cleaner.Reset();
            if (logoutCoverWindowClosed_) {
                switch (olData.BrowserName) {
                    case 'iejs':
                        olExtension._internal.windowObjectReference = kango.browser.windows.createWithOlParam({
                        url : url_,
                        name : 'LogoutCover',
                        parameters : parameters
                        });
                        break;
                default:
                        olExtension._internal.windowObjectReference = window.open(url_, "LogoutCover", parameters);
                        break;
                }

                // save logout tab
                // TODO check this - fixed IE problem with getCurrent tab
                kango.browser.tabs.getAll(function(tabs) {
                    // tabs is Array of KangoBrowserTab
                    for (var i = 0; i < tabs.length; i++) {
                        if (olFunctions.CompareUrls(tabs[i].getUrl(), url_)) {
                            olExtension._internal.tabObjectReference = tabs[i];
                            break;
                        }
                    }
                });

            } else {
                switch (olData.BrowserName) {
                    case 'chrome':
                        try {
                            olExtension._internal.windowObjectReference.close();
                    } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Error closing cover window!', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        } finally {
                            olExtension._internal.windowObjectReference = window.open(url_, "LogoutCover", parameters);
                        }
                        // save logout tab
                        kango.browser.tabs.getCurrent(function(tab) {
                            olExtension._internal.tabObjectReference = tab;
                        });

                        break;
                    case 'firefox':
                        olExtension._internal.windowObjectReference.focus();
                        // save logout tab
                        kango.browser.tabs.getCurrent(function(tab) {
                            olExtension._internal.tabObjectReference = tab;
                        });

                        break;
                    case 'iejs':
                        try {
                        if (olExtension._internal.windowObjectReference) {
                                olExtension._internal.windowObjectReference.close();
                            }

                            olExtension._internal.tabObjectReference.close();
                    } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Error closing cover window!', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        } finally {
                            olExtension._internal.windowObjectReference = kango.browser.windows.createWithOlParam({
                            url : url_,
                            name : 'LogoutCover',
                            parameters : parameters
                            });

                            // save logout tab
                            // TODO check this - IE problem with getCurrent tab
                            kango.browser.tabs.getAll(function(tabs) {
                                // tabs is Array of KangoBrowserTab
                            for (var i = 0; i < tabs.length; i++) {
                                if (olFunctions.CompareUrls(tabs[i].getUrl(), url_)) {
                                        olExtension._internal.tabObjectReference = tabs[i];
                                        break;
                                    }
                                }
                            });

                            break;
                        }
                }
            }
        },
        _logoutWindowParameters : function() {
            var widthLogout;
            var heightLogout;
            var left_;
            var top_;
            var parameters_;
            var parametersCover_;

            if (olOptions.Debug.DebugMode()) {
                switch (olData.BrowserName) {
                    case 'iejs':
                        //logout
                        widthLogout = 0;
                        heightLogout = 0;
                        left_ = screen.width - widthLogout - 20;
                        top_ = screen.height - heightLogout - 20;
                        parameters_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        //cover
                        widthLogout = 1000;
                        heightLogout = 900;
                        left_ = screen.width - widthLogout - 20;
                        top_ = screen.height - heightLogout - 20;
                        parametersCover_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        break;
                default:
                        widthLogout = 1000;
                        heightLogout = 900;
                        left_ = screen.width - widthLogout - 20;
                        top_ = screen.height - heightLogout - 20;
                        parameters_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        parametersCover_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        break;
                }
            } else {
                // left_ = screen.width; this works for firefox... new window can't be seen
                // top_ = screen.height; unfortunatly, it doesn't work for chrome
                switch (olData.BrowserName) {
                    case 'chrome':
                        widthLogout = 150;
                        heightLogout = 100;
                        left_ = screen.width - widthLogout;
                        top_ = screen.height - heightLogout;
                        parameters_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        parametersCover_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        break;
                    case 'firefox':
                        widthLogout = 140;
                        heightLogout = 60;
                        left_ = screen.width - widthLogout - 10;
                        top_ = screen.height - heightLogout - 40;
                        parameters_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        parametersCover_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        break;
                    case 'iejs':
                        widthLogout = 0;
                        heightLogout = 0;
                        left_ = screen.width - widthLogout - 10;
                        top_ = screen.height - heightLogout - 40;
                        parameters_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;

                        widthLogout = 140;
                        heightLogout = 60;
                        left_ = screen.width - widthLogout - 130;
                        top_ = screen.height - heightLogout - 150;
                        parametersCover_ = 'top=' + top_ + ',left=' + left_ + ',height=' + heightLogout + ', width=' + widthLogout;
                        break;
                }

                parameters_ += ', titlebar=no,location=no,menubar=no,scrollbars=no,status=no,directories=no,resizable=no';
                parametersCover_ += ', titlebar=no,location=no,menubar=no,scrollbars=no,status=no,directories=no,resizable=no';
            }
            var returnObject_ = {
                windowParam : parameters_,
                coverParam : parametersCover_
            };
            return returnObject_;
        },
        OpenLogoutWindow : function(tabId) {
            try {
                var parameters_ = olExtension._internal._logoutWindowParameters();
                switch (olData.BrowserName) {
                    case 'iejs':
                        olExtension.Cleaner.Reset();

                        kango.browser.windows.createWithOlParam({
                        url : olExtension.Data.LogoutUrl,
                        name : '_blank',
                        parameters : parameters_.windowParam
                        });

                        break;
                default:
                        olExtension.Cleaner.Reset();
                        window.open(olExtension.Data.LogoutUrl, '_blank', parameters_.windowParam);
                        break;
                }
                olExtension._internal.LogoutWindowsNumber++;
                switch (olData.BrowserName) {
                    case 'iejs':
                        olExtension._internal.OpenLogoutWindowCover(parameters_.coverParam);
                        break;
                default:
                        kango.browser.windows.getCurrent(function(win) {
                            win.getCurrentTab(function(tab) {
                                var id_ = tab.getId();
                                var attachTime_ = new Date().getTime();
                                var logoutListMember_ = {
                                Id : id_,
                                AttachTime : attachTime_
                                };
                                olExtension.Cleaner._LogoutMemberTabIds.push(logoutListMember_);
                                olExtension._internal.OpenLogoutWindowCover(parameters_.coverParam);
                            });
                        });
                        break;
                }
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('OpenLogoutWindow', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        HandleLogoutWindow : function(event) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Handle logout window', 'Recevied by extension');
                olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.HandleLogoutWindow(), alertContent_);

                //Once logout window is opened we take Logout tab member and handle logout
                var logoutTabMember_ = olExtension._internal.TabMember.GetLogoutTM(false, olExtension.Data.WindowHandle, event.target.getId());
                if (logoutTabMember_) {
                    if (logoutTabMember_.CloseTab) {
                        logoutTabMember_.TargetTab.close();
                    }

                    logoutTabMember_.TargetTab = event.target;
                    var lastUrl_ = logoutTabMember_._internal.GetLastUrl();

                    // if ClosingResponse.LastURL is not defined set last url to last url from TabMember
                    if (logoutTabMember_.PageInfo.ClosingResponse && !logoutTabMember_.PageInfo.ClosingResponse.LastURL) {
                        logoutTabMember_.PageInfo.ClosingResponse.LastURL = lastUrl_;
                    }

                    switch (olData.BrowserName) {
                        case 'iejs':

                            var logoutTab = logoutTabMember_.TargetTab;
                            var id_ = logoutTab.getId();
                            var attachTime_ = new Date().getTime();
                            var logoutListMember_ = {
                            Id : id_,
                            AttachTime : attachTime_
                            };
                            olExtension.Cleaner._LogoutMemberTabIds.push(logoutListMember_);

                            //TODO !?!?!?! this is needed for ie, it doesn't navigate if we don't do it second time
                            logoutTabMember_.TargetTab.navigate('');
                            break;
                    }
                    logoutTabMember_.TargetTab.navigate(lastUrl_);
                } else {
                    event.target.close();
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('HandleLogoutWindow', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        }
    },
    Cleaner : {
        _CloseCoverWindow : false,
        _ResetTime : null,
        _LogoutMemberTabIds : [],
        Reset : function() {
            olExtension.Cleaner._ResetTime = new Date().getTime() + 3000;
        },
        Start : function() {
            setInterval(function() {
                olExtension.Cleaner._Clean();
            }, 3000);
        },
        _Clean : function() {
            if (olExtension.Cleaner._CloseCoverWindow) {
                // if needed close cover window and wait next iteration
                olExtension.Cleaner._CloseCoverWindow = false;
                if (olExtension._internal.windowObjectReference) {
                    olExtension._internal.windowObjectReference.close();
                    // TODO explorer
                }

                if (olExtension._internal.tabObjectReference) {
                    olExtension._internal.tabObjectReference.close();
                    // TODO explorer
                }
            } else {
                var currentTime_ = new Date().getTime();
                if (currentTime_ > olExtension.Cleaner._ResetTime) {
                    olExtension.Cleaner.Reset();
                    // Clean now
                    olExtension.Cleaner._CloseCoverWindow = true;
                    kango.browser.windows.getAll(function(wins) {
                        for (var i = 0; i < wins.length; i++) {
                            wins[i].getTabs(function(tabs) {
                                try {
                                    for (var j = 0; j < tabs.length; j++) {
                                        var tabId_ = tabs[j].getId();

                                        var logoutListMembers_ = $.grep(olExtension.Cleaner._LogoutMemberTabIds, function(member) {
                                            return (member.Id == tabId_);
                                        });

                                        if (olFunctions.IsFilledArray(logoutListMembers_)) {
                                            var logoutTabMember_ = logoutListMembers_[0];
                                            // clean persistant attached window
                                            var elapsedTime_ = null;
                                            if (!olOptions.Debug.DebugMode()) {
                                                elapsedTime_ = 10050;
                                            } else {
                                                elapsedTime_ = 33000;
                                            }
                                            var currentTime_ = new Date().getTime();
                                            //TODO ADDED: check if tabs[j] exists
                                            if (currentTime_ > (logoutTabMember_.AttachTime + elapsedTime_)) {
                                                //TODO Check this!!!
                                                try {
                                                    tabs[j].close();
                                                } catch (e) {
                                                }

                                            } else {
                                                olExtension.Cleaner._CloseCoverWindow = false;
                                            }
                                        }
                                    }
                                } catch (e) {
                                    var alertContent_ = new olFunctions.AlertContent('_Clean', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                                }
                            });
                        }
                    });
                }
            }
        }
    },
    Wrapper : {
        GetAllTabs : function(callBackFunction) {
            switch (olData.BrowserName) {
                case 'chrome':
                    chrome.tabs.query({}, function(tabs) {
                        callBackFunction(tabs);
                    });
                    break;
                case 'firefox':
                    kango.browser.tabs.getAll(function(tabs) {
                        callBackFunction(tabs);
                    });
                    break;
                case 'iejs':
                    kango.browser.tabs.getAll(function(tabs) {
                        callBackFunction(tabs);
                    });
                    break;
            }
        },
        GetAllTabsTabId : function(tab) {
            var id_ = null;
            switch (olData.BrowserName) {
                case 'chrome':
                    id_ = tab.id;
                    break;
                case 'firefox':
                    id_ = tab.getId();
                    break;
                case 'iejs':
                    id_ = tab.getId();
                    break;
            }
            return id_;
        }
    },
    BasicAuthentication : {
        _internal : {
            RefreshTabIdArray : [],
            AddToRefreshTabIdArray : function(tabId) {
                try {
                    olExtension.BasicAuthentication._internal.RefreshTabIdArray.push(tabId);
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('AddToRefreshTabIdArray', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            CheckRefreshTabId : function(tabId) {
                var length_ = olExtension.BasicAuthentication._internal.RefreshTabIdArray.length;
                olExtension.BasicAuthentication._internal.RefreshTabIdArray = $.grep(olExtension.BasicAuthentication._internal.RefreshTabIdArray, function(member) {
                    return member != tabId;
                });
                if (length_ == olExtension.BasicAuthentication._internal.RefreshTabIdArray.length) {
                    return false;
                }
                return true;
            },
            RemoveFromRefreshTabIdArray : function(tabId) {
                try {
                    olExtension.BasicAuthentication._internal.RefreshTabIdArray = $.grep(olExtension.BasicAuthentication._internal.RefreshTabIdArray, function(member) {
                        return member != tabId;
                    });
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('RemoveFromRefreshTabIdArray', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            }
        },
        CheckUrlLoggedInBasicAuth : function(tabMember, url, username, password) {
            //double basic authentitcation check
            try {
                $.ajax({
                    type : 'GET',
                    url : url,
                    cashed : false,
                    dataType : 'json',
                    async : true,
                    complete : function(e) {
                        if (e.status == 401) {
                            $.ajax({
                                type : 'GET',
                                url : url + '/',
                                cashed : false,
                                dataType : 'json',
                                async : true,
                                username : username,
                                password : password,
                                complete : function(e) {
                                    if (e.status != 401) {
                                        tabMember.TargetTab.navigate(url);
                                    }
                                }
                            });
                        }
                    }
                });
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('Login', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        HandleBasicAuthentication : function(tabMember, variables) {
            try {
                var bnr0_ = tabMember.PageInfo.Response.BeforeNavigateResponses[0];
                var username_ = olExtension._internal.TabMember.GetElementVaribleReplacement(tabMember.PageInfo.DefinedNames.UsernameArray, variables);
                var password_ = olExtension._internal.TabMember.GetElementVaribleReplacement(tabMember.PageInfo.DefinedNames.PasswordArray, variables);

                //Basic authentication form exists?
                var currentForm_;
                if (bnr0_.Forms && olFunctions.IsFilledArray(bnr0_.Forms)) {
                    for (var i = 0; i < bnr0_.Forms.length; i++) {
                        currentForm_ = bnr0_.Forms[i];
                        if (currentForm_.Basic) {
                            tabMember._internal.ExtensionFlags.BasicAuthFormExist = true;
                            tabMember._internal.ExtensionFlags.BasicAuthURLs = currentForm_.URL;
                            break;
                        }
                    }
                }
                if (tabMember._internal.ExtensionFlags.BasicAuthFormExist) {
                    if (!tabMember._internal.ExtensionFlags.BasicAuthDoneOrNotNeeded && !tabMember._internal.ExtensionFlags.BasicAuthLoginSent && username_ && password_) {
                        tabMember._internal.ExtensionFlags.BasicAuthLoginSent = true;
                        if (olFunctions.IsFilledArray(tabMember._internal.ExtensionFlags.BasicAuthURLs)) {
                            tabMember._internal.ExtensionFlags.NumberOfBasicAuthUrls = tabMember._internal.ExtensionFlags.BasicAuthURLs.length;
                            for ( i = 0; i < tabMember._internal.ExtensionFlags.BasicAuthURLs.length; i++) {
                                var formUrl_ = tabMember._internal.ExtensionFlags.BasicAuthURLs[i];
                                olExtension.BasicAuthentication.Login(tabMember, username_, password_, formUrl_);
                            }
                        }
                    } else {
                        olExtension.BasicAuthentication._internal.RemoveFromRefreshTabIdArray(tabMember.TabId);
                        olExtension.BasicAuthentication.CheckUrlLoggedInBasicAuth(tabMember, tabMember.PageInfo.Url, username_, password_);
                    }
                } else {
                    tabMember._internal.ExtensionFlags.BasicAuthDoneOrNotNeeded = true;
                }
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('HandleBasicAuthentication', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        Login : function(tabMember, username, password, url) {
            try {
                $.ajax({
                    type : 'GET',
                    url : 'http://' + url,
                    cashed : false,
                    dataType : 'json',
                    username : username,
                    password : password,
                    complete : function(e) {
                        tabMember._internal.ExtensionFlags.NumberOfBasicAuthUrls--;
                        if (e.status != 401) {
                            var alertContent_ = new olFunctions.AlertContent('Basic authentication done', 'Page refreshed. Logged in for url: ' + tabMember.PageInfo.Url);
                            tabMember._internal.ExtensionFlags.BasicAuthDoneOrNotNeeded = true;
                            olFunctions.Alert(olOptions._internal.GetDependedValue('DebugExtensionBasicAuthentication'), alertContent_);
                        }

                        if (tabMember._internal.ExtensionFlags.NumberOfBasicAuthUrls == 0) {
                            tabMember._internal.ExtensionFlags.BasicAuthDoneOrNotNeeded = true;
                        }

                        if (tabMember._internal.ExtensionFlags.NumberOfBasicAuthUrls == 0 && tabMember._internal.ExtensionFlags.BasicAuthDoneOrNotNeeded) {
                            switch (olData.BrowserName) {
                                case 'chrome':
                                if (olExtension.BasicAuthentication._internal.CheckRefreshTabId(tabMember.TabId) && olOptions.Testing.BasicAuthenticationAutoRefresh()) {
                                        tabMember.TargetTab.navigate(tabMember.PageInfo.Url);
                                    }
                                    break;
                                case 'firefox':
                                if (olOptions.Testing.BasicAuthenticationAutoRefresh()) {
                                        tabMember.TargetTab.navigate(tabMember.PageInfo.Url);
                                    }
                                    break;
                                case 'iejs':
                                if (olOptions.Testing.BasicAuthenticationAutoRefresh()) {
                                        tabMember.TargetTab.navigate(tabMember.PageInfo.Url);
                                    }
                                    break;
                            }
                            olExtension.BasicAuthentication.CheckUrlLoggedInBasicAuth(tabMember, tabMember.PageInfo.Url, username, password);
                        }
                    }
                });
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('Login', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        }
    },
    Data: {
        OneLogInfoPannelUrl: null,
        LogoutInfoWindow: null,
        WindowHandle: null,
        ResourcesUrlPrefix: 'http://cloud.onelog.com/extensions/olResources/',
        LogoutUrl: 'http://cloud.onelog.com/extensions/olResources/logout.html',
        LogoutInfoUrl: 'http://cloud.onelog.com/extensions/olResources/logoutInfo.html',
        RuntimeDataUrl: 'https://cloud.onelog.com/extensions/olResources/olRuntimeData.json'

                // SWITCH Development
                // ResourcesUrlPrefix : 'https://devtest.onelog.com/mobview/olResources/',
                // ResourcesUrlPrefix : 'c:/!!!__________________OnelogExtension_deployment/olResources/',
                // LogoutUrl : 'https://devtest.onelog.com/mobview/olResources/logout.html',
                // LogoutInfoUrl : 'https://devtest.onelog.com/mobview/olResources/logoutInfo.html'
                // SWITCH Production
                // ResourcesUrlPrefix : 'https://cloud.onelog.com/extensions/olResources/',
                // LogoutUrl : 'https://cloud.onelog.com/extensions/olResources/logout.html',
                // LogoutInfoUrl : 'https://cloud.onelog.com/extensions/olResources/logoutInfo.html'
    },
    DataConstructors : {
        AjaxParams : function(data) {
            try {
                var self = this;
                self.ProcessData = false;
                self.Async = true;
                self.Type = 'POST';
                self.Url = olOptions.General.Extension.ServerUrl();
                self.ContentType = 'jsonp';
                self.Data = data;
                //self.Timeout = olOptions.General.Extension.AjaxCallTimeout();
                self.Timeout = 60000;
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('AjaxParams', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        MessageContent : function(tabMember, responseContent) {
            try {
                var self = this;
                if ( typeof (tabMember) === 'undefined')
                    tabMember = null;
                if ( typeof (responseContent) === 'undefined')
                    responseContent = null;

                if (tabMember) {
                    self.TabMember = tabMember;
                    self.TabMessageContent = {
                        ApplicationsSessionId : tabMember.ApplicationsSessionId,
                        ApplicationName : tabMember.ApplicationName,
                        PageFlags : tabMember._internal.PageFlags,
                        PageInfo : tabMember.PageInfo,
                        ResponseContent : responseContent
                    };
                }

            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('MessageContent', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        PageInfo : function(url) {
            try {
                var self = this;
                self.Url = url;
                self.LastUrl = url;
                self.Response = {
                    BeforeNavigateResponses : null,
                    CheckMatterResponse : null,
                    DocumentCompleteResponse : null,
                    ErrorState : null,
                    GetAppIdListResponse : null,
                    GetLocalPersonalCodeListResponse : null,
                    LanguageItems : null,
                    NavigateCompleteResponses : null,
                    PulseResponse : null,
                    QuittingResponse : null,
                    SetCommentEditResponse : null,
                    SetCommonDetailsResponse : null,
                    SetPersonalDetailsResponse : null,
                    TestResourceSelectResponse : null,
                    ValidateMatterResponse : null,
                    WindowClosingResponses : null
                };
                self.ClosingResponse = null;
                self.DefinedNames = {
                    UsernameArray : [],
                    PasswordArray : [],
                    MatterArray : [],
                    CustomArray : [],
                    TimeKeeperArray : [],
                    CommentArray : []
                };
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('PageInfo', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        RequestContent : function(tabMember, parameters) {
            try {
                var self = this;
                if ( typeof (tabMember) === 'undefined')
                    tabMember = null;
                if ( typeof (parameters) === 'undefined')
                    parameters = null;

                self.TabMember = tabMember;
                self.Parameters = parameters;
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('RequestContent', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SendRequestParameters : function(requestName, ajaxData, requestContent, requestSuccessFunction) {
            try {
                var self = this;
                self.RequestName = requestName;
                self.AjaxParam = new olExtension.DataConstructors.AjaxParams(ajaxData);
                self.RequestContent = requestContent;
                self.RequestSuccessFunction = requestSuccessFunction;
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('SendRequestParameters', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        ExtensionFlags : function() {
            var self = this;
            self.BeforeNavigateRequestSent = false;
            self.BasicAuthDoneOrNotNeeded = false;
            self.BasicAuthLoginSent = false;
            self.BasicAuthFormExist = false;
            self.BasicAuthURLs = [];
            self.ClosingResponsesSent = false;
            self.DocumentReady = false;
            self.LogoutWindowAttached = false;
            self.LogoutWindowAttachTime = null;
            self.MatterDetailFilled = false;
            self.NumberOfBasicAuthUrls = 0;
            self.PersonalCodeFilled = false;
            self.ServiceResponded = false;
            self.TabRemoved = false;
            self.Error = false;
            self.ErrorState = false;
        },
        PageFlags : function(TabId) {
            var self = this;
            self.ExtensionEnviroment = true;
            self.MobileEnviroment = '';
            self.BrowserName = olData.BrowserName;
            self.Comment = '';
            self.CommentChanged = false;
            self.CommentRequest = false;
            self.InOfflineMode = false;
            self.MatterNeeded = false;
            self.MatterDone = false;
            self.MatterSkiped = false;
            self.MatterChanged = false;
            self.MatterNumber = '';
            self.MatterFormat = '';
            self.FinalMatterValue = '';
            self.MatterFreeInput = false;
            self.PersonalCodeNeeded = false;
            self.PersonalCodeDone = false;
            self.TimekeeperNumber = '';
            self.TimekeeperChanged = false;
            self.LogonNeeded = false;
            self.LogonNeededForUsername = false;
            self.LogonNeededForPassword = false;
            self.LogonCommonNeeded = false;
            self.LogonCommonNeededForUsername = false;
            self.LogonCommonNeededForPassword = false;
            self.LogonDetailsFreeInput = false;
            self.LogonDone = false;
            self.LogonSkiped = false;
            //Changed to null so preference on option page can override this on first setting of the toolbar
            self.ToolbarMinimized = null;
            self.Unauthorised = false;
            self.LicenceLimitReachedNeeded = false;
            self.LicenceLimitReachedDone = false;
            self.PooledDetailsLimitReachedNeeded = false;
            self.PooledDetailsLimitReachedDone = false;
            self.TabId = TabId;
            self.PmtUser = true;
            self.PmtAdmin = false;
            self.PmtAutomatic = false;
            self.PassDetailsToSite = true;
            self.LoginType = 'User';
        },
        TabMember : function(tabId, url) {
            try {
                var self = this;
                self.Id = olExtension.Functions.Guid();
                self.ApplicationsSessionId = null;
                self.ApplicationName = null;
                self.BrowserType = olData.BrowserName;
                self.CloseTab = false;
                self.DocumentTitle = null;
                self.PageInfo = new olExtension.DataConstructors.PageInfo(url);
                self.WindowHandle = olExtension.Data.WindowHandle;
                self.WindowId = tabId + '-' + olExtension.Data.WindowHandle;
                self.TabId = tabId;
                self.Domains = [];

                // TargetTab gets filled on document complete event also, since this way isn't working for Chrome
                kango.browser.tabs.getAll(function(tabs) {
                    for (var i = 0; i < tabs.length; i++) {
                        if (tabs[i].getId() == tabId) {
                            self.TargetTab = tabs[i];
                        }
                    }
                });

                var extensionFlags_ = new olExtension.DataConstructors.ExtensionFlags();
                var pageFlags_ = new olExtension.DataConstructors.PageFlags(tabId);

                self._internal = {
                    ExtensionFlags : extensionFlags_,
                    PageFlags : pageFlags_,
                    GetUrl : function() {
                        return self.PageInfo.Url;
                    },
                    GetLastUrl : function() {
                        return self.PageInfo.LastUrl;
                    }
                };
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('TabMember', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        }
    },
    Listeners : {
        _internal : {
            Events : {
                BasicAuthenticationNeeded : function() {
                    try {
                        switch (olData.BrowserName) {
                            case 'chrome':
                                chrome.webRequest.onAuthRequired.addListener(function(details) {
                                    try {
                                        var alertContent_ = new olFunctions.AlertContent('Basic authentication event (401)', 'Url: ' + details.url);
                                        olExtension.BasicAuthentication._internal.AddToRefreshTabIdArray(details.tabId);
                                        olFunctions.Alert(olOptions.Debug.Extension.BasicAuthentication.Display401Url(), alertContent_);
                                } catch (e) {
                                        var alertErrorContent_ = new olFunctions.AlertContent('BasicAuthenticationNeeded', e.message + '\n' + e.stack);
                                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                    }
                                }, {
                                urls : ["<all_urls>"]
                                }, ["blocking"]);
                                break;
                            case 'firefox':
                                //TODO
                                // kango.browser.addEventListener(kango.browser.event.RESPONSE_401, function(event) {
                                // });
                                break;
                            case 'iejs':
                                break;
                        }
                    } catch (e) {
                        var alertContent_ = new olFunctions.AlertContent('BasicAuthenticationNeeded', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    }

                },
                BeforeNavigate : function() {
                    kango.browser.addEventListener(kango.browser.event.BEFORE_NAVIGATE, function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Before navigate event', 'Caught by extension\nUrl: ' + event.url);
                            if (event.url != null) {
                                if (event.url == olExtension.Data.LogoutInfoUrl) {
                                    // lurlogout info tab
                                    return;
                                }
                                if (event.url == olExtension.Data.LogoutUrl) {
                                    olData.LogoutTabs.push(event.target.getId());
                                    olExtension._internal.HandleLogoutWindow(event);
                                } else {
                                    //Check logout array
                                    if ($.inArray(event.target.getId(), olData.LogoutTabs) == -1) {
                                        // not a logout tab
                                        var tabMember_ = olExtension._internal.TabMember.Create(event.target.getId(), event.url);

                                        var urlDomain_ = olExtension.Functions.GetDomainFromUrl(event.url);
                                        if (urlDomain_ && ($.inArray(urlDomain_, tabMember_.Domains) == -1)) {
                                            tabMember_.Domains.push(urlDomain_);
                                        }
                                        //tabMember_._internal.ExtensionFlags.DocumentReady = false;
                                        var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_);
                                        olExtension.Service.BeforeNavigateRequestSend(requestContent_);
                                    } else {
                                        // logout tab
                                        return;
                                    }
                                }
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Events.BeforeNavigate(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BeforeNavigate', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                BrowserWindowClosing : function() {
                    switch (olData.BrowserName) {
                        case 'firefox':
                            olKangoChromeWindows.onUnload(function(event) {
                                try {
                                    kango.browser.tabs.getAll(function(tabs) {
                                        //find all existing tabs
                                        var ids_ = [];
                                    for (var i = 0; i < tabs.length; i++) {
                                            ids_.push(tabs[i].getId());
                                        }
                                        var requestContentArray_ = new Array();
                                        var closedTabsArray_ = $.grep(olData.TabInfoArray.TabMembers, function(member) {
                                            return (($.inArray(member.TabId, ids_) == -1));
                                        });
                                        //handle all closed tabs
                                    for ( i = 0; i < closedTabsArray_.length; i++) {
                                            requestContentArray_[i] = new olExtension.DataConstructors.RequestContent(closedTabsArray_[i]);
                                        }
                                    for ( i = 0; i < requestContentArray_.length; i++) {
                                            olExtension.Service.WindowClosingRequestSend(requestContentArray_[i]);
                                        }
                                    });
                            } catch (e) {
                                    var alertContent_ = new olFunctions.AlertContent('BrowserWindowClosing', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                                }
                            });
                            break;
                        case 'chrome':
                            break;
                        case 'iejs':
                            break;
                    }
                },
                CleanUp : function() {
                    try {
                        olExtension.Service.MainWindowClosingRequestSend(null);
                    } catch (e) {
                        var alertContent_ = new olFunctions.AlertContent('CleanUp', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    }
                },
                TabRemoved : function() {
                    kango.browser.addEventListener(kango.browser.event.TAB_REMOVED, function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Tab removed event', 'Caught by extension\nWindow ID: ' + event.tabId);
                            var tabId_ = event.tabId;
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                //resource tab closed
                                if (!tabMembers_[0].CloseTab) {
                                    tabMembers_[0]._internal.ExtensionFlags.TabRemoved = true;

                                    if (tabMembers_[0]._internal.ExtensionFlags.ServiceResponded) {
                                        var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0]);
                                        olExtension.Service.WindowClosingRequestSend(requestContent_);
                                    }
                                }
                            } else {
                                var logoutTabMembers_ = olExtension._internal.TabMember.FilterLogoutInfoArray(olExtension.Data.WindowHandle, tabId_, null);
                                if (olFunctions.IsFilledArray(logoutTabMembers_)) {
                                    for (var i = 0; i < logoutTabMembers_.length; i++) {
                                        olExtension._internal.TabMember.RemoveLogout(logoutTabMembers_[i]);
                                    }
                                }
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Events.TabRemoved(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('TabRemoved', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                TabChanged : function() {
                    kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, function(event) {
                        try {
                            //TODO ne koristi se?
                            var alertContent_ = new olFunctions.AlertContent('Tab changed event', 'Caught by extension\nWindow ID: ' + event.tabId);
                            olFunctions.Alert(olOptions.Debug.Extension.Events.TabChanged(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('TabChanged', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                TabCreated : function() {
                    switch (olData.BrowserName) {
                        case 'firefox':
                            break;
                        case 'iejs':
                            break;
                        case 'chrome':
                            kango.browser.addEventListener(kango.browser.event.TAB_CREATED, function(event) {
                                try {
                                    var alertContent_ = new olFunctions.AlertContent('Tab created event', 'Caught by extension\nWindow ID: ' + event.tabId);
                                    olData.CreatedTabs.push(event.tabId);
                                    // Handle cookies array if this is first tab to open
                                    var currentTabId_ = event.target.getId();
                                    kango.browser.tabs.getAll(function(tabs) {
                                    if (tabs.length == 1 && tabs[0].getId() == currentTabId_) {
                                            // this tab is the first one
                                            olExtension.Functions.HandleCookiesArray();
                                        }
                                    });
                                    olFunctions.Alert(olOptions.Debug.Extension.Events.TabCreated(), alertContent_);
                            } catch (e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('TabCreated', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                },
                TabReplaced : function() {
                    switch (olData.BrowserName) {
                        case 'firefox':
                            break;
                        case 'iejs':
                            break;
                        case 'chrome':
                            chrome.webNavigation.onTabReplaced.addListener(function(event) {
                                try {
                                    var alertContent_ = new olFunctions.AlertContent('Tab replaced event', 'Caught by extension\nWindow ID: ' + event.tabId);

                                    var tabId_ = event.tabId;
                                    var replacedTabId_ = event.replacedTabId;
                                    //insert into created tabs
                                    olData.CreatedTabs.push(tabId_);

                                    //invoke document ready for replaced tab
                                    kango.browser.tabs.getAll(function(tabs) {
                                    for (var i = 0; i < tabs.length; i++) {
                                        if (tabId_ == tabs[i].getId()) {
                                                //change tabid in tab memeber
                                                var foundTab = tabs[i];
                                                var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, replacedTabId_, null, null);
                                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                                for (var j = 0; j < tabMembers_.length; j++) {
                                                        tabMembers_[j].TabId = tabId_;
                                                        tabMembers_[j].TargetTab = foundTab;
                                                    }
                                                }
                                                var tabMembersLogout_ = olExtension._internal.TabMember.FilterLogoutInfoArray(olExtension.Data.WindowHandle, replacedTabId_);
                                            if (olFunctions.IsFilledArray(tabMembersLogout_)) {
                                                for (var k = 0; k < tabMembersLogout_.length; k++) {
                                                        tabMembersLogout_[k].TabId = tabId_;
                                                        tabMembersLogout_[k].TargetTab = foundTab;
                                                    }
                                                }

                                                // westlaw - google problem
                                            if (foundTab.getUrl().indexOf('chrome-instant') == -1) {
                                                    var code_ = 'window.location.reload()';
                                                    chrome.tabs.executeScript(tabId_, {
                                                    code : code_
                                                    });
                                                }
                                                ;
                                                break;
                                            }
                                        }
                                    });

                                    olFunctions.Alert(olOptions.Debug.Extension.Events.TabReplaced(), alertContent_);
                            } catch (e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('TabReplaced', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                },
                WindowChanged : function() {
                    var alertContent_ = new olFunctions.AlertContent('Window changed event', 'Caught by extension');
                    switch (olData.BrowserName) {
                        case 'chrome':
                            chrome.windows.onFocusChanged.addListener(function(windowId) {
                                try {

                                    olFunctions.Alert(olOptions.Debug.Extension.Events.WindowChanged(), alertContent_);
                            } catch (e) {
                                    var alertContent1_ = new olFunctions.AlertContent('WindowChanged', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent1_);
                                }
                            });
                            break;
                        case 'firefox':
                            //TODO
                            break;
                        case 'iejs':
                            break;
                    }
                }
            },
            Messages : {
                Flags : {
                    MatterDone : function() {
                        kango.addMessageListener('olMatterDone', function(event) {
                            try {
                                olExtension.Functions._parseEventDataExtension(event);
                                var alertContent_ = new olFunctions.AlertContent('Matter done message', 'Recevied by extension');
                                var tabId_ = event.target.getId();

                                var tabMember_;
                                var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                                if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                    tabMember_ = filterTabMembers_[0];
                                    tabMember_._internal.PageFlags.MatterDone = event.data;
                                }
                                olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.Flags.MatterDone(), alertContent_);
                            } catch (e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('MatterDone', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        });
                    },
                    LogonDone : function() {
                        kango.addMessageListener('olLogonDone', function(event) {
                            try {
                                olExtension.Functions._parseEventDataExtension(event);
                                var alertContent_ = new olFunctions.AlertContent('Logon done message', 'Recevied by extension');
                                var tabId_ = event.target.getId();

                                var tabMember_;
                                var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                                if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                    tabMember_ = filterTabMembers_[0];
                                    tabMember_._internal.PageFlags.LogonDone = event.data;
                                }
                                olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.Flags.LogonDone(), alertContent_);
                            } catch (e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('LogonDone', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        });
                    }
                },
                SetAnalysisRequest : function() {
                    kango.addMessageListener('olSetAnalysisRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var tabId_ = event.target.getId();

                            var tabMember_;
                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                tabMember_ = filterTabMembers_[0];
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_, event.data);
                                olExtension.Service.SetAnalysisRequest(requestContent_);
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('messages.SetAnalysisRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                ApplicationRequest : function() {
                    kango.addMessageListener('olApplicationRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Application request message', 'Recevied by extension\nUrl: ' + event.url);
                            var tabId_ = event.target.getId();
                            var applicationsSessionId_ = event.data.ApplicationsSessionId;

                            var tabMember_;
                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, applicationsSessionId_);
                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                tabMember_ = filterTabMembers_[0];

                                tabMember_.ApplicationName = event.data.ApplicationName;

                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_, event.data);

                                olExtension.Service.ApplicationRequestSend(requestContent_);
                            }

                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.Application(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('ApplicationRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                CheckMatterGlobalRequest : function() {
                    kango.addMessageListener('olCheckMatterGlobalRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Check matter global request message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabId_ = event.target.getId();

                            var tabMember_;
                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                tabMember_ = filterTabMembers_[0];

                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_, event.data);
                                olExtension.Service.CheckMatterGlobalRequestSend(requestContent_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.CheckMatterGlobal(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('CheckMatterGlobalRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                ContinueSessionRequest : function() {
                    kango.addMessageListener('olContinueSessionRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Continue session request message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabId_ = event.target.getId();
                            var tabMember_;

                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, event.data.ApplicationSessionId);
                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                tabMember_ = filterTabMembers_[0];

                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_);
                                olExtension.Service.ContinueSessionRequestSend(requestContent_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.ContinueSession(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('ContinueSessionRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                CloseTab : function() {
                    kango.addMessageListener('olCloseTab', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            olExtension.Functions.CloseTabFunction(event.target, event.data);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('CloseTab', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                DeletePersonalDetailRequest : function() {
                    kango.addMessageListener('olDeletePersonalDetailRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Delete personal detail request message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabId_ = event.target.getId();

                            var tabMember_;
                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                tabMember_ = filterTabMembers_[0];

                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_, event.data);

                                olExtension.Service.DeletePersonalDetailRequestSend(requestContent_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.DeletePersonalDetail(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('DeletePersonalDetailRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                FormSubmit : function() {
                    kango.addMessageListener('olFormSubmit', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Form submit message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var filterTabMembers_;
                            if (tabUrl_ != null) {
                                filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                            } else {
                                filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                            }
                            var tabMember_ = filterTabMembers_[0];
                            var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_);

                            olExtension.Service.FormSubmitRequestSend(requestContent_);

                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.FormSubmit(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('olExtension.Listeners.Messages.FormSubmit', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                //IMPORTANT tabUrl is needed becouse kango in firefox doesn't read hash urls poroperly
                _onDocumentReady : function(targetTab, documentTitle, tabUrl) {
                    if ( typeof (documentTitle) === 'undefined')
                        documentTitle = targetTab.getTitle();
                    if ( typeof (tabUrl) === 'undefined')
                        tabUrl = targetTab.getUrl();

                    var tabUrl_ = tabUrl;
                    var tabId_ = targetTab.getId();

                    olExtension.Wrapper.GetAllTabs(function(tabs) {
                        for (var i = 0; i < tabs.length; i++) {
                            var currentTabId_ = olExtension.Wrapper.GetAllTabsTabId(tabs[i]);
                            if ($.inArray(currentTabId_, olData.CreatedTabs) == -1) {
                                olData.CreatedTabs.push(currentTabId_);
                            }
                        }

                        var createdTab_ = true;
                        switch (olData.BrowserName) {
                            case 'firefox':
                                break;
                            case 'iejs':
                                break;
                            case 'chrome':
                            if ($.inArray(tabId_, olData.CreatedTabs) == -1) {
                                    createdTab_ = false;
                                }
                                break;
                            default:
                                break;
                        }
                        if (createdTab_) {
                            //Check logout array
                            if ($.inArray(tabId_, olData.LogoutTabs) == -1) {
                                // Not a logout tab
                                // fix target tab for all tab members with that id no matter what
                                var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);

                                for (var f = 0; f < filterTabMembers_.length; f++) {
                                    filterTabMembers_[f].TargetTab = targetTab;
                                }

                                if (tabUrl_ != null) {
                                    var tabMember_;

                                    filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                                    if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                        tabMember_ = filterTabMembers_[0];
                                    } else {
                                        if (tabUrl_ == olExtension.Data.LogoutUrl) {
                                            olData.LogoutTabs.push(tabId_);
                                            return;
                                        } else {
                                            tabMember_ = olExtension._internal.TabMember.Create(tabId_, tabUrl_);
                                            tabMember_.TargetTab = targetTab;
                                        }
                                    }

                                    var urlDomain_ = olExtension.Functions.GetDomainFromUrl(tabUrl_);
                                    if (urlDomain_ && ($.inArray(urlDomain_, tabMember_.Domains) == -1)) {
                                        tabMember_.Domains.push(urlDomain_);
                                    }

                                    if (!tabMember_._internal.ExtensionFlags.BeforeNavigateRequestSent) {
                                        var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_);
                                        olExtension.Service.BeforeNavigateRequestSend(requestContent_);
                                    }

                                    tabMember_._internal.ExtensionFlags.DocumentReady = true;
                                    tabMember_.DocumentTitle = documentTitle;

                                    var messageContent_ = new olExtension.DataConstructors.MessageContent(tabMember_);

                                    if (tabMember_._internal.ExtensionFlags.Error) {
                                        olExtension.Messages.Error(messageContent_);
                                        return;
                                    }

                                    if (tabMember_._internal.ExtensionFlags.ErrorState) {
                                        olExtension._internal.TabMember.RemoveOnErrorState(tabMember_);
                                        return;
                                    }

                                    if (olFunctions.IsFilledArray(tabMember_.PageInfo.Response.BeforeNavigateResponses) && !tabMember_.PageInfo.Response.BeforeNavigateResponses[0].AppIdSpecified && tabMember_.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId) {
                                        olExtension.Messages.ChooseApplicationDispatchMessage(messageContent_);
                                    } else {
                                        olExtension.Messages.BeforeNavigateRequestDispatchResponse(messageContent_);
                                    }
                                }
                            } else {
                                // ne moze da se salje logoutTabMember_, ff puca iz nepoznatog razloga
                                // pokusacu da posaljem samo closing response

                                var logoutTabMember_ = olExtension._internal.TabMember.GetLogoutTM(true, olExtension.Data.WindowHandle, tabId_);
                                if (logoutTabMember_) {
                                    var closingResponses_ = logoutTabMember_.PageInfo.ClosingResponse;
                                    if (closingResponses_) {
                                        targetTab.dispatchMessage('olLogoutMember', closingResponses_);
                                        if (!olOptions.Debug.DebugMode()) {
                                            //autoclose tab after 10000 ms
                                            olExtension.Functions.CloseTabFunction(targetTab, 10000);
                                        } else {
                                            //autoclose tab after 30000 ms
                                            olExtension.Functions.CloseTabFunction(targetTab, 30000);
                                        }
                                    }
                                } else {
                                    logoutTabMember_ = olExtension._internal.TabMember.GetLogoutTM(false, null, tabId_);
                                    var alertErrorContent_ = new olFunctions.AlertContent('ERROR: Resource didnt perform lougout! tabid = ' + tabId_ + '  tabUrl = ' + tabUrl_ + ' documentTitle = ' + documentTitle + ' logoutTabMember : ' + logoutTabMember_, '');
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                                return;
                            }
                        }
                    });
                },
                DocumentReady : function() {
                    kango.addMessageListener('olDocumentReady', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Document ready message', 'Recevied by extension\nUrl: ' + event.url);

                            olExtension.Listeners._internal.Messages._onDocumentReady(event.target, event.data);

                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.DocumentReady(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('olExtension.Listeners.Messages.DocumentReady', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                WindowHashChange : function() {
                    kango.addMessageListener('olWindowHashChange', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Window hash change message', 'Recevied by extension\nUrl: ' + event.data.Url);

                            var tabMemberForRequest_ = olExtension._internal.TabMember.Create(event.target.getId(), event.data.Url);
                            tabMemberForRequest_.TargetTab = event.target;

                            olExtension.Listeners._internal.Messages._onDocumentReady(tabMemberForRequest_.TargetTab, event.data.Title, event.data.Url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.WindowHashChange(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('olExtension.Listeners.Messages.WindowHashChange', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                ProcessPageCompleted : function() {
                    kango.addMessageListener('olProcessPageCompleted', function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Process page completed message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.ProcessPageCompleted(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('ProcessPageCompleted', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                PersonalDetailsChosenRequest : function() {
                    kango.addMessageListener('olPersonalDetailsChosenRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Personal details chosen request completed message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.PersonalDetailsChosenRequest(), alertContent_);

                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                            var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                            olExtension.Service.PersonalDetailsChosenRequestSend(requestContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('PersonalDetailsChosenRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                PulseRequest : function() {
                    //this is obsolete since pulse interval moved to extension page
                    kango.addMessageListener('olPulseRequest', function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Pulse', 'Recevied by extension');
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.Pulse(), alertContent_);

                            var tabId_ = event.target.getId();

                            olExtension.Service.PulseRequestSend(tabId_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('PulseRequest message', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                LogoutSequenceCompleted : function() {
                    kango.addMessageListener('olLogoutSequenceCompleted', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Logout Sequence Completed', 'Recevied by extension');
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.LogoutSequenceCompleted(), alertContent_);

                            var applicationSessionId_ = event.data;

                            var tabMembers_ = olExtension._internal.TabMember.FilterLogoutInfoArray(null, null, applicationSessionId_);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                for (var i = 0; i < tabMembers_.length; i++) {
                                    olExtension._internal.TabMember.RemoveLogout(tabMembers_[i]);
                                }
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('LogoutSequenceCompleted, Extension', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                SetCommentRequest : function() {
                    kango.addMessageListener('olSetCommentRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Set comment request message', 'Recevied by extension\nUrl: ' + event.url);
                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.SetCommentRequestSend(requestContent_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SetComment(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SetCommentRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                SetCommentEditRequest : function() {
                    kango.addMessageListener('olSetCommentEditRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Set comment edit request message', 'Recevied by extension\nUrl: ' + event.url);
                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.SetCommentEditRequestSend(requestContent_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SetCommentEdit(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SetCommentEditRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                SetCurrentPersonalDetailsRequest : function() {
                    kango.addMessageListener('olSetCurrentPersonalDetailsRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Set current personal details request completed message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SetCurrentPersonalDetails(), alertContent_);

                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                            var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                            olExtension.Service.SetCurrentPersonalDetailsRequestSend(requestContent_);

                            olExtension.BasicAuthentication.HandleBasicAuthentication(tabMembers_[0], event.data.Details.Variables);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SetCurrentPersonalDetailsRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                SetPersonalDetailsRequest : function() {
                    kango.addMessageListener('olSetPersonalDetailsRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Set personal details request completed message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SetPersonalDetails(), alertContent_);

                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);

                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.SetPersonalDetailsRequestSend(requestContent_);
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SetPersonalDetailsRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                SetCommonDetailsRequest : function() {
                    kango.addMessageListener('olSetCommonDetailsRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Set personal details request completed message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SetCommonDetails(), alertContent_);

                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.SetCommonDetailsRequestSend(requestContent_);
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SetCommonDetailsRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                SetTempPersonalDetailsRequest : function() {
                    kango.addMessageListener('olSetTempPersonalDetailsRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Set personal details request completed message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SetTempPersonalDetails(), alertContent_);

                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, event.data.ApplicationSessionId);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.SetTempPersonalDetailsRequestSend(requestContent_);
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SetTempPersonalDetailsRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                StorePasswordRequest : function() {
                    kango.addMessageListener('olStorePasswordRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Skip matter details request message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.StorePasswordRequest(), alertContent_);

                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, event.data.ApplicationSessionId);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.StorePasswordRequestSend(requestContent_);
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SkipMatterDetailsRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                SkipMatterDetailsRequest : function() {
                    kango.addMessageListener('olSkipMatterDetailsRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Skip matter details request message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SkipMatterDetailsRequest(), alertContent_);

                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.SkipMatterDetailsRequestSend(requestContent_);
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SkipMatterDetailsRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                SkipPersonalDetailsRequest : function() {
                    kango.addMessageListener('olSkipPersonalDetailsRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Skip personal details request message', 'Recevied by extension\nUrl: ' + event.url);
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SkipPersonalDetailsRequest(), alertContent_);

                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.SkipPersonalDetailsRequestSend(requestContent_);
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SkipPersonalDetailsRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                RefreshOptions : function() {
                    kango.addMessageListener('olRefreshOptions', function() {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Refresh options message', 'Recevied by extension');
                            olOptions._internal.Get();
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.RefreshOptions(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('RefreshOptions', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                UpdateResponse : function() {
                    kango.addMessageListener('olUpdateResponse', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Update response message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, null, null, event.data.Response.BeforeNavigateResponses[0].ApplicationsSessionId);
                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                for (var i = 0; i < tabMembers_.length; i++) {
                                    // we will copy variable replacments, start time and pause duration and page flags
                                    if (event.data.Response.BeforeNavigateResponses && event.data.Response.BeforeNavigateResponses[0]) {
                                        var currentTabMemberBnr_ = tabMembers_[i].PageInfo.Response.BeforeNavigateResponses[0];
                                        var pageBnr_ = event.data.Response.BeforeNavigateResponses[0];
                                        if (event.data.Response.BeforeNavigateResponses[0].VariableReplacement) {
                                            currentTabMemberBnr_.VariableReplacement = pageBnr_.VariableReplacement;
                                        }
                                        currentTabMemberBnr_.StartTime = pageBnr_.StartTime;
                                        currentTabMemberBnr_.PauseDuration = pageBnr_.PauseDuration;
                                        currentTabMemberBnr_.ShowStartMessage = pageBnr_.ShowStartMessage ? pageBnr_.ShowStartMessage : false;
                                    }
                                    tabMembers_[i]._internal.PageFlags = event.data.PageFlags;
                                    tabMembers_[i].DocumentTitle = event.data.Title;
                                }
                            } else {
                                var alertContent1_ = new olFunctions.AlertContent('Update before navigate response message received', 'Error: no tab member(AppSesId:' + event.data.Response.BeforeNavigateResponses[0].ApplicationsSessionId + ')');
                                olFunctions.Alert(olOptions.Debug.Errors(), alertContent1_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.UpdateResponse(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('UpdateResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                ValidateSelectedMatterRequest : function() {
                    kango.addMessageListener('olValidateSelectedMatterRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Validate selected matter request message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabUrl_ = event.url;
                            var tabId_ = event.target.getId();
                            var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, tabUrl_, null);

                            if (olFunctions.IsFilledArray(tabMembers_)) {
                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMembers_[0], event.data);
                                olExtension.Service.ValidateSelectedMatterRequestSend(requestContent_);
                            } else {
                                var alertContent1_ = new olFunctions.AlertContent('Validate selected matter request message received', 'Error: no tab member');
                                olFunctions.Alert(olOptions.Debug.Errors(), alertContent1_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.ValidateSelectedMatter(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('ValidateSelectedMatterRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                Notification : function() {
                    kango.addMessageListener('olNotification', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = event.data;
                            olFunctions.Alert(true, alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Notification', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                QuittingResourceSessionRequest : function() {
                    kango.addMessageListener('olQuittingResourceSessionRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Quitting resource session request message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabId_ = event.target.getId();
                            var tabMember_;

                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, null, null, event.data.ApplicationSessionId);

                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                for (var i = 0; i < filterTabMembers_.length; i++) {
                                    if (filterTabMembers_[i].TabId == tabId_) {
                                        tabMember_ = filterTabMembers_[i];
                                    } else {
                                        //IE closes tabs here so we will too
                                        filterTabMembers_[i].TargetTab.close();
                                    }
                                }

                                if (tabMember_) {
                                    if (event.data.CloseTab) {
                                        //tabMember_.TargetTab = event.target;
                                        tabMember_.CloseTab = true;
                                    }

                                    var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_);
                                    olExtension.Service.QuittingResourceSessionRequestSend(requestContent_);
                                }
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.QuittingResourceSession(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('QuittingResourceSessionRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                //Analysis
                SetFeaturesRequest : function() {
                    kango.addMessageListener('olSetFeaturesRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Set features request message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabId_ = event.target.getId();
                            var tabMember_;

                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, event.data.ApplicationSessionId);
                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                tabMember_ = filterTabMembers_[0];

                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_, event.data);

                                olExtension.Service.SetFeaturesRequestSend(requestContent_);
                            }

                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.SetFeatures(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SetFeaturesRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                //WebControl
                StartMessageSeenRequest : function() {
                    kango.addMessageListener('olStartMessageSeenRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Start message seen request message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabId_ = event.target.getId();
                            var tabMember_;

                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                tabMember_ = filterTabMembers_[0];

                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_, event.data);

                                olExtension.Service.StartMessageSeenRequestSend(requestContent_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.StartMessageSeen(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('StartMessageSeenRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                },
                HideStartMessageRequest : function() {
                    kango.addMessageListener('olHideStartMessageRequest', function(event) {
                        try {
                            olExtension.Functions._parseEventDataExtension(event);
                            var alertContent_ = new olFunctions.AlertContent('Hide start message request message', 'Recevied by extension\nUrl: ' + event.url);

                            var tabId_ = event.target.getId();
                            var tabMember_;

                            var filterTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, null);
                            if (olFunctions.IsFilledArray(filterTabMembers_)) {
                                tabMember_ = filterTabMembers_[0];

                                var requestContent_ = new olExtension.DataConstructors.RequestContent(tabMember_, event.data);

                                olExtension.Service.HideStartMessageRequestSend(requestContent_);
                            }
                            olFunctions.Alert(olOptions.Debug.Extension.Messages.Received.HideStartMessage(), alertContent_);
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('HideStartMessageRequest', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    });
                }
            }
        },
        IntialiseEventListeners : function() {
            try {
                olExtension.Listeners._internal.Events.BeforeNavigate();
                olExtension.Listeners._internal.Events.TabRemoved();
                olExtension.Listeners._internal.Events.TabReplaced();
                olExtension.Listeners._internal.Events.TabChanged();
                olExtension.Listeners._internal.Events.TabCreated();
                olExtension.Listeners._internal.Events.BasicAuthenticationNeeded();
                olExtension.Listeners._internal.Events.WindowChanged();
                olExtension.Listeners._internal.Events.BrowserWindowClosing();
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('IntialiseEventListeners', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        IntialiseMessageListeners : function() {
            try {
                olExtension.Listeners._internal.Messages.Flags.MatterDone();
                olExtension.Listeners._internal.Messages.Flags.LogonDone();
                olExtension.Listeners._internal.Messages.ApplicationRequest();
                olExtension.Listeners._internal.Messages.CheckMatterGlobalRequest();
                olExtension.Listeners._internal.Messages.ContinueSessionRequest();
                olExtension.Listeners._internal.Messages.CloseTab();
                olExtension.Listeners._internal.Messages.DeletePersonalDetailRequest();
                olExtension.Listeners._internal.Messages.FormSubmit();
                olExtension.Listeners._internal.Messages.DocumentReady();
                olExtension.Listeners._internal.Messages.PulseRequest();
                olExtension.Listeners._internal.Messages.LogoutSequenceCompleted();
                olExtension.Listeners._internal.Messages.Notification();
                olExtension.Listeners._internal.Messages.ProcessPageCompleted();
                olExtension.Listeners._internal.Messages.PersonalDetailsChosenRequest();
                olExtension.Listeners._internal.Messages.RefreshOptions();
                olExtension.Listeners._internal.Messages.SetCurrentPersonalDetailsRequest();
                olExtension.Listeners._internal.Messages.SetCommentRequest();
                olExtension.Listeners._internal.Messages.SetCommentEditRequest();
                olExtension.Listeners._internal.Messages.SetPersonalDetailsRequest();
                olExtension.Listeners._internal.Messages.SetCommonDetailsRequest();
                olExtension.Listeners._internal.Messages.SetTempPersonalDetailsRequest();
                olExtension.Listeners._internal.Messages.StorePasswordRequest();
                olExtension.Listeners._internal.Messages.SkipPersonalDetailsRequest();
                olExtension.Listeners._internal.Messages.SkipMatterDetailsRequest();
                olExtension.Listeners._internal.Messages.ValidateSelectedMatterRequest();
                olExtension.Listeners._internal.Messages.UpdateResponse();
                olExtension.Listeners._internal.Messages.QuittingResourceSessionRequest();
                olExtension.Listeners._internal.Messages.SetFeaturesRequest();
                olExtension.Listeners._internal.Messages.StartMessageSeenRequest();
                olExtension.Listeners._internal.Messages.HideStartMessageRequest();
                olExtension.Listeners._internal.Messages.WindowHashChange();
                olExtension.Listeners._internal.Messages.SetAnalysisRequest();
            } catch (e) {
                var alertContent_ = new olFunctions.AlertContent('IntialiseMessageListeners', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        }
    },
    Service : {
        ApplicationRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Application request sent', 'Url: ' + requestContent.TabMember._internal.GetUrl());
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessApplicationRequest);
                var browserName_ = olData.BrowserName;
                var ajaxData_ = {
                    ApplicationRequest : {
                        URL : requestContent.TabMember._internal.GetUrl(),
                        AppId : requestContent.Parameters.AppId,
                        WindowId : requestContent.TabMember.WindowId,
                        RequestType : 0,
                        WindowHandle : requestContent.TabMember.WindowHandle,
                        BrowserType : browserName_
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('ApplicationRequest', ajaxData_, requestContent, successFunction_);
                //This is like forcing another before navigate request so service responded flag must go to false
                requestContent.TabMember._internal.ExtensionFlags.ServiceResponded = false;
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.ApplicationRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('ApplicationRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        DummyBeforeNavigateRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Dummy Before navigate request sent', 'Url: ' + requestContent.TabMember._internal.GetUrl());
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessDummyBeforeNavigateRequest);
                var browserName_ = olData.BrowserName;
                var ajaxData_ = {
                    BeforeNavigateRequest : {
                        URL : requestContent.TabMember._internal.GetUrl(),
                        WindowId : requestContent.TabMember.WindowId,
                        SessionSetId : 1,
                        WindowHandle : requestContent.TabMember.WindowHandle,
                        BrowserType : browserName_
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('BeforeNavigateRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.BeforeNavigateRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('DummyBeforeNavigateRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        BeforeNavigateRequestSend : function(requestContent, processRequestSuccess) {
            try {
                requestContent.TabMember._internal.ExtensionFlags.BeforeNavigateRequestSent = true;
                var alertContent_ = new olFunctions.AlertContent('Before navigate request sent', 'Url: ' + requestContent.TabMember._internal.GetUrl());
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessBeforeNavigateRequest);
                var browserName_ = olData.BrowserName;
                var ajaxData_ = {
                    BeforeNavigateRequest : {
                        URL : requestContent.TabMember._internal.GetUrl(),
                        WindowId : requestContent.TabMember.WindowId,
                        SessionSetId : 1,
                        WindowHandle : requestContent.TabMember.WindowHandle,
                        BrowserType : browserName_
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('BeforeNavigateRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.BeforeNavigateRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('BeforeNavigateRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        CheckMatterGlobalRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Check matter global request sent', 'AppSessId: ' + requestContent.TabMember.ApplicationsSessionId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessCheckMatterGlobalRequest);
                var ajaxData_ = {
                    CheckMatterRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        LocalSearch : false,
                        MatterName : requestContent.Parameters.MatterName,
                        MatterNumber : requestContent.Parameters.MatterNumber,
                        PageNumber : requestContent.Parameters.PageNumber,
                        PageNumberSpecified : true
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('CheckMatterGlobalRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.CheckMatterGlobalRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('CheckMatterGlobalRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        CheckMatterLocalRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Check matter local request sent', 'AppSessId: ' + requestContent.TabMember.ApplicationsSessionId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessCheckMatterLocalRequest);
                var ajaxData_ = {
                    CheckMatterRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        LocalSearch : true,
                        MatterName : '',
                        MatterNumber : '',
                        PageNumber : 1
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('CheckMatterLocalRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.CheckMatterLocalRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('CheckMatterLocalRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        ContinueSessionRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Continue session request sent', '');
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessContinueSessionRequest);
                var ajaxData_ = {
                    ContinueSessionRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('ContinueSessionRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.ContinueSessionRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('ContinueSessionRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        DeletePersonalDetailRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Delete personal detail request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessDeletePersonalDetailRequest);
                var ajaxData_ = {
                    DeletePersonalDetail : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Id : requestContent.Parameters.Id
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('DeletePersonalDetail', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.DeletePersonalDetailRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('DeletePersonalDetailRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        FormSubmitRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Form submit request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessFormSubmitRequest);
                var ajaxData_ = {
                    FormSubmitRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('FormSubmitRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.FormSubmitRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('FormSubmitRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        DocumentCompleteRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Document complete request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessDocumentCompleteRequest);
                var ajaxData_ = {
                    DocumentCompleteRequest : {
                        WindowTitle : requestContent.TabMember.DocumentTitle,
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Ignore : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].Ignore,
                        TurnAway : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].TurnAway,
                        TurnAwaySpecified : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].TurnAwaySpecified
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('DocumentCompleteRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.DocumentCompleteRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('DocumentCompleteRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        GetLocalPersonalCodeListRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var bnr0_ = requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0];

                if (bnr0_.RequestPersonalCode && !requestContent.TabMember._internal.ExtensionFlags.PersonalCodeFilled) {
                    var alertContent_ = new olFunctions.AlertContent('Get local personal code list request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                    var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessGetLocalPersonalCodeListRequest);
                    var ajaxData_ = {
                        GetLocalPersonalCodeListRequest : {
                            ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                        }
                    };
                    var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('GetLocalPersonalCodeListRequestSend', ajaxData_, requestContent, successFunction_);

                    olExtension.Service._internal.SendRequest(sendRequestParams_);

                    olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.GetLocalPersonalCodeListRequestSend(), alertContent_);

                } else {
                    requestContent.TabMember._internal.ExtensionFlags.PersonalCodeFilled = true;
                }

            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('GetLocalPersonalCodeListRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        LanguageItemsRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Language items request sent', 'Sent by extension');
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessLanguageItemsRequest);
                var ajaxData_ = {
                    LanguageItems : {}
                };

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('LanguageItemsRequestSend', ajaxData_, requestContent, successFunction_);

                sendRequestParams_.AjaxParam.Async = false;

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.LanguageItemsRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('LanguageItemsRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        LogoutCompletedRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Logout completed request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessLogoutCompletedRequest);
                var ajaxData_ = {
                    LogoutCompleted : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('LogoutCompletedRequestSend', ajaxData_, requestContent, successFunction_);

                sendRequestParams_.AjaxParam.Async = false;
                sendRequestParams_.AjaxParam.Timeout = 100000;

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.LogoutCompletedRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('LogoutCompletedRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        LogoutWindowRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Logout window request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessLogoutWindowRequest);
                var ajaxData_ = {
                    LogoutWindowRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        WindowHandle : olExtension.Functions.Guid()
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('LogoutWindowRequestSend', ajaxData_, requestContent, successFunction_);

                sendRequestParams_.AjaxParam.Async = false;
                sendRequestParams_.AjaxParam.Timeout = 100000;

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.LogoutWindowRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('LogoutWindowRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        MainWindowClosingRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Main window closing request sent', 'WindowHandle: ' + olExtension.Data.WindowHandle);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessMainWindowClosingRequest);
                var ajaxData_ = {
                    MainWindowClosingRequest : {
                        WindowHandle : olExtension.Data.WindowHandle
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('MainWindowClosingRequest', ajaxData_, requestContent, successFunction_);
                sendRequestParams_.AjaxParam.Async = false;
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.MainWindowClosingRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('MainWindowClosingRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        NavigateCompleteRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Navigate complete request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessNavigateCompleteRequest);
                var browserName_ = olData.BrowserName;
                var ajaxData_ = {
                    NavigateCompleteRequest : {
                        URL : requestContent.TabMember.PageInfo.Url,
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        WindowId : requestContent.TabMember.WindowId,
                        SessionSetId : 1,
                        WindowHandle : requestContent.TabMember.WindowHandle,
                        RecordPageInfoSpecified : false,
                        BrowserType : browserName_
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('NavigateCompleteRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.NavigateCompleteRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('NavigateCompleteRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        NewWindowRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('New window request sent', 'WindowId: ' + requestContent.TabMember.WindowId);

                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessNewWindowRequest);
                var ajaxData_ = {
                    NewWindowRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Ignore : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].Ignore,
                        SessionSetId : 1,
                        TurnAway : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].TurnAway,
                        NewWindowURL : '',
                        ParentWindowHandle : requestContent.TabMember.WindowHandle
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('NewWindowRequest', ajaxData_, requestContent, successFunction_);

                sendRequestParams_.AjaxParam.Async = false;
                sendRequestParams_.AjaxParam.Timeout = 100000;
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.NewWindowRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('NewWindowRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        PersonalDetailsChosenRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Personal details chosen request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessPersonalDetailsChosenRequest);
                var ajaxData_ = {
                    PersonalDetailsChosen : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('PersonalDetailsChosenRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.PersonalDetailsChosenRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('PersonalDetailsChosenRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        PulseRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, requestContent, null, null);
                if (olFunctions.IsFilledArray(tabMembers_)) {
                    for (var i = 0; i < tabMembers_.length; i++) {
                        var alertContent_ = new olFunctions.AlertContent('Pulse request sent', 'App: ' + tabMembers_[i].ApplicationName + '\nWindowID: ' + tabMembers_[i].WindowId);
                        var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessPulseRequest);
                        var ajaxData_ = {
                            PulseRequest : {
                                WindowId : tabMembers_[i].WindowId
                            }
                        };
                        var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('PulseRequestSend', ajaxData_, requestContent, successFunction_);

                        olExtension.Service._internal.SendRequest(sendRequestParams_);

                        olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.PulseRequestSend(), alertContent_);
                    }
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('PulseRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetPersonalDetailsRequestSend : function(requestContent, processRequestSuccess) {
            try {
                //TODO ARRAY IE srediti!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                var alertContent_ = new olFunctions.AlertContent('Set personal details request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSetPersonalDetailsRequest);
                var ajaxData_ = {
                    SetPersonalDetailsRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Details : requestContent.Parameters.Details,
                        New : requestContent.Parameters.New,
                        Id : requestContent.Parameters.Id,
                        InitialRequestSpecified : requestContent.Parameters.InitialRequestSpecified
                    }
                };

                switch (olData.BrowserName) {
                    case 'iejs':
                        ajaxData_.SetPersonalDetailsRequest.Details = {};
                        ajaxData_.SetPersonalDetailsRequest.Details.Variables = [];
                        ajaxData_.SetPersonalDetailsRequest.Details.Name = requestContent.Parameters.Details.Name;

                        olExtension.Functions.fixIEObjectToArray(requestContent.Parameters.Details.Variables, ajaxData_.SetPersonalDetailsRequest.Details.Variables);

                        // for (var c = 0; c < requestContent.Parameters.Details.Variables.length; c++) {
                        // ajaxData_.SetPersonalDetailsRequest.Details.Variables.push(requestContent.Parameters.Details.Variables[c]);
                        // }
                        break;
                default:
                        break;
                }

                if (requestContent.Parameters.InitialRequestSpecified) {
                    ajaxData_.SetPersonalDetailsRequest.InitialRequest = requestContent.Parameters.InitialRequest;
                }

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SetPersonalDetailsRequest', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SetPersonalDetailsRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetPersonalDetailsRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetCommonDetailsRequestSend : function(requestContent, processRequestSuccess) {
            try {
                //TODO ARRAY IE srediti!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                var alertContent_ = new olFunctions.AlertContent('Set common details request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSetCommonDetailsRequest);
                var ajaxData_ = {
                    SetCommonDetailsRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        InitialRequestSpecified : requestContent.Parameters.InitialRequestSpecified,
                        Variable : requestContent.Parameters.Variable
                    }
                };

                if (requestContent.Parameters.InitialRequestSpecified) {
                    ajaxData_.SetCommonDetailsRequest.InitialRequest = requestContent.Parameters.InitialRequest;
                }

                switch (olData.BrowserName) {
                    case 'iejs':
                        ajaxData_.SetCommonDetailsRequest.Variable = [];

                        olExtension.Functions.fixIEObjectToArray(requestContent.Parameters.Variable, ajaxData_.SetCommonDetailsRequest.Variable);

                        // for (var c = 0; c < requestContent.Parameters.Variable.length; c++) {
                        // ajaxData_.SetCommonDetailsRequest.Variable.push(requestContent.Parameters.Variable[c]);
                        // }
                        break;
                default:
                        break;
                }

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SetCommonDetailsRequest', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SetCommonDetailsRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetPersonalDetailsRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetCommentRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set comment request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSetCommentRequest);
                var ajaxData_ = {
                    SetCommentRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Comment : requestContent.Parameters.Comment,
                        PredefinedComment : requestContent.Parameters.PredefinedComment
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SetCommentRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SetCommentRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetCommentRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetCommentEditRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set comment edit request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSetCommentEditRequest);
                var ajaxData_ = {
                    SetCommmentEditRequest : {
                        CurrentApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        MatterName : requestContent.Parameters.MatterName,
                        MatterNumber : requestContent.Parameters.MatterNumber,
                        PersonalCode : requestContent.Parameters.PersonalCode,
                        Comment : requestContent.Parameters.Comment,
                        PredefinedComment : requestContent.Parameters.PredefinedComment
                    }
                };

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SetCommentEditRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SetCommentRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetCommentEditRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetCurrentPersonalDetailsRequestSend : function(requestContent, processRequestSuccess) {
            //TODO ARRAY IE srediti!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            try {
                var alertContent_ = new olFunctions.AlertContent('Set current personal details request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSetCurrentPersonalDetailsRequest);
                var ajaxData_ = {
                    SetCurrentPersonalDetailsRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Id : requestContent.Parameters.Id,
                        PersonalDetail : requestContent.Parameters.Details
                    }
                };

                switch (olData.BrowserName) {
                    case 'iejs':
                        ajaxData_.SetCurrentPersonalDetailsRequest.PersonalDetail.Variables = [];

                        olExtension.Functions.fixIEObjectToArray(requestContent.Parameters.Details.Variables, ajaxData_.SetCurrentPersonalDetailsRequest.PersonalDetail.Variables);
                        // for (var c = 0; c < requestContent.Parameters.Details.Variables.length; c++) {
                        // ajaxData_.SetCurrentPersonalDetailsRequest.PersonalDetail.Variables.push(requestContent.Parameters.Details.Variables[c]);
                        // }
                        // break;
                default:
                        break;
                }

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SetCurrentPersonalDetailsRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SetCurrentPersonalDetailsRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetCurrentPersonalDetailsRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetTempPersonalDetailsRequestSend : function(requestContent, processRequestSuccess) {
            //TODO ARRAY IE srediti!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // PROVERITI vec je sredjeno
            try {
                var alertContent_ = new olFunctions.AlertContent('Set temp presonal details request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSetTempPersonalDetailsRequest);
                var ajaxData_ = {
                    SetTempPersonalDetailsRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Id : requestContent.Parameters.Id,
                        Details : {
                            Name : requestContent.Parameters.Details.Name,
                            Variables : requestContent.Parameters.Details.Variables
                        }
                    }
                };

                switch (olData.BrowserName) {
                    case 'iejs':
                        ajaxData_.SetTempPersonalDetailsRequest.Details.Variables = [];

                        olExtension.Functions.fixIEObjectToArray(requestContent.Parameters.Details.Variables, ajaxData_.SetTempPersonalDetailsRequest.Details.Variables);

                        // for (var c = 0; c < requestContent.Parameters.Details.Variables.length; c++) {
                        // ajaxData_.SetTempPersonalDetailsRequest.Details.Variables.push(requestContent.Parameters.Details.Variables[c]);
                        // }
                        break;
                default:
                        break;
                }

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SetTempPersonalDetailsRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SetTempPersonalDetailsRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetTempPersonalDetailsRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SkipMatterDetailsRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Skip matter details request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSkipMatterDetailsRequest);
                var ajaxData_ = {
                    SkipMatterDetailsRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SkipMatterDetailsRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SkipMatterDetailsRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SkipMatterDetailsRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SkipPersonalDetailsChosenRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Personal details chosen request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSkipPersonalDetailsChosenRequest);
                var ajaxData_ = {
                    SkipPersonalDetailsChosen : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SkipPersonalDetailsChosenRequestSend', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);
                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SkipPersonalDetailsChosenRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SkipPersonalDetailsChosenRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SkipPersonalDetailsRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Personal details chosen request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSkipPersonalDetailsRequest);
                var ajaxData_ = {
                    SkipPersonalDetailsRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SkipPersonalDetailsRequest', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SkipPersonalDetailsRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SkipPersonalDetailsRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        StorePasswordRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Store passwordn request sent', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessStorePassword);
                var ajaxData_ = {
                    StorePassword : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Store : requestContent.Parameters.Store
                    }
                };

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('StorePasswordRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.StorePasswordRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SkipPersonalDetailsRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        ValidateSelectedMatterRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Validate matter request sent (selected matter)', 'Matter number: ' + requestContent.Parameters.MatterNumber);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessValidateSelectedMatterRequest);
                var ajaxData_ = {
                    ValidateMatterRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Comment : requestContent.Parameters.Comment,
                        MatterName : requestContent.Parameters.MatterName,
                        MatterNumber : requestContent.Parameters.MatterNumber,
                        PersonalCode : requestContent.Parameters.PersonalCode,
                        PredefinedComment : requestContent.Parameters.PredefinedComment,
                        RequestNewSession : requestContent.Parameters.RequestNewSession,
                        RequestNewSessionSpecified : requestContent.Parameters.RequestNewSessionSpecified
                    }
                };

                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('ValidateMatterRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.ValidateMatterRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('ValidateSelectedMatterRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        WindowClosingRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Window closing request sent', 'WindowId: ' + requestContent.TabMember.WindowId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessWindowClosingRequest);
                var ajaxData_ = {
                    WindowClosingRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Ignore : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].Ignore,
                        TurnAway : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].TurnAway,
                        WindowId : requestContent.TabMember.WindowId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('WindowClosingRequest', ajaxData_, requestContent, successFunction_);

                sendRequestParams_.AjaxParam.Async = false;
                sendRequestParams_.AjaxParam.Timeout = 100000;
                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.WindowClosingRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('WindowClosingRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        QuittingResourceSessionRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Quitting resource session request sent', 'WindowId: ' + requestContent.TabMember.WindowId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessQuittingResourceSessionRequest);
                var ajaxData_ = {
                    QuittingResourceSession : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('QuittingResourceSession', ajaxData_, requestContent, successFunction_);
                sendRequestParams_.AjaxParam.Async = false;
                sendRequestParams_.AjaxParam.Timeout = 100000;
                olExtension.Service._internal.SendRequest(sendRequestParams_);
                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.QuittingResourceSessionRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('QuittingResourceSessionRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        //Analysis service requests
        SetFeaturesRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set features request sent', 'WindowId: ' + requestContent.TabMember.WindowId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSetFeaturesRequest);

                var ajaxData_ = {
                    SetFeaturesRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        Features : []
                    }
                };

                // featureRequest IE problem with array formating
                var browserName_ = olData.BrowserName;
                switch (browserName_) {
                    case 'iejs':
                        ajaxData_.SetFeaturesRequest.Features = [];
                    for (var j = 0; j < requestContent.Parameters.Features.length; j++) {
                            ajaxData_.SetFeaturesRequest.Features.push(olFunctions.Clone(requestContent.Parameters.Features[j]));
                            ajaxData_.SetFeaturesRequest.Features[j].Item = new Array();
                        }
                        ;
                    for (var i = 0; i < ajaxData_.SetFeaturesRequest.Features.length; i++) {
                        for (var c = 0; c < requestContent.Parameters.Features[i].Item.length; c++) {
                                ajaxData_.SetFeaturesRequest.Features[i].Item.push(requestContent.Parameters.Features[i].Item[c]);
                            }
                        }
                        break;
                default:
                        ajaxData_.SetFeaturesRequest.Features = requestContent.Parameters.Features;
                        break;
                }
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SetFeaturesRequest', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);
                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.SetFeaturesRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetFeaturesRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        RequestFeatureRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Request feature request sent', 'WindowId: ' + requestContent.TabMember.WindowId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessRequestFeatureRequest);
                var ajaxData_ = {
                    RequestFeature : {
                        Item : requestContent.TabMember.ApplicationsSessionId,
                        Label : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].Ignore,
                        UID : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].TurnAway
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('RequestFeatureRequestSend', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);
                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.RequestFeatureSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('RequestFeatureRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        RequestFeatureItemRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Request feature item request sent', 'WindowId: ' + requestContent.TabMember.WindowId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessRequestFeatureItemRequest);
                var ajaxData_ = {
                    RequestFeatureItem : {
                        IsCost : requestContent.TabMember.ApplicationsSessionId,
                        IsUnique : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].Ignore,
                        Label : requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].TurnAway,
                        Value : requestContent.TabMember.WindowId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('RequestFeatureItemRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);

                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.RequestFeatureItemSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('RequestFeatureItemRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetAnalysisRequest : function(requestContent, processRequestSuccess) {
            try {
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessSetAnalysisRequest);
                var ajaxData_ = {
                    SetAnalysisRequest : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId,
                        RequestAnalysisControlItems : [JSON.parse(requestContent.Parameters)]
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('SetAnalysisRequestSend', ajaxData_, requestContent, successFunction_);

                olExtension.Service._internal.SendRequest(sendRequestParams_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetAnalysisRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        //WebControl service requests
        StartMessageSeenRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Request feature item request sent', 'WindowId: ' + requestContent.TabMember.WindowId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessStartMessageSeenRequest);
                var ajaxData_ = {
                    StartMessageSeen : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('StartMessageSeenRequestSend', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);
                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.StartMessageSeenRequestSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('StartMessageSeenRequestSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        HideStartMessageRequestSend : function(requestContent, processRequestSuccess) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Request feature item request sent', 'WindowId: ' + requestContent.TabMember.WindowId);
                var successFunction_ = olExtension.Service._internal.SetSuccessFunction(processRequestSuccess, olExtension.Service._internal.SuccessHideStartMessageRequest);
                var ajaxData_ = {
                    HideStartMessage : {
                        ApplicationSessionId : requestContent.TabMember.ApplicationsSessionId
                    }
                };
                var sendRequestParams_ = new olExtension.DataConstructors.SendRequestParameters('HideStartMessageRequestSend', ajaxData_, requestContent, successFunction_);
                olExtension.Service._internal.SendRequest(sendRequestParams_);
                olFunctions.Alert(olOptions.Debug.Extension.Service.SentRequests.HideStartMessageRequesttSendSend(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('HideStartMessageRequesttSend', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        _internal : {
            HandleLogoutForExistingTabMembers : function(tabMember) {
                try {
                    //handle resource end for existing tabMembers with different app session id
                    var filterMembers_ = olExtension._internal.TabMember.Filter(tabMember.WindowHandle, tabMember.TabId, null, null);
                    if (olFunctions.IsFilledArray(filterMembers_)) {
                        for (var i = 0; i < filterMembers_.length; i++) {
                            if (tabMember.ApplicationsSessionId) {
                                if (tabMember.ApplicationsSessionId != filterMembers_[i].ApplicationsSessionId) {
                                    olExtension._internal.TabMember.HandleResourceEnd(filterMembers_[i]);
                                }
                            } else {
                                olExtension._internal.TabMember.HandleResourceEnd(filterMembers_[i]);
                            }
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('HandleLogoutForExistingTabMembers', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            SetSuccessFunction : function(processRequestSuccess, successFunction) {
                if ( typeof (processRequestSuccess) === 'undefined')
                    processRequestSuccess = true;
                if (processRequestSuccess) {
                    return successFunction;
                } else {
                    return null;
                }
            },
            SendRequest : function(sendRequestParameters) {
                // this is main request sending function that gets info ONLY from localy installed service app
                try {
                    if (sendRequestParameters.RequestName == 'LanguageItemsRequestSend' || olFunctions.IsFilledArray(olExtension._internal.LanguageItems)) {
                        $.ajax({
                            processData : sendRequestParameters.AjaxParam.ProcessData,
                            cache : sendRequestParameters.AjaxParam.Cache,
                            async : sendRequestParameters.AjaxParam.Async,
                            type : sendRequestParameters.AjaxParam.Type,
                            url : 'http://localhost:12345/index/',
                            contentType : sendRequestParameters.AjaxParam.ContentType,
                            data : JSON.stringify(sendRequestParameters.AjaxParam.Data),
                            timeout : sendRequestParameters.AjaxParam.Timeout,
                            success : function(requestResult) {
                                if (requestResult && requestResult.ErrorState) {
                                    var alertContent_ = new olFunctions.AlertContent(sendRequestParameters.RequestName + ' Error', 'ErrorId: ' + requestResult.ErrorState.ErrorId);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);

                                    if (sendRequestParameters.RequestContent.TabMember) {
                                        if (!(sendRequestParameters.RequestName == 'BeforeNavigateRequest' || sendRequestParameters.RequestName == 'NavigateCompleteRequest' || sendRequestParameters.RequestName == 'PulseRequestSend')) {
                                            sendRequestParameters.RequestContent.TabMember._internal.ExtensionFlags.ErrorState = true;
                                            sendRequestParameters.RequestContent.TabMember._internal.ExtensionFlags.ServiceResponded = true;
                                            olExtension._internal.TabMember.RemoveOnErrorState(sendRequestParameters.RequestContent.TabMember);
                                        } else {
                                            if (!sendRequestParameters.RequestContent.TabMember.ApplicationsSessionId) {
                                                olExtension._internal.TabMember.Remove(sendRequestParameters.RequestContent.TabMember);
                                            }
                                        }
                                    }
                                } else {
                                    olExtension.Messages._errorState = false;
                                    if (sendRequestParameters.RequestSuccessFunction) {
                                        sendRequestParameters.RequestSuccessFunction(requestResult, sendRequestParameters.RequestContent);
                                    }
                                }
                            },
                            error : function(e) {
                                var alertContent_ = new olFunctions.AlertContent(sendRequestParameters.RequestName + ' server response error: ' + e.statusText);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);

                                if (sendRequestParameters.RequestName == 'LanguageItemsRequestSend') {
                                    // no language items, send in 1 second
                                    setTimeout(function() {
                                        olExtension.Service._internal.SendRequest(sendRequestParameters);
                                    }, 1000);
                                } else {
                                    if (sendRequestParameters.RequestContent.TabMember) {
                                        if (!(sendRequestParameters.RequestName == 'BeforeNavigateRequest' || sendRequestParameters.RequestName == 'NavigateCompleteRequest' || sendRequestParameters.RequestName == 'PulseRequestSend')) {
                                            sendRequestParameters.RequestContent.TabMember._internal.ExtensionFlags.ErrorState = true;
                                            sendRequestParameters.RequestContent.TabMember._internal.ExtensionFlags.ServiceResponded = true;
                                            olExtension._internal.TabMember.RemoveOnErrorState(sendRequestParameters.RequestContent.TabMember);

                                            var messageContent_ = new olExtension.DataConstructors.MessageContent(sendRequestParameters.RequestContent.TabMember);
                                            olExtension.Messages.Error(messageContent_);
                                        } else {
                                            if (!sendRequestParameters.RequestContent.TabMember.ApplicationsSessionId) {
                                                olExtension._internal.TabMember.Remove(sendRequestParameters.RequestContent.TabMember);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        var alertErrorContent_ = new olFunctions.AlertContent('Error! ' + sendRequestParameters.RequestName + ' not sent. No language items.');
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        if (sendRequestParameters.RequestContent.TabMember) {
                            olExtension._internal.TabMember.Remove(sendRequestParameters.RequestContent.TabMember);
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('SendRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            SortMatterDetails : function(requestResult, requestContent) {
                try {
                    //sort matter numbers
                    var matterDetails_ = requestContent.TabMember.PageInfo.Response.CheckMatterResponse.MatterDetails;
                    var matterDetail_;
                    var matterIndex_ = -1;
                    for (var i = 0; i < matterDetails_.length; i++) {
                        if (matterDetails_[i].MatterNumber == requestContent.Parameters.MatterNumber) {
                            matterIndex_ = i;
                            break;
                        }
                    }

                    if (matterIndex_ > -1) {
                        matterDetail_ = matterDetails_.splice(matterIndex_, 1)[0];
                    } else {
                        matterDetail_ = {
                            MatterName : '',
                            MatterNumber : requestContent.Parameters.MatterNumber
                        };
                    }

                    if (requestResult.ValidateMatterResponse.ValidatedSpecified && requestResult.ValidateMatterResponse.Validated) {
                        matterDetails_.reverse();
                        matterDetails_.push(matterDetail_);
                        matterDetails_.reverse();
                        while (matterDetails_.length > 10) {
                            matterDetails_.pop();
                        }
                    }

                    //sort Timekeeper Numbers
                    if (requestContent.TabMember._internal.PageFlags.PersonalCodeNeeded) {
                        var timekeeper_ = requestContent.Parameters.PersonalCode;
                        var localPersonalCodes_ = requestContent.TabMember.PageInfo.Response.GetLocalPersonalCodeListResponse.LocalPersonalCodes;
                        if (olFunctions.IsFilledArray(localPersonalCodes_)) {
                            var personalCodeIndex_ = -1;
                            for ( i = 0; i < localPersonalCodes_.length; i++) {
                                if (localPersonalCodes_[i] == timekeeper_) {
                                    personalCodeIndex_ = i;
                                    break;
                                }
                            }

                            if (personalCodeIndex_ > -1) {
                                localPersonalCodes_.splice(personalCodeIndex_, 1)[0];
                            }

                            if (requestResult.ValidateMatterResponse.ValidatedSpecified && requestResult.ValidateMatterResponse.Validated) {
                                localPersonalCodes_.reverse();
                                localPersonalCodes_.push(timekeeper_);
                                localPersonalCodes_.reverse();
                                while (localPersonalCodes_.length > 10) {
                                    localPersonalCodes_.pop();
                                }
                            }
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('SortMatterDetails', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            SuccessApplicationRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Application request succeeded', 'Url: ' + requestContent.TabMember._internal.GetUrl());
                    requestResult.BeforeNavigateResponses[0].ApplicationName = requestContent.Parameters.ApplicationName;

                    olExtension.Service._internal.SuccessBeforeNavigateRequest(requestResult, requestContent);

                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.ApplicationRequest(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessApplicationRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessDummyBeforeNavigateRequest : function(requestResult, requestContent) {
                try {
                    if (requestResult && requestResult.BeforeNavigateResponses && requestResult.BeforeNavigateResponses[0] && requestResult.BeforeNavigateResponses[0].AppIdSpecified) {

                        //Update StartTime and PauseDuration
                        var bnr0_ = requestResult.BeforeNavigateResponses[0];
                        var alertContent_ = new olFunctions.AlertContent('Dummy Before navigate request succeeded', 'App: ' + requestContent.TabMember.ApplicationName + '\nStart time: ' + bnr0_.StartTime + '\nPauseDuration: ' + bnr0_.PauseDuration);
                        olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.BeforeNavigate(), alertContent_);

                        if (requestContent.TabMember.PageInfo.Response) {
                            if (!requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses) {
                                requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses = [];
                                requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses.push(bnr0_);
                            }

                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].StartTime = bnr0_.StartTime;
                            //and send pause duration
                            if (!(bnr0_.PauseDuration && bnr0_.PauseDuration > 0)) {
                                bnr0_.PauseDuration = 0;
                            }

                            //Change state of InOfflineMode
                            if (bnr0_.InOfflineModeSpecified) {
                                requestContent.TabMember._internal.PageFlags.InOfflineMode = bnr0_.InOfflineMode;
                            }

                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = bnr0_.PauseDuration;
                            // send pause duration back to tab
                            // var dummyBeforeNavigate_ = {
                            // ApplicationName : bnr0_.ApplicationName,
                            // PauseDuration : bnr0_.PauseDuration,
                            // InOfflineMode : bnr0_.InOfflineMode
                            // };
                            // var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, dummyBeforeNavigate_);
                            // olExtension.Messages.PauseDuration(messageContent_);

                            var messageContent1_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);
                            olExtension.Messages.BeforeNavigateRequestDispatchResponse(messageContent1_);

                            //sending NavigateCompleteRequest
                            var requestContent1_ = new olExtension.DataConstructors.RequestContent(requestContent.TabMember);
                            olExtension.Service.NavigateCompleteRequestSend(requestContent1_);
                        }
                    }
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessDummyBeforeNavigateRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            _sbnCreateDefinedNames : function(tabMember, requestResult) {
                try {
                    var bnr0_ = requestResult.BeforeNavigateResponses[0];
                    var usernameArray_ = [];
                    var passwordArray_ = [];
                    var matterArray_ = ['matter'];
                    var customArray_ = [];
                    var timeKeeperArray_ = ['time keeper', 'timekeeper'];
                    var commentArray_ = ['comment'];
                    var currentForm_;
                    if (bnr0_) {
                        if (bnr0_.Forms == null) {
                            bnr0_.Forms = [];
                        }
                        // if automatic or collect login type check changepass form
                        if (bnr0_.PasswordManagementTypeSpecified && bnr0_.PasswordManagementType == 2 && bnr0_.ChangePassword && olFunctions.IsFilledArray(bnr0_.ChangePassword)) {
                            for (var a = 0; a < bnr0_.ChangePassword.length; a++) {
                                bnr0_.Forms.push(bnr0_.ChangePassword[a]);
                            }
                        }
                        if (bnr0_.Forms && olFunctions.IsFilledArray(bnr0_.Forms)) {
                            for (var p = 0; p < bnr0_.Forms.length; p++) {
                                currentForm_ = bnr0_.Forms[p];
                                var currentElement_;
                                for (var o = 0; o < currentForm_.Elements.length; o++) {
                                    currentElement_ = currentForm_.Elements[o];

                                    if (currentElement_.DefinedName) {
                                        switch (currentElement_.Type) {
                                            case 0:
                                            if ($.inArray(currentElement_.DefinedName, usernameArray_) == -1) {
                                                    usernameArray_.push(String(currentElement_.DefinedName));
                                                }
                                                break;
                                            case 1:
                                            if ($.inArray(currentElement_.DefinedName, passwordArray_) == -1) {
                                                    passwordArray_.push(String(currentElement_.DefinedName));
                                                }

                                                break;
                                            case 2:
                                            if ($.inArray(currentElement_.DefinedName, matterArray_) == -1) {
                                                    matterArray_.push(String(currentElement_.DefinedName));
                                                }
                                                break;
                                            case 3:
                                            if ($.inArray(currentElement_.DefinedName, customArray_) == -1) {
                                                    customArray_.push(String(currentElement_.DefinedName));
                                                }
                                                break;
                                            case 4:
                                            if ($.inArray(currentElement_.DefinedName, timeKeeperArray_) == -1) {
                                                    timeKeeperArray_.push(String(currentElement_.DefinedName));
                                                }
                                                break;
                                            case 5:
                                            if ($.inArray(currentElement_.DefinedName, commentArray_) == -1) {
                                                    commentArray_.push(String(currentElement_.DefinedName));
                                                }
                                                break;
                                        }
                                    }
                                }
                            }
                            // username and password are filled only if there are forms
                            tabMember.PageInfo.DefinedNames.UsernameArray = usernameArray_;
                            tabMember.PageInfo.DefinedNames.PasswordArray = passwordArray_;
                        }
                        // matter, custom, timekeeper and comment are filled always
                        tabMember.PageInfo.DefinedNames.MatterArray = matterArray_;
                        tabMember.PageInfo.DefinedNames.CustomArray = customArray_;
                        tabMember.PageInfo.DefinedNames.TimeKeeperArray = timeKeeperArray_;
                        tabMember.PageInfo.DefinedNames.CommentArray = commentArray_;
                    }
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('_sbnCreateDefinedNames', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            _sbnSetInternalData : function(tabMember, requestResult) {
                try {
                    //Service responded FIRST LINE
                    tabMember._internal.ExtensionFlags.ServiceResponded = true;

                    //we have all that we need for new tab member, just to check if it is hash event
                    if (tabMember.PageInfo.Response.BeforeNavigateResponses == null || tabMember.PageInfo.Response.BeforeNavigateResponses[0] == null || !tabMember.PageInfo.Response.BeforeNavigateResponses[0].AppIdSpecified) {
                        // this is new tab memeber
                        tabMember.PageInfo.Response.BeforeNavigateResponses = requestResult.BeforeNavigateResponses;
                    }

                    if (tabMember.PageInfo.Response.BeforeNavigateResponses != null) {
                        tabMember.PageInfo.LanguageItemsLabels = {};

                        for (var i = 0; i < olExtension._internal.LanguageItems.length; i++) {
                            tabMember.PageInfo.LanguageItemsLabels[olExtension._internal.LanguageItems[i].Key] = olExtension._internal.LanguageItems[i].Value;
                        }

                        var bnr0_ = requestResult.BeforeNavigateResponses[0];
                        tabMember.ApplicationsSessionId = bnr0_.ApplicationsSessionId;

                        //Check application name
                        if (bnr0_.ApplicationName && bnr0_.ApplicationName != null) {
                            tabMember.ApplicationName = bnr0_.ApplicationName;
                        }

                        //LicenceLimitReached
                        if (bnr0_.LicenceLimitReachedSpecified) {
                            tabMember._internal.PageFlags.LicenceLimitReachedNeeded = bnr0_.LicenceLimitReached;
                        }

                        //PooledDetailsLimitReached
                        if (bnr0_.PooledDetailsLimitReachedSpecified) {
                            tabMember._internal.PageFlags.PooledDetailsLimitReachedNeeded = bnr0_.PooledDetailsLimitReached;
                        }

                        //Matter format
                        if (bnr0_.MatterFormat) {
                            tabMember._internal.PageFlags.MatterFormat = bnr0_.MatterFormat;
                        }

                        //Matter free input
                        if (bnr0_.MatterFreeInput) {
                            tabMember._internal.PageFlags.MatterFreeInput = bnr0_.MatterFreeInput;
                        }

                        //In offline mode
                        if (bnr0_.InOfflineModeSpecified) {
                            tabMember._internal.PageFlags.InOfflineMode = bnr0_.InOfflineMode;
                        }

                        //Unauthorised access
                        if (bnr0_.UnauthorisedSpecified) {
                            tabMember._internal.PageFlags.Unauthorised = bnr0_.Unauthorised;
                        }

                        //Logon details
                        if (bnr0_.LogonDetailsFreeInputSpecified) {
                            tabMember._internal.PageFlags.LogonDetailsFreeInput = bnr0_.LogonDetailsFreeInput;
                        }

                        //LoginType
                        try {
                            tabMember._internal.PageFlags.PmtUser = bnr0_.PasswordManagementTypeSpecified && bnr0_.PasswordManagementType == 0;
                            tabMember._internal.PageFlags.PmtAdmin = bnr0_.PasswordManagementTypeSpecified && bnr0_.PasswordManagementType == 1;
                            tabMember._internal.PageFlags.PmtAutomatic = (bnr0_.PasswordManagementTypeSpecified && bnr0_.PasswordManagementType == 2);
                            tabMember._internal.PageFlags.PassDetailsToSite = (!tabMember._internal.PageFlags.PmtAutomatic || (bnr0_.PassDetailsToSiteSpecified && bnr0_.PassDetailsToSite));

                            if (tabMember._internal.PageFlags.PmtUser) {
                                tabMember._internal.PageFlags.LoginType = 'User';
                            } else if (tabMember._internal.PageFlags.PmtAdmin) {
                                tabMember._internal.PageFlags.LoginType = 'Admin';
                            } else {
                                if (tabMember._internal.PageFlags.PmtAutomatic && tabMember._internal.PageFlags.PassDetailsToSite) {
                                    tabMember._internal.PageFlags.LoginType = 'Automatic';
                                } else if (tabMember._internal.PageFlags.PmtAutomatic && !tabMember._internal.PageFlags.PassDetailsToSite) {
                                    tabMember._internal.PageFlags.LoginType = 'Collect';
                                }
                            }
                        } catch (e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('_sbnSetInternalData', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                        olExtension.Service._internal._sbnCreateDefinedNames(tabMember, requestResult);
                    }
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('_sbnSetInternalData', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            _sbnSetDataFromExistingTabMembers : function(tabMember) {
                try {
                    var filterMembers_ = olExtension._internal.TabMember.Filter(null, null, null, tabMember.ApplicationsSessionId);

                    if (olFunctions.IsFilledArray(filterMembers_)) {
                        for (var i = 0; i < filterMembers_.length; i++) {
                            if (filterMembers_[i].Id != tabMember.Id) {
                                if (filterMembers_[i]._internal.ExtensionFlags.ServiceResponded) {
                                    if (filterMembers_[i].PageInfo.Response.BeforeNavigateResponses && filterMembers_[i].PageInfo.Response.BeforeNavigateResponses[0]) {
                                        tabMember.PageInfo.Response.BeforeNavigateResponses[0].ShowStartMessage = filterMembers_[i].PageInfo.Response.BeforeNavigateResponses[0].ShowStartMessage ? filterMembers_[i].PageInfo.Response.BeforeNavigateResponses[0].ShowStartMessage : false;
                                        if (filterMembers_[i].PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement) {
                                            tabMember.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement = filterMembers_[i].PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement;
                                        }
                                    }
                                }
                                if (filterMembers_[i]._internal.ExtensionFlags.BasicAuthDoneOrNotNeeded) {
                                    tabMember._internal.ExtensionFlags.BasicAuthDoneOrNotNeeded = true;
                                }
                                if (filterMembers_[i]._internal.ExtensionFlags.BeforeNavigateRequestSent) {
                                    tabMember._internal.ExtensionFlags.BeforeNavigateRequestSent = true;
                                }

                                if (filterMembers_[i]._internal.ExtensionFlags.MatterDetailFilled) {
                                    tabMember._internal.ExtensionFlags.MatterDetailFilled = true;
                                    tabMember.PageInfo.Response.CheckMatterResponse = filterMembers_[i].PageInfo.Response.CheckMatterResponse;
                                }

                                if (filterMembers_[i]._internal.ExtensionFlags.PersonalCodeFilled) {
                                    tabMember._internal.ExtensionFlags.PersonalCodeFilled = true;
                                    tabMember.PageInfo.Response.GetLocalPersonalCodeListResponse = filterMembers_[i].PageInfo.Response.GetLocalPersonalCodeListResponse;
                                }

                                filterMembers_[i].PageInfo.LastUrl = tabMember.PageInfo.LastUrl;
                                tabMember._internal.PageFlags = filterMembers_[i]._internal.PageFlags;
                                for (var j in tabMember.Domains) {
                                    if ($.inArray(tabMember.Domains[j], filterMembers_[i].Domains) == -1) {
                                        filterMembers_[i].Domains.push(tabMember.Domains[j]);
                                    }
                                }
                                tabMember.Domains = filterMembers_[i].Domains;

                                // this next part has to be last in this if branch!!!
                                if ((filterMembers_[i].TabId == tabMember.TabId) && (filterMembers_[i].WindowHandle == tabMember.WindowHandle)) {
                                    olExtension._internal.TabMember.Remove(filterMembers_[i], false);
                                    // failsafe
                                    olExtension._internal.TabMember.Add(tabMember);
                                }
                            }
                        }
                    }
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('_sbnSetDataFromExistingTabMembers', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            _populateVariableReplacements : function(definedNamesArray, bnr0) {
                try {
                    for (var i = 0; i < definedNamesArray.length; i++) {
                        var set_ = true;
                        for (var j = 0; j < bnr0.VariableReplacement.Variables.length; j++) {
                            if (String(bnr0.VariableReplacement.Variables[j].DefinedName) == String(definedNamesArray[i])) {
                                set_ = false;
                                break;
                            }
                        }
                        if (set_) {
                            var variable_ = {
                                olAdded : true,
                                AutomaticValue : null,
                                DefinedName : String(definedNamesArray[i]),
                                IsCommonSpecified : false,
                                IsPersonalSpecified : false,
                                Label : String(definedNamesArray[i]),
                                Value : ''
                            };
                            bnr0.VariableReplacement.Variables.push(variable_);
                        }
                    }
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('_populateVariableReplacements', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            _sbnSetDataForResource : function(requestContent, requestResult) {
                try {
                    var bnr0_ = requestResult.BeforeNavigateResponses[0];

                    //Logon needed?
                    requestContent.TabMember._internal.PageFlags.LogonNeededForUsername = false;
                    requestContent.TabMember._internal.PageFlags.LogonNeededForPassword = false;
                    requestContent.TabMember._internal.PageFlags.LogonCommonNeededForUsername = false;
                    requestContent.TabMember._internal.PageFlags.LogonCommonNeededForPassword = false;

                    var usernameArray_ = requestContent.TabMember.PageInfo.DefinedNames.UsernameArray;
                    var passwordArray_ = requestContent.TabMember.PageInfo.DefinedNames.PasswordArray;
                    var matterArray_ = requestContent.TabMember.PageInfo.DefinedNames.MatterArray;
                    var timeKeeperArray_ = requestContent.TabMember.PageInfo.DefinedNames.TimeKeeperArray;
                    var commentArray_ = requestContent.TabMember.PageInfo.DefinedNames.CommentArray;

                    if (bnr0_.VariableReplacement && olFunctions.IsFilledArray(bnr0_.VariableReplacement.Variables)) {
                        for (var i = 0; i < bnr0_.VariableReplacement.Variables.length; i++) {
                            var definedNameVariables_ = String(bnr0_.VariableReplacement.Variables[i].DefinedName);
                            if (($.inArray(definedNameVariables_, usernameArray_) > -1) && bnr0_.VariableReplacement.Variables[i].IsPersonal) {
                                requestContent.TabMember._internal.PageFlags.LogonNeededForUsername = bnr0_.VariableReplacement.Variables[i].IsPersonal;
                            }
                            if (($.inArray(definedNameVariables_, usernameArray_) > -1) && bnr0_.VariableReplacement.Variables[i].IsCommon) {
                                requestContent.TabMember._internal.PageFlags.LogonCommonNeededForUsername = bnr0_.VariableReplacement.Variables[i].IsCommon;
                            }
                            if (($.inArray(definedNameVariables_, passwordArray_) > -1) && bnr0_.VariableReplacement.Variables[i].IsPersonal) {
                                requestContent.TabMember._internal.PageFlags.LogonNeededForPassword = bnr0_.VariableReplacement.Variables[i].IsPersonal;
                            }
                            if (($.inArray(definedNameVariables_, passwordArray_) > -1) && bnr0_.VariableReplacement.Variables[i].IsCommon) {
                                requestContent.TabMember._internal.PageFlags.LogonCommonNeededForPassword = bnr0_.VariableReplacement.Variables[i].IsCommon;
                            }

                            //set automatic values
                            if (!bnr0_.VariableReplacement.Variables[i].AutomaticValue) {
                                bnr0_.VariableReplacement.Variables[i].AutomaticValue = null;
                            }
                        }
                        //if there are variables fill usernames and passwords
                        olExtension.Service._internal._populateVariableReplacements(usernameArray_, bnr0_);
                        olExtension.Service._internal._populateVariableReplacements(passwordArray_, bnr0_);
                    } else {
                        if (!bnr0_.VariableReplacement) {
                            bnr0_.VariableReplacement = {};
                        }
                        if (!bnr0_.VariableReplacement.Variables) {
                            bnr0_.VariableReplacement.Variables = [];
                        }
                    }

                    // matter, timekeeper and comment arrayes should be filled every time
                    olExtension.Service._internal._populateVariableReplacements(matterArray_, bnr0_);
                    olExtension.Service._internal._populateVariableReplacements(timeKeeperArray_, bnr0_);
                    olExtension.Service._internal._populateVariableReplacements(commentArray_, bnr0_);

                    requestContent.TabMember._internal.PageFlags.LogonNeeded = requestContent.TabMember._internal.PageFlags.LogonNeededForPassword || requestContent.TabMember._internal.PageFlags.LogonNeededForUsername;
                    requestContent.TabMember._internal.PageFlags.LogonCommonNeeded = requestContent.TabMember._internal.PageFlags.LogonCommonNeededForPassword || requestContent.TabMember._internal.PageFlags.LogonCommonNeededForUsername;

                    //Matter needed?
                    requestContent.TabMember._internal.PageFlags.MatterNeeded = bnr0_.RecordMatter;
                    //Timekeeper(PersonalCode) needed?
                    requestContent.TabMember._internal.PageFlags.PersonalCodeNeeded = bnr0_.RequestPersonalCode;

                    if (bnr0_.RecordMatter && !requestContent.TabMember._internal.ExtensionFlags.MatterDetailFilled) {
                        olExtension.Service.CheckMatterLocalRequestSend(requestContent);
                        olExtension.Service.GetLocalPersonalCodeListRequestSend(requestContent);
                    } else {
                        requestContent.TabMember._internal.ExtensionFlags.MatterDetailFilled = true;
                        requestContent.TabMember._internal.ExtensionFlags.PersonalCodeFilled = true;
                        var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);
                        olExtension.Messages.BeforeNavigateRequestDispatchResponse(messageContent_);
                    }
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('_sbnSetDataForResource', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            _successBeforeNavigateLocked : false,
            SuccessBeforeNavigateRequest : function(requestResult, requestContent) {
                if (!olExtension.Service._internal._successBeforeNavigateLocked) {
                    olExtension.Service._internal._successBeforeNavigateLocked = true;
                    try {
                        var alertContent_ = new olFunctions.AlertContent('Before navigate request succeeded', 'Url: ' + requestContent.TabMember._internal.GetUrl());
                        olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.BeforeNavigate(), alertContent_);

                        olExtension.Service._internal._sbnSetInternalData(requestContent.TabMember, requestResult);

                        if (olFunctions.IsFilledArray(requestResult.BeforeNavigateResponses)) {
                            var bnr0_ = requestResult.BeforeNavigateResponses[0];
                            if (bnr0_.AppIdSpecified || bnr0_.WebControlRules) {
                                if (bnr0_.ApplicationsSessionId || bnr0_.WebControlRules) {
                                    olExtension.Service._internal.HandleLogoutForExistingTabMembers(requestContent.TabMember);
                                    olExtension.Service._internal._sbnSetDataFromExistingTabMembers(requestContent.TabMember);
                                    if (!requestContent.TabMember._internal.PageFlags.Unauthorised) {
                                        //Authorised access
                                        if (!requestContent.TabMember._internal.ExtensionFlags.TabRemoved) {
                                            olExtension.Service._internal._sbnSetDataForResource(requestContent, requestResult);

                                            //Basic Auth
                                            olExtension.BasicAuthentication.HandleBasicAuthentication(requestContent.TabMember, bnr0_.VariableReplacement.Variables);
                                        } else {
                                            // tab removed before server responded and now we have all info
                                            // just call window closing
                                            olExtension.Service.WindowClosingRequestSend(requestContent);
                                        }
                                    } else {
                                        // Unathorised access
                                        var messageContent1_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);
                                        olExtension.Messages.BeforeNavigateRequestDispatchResponse(messageContent1_);
                                    }
                                } else {
                                    if (bnr0_.ApplicationsSessionId == null) {
                                        // native mode with exact url is used so we should remove this one
                                        olExtension.BasicAuthentication._internal.RemoveFromRefreshTabIdArray(requestContent.TabMember.TabId);
                                        olExtension._internal.TabMember.Remove(requestContent.TabMember);
                                    } else {
                                        var alertErrorContent_ = new olFunctions.AlertContent('Error! Tab member should not exist here');
                                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                    }
                                }
                            } else {
                                // AppId not specified
                                // => mutliple applications, send choose application
                                if (bnr0_.ApplicationsSessionId) {
                                    var messageContent2_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);

                                    olExtension.Messages.ChooseApplicationDispatchMessage(messageContent2_);
                                    olExtension.Service._internal.HandleLogoutForExistingTabMembers(requestContent.TabMember);
                                } else {
                                    olExtension.BasicAuthentication._internal.RemoveFromRefreshTabIdArray(requestContent.TabMember.TabId);
                                    olExtension._internal.TabMember.Remove(requestContent.TabMember);
                                }
                            }
                        } else {
                            //bnr being null means something strange happened and our requests broke server logic
                            //only way we know this could happen is on rederect on url that has multiple resources on it
                            //the fact this happened indicates that first tab member will not hit document ready
                            var sameIdTabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, requestContent.TabMember.TabId, null, null);

                            if (sameIdTabMembers_.lenght > 1) {
                                var previousTabMember_ = sameIdTabMembers_[sameIdTabMembers_.length - 2];
                                previousTabMember_.PageInfo.LastUrl = requestContent.TabMember.PageInfo.LastUrl;
                                previousTabMember_.PageInfo.Url = requestContent.TabMember.PageInfo.Url;
                                previousTabMember_.TargetTab = requestContent.TabMember.TargetTab;

                                if (requestContent.TabMember._internal.ExtensionFlags.DocumentReady) {
                                    olExtension.Listeners._internal.Messages._onDocumentReady(previousTabMember_.TargetTab);
                                }
                                olExtension._internal.TabMember.Remove(requestContent.TabMember);
                            } else {
                                olExtension._internal.TabMember.Remove(sameIdTabMembers_[0]);
                            }
                        }
                    } catch (e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('SuccessBeforeNavigateRequest', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }

                    olExtension.Service._internal._successBeforeNavigateLocked = false;
                } else {
                    setTimeout(function() {
                        olExtension.Service._internal.SuccessBeforeNavigateRequest(requestResult, requestContent);
                    }, 200);

                }
            },
            SuccessCheckMatterGlobalRequest : function(requestResult, requestContent) {
                try {
                    if (!requestResult || !requestResult.CheckMatterResponse || !requestResult.CheckMatterResponse.MatterDetails) {
                        requestResult = {};
                        requestResult.CheckMatterResponse = {};
                        requestResult.CheckMatterResponse.MatterDetails = [];
                        requestResult.CheckMatterResponse.PageCount = 0;
                    }
                    var message_ = 'Metter details: ' + requestResult.CheckMatterResponse.MatterDetails.length;
                    var alertContent_ = new olFunctions.AlertContent('Check matter global request succeeded', message_);

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, requestResult);
                    olExtension.Messages.CheckMatterGlobalRequestDispatchResponse(messageContent_);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.CheckMatterGlobal(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessCheckMatterGlobalRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessCheckMatterLocalRequest : function(requestResult, requestContent) {
                try {
                    var message_ = '';
                    if (requestResult && requestResult.CheckMatterResponse && requestResult.CheckMatterResponse.MatterDetails) {
                        message_ = 'Metter details: ' + requestResult.CheckMatterResponse.MatterDetails.length;
                    } else {
                        message_ = 'Check matter response: ' + requestResult.CheckMatterResponse;
                    }
                    var alertContent_ = new olFunctions.AlertContent('Check matter local request succeeded', message_);

                    if (requestResult.CheckMatterResponse) {
                        requestContent.TabMember.PageInfo.Response.CheckMatterResponse = requestResult.CheckMatterResponse;
                    } else {
                        requestContent.TabMember.PageInfo.Response.CheckMatterResponse = {
                            MatterDetails : []
                        };
                    }

                    requestContent.TabMember._internal.ExtensionFlags.MatterDetailFilled = true;

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);
                    olExtension.Messages.BeforeNavigateRequestDispatchResponse(messageContent_);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.CheckMatterLocal(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessCheckMatterLocalRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessContinueSessionRequest : function(requestResult, requestContent) {

            },
            SuccessDeletePersonalDetailRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Delete personal detail request succeeded', 'Url: ' + requestContent.TabMember.PageInfo.Url);

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, requestContent.Parameters.Id);
                    olExtension.Messages.DeletePersonalDetailRequestDispatchResponse(messageContent_);

                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.DeletePersonalDetail(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessDeletePersonalDetailRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            AskToStorePasswordDetails : function(requestResponse) {
                var title_ = '';
                var body_ = '';

                if (requestResponse.IsNewPasswordSpecified && requestResponse.IsNewPassword) {
                    // new password
                    title_ = olExtension._internal.Translate('JS_StorePasswordDetailsTitle');
                    body_ = olExtension._internal.Translate('JS_StorePasswordDetailsBody');
                } else {
                    // update password
                    title_ = olExtension._internal.Translate('JS_UpdatePasswordDetailsTitle');
                    body_ = olExtension._internal.Translate('JS_UpdatePasswordDetailsBody');
                }

                var details_ = {
                    Title : title_,
                    Body : body_
                };

                return details_;
            },
            SuccessFormSubmitRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Form submit request succeeded', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                    if (requestResult && requestResult.FormSubmitResponse && requestResult.FormSubmitResponse.AskToStorePasswordSpecified && requestResult.FormSubmitResponse.AskToStorePassword) {
                        var details_ = olExtension.Service._internal.AskToStorePasswordDetails(requestResult.FormSubmitResponse);
                        details_.Body = details_.Body.replace('{rep1}', requestContent.TabMember.ApplicationName);
                        var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, details_);
                        olExtension.Messages.AskToStorePassword(messageContent_);
                    }
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.FormSubmit(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessFormSubmitRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessDocumentCompleteRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Document complete request succeeded', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                    if (requestResult && requestResult.DocumentCompleteResponse && requestResult.DocumentCompleteResponse.AskToStorePasswordSpecified && requestResult.DocumentCompleteResponse.AskToStorePassword) {
                        var details_ = olExtension.Service._internal.AskToStorePasswordDetails(requestResult.DocumentCompleteResponse);
                        details_.Body = details_.Body.replace('{rep1}', requestContent.TabMember.ApplicationName);
                        var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, details_);
                        olExtension.Messages.AskToStorePassword(messageContent_);
                    }
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.DocumentComplete(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessDocumentCompleteRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessGetLocalPersonalCodeListRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Get local personal code list request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);

                    if (requestResult.GetLocalPersonalCodeListResponse && olFunctions.IsFilledArray(requestResult.GetLocalPersonalCodeListResponse.LocalPersonalCodes)) {
                        requestContent.TabMember.PageInfo.Response.GetLocalPersonalCodeListResponse = requestResult.GetLocalPersonalCodeListResponse;
                    } else {
                        requestContent.TabMember.PageInfo.Response.GetLocalPersonalCodeListResponse = {
                            LocalPersonalCodes : []
                        };
                    }

                    requestContent.TabMember._internal.ExtensionFlags.PersonalCodeFilled = true;

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);
                    olExtension.Messages.BeforeNavigateRequestDispatchResponse(messageContent_);

                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.GetLocalPersonalCodeList(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessGetLocalPersonalCodeListRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessLanguageItemsRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Language items request succeeded', 'Returned to extension');
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.LanguageItems(), alertContent_);

                    for (var i = 0; i < olExtension._internal.DefaultLanguageItems.length; i++) {
                        var languageItems_ = $.grep(requestResult.LanguageItems, function(member) {
                            return (member.Key == olExtension._internal.DefaultLanguageItems[i].Key);
                        });
                        if (olFunctions.IsFilledArray(languageItems_)) {
                            olExtension._internal.LanguageItems.push(languageItems_[0]);
                        } else {
                            olExtension._internal.LanguageItems.push(olExtension._internal.DefaultLanguageItems[i]);
                        }
                    }

                    //storing OneLog forms
                    olExtension._internal.StoreOneLogForms();
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessLanguageItemsRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessLogoutCompletedRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Logout completed request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);
                    //TODO ovo sjebe ff
                    olExtension._internal.TabMember.Remove(requestContent.TabMember);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.LogoutCompleted(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessLogoutCompletedRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessLogoutWindowRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Logout window request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);

                    // nastavak se salje kad se zavrsi logout sekvenca
                    // returning back to original
                    var requestContent_ = new olExtension.DataConstructors.RequestContent(requestContent.TabMember);
                    olExtension.Service.LogoutCompletedRequestSend(requestContent_);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.LogoutWindow(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessLogoutWindowRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessMainWindowClosingRequest : function(requestResult, requestContent) {

            },
            SuccessNavigateCompleteRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Navigate complete request succeeded', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                    if (olFunctions.IsFilledArray(requestResult.NavigateCompleteResponses)) {
                        if (requestResult.NavigateCompleteResponses.length > 1) {
                            var navigateResponse_ = requestResult.NavigateCompleteResponses[1];

                            var filterMembers_ = olExtension._internal.TabMember.Filter(null, null, null, navigateResponse_.ApplicationsSessionId);
                            if (navigateResponse_.ApplicationsSessionId && olFunctions.IsFilledArray(filterMembers_)) {
                                var tabMember_ = filterMembers_[0];
                                tabMember_.PageInfo.ClosingResponse = navigateResponse_;
                                olExtension._internal.TabMember.HandleResourceEnd(tabMember_);
                            }
                        }

                        var ncr0_ = requestResult.NavigateCompleteResponses[0];
                        //and send pause duration
                        if (!(ncr0_.PauseDuration && ncr0_.PauseDuration > 0)) {
                            ncr0_.PauseDuration = 0;
                        }
                        requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = ncr0_.PauseDuration;
                        // send pause duration back to tab
                        var pauseDuration_ = {
                            ApplicationName : ncr0_.ApplicationName,
                            PauseDuration : ncr0_.PauseDuration
                        };
                        var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, pauseDuration_);
                        olExtension.Messages.PauseDuration(messageContent_);

                    }

                    olExtension.Service.DocumentCompleteRequestSend(requestContent);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.NavigateComplete(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessNavigateCompleteRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessNewWindowRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('New window request succeeded', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                    olExtension._internal.OpenLogoutWindow(requestContent.TabMember.TabId);

                    // This changes now...
                    // Logout window request should be sent once new window is opened with new windowhandle
                    // returning back to original
                    olExtension.Service.LogoutWindowRequestSend(requestContent);

                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.NewWindow(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessNewWindowRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessPulseRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Pulse request succeeded');

                    if (requestResult && requestResult.PulseResponse) {
                        var applicationSessionId_ = requestResult.PulseResponse.ApplicationSessionId;
                        var tabId_ = requestContent;

                        var tabMembers_ = olExtension._internal.TabMember.Filter(olExtension.Data.WindowHandle, tabId_, null, applicationSessionId_);
                        if (olFunctions.IsFilledArray(tabMembers_)) {
                            var tabMember_ = tabMembers_[0];

                            if (requestResult.PulseResponse.PauseDuration) {
                                tabMember_.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = requestResult.PulseResponse.PauseDuration;
                            } else {
                                tabMember_.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = 0;
                            }

                            kango.browser.tabs.getAll(function(tabs) {
                                var currentTargetTab_ = null;
                                for (var i = 0; i < tabs.length; i++) {
                                    if (tabs[i].getId() == tabId_) {
                                        currentTargetTab_ = tabs[i];
                                    }
                                }
                                if (currentTargetTab_) {
                                    tabMember_.TargetTab = currentTargetTab_;
                                }

                                if (requestResult.PulseResponse.SessionInactive && requestResult.PulseResponse.SessionInactive) {
                                    if (requestResult.PulseResponse.EndClientResourceSessionSpecified && requestResult.PulseResponse.EndClientResourceSession) {
                                        // sleep or hybernate occured, just close tab
                                        currentTargetTab_.close();
                                    } else {
                                        // session is inactive => resource timeout
                                        var applicationName_ = tabMember_.PageInfo.Response.BeforeNavigateResponses[0].ApplicationName;
                                        var pauseDuration_ = 0;
                                        if (requestResult.PulseResponse.PauseDuration) {
                                            pauseDuration_ = requestResult.PulseResponse.PauseDuration;
                                        }

                                        var resourceTimeout_ = {
                                            ApplicationSessionId : applicationSessionId_,
                                            ApplicationName : applicationName_,
                                            ResourceTimeoutText : olExtension._internal.Translate('JS_ResourceTimeoutLabel'),
                                            PauseDuration : pauseDuration_
                                        };

                                        var messageContent_ = new olExtension.DataConstructors.MessageContent(tabMember_, resourceTimeout_);
                                        olExtension.Messages.ResourceTimeout(messageContent_);
                                    }
                                } else {
                                    // send pause duration back to tab
                                    if (!(requestResult.PulseResponse.PauseDuration && requestResult.PulseResponse.PauseDuration > 0)) {
                                        requestResult.PulseResponse.PauseDuration = 0;
                                    }
                                    var pauseDuration_ = {
                                        ApplicationName : applicationName_,
                                        PauseDuration : requestResult.PulseResponse.PauseDuration
                                    };
                                    var messageContent_ = new olExtension.DataConstructors.MessageContent(tabMember_, pauseDuration_);
                                    olExtension.Messages.PauseDuration(messageContent_);
                                }
                            });
                        }
                    }
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.Pulse(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessPulseRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessSetCommentEditRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Set comment edit request succeeded', '');

                    if (requestResult && requestResult.SetCommentEditResponse && requestResult.SetCommentEditResponse.ApplicationSessionId) {
                        olExtension._internal.TabMember.ChangeApplicationIdAndStartTime(requestContent.TabMember.ApplicationsSessionId, requestResult.SetCommentEditResponse.ApplicationSessionId, requestResult.SetCommentEditResponse.StartTime, requestResult.SetCommentEditResponse.PauseDuration);
                    }
                    if (requestResult && requestResult.SetCommentEditResponse) {
                        if (requestResult.SetCommentEditResponse.StartTime) {
                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].StartTime = requestResult.SetCommentEditResponse.StartTime;
                        }
                        if (requestResult.SetCommentEditResponse.PauseDuration) {
                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = requestResult.SetCommentEditResponse.PauseDuration;
                        }
                    }

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, requestResult.SetCommentEditResponse);
                    olExtension.Messages.SetCommentEditRequestDispatchResponse(messageContent_);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.SetCommentEdit(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessSetCommentEditRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessSetCommentRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Set comment request succeeded', '');

                    if (requestResult && requestResult.SetCommentResponse && requestResult.SetCommentResponse.ApplicationSessionId) {
                        olExtension._internal.TabMember.ChangeApplicationIdAndStartTime(requestContent.TabMember.ApplicationsSessionId, requestResult.SetCommentResponse.ApplicationSessionId, requestResult.SetCommentResponse.StartTime, requestResult.SetCommentResponse.PauseDuration);
                    }
                    if (requestResult && requestResult.SetCommentResponse) {
                        if (requestResult.SetCommentResponse.StartTime) {
                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].StartTime = requestResult.SetCommentResponse.StartTime;
                        }
                        if (requestResult.SetCommentResponse.PauseDuration) {
                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = requestResult.SetCommentResponse.PauseDuration;
                        }
                    }

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, true);
                    olExtension.Messages.SetCommentRequestDispatchResponse(messageContent_);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.SetComment(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessSetCommentRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessSetCurrentPersonalDetailsRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Set current personal details request succeeded', 'TO DO');
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.SetCurrentPersonalDetails(), alertContent_);

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);
                    olExtension.Messages.SetCurrentPersonalDetailsRequestDispatchResponse(messageContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessSetCurrentPersonalDetailsRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessSetTempPersonalDetailsRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Set temp personal details request succeeded', 'TO DO');
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.SetTempPersonalDetails(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessSetCurrentPersonalDetailsRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessSkipMatterDetailsRequest : function() {
                // var alertContent_ = new olFunctions.AlertContent('Personal details chosen request succeeded', 'TO DO');
                // olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.PersonalDetailsChosen(), alertContent_);
            },
            SuccessSkipPersonalDetailsRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Skip personal details request succeeded', 'TO DO');
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.SkipPersonalDetails(), alertContent_);

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);
                    olExtension.Messages.SkipPersonalDetailsRequestDisptachResponse(messageContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessSkipPersonalDetailsRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessStorePassword : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Store password request succeeded', 'TO DO');
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.StorePassword(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessStorePassword', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessPersonalDetailsChosenRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Personal details chosen request succeeded', 'TO DO');
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.PersonalDetailsChosen(), alertContent_);

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember);
                    olExtension.Messages.PersonalDetailsChosenRequestDisptachResponse(messageContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessPersonalDetailsChosenRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessSetPersonalDetailsRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Set personal details request succeeded', 'TO DO');
                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, requestResult);

                    try {
                        var detailsId_ = requestResult.SetPersonalDetailsResponse.DetailsId;
                        var detailsName_ = requestContent.Parameters.Details.Name;
                        var detailsVariables_ = requestContent.Parameters.Details.Variables;
                        var detailsNew_ = requestContent.Parameters.New;

                        var variableReplacementVariables_ = requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.Variables;
                        if (requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.PersonalDetail == null) {
                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.PersonalDetail = [];
                        }

                        var personalDetail_ = {
                            Id : detailsId_,
                            Name : detailsName_,
                            Variables : []
                        };
                        if (detailsNew_) {
                            for (var i = 0; i < detailsVariables_.length; i++) {
                                for (var j = 0; j < variableReplacementVariables_.length; j++) {
                                    if (detailsVariables_[i].Name == variableReplacementVariables_[j].DefinedName) {
                                        var variable_ = {
                                            DefinedName : variableReplacementVariables_[j].DefinedName,
                                            Label : variableReplacementVariables_[j].Label,
                                            Value : detailsVariables_[i].Value
                                        };
                                        personalDetail_.Variables.push(variable_);
                                        break;
                                    }
                                }
                            }
                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.PersonalDetail.push(personalDetail_);
                        } else {
                            var personalDetails_ = $.grep(requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.PersonalDetail, function(member) {
                                return (member.Id == detailsId_);
                            });
                            personalDetail_ = personalDetails_[0];
                        }

                        for (var i = 0; i < detailsVariables_.length; i++) {
                            for (var j = 0; j < personalDetail_.Variables.length; j++) {
                                if (detailsVariables_[i].Name == personalDetail_.Variables[j].DefinedName) {
                                    personalDetail_.Variables[j].Value = detailsVariables_[i].Value;
                                    break;
                                }
                            }
                        }
                    } catch (e) {

                    }

                    olExtension.Messages.SetPersonalDetailsRequestDispatchResponse(messageContent_);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.SetPersonalDetails(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessSetPersonalDetailsRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessSetCommonDetailsRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Set common details request succeeded', 'TO DO');
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.SetCommonDetails(), alertContent_);

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, requestResult);
                    olExtension.Messages.SetCommonDetailsDispatchResponse(messageContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessSetCommonDetailsRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessValidateSelectedMatterRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Validate selected matter request succeeded', 'Matter number: ' + requestContent.Parameters.MatterNumber);
                    olExtension.Service._internal.SortMatterDetails(requestResult, requestContent);

                    if (requestResult.ValidateMatterResponse && requestResult.ValidateMatterResponse.ApplicationSessionId) {
                        olExtension._internal.TabMember.ChangeApplicationIdAndStartTime(requestContent.TabMember.ApplicationsSessionId, requestResult.ValidateMatterResponse.ApplicationSessionId, requestResult.ValidateMatterResponse.StartTime, requestResult.ValidateMatterResponse.PauseDuration);
                    }
                    if (requestResult.ValidateMatterResponse) {
                        if (requestResult.ValidateMatterResponse.StartTime) {
                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].StartTime = requestResult.ValidateMatterResponse.StartTime;
                        }
                        if (requestResult.ValidateMatterResponse.PauseDuration) {
                            requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = requestResult.ValidateMatterResponse.PauseDuration;
                        }
                    }

                    var messageContent_ = new olExtension.DataConstructors.MessageContent(requestContent.TabMember, requestResult.ValidateMatterResponse);
                    olExtension.Messages.ValidateSelectedMatterRequestDispatchResponse(messageContent_);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.ValidateMatter(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessValidateSelectedMatterRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessWindowClosingRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Window closing request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);
                    if (requestResult && olFunctions.IsFilledArray(requestResult.WindowClosingResponses)) {
                        requestContent.TabMember.PageInfo.ClosingResponse = requestResult.WindowClosingResponses[0];
                    }

                    olExtension._internal.TabMember.HandleResourceEnd(requestContent.TabMember);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.WindowClosing(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessWindowClosingRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessQuittingResourceSessionRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Quitting resource session request succeeded', 'Url: ' + requestContent.TabMember.PageInfo.Url);
                    if (requestContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0].LogoutScriptExists) {
                        requestContent.TabMember.PageInfo.ClosingResponse = requestResult.QuittingResponse;
                        olExtension._internal.TabMember.HandleResourceEnd(requestContent.TabMember);
                    } else {
                        olExtension._internal.TabMember.Remove(requestContent.TabMember);
                        // if there are no logout scripts and we are on resource we just need to close tab
                        if (requestContent.TabMember.CloseTab) {
                            requestContent.TabMember.TargetTab.close();
                        }
                    }
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.QuittingResourceSession(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessQuittingResourceSessionRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            //Analysis service requests
            SuccessSetFeaturesRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Set features request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);

                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.SetFeatures(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessSetFeaturesRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessRequestFeatureRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Request feature request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);
                    if (requestResult && olFunctions.IsFilledArray(requestResult.WindowClosingResponses)) {
                        requestContent.TabMember.PageInfo.ClosingResponse = requestResult.WindowClosingResponses[0];
                    }

                    olExtension._internal.TabMember.HandleResourceEnd(requestContent.TabMember);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.RequestFeature(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('RequestFeatureRequestSend', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessRequestFeatureItemRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Request feature item request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);
                    if (requestResult && olFunctions.IsFilledArray(requestResult.WindowClosingResponses)) {
                        requestContent.TabMember.PageInfo.ClosingResponse = requestResult.WindowClosingResponses[0];
                    }

                    olExtension._internal.TabMember.HandleResourceEnd(requestContent.TabMember);
                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.RequestFeatureItem(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessRequestFeatureItemRequestSend', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessSetAnalysisRequest : function(requestResult, requestContent) {

            },
            //WebControl
            SuccessStartMessageSeenRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Start message seen request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);

                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.StartMessageSeen(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessStartMessageSeenRequest', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SuccessHideStartMessageRequest : function(requestResult, requestContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Hide start message seen request succeeded', 'Window Id: ' + requestContent.TabMember.WindowId);

                    olFunctions.Alert(olOptions.Debug.Extension.Service.SucceededRequests.HideStartMessage(), alertContent_);
                } catch (e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SuccessRequestFeatureItemRequestSend', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            }
        }
    },
    Messages : {
        AskToStorePassword : function(messageContent) {
            try {
                if (messageContent.TabMember.TargetTab && messageContent.TabMember._internal.ExtensionFlags.ServiceResponded && messageContent.TabMember._internal.ExtensionFlags.DocumentReady) {
                    var alertContent_ = new olFunctions.AlertContent('Ask to store password message', 'Sent by extension');
                    olExtension.Messages._internal.DispatchMessageToTab('olAskToStorePassword', messageContent);

                    olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.AskToStorePassword(), alertContent_);
                } else {
                    setTimeout(function() {
                        olExtension.Messages.AskToStorePassword(messageContent);
                    }, 200);
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('AskToStorePassword', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        BeforeNavigateRequestDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Before navigate request response message', 'Sent by extension');
                var TestNulti_;
                if (!messageContent.TabMember._internal.PageFlags.Unauthorised) {
                    if (messageContent.TabMember.TargetTab && messageContent.TabMember._internal.ExtensionFlags.ServiceResponded && messageContent.TabMember._internal.ExtensionFlags.DocumentReady && messageContent.TabMember._internal.ExtensionFlags.MatterDetailFilled && messageContent.TabMember._internal.ExtensionFlags.PersonalCodeFilled) {
                        olExtension.Messages._internal.DispatchMessageToTab('olResponseToBeforeNavigateRequest', messageContent);
                        olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.BeforeNavigateRequestDispatchResponse(), alertContent_);
                        TestNulti_ = messageContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0];

                        //sending NavigateCompleteRequest
                        var requestContent_ = new olExtension.DataConstructors.RequestContent(messageContent.TabMember);
                        olExtension.Service.NavigateCompleteRequestSend(requestContent_);
                    }
                } else if (messageContent.TabMember.TargetTab && messageContent.TabMember._internal.ExtensionFlags.ServiceResponded && messageContent.TabMember._internal.ExtensionFlags.DocumentReady) {
                    olExtension.Messages._internal.DispatchMessageToTab('olResponseToBeforeNavigateRequest', messageContent);
                    olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.BeforeNavigateRequestDispatchResponse(), alertContent_);
                    TestNulti_ = messageContent.TabMember.PageInfo.Response.BeforeNavigateResponses[0];

                    //sending NavigateCompleteRequest
                    var requestContent1_ = new olExtension.DataConstructors.RequestContent(messageContent.TabMember);
                    olExtension.Service.NavigateCompleteRequestSend(requestContent1_);
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('BeforeNavigateRequestDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        CheckMatterGlobalRequestDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Check matter global request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToCheckMatterGlobalRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.CheckMatterGlobalRequestDispatchResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('CheckMatterGlobalRequestDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        ChooseApplicationDispatchMessage : function(messageContent) {
            try {
                if (messageContent.TabMember._internal.ExtensionFlags.DocumentReady && messageContent.TabMember._internal.ExtensionFlags.ServiceResponded) {
                    var alertContent_ = new olFunctions.AlertContent('Choose application message', 'Sent by extension');
                    olExtension.Messages._internal.DispatchMessageToTab('olChooseApplication', messageContent);
                    olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.ChooseApplicationDispatchMessage(), alertContent_);
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('ChooseApplicationDispatchMessage', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        DeletePersonalDetailRequestDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Delete personal detail request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToDeletePersonalDetailRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.DeletePersonalDetailRequestDispatchResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('DeletePersonalDetailRequestDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        PersonalDetailsChosenRequestDisptachResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Personal details chosen request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToPersonalDetailsChosenRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.PersonalDetailsChosenRequestDisptachResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('PersonalDetailsChosenRequestDisptachResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        ResourceTimeout : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Resource timeout message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResourceTimeout', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.ResourceTimeout(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('ResourceTimeout extension', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        _errorState : false,
        Error : function(messageContent) {
            try {
                if (messageContent.TabMember._internal.ExtensionFlags.DocumentReady) {
                    if (!olExtension.Messages._errorState) {
                        olExtension.Messages._errorState = true;
                        var alertContent_ = new olFunctions.AlertContent('Error message', 'Sent by extension');
                        olExtension.Messages._internal.DispatchMessageToTab('olError', messageContent);

                        olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.Error(), alertContent_);
                    }
                    olExtension._internal.TabMember.Remove(messageContent.TabMember);
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('Error extension', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        WebControlMessage : function(messageContent) {
            try {
                if (messageContent.TabMember._internal.ExtensionFlags.DocumentReady) {
                    var alertContent_ = new olFunctions.AlertContent('WebControlMessage message', 'Sent by extension');
                    olExtension.Messages._internal.DispatchMessageToTab('olWebControlMessage', messageContent);

                    olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.WebControlMessage(), alertContent_);
                }
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('WebControlMessage extension', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        PauseDuration : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Pause duration message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olPauseDuration', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.PauseDuration(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('PauseDuration extension', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetCurrentPersonalDetailsRequestDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set current personal details request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToSetCurrentPersonalDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.PersonalDetailsChosenRequestDisptachResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetCurrentPersonalDetailsRequestDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetCommentEditRequestDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set comment edit request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToSetCommentEditRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.SetCommentRequestEditDispatchResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetCommentEditRequestDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SkipPersonalDetailsRequestDisptachResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Skip personal details request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToSkipPersonalDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.SkipPersonalDetailsRequestDisptachResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SkipPersonalDetailsRequestDisptachResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetCommentRequestDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set comment request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToSetCommentRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.SetCommentRequestDispatchResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetCommentRequestDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetPersonalDetailsRequestDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set personal details request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToSetPersonalDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.SetPersonalDetailsRequestDispatchResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetPersonalDetailsRequestDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        SetCommonDetailsDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set common details request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToSetCommonDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.SetPersonalDetailsRequestDispatchResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetCommonDetailsDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        ValidateSelectedMatterRequestDispatchResponse : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Validate selected matter request response message', 'Sent by extension');
                olExtension.Messages._internal.DispatchMessageToTab('olResponseToValidateSelectedMatterRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Extension.Messages.Sent.ValidateSelectedMatterRequestDispatchResponse(), alertContent_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('ValidateSelectedMatterRequestDispatchResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        _internal : {
            DispatchMessageToTab : function(message, messageContent) {
                try {
                    var messageContentTabMessageContent_ = JSON.stringify(messageContent.TabMessageContent);

                    messageContent.TabMember.TargetTab.dispatchMessage(message, messageContentTabMessageContent_);
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('DispatchMessageToTab', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            }
        }
    },
    Initialise : function() {
        try {
            olOptions.IntialiseOptionsData();
            var browserName_ = kango.browser.getName();

            //data initializaton
            if (browserName_ == "firefox") {
                try {
                    Components.utils.import(kango.io.getResourceUrl("modData.js"));
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error Extension intialisation', 'Firefox components utils import: ' + e.message);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            }

            switch (browserName_) {
                case 'ie':
                    browserName_ = 'iejs';
                    break;
            default:
                    break;
            }

            //browser name
            olData.BrowserName = browserName_;

            //generate WindowHandle
            olExtension.Data.WindowHandle = olExtension.Functions.Guid();

            //data initialization
            if (!olData.Initialised) {
                olData.Initialise();
            }

            //Resource for IE
            olExtension.Data.ResourcesUrlPrefix = olOptions.Debug.ResourcesUrlPrefix();

            //event listeners
            olExtension.Listeners.IntialiseEventListeners();

            //message listeners
            olExtension.Listeners.IntialiseMessageListeners();

            //Language items
            olExtension.Service.LanguageItemsRequestSend();

            //Clean up sessions
            if (olData.CleanUp) {
                olExtension.Listeners._internal.Events.CleanUp();
            }

            //Fill exising tab ids
            olExtension.Wrapper.GetAllTabs(function(tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    olData.CreatedTabs.push(olExtension.Wrapper.GetAllTabsTabId(tabs[i]));
                }
            });

            //Pulse interval
            setInterval(function() {
                olExtension.Wrapper.GetAllTabs(function(tabs) {
                    for (var i = 0; i < tabs.length; i++) {
                        var id_ = olExtension.Wrapper.GetAllTabsTabId(tabs[i]);
                        olExtension.Service.PulseRequestSend(id_);
                    }
                });
            }, 10000);

            //Initialise cleaner
            olExtension.Cleaner.Reset();
            olExtension.Cleaner.Start();

            //Page content excludes
            try {
                var resouceExclusionList_;

                switch (olData.BrowserName) {
                    case 'iejs':
                        resouceExclusionList_ = kango.xhr.getXMLHttpRequest();
                        break;
                    default:
                        resouceExclusionList_ = new XMLHttpRequest();
                        break;
                }

                var ExtensionInfo_ = kango.getExtensionInfo();
                resouceExclusionList_.open('GET', olExtension.Data.RuntimeDataUrl + '?version=' + ExtensionInfo_.version, false);
                resouceExclusionList_.send(null);
                var olRuntimeData_ = JSON.parse(resouceExclusionList_.responseText);

                if (resouceExclusionList_.responseText) {
                    var olRuntimeData_ = JSON.parse(resouceExclusionList_.responseText);
// console.log(olRuntimeData_)
// olRuntimeData_.exclude.push('*relativity*')
// console.log(olRuntimeData_)
                    for (var i = 0; i < kango.olUserScripts._scripts.length; i++) {
                        for (var j = 0; j < olRuntimeData_.exclude.length; j++) {
                            kango.olUserScripts._scripts[i].script.headers.exclude.push(olRuntimeData_.exclude[j]);
                        }
                    }
                }
                
            } catch (e) {
                var alertErrorContent_ = new olOptions.DataConstructors.AlertContent('Page content excludes, either empty or ', e.message + '\n' + e.stack);
                olOptions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        } catch (e) {
            var alertErrorContent_ = new olFunctions.AlertContent('Initialise', e.message + '\n' + e.stack);
            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
        }
    }
};

/**
 *  one time extension initialisation/
 */
olExtension.Initialise();

// console.log('evalinsandbox check')
// console.log(Components)
