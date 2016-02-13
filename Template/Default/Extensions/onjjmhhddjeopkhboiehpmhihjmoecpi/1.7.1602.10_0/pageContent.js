// ==UserScript==
// @name Onelog
// @namespace itsOneLog
// @include http://*
// @include https://*
// @include resource://*
// @include file://*
// @require modOptions.js
// @require modFunctions.js
// @require modDictionaries.js
// @require modInjection.js
// @exclude ol.ol.ol.ol

// ==/UserScript==
/**
 *  OneLog content object
 */

// Global variables
/*global kango, olFunctions, e, olInjection, olDictionaries*/

var olPage = {
    Functions : {
        RemoveFramesetTag : function(htmlFrameset) {
            htmlFrameset.parentNode.removeChild(htmlFrameset);
            olPage.Data.FramesetRemoved = true;
        },
        InsertFramesetTag : function(htmlFrameset) {
            var bodyTag = document.getElementsByTagName('body')[0];
            bodyTag.parentNode.insertBefore(htmlFrameset, bodyTag);
            olPage.Data.FramesetRemoved = false;
        },
        SetHasPrototypeFramework : function() {
            try {
                [].shift();
                olPage.Data.LocalPageFlags.HasPrototypeFramework = false;
            } catch(e) {
                olPage.Data.LocalPageFlags.HasPrototypeFramework = true;
            }
        },
        // IE: ON-636 fix (url: https://stnweb.cas.org/)
        SetHasFrameset : function() {
            olPage.Data.HtmlFrameset = document.getElementsByTagName('frameset')[0];
            if ((kango.browser.getName() == 'ie') && (olPage.Data.HtmlFrameset)) {
                olPage.Data.LocalPageFlags.HasFrameset = true;
            } else {
                olPage.Data.LocalPageFlags.HasFrameset = false;
            }
        },
        SetIECompatibilityMode : function() {
            if (kango.browser.getName() == 'ie') {
                var agentStr = navigator.userAgent;
                if (agentStr.indexOf('MSIE 7.0') > -1) {
                    olPage.Data.LocalPageFlags.IECompatibilityMode = 'IE7';
                }
                if (agentStr.indexOf('MSIE 8.0') > -1) {
                    olPage.Data.LocalPageFlags.IECompatibilityMode = 'IE8';
                }
                if (agentStr.indexOf('MSIE 9.0') > -1) {
                    olPage.Data.LocalPageFlags.IECompatibilityMode = 'IE9';
                }
            }
        },
        GetLanguageItem : function(key) {
            return olPage.Data.PageInfo.LanguageItemsLabels[key];
        },
        IframeHasVerticalScrollBar : function(iFrame) {
            return (iFrame[0].clientWidth != iFrame[0].contentDocument.body.clientWidth);
        },
        Hide : function(selector, value) {
            if ( typeof (value) === 'undefined')
                value = 'display: none !important';

            $(selector).css('cssText', value);
        },
        Show : function(selector, value) {
            if ( typeof (value) === 'undefined')
                value = 'display: inline-block !important';

            $(selector).css('cssText', 'display: inline-block !important');
        },
        SwapElements : function(array, index1, index2) {
            var temp_ = array[index1];
            array[index1] = array[index2];
            array[index2] = temp_;
        },
        DateFromISO8601 : function(isoDateString) {
            var parts = isoDateString.match(/\d+/g);
            var isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
            var isoDate = new Date(isoTime);
            return isoDate;
        },
        //Do not delete following TestEval block, it is needed for script testing

        // TestEval_ : null,
        // TestEval : function() {
        // if (olFunctions.TestEval_) {
        // try {
        // if (olFunctions.TestEval_.indexOf('olInternalJS') != -1) {
        // // internal JS
        // var alertErrorContent_ = new olFunctions.AlertContent('internal JS', '');
        // olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
        // eval(olFunctions.TestEval_);
        // } else {
        // // dom JS
        // var alertErrorContent_ = new olFunctions.AlertContent('dom JS', '');
        // olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
        // $('#olSourceEval').val(olFunctions.TestEval_);
        // $('#olSourceEval').off('olCustomEvent');
        // $('#olSourceEval').on('olCustomEvent', function() {
        // var olSource = document.getElementById('olSourceEval').value;
        // eval(olSource);
        // });
        // $('#olSourceEval').trigger('olCustomEvent');
        // }
        // } catch (e) {
        // var alertErrorContent_ = new olFunctions.AlertContent('Eval error', e.message);
        // olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
        // }
        // }
        // },

        _parseEventDataPage : function(event) {
            var clonedEvent_;
            try {
                if (event) {
                    clonedEvent_ = olFunctions.Clone(event);
                    try {
                        clonedEvent_.data = JSON.parse(String(clonedEvent_.data));
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('_parseEventData JSON.parse failed. Using object instead of parsing string! ', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                }
            } catch(e) {
                var alertErrorContent_ = new olFunctions.AlertContent('_parseEventData', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            } finally {
                return clonedEvent_;
            }
        }
    },
    Data : {
        LocalPageFlags : {
            WindowUnloading : false,
            IECompatibilityMode : null,
            HasPrototypeFramework : false,
            HasFrameset : false
        },
        PageInfo : null,
        PageFlags : null,
        StartTime : null,
        PauseDuration : null,
        HtmlFrameset : null,
        FramesetRemoved : false

    },
    Listeners : {
        _internal : {
            Events : {
                WrappedEvents : {
                    //                    OnContentLoaded : function(win, fn) {
                    //                        var done_ = false;
                    //                        var top_ = true;
                    //                        var doc_ = win.document;
                    //                        var root_ = doc_.documentElement;
                    //                        var add_ = doc_.addEventListener ? 'addEventListener' : 'attachEvent';
                    //                        var rem_ = doc_.addEventListener ? 'removeEventListener' : 'detachEvent';
                    //                        var pre_ = doc_.addEventListener ? '' : 'on';
                    //
                    //                        var init = function(e) {
                    //                            if (e.type == 'readystatechange' && doc_.readyState != 'complete')
                    //                                return;
                    //                            (e.type == 'load' ? win : doc_)[rem_](pre_ + e.type, init, false);
                    //                            if (!done_ && ( done_ = true))
                    //                                fn.call(win, e.type || e);
                    //                        };
                    //                        var poll = function() {
                    //                            try {
                    //                                root_.doScroll('left');
                    //                            } catch(e) {
                    //                                setTimeout(function() {
                    //                                    poll();
                    //                                }, 50);
                    //                                return;
                    //                            }
                    //                            init('poll');
                    //                        };
                    //
                    //                        if (doc_.readyState == 'complete')
                    //                            fn.call(win, 'lazy');
                    //                        else {
                    //                            if (doc_.createEventObject && root_.doScroll) {
                    //                                try {
                    //                                    top_ = !win.frameElement;
                    //                                } catch(e) {
                    //                                }
                    //                                if (top_)
                    //                                    poll();
                    //                            }
                    //                            doc_[add_](pre_ + 'DOMContentLoaded', init, false);
                    //                            doc_[add_](pre_ + 'readystatechange', init, false);
                    //                            win[add_](pre_ + 'load', init, false);
                    //                        }
                    //                    },
                    _elementSubtreeChangeFinishedTimeout : {},
                    OnElementSubtreeChangeFinished : function(elementSelector, repetitionInterval, fn) {
                        $(elementSelector).off('DOMSubtreeModified');
                        $(elementSelector).on('DOMSubtreeModified', function(event) {
                            if (!olPage.Listeners._internal.Events.WrappedEvents._elementSubtreeChangeFinishedTimeout[elementSelector]) {
                                setTimeout(function() {
                                    fn(arguments);
                                    clearInterval(olPage.Listeners._internal.Events.WrappedEvents._elementSubtreeChangeFinishedTimeout[elementSelector]);
                                    olPage.Listeners._internal.Events.WrappedEvents._elementSubtreeChangeFinishedTimeout[elementSelector] = null;
                                }, 2000);
                            }

                            clearInterval(olPage.Listeners._internal.Events.WrappedEvents._elementSubtreeChangeFinishedTimeout[elementSelector]);

                            olPage.Listeners._internal.Events.WrappedEvents._elementSubtreeChangeFinishedTimeout[elementSelector] = setTimeout(function() {
                                fn(arguments);
                            }, repetitionInterval);
                        });
                    }
                },
                BodySubtreeChanged : function() {
                    olPage.Listeners._internal.Events.WrappedEvents.OnElementSubtreeChangeFinished('body', 1000, function() {
                        var alertContent_ = new olFunctions.AlertContent('Body Subtree Changed event', 'Caught by page');
                        try {
                            olPage.Content.Modules.ActivateAnalysis();
                            olPage.Content.Modules.ActivateWebControl();
                            olPage.Content.Modules.ProcessModules();
                        } catch(e) {
                            var alertContent1_ = new olFunctions.AlertContent('olPage.Listeners._internal.Events.BodySubtreeChanged', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent1_);
                        }
                        olFunctions.Alert(olOptions.Debug.Page.Events.BodySubtreeChanged(), alertContent_);
                    });
                },
                TitleSubtreeChanged : function() {
                    olPage.Listeners._internal.Events.WrappedEvents.OnElementSubtreeChangeFinished('title', 1100, function() {
                        var alertContent_ = new olFunctions.AlertContent('Title Subtree Changed event', 'Caught by page');
                        try {
                            olPage.Messages.UpdateResponse();
                        } catch(e) {
                            var alertContent1_ = new olFunctions.AlertContent('olPage.Listeners._internal.Events.BodySubtreeChanged', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent1_);
                        }
                        olFunctions.Alert(olOptions.Debug.Page.Events.TitleSubtreeChanged(), alertContent_);
                    });
                },
                WindowHashChange : function() {
                    olFunctions.olAddEventListener(window, 'hashchange', function() {
                        var alertContent_ = new olFunctions.AlertContent('Window Hash Change event', 'Caught by page');
                        olPage.Messages.UpdateResponse();
                        olPage.PageReset();
                        olPage.Messages.WindowHashChange();

                        olFunctions.Alert(olOptions.Debug.Page.Events.WindowHashChange(), alertContent_);
                    });
                },
                WindowBeforeUnload : function() {
                    olFunctions.olAddEventListener(window, 'beforeunload', function() {
                        var alertContent_ = new olFunctions.AlertContent('Window Before unload event', 'Caught by page');
                        try {
                            // fix for account wrong default names on keypress = 13 (enter)
                            olPage.Data.LocalPageFlags.WindowUnloading = true;
                        } catch(e) {
                            var alertContent1_ = new olFunctions.AlertContent('olPage.Listeners._internal.Events.WindowBeforeUnload', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent1_);
                        }
                        olFunctions.Alert(olOptions.Debug.Page.Events.WindowBeforeUnload(), alertContent_);
                    });
                },
                FramesLoad : function() {
                    try {
                        $('frame, iframe').on('load', function() {
                            olPage.Content.Modules.ActivateAnalysis();
                            olPage.Content.Modules.ActivateWebControl();
                            olPage.Content.Modules.ProcessModules();
                        });
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('FramesLoad', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                DocumentReady : function() {
                    $(document).ready(function() {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Document ready event', 'Caught by page');

                            //initiate page events
                            olPage.Listeners._internal.Events.FramesLoad();
                            //IE: check if frameset exists
                            olPage.Functions.SetHasFrameset();
                            //page fixes
                            try {
                                var olFix_flash = function() {
                                    // loop through every embed tag on the site
                                    var embeds = document.getElementsByTagName('embed'), html;
                                    for (var i = 0; i < embeds.length; i++) {
                                        var embed = embeds[i];
                                        //Dont do this for pdf files, next if excludes pdf
                                        if (embed.getAttribute('type').indexOf('pdf') == -1 && embed.getAttribute('src').indexOf('pdf') == -1) {
                                            var new_embed;
                                            // everything but Firefox & Konqueror
                                            if (embed.outerHTML) {
                                                html = embed.outerHTML;
                                                // replace an existing wmode parameter
                                                if (html.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i))
                                                    new_embed = html.replace(/wmode\s*=\s*('|")window('|")/i, "wmode='transparent'");
                                                // add a new wmode parameter
                                                else
                                                    new_embed = html.replace(/<embed\s/i, "<embed wmode='transparent' ");
                                                // replace the old embed object with the fixed version
                                                embed.insertAdjacentHTML('beforeBegin', new_embed);
                                                embed.parentNode.removeChild(embed);
                                            } else {
                                                // cloneNode is buggy in some versions of Safari & Opera, but works fine in FF
                                                new_embed = embed.cloneNode(true);
                                                if (!new_embed.getAttribute('wmode') || new_embed.getAttribute('wmode').toLowerCase() == 'window')
                                                    new_embed.setAttribute('wmode', 'transparent');
                                                embed.parentNode.replaceChild(new_embed, embed);
                                            }
                                        }
                                    }
                                    // loop through every object tag on the site
                                    var objects = document.getElementsByTagName('object');
                                    for ( i = 0; i < objects.length; i++) {
                                        var object = objects[i];
                                        var new_object;
                                        // object is an IE specific tag so we can use outerHTML here
                                        if (object.outerHTML) {
                                            html = object.outerHTML;
                                            // replace an existing wmode parameter
                                            if (html.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i))
                                                new_object = html.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i, "<param name='wmode' value='transparent' />");
                                            // add a new wmode parameter
                                            else
                                                new_object = html.replace(/<\/object\>/i, "<param name='wmode' value='transparent' />\n</object>");
                                            // loop through each of the param tags
                                            var children = object.childNodes;
                                            for (var j = 0; j < children.length; j++) {
                                                try {
                                                    if (children[j].getAttribute('name').match(/flashvars/i)) {
                                                        new_object = new_object.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i, "<param name='flashvars' value='" + children[j].getAttribute('value') + "' />");
                                                    }
                                                } catch(e) {

                                                }
                                            }
                                            // replace the old embed object with the fixed versiony
                                            object.insertAdjacentHTML('beforeBegin', new_object);
                                            object.parentNode.removeChild(object);
                                        }
                                    }
                                };
                                olFix_flash();
                            } catch(e) {
                                var alertContent2_ = new olFunctions.AlertContent('Flash fix error:', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertContent2_);
                            }

                            olPage.Messages.DocumentReady(document.title);

                            olFunctions.Alert(olOptions.Debug.Page.Events.DocumentReady(), alertContent_);
                        } catch(e) {
                            var alertContent1_ = new olFunctions.AlertContent('olPage.Listeners._internal.Events.DocumentReady', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent1_);
                        }

                        try {
                            var olFix_video = function() {
                                $('iframe').each(function() {
                                    var url = $(this).attr("src");
                                    if (($(this).attr("src")) && ($(this).attr("src").indexOf("pdf") == -1) && ($(this).attr("src").indexOf("?") > 0)) {
                                        $(this).attr(
                                        //Fix for
                                        //https://henchman.atlassian.net/browse/ON-1018
                                        //https://app.volarian.com/QueryCentre/index.html#ticketView?queryCentreId=30c0bb4b-aa76-466f-87b3-a3db00b865f9&ticketId=0c4149c3-00c7-43ba-9f7e-a5940124a87d
                                        // {
                                        // "src" : url + "&wmode=transparent",
                                        // "wmode" : "Opaque"
                                        // }
                                        {
                                            "wmode" : "transparent"
                                        });
                                    }
                                });
                            };

                            olFix_video();
                        } catch(e) {
                            var alertContent1_ = new olFunctions.AlertContent('Video fix error:', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent1_);
                        }
                    });
                },
                ElementFocus : function(element) {
                    olPage.Listeners._internal.Events._currentTabIndex = $(element).attr('tabindex');
                    if ($(element).text && $(element).text() !== '') {
                        $(element).select();
                    }
                },
                _processingKey : false,
                _currentTabIndex : 0,
                KeyEvents : function() {
                    $(document).on('keyup', function(e) {
                        //Tab
                        if (e.keyCode == 9) {
                            if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt !== '') {
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                e.stopPropagation();

                                var $focused_ = $(':focus');
                                if ($('#' + olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt).has($focused_).length === 0) {
                                    var nextTabIndex_ = parseInt(olPage.Listeners._internal.Events._currentTabIndex) + 1;
                                    var nextForFocus_ = $('#' + olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt).find('[tabindex=' + nextTabIndex_ + ']');
                                    if (nextForFocus_.length === 0) {
                                        var zeroElement_ = $('#' + olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt).find('[tabindex=1]');
                                        zeroElement_.focus();
                                    } else {
                                        nextForFocus_[0].focus();
                                    }
                                }
                            }
                        }
                    });

                    $(document).on('keypress', function(e) {
                        //Enter
                        if (!olPage.Listeners._internal.Events._processingKey && e.keyCode == 13) {
                            if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt !== '') {
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                e.stopPropagation();
                                olPage.Listeners._internal.Events._processingKey = true;

                                var $focused_ = $(':focus');
                                //Is focused item child of current prompt, if not, focus on tabindex = 1 on current form
                                if ($('#' + olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt).has($focused_).length === 0) {
                                    $('#' + olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt).find('[tabindex=1]').select().focus();
                                }

                                switch(olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt) {
                                case ('olPromptLogonDetails'):
                                    if (olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckData()) {
                                        $("#olPromptLogonDetailsOK").click();
                                    } else {
                                        olPage.Listeners._internal.Events._processingKey = false;
                                    }
                                    break;
                                case ('olPromptMatter') :
                                    if (olPage.Content.Divs._internal.PromptMatter._internal.CheckData()) {
                                        $("#olMatterOK").click();
                                    } else {
                                        olPage.Listeners._internal.Events._processingKey = false;
                                    }
                                    break;
                                default:
                                    break;
                                }
                            }
                        }
                    });
                }
            },
            Messages : {
                AskToStorePassword : function() {
                    kango.addMessageListener('olAskToStorePassword', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var bnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];

                            //Default delay for displaying password saving dialog
                            var timeoutValue_ = 1500;
                            if (bnr_.StorePasswordDialogDisplayTimeSpecified) {
                                timeoutValue_ = bnr_.StorePasswordDialogDisplayTime;
                            }
                            setTimeout(function() {
                                try {
                                    var alertContent_ = new olFunctions.AlertContent('Ask to store password message', 'Received by page');
                                    olFunctions.Alert(olOptions.Debug.Page.Messages.Received.AskToStorePassword(), alertContent_);
                                    olPage.Content.Modules._internal.PasswordManagement._parameters = eventLocal_.data;
                                    olPage.Content.Modules.ActivatePasswordManagement();
                                    olPage.Content.Modules.ProcessModules();
                                } catch(e) {
                                    var alertContent_ = new olFunctions.AlertContent('AskToStorePassword page', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                                }
                            }, timeoutValue_);
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('AskToStorePassword', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }

                    });
                },
                BeforeNavigateRequestResponse : function() {
                    kango.addMessageListener('olResponseToBeforeNavigateRequest', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var alertContent_ = new olFunctions.AlertContent('Before navigate request response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.BeforeNavigate(), alertContent_);

                            var receivedPageInfo_ = eventLocal_.data.PageInfo;

                            if (olFunctions.CompareTabUrl(receivedPageInfo_.Url)) {
                                olPage.Data.ApplicationName = eventLocal_.data.ApplicationName;

                                olPage.Data.PageFlags = eventLocal_.data.PageFlags;
                                olInjection.Parameters.Flags = olPage.Data.PageFlags;
                                olPage.Data.PageInfo = receivedPageInfo_;
                                // olPage.Listeners._internal.Messages._internal.CheckHashVariables();

                                if (olPage.Data.PageInfo.Response.BeforeNavigateResponses.length > 0) {
                                    // olPage.Functions.TestEval()
                                    olInjection.Parameters.JScript = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].JScript;
                                    olInjection.JScriptInjectionBA('olJSInjectBefore');
                                    olPage.Content.ProcessPage();
                                }
                            } else {
                                // TODO ?
                            }
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('BeforeNavigateRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                CheckMatterGlobalRequestResponse : function() {
                    kango.addMessageListener('olResponseToCheckMatterGlobalRequest', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var alertContent_ = new olFunctions.AlertContent('Check global matter request response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.CheckMatterGlobal(), alertContent_);

                            var receivedMessageContent_ = eventLocal_.data;

                            olPage.Content.Divs._internal.PromptMatterSearch._internal.CreateSearchTable(receivedMessageContent_.ResponseContent.CheckMatterResponse);
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('CheckMatterGlobalRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                ChooseApplicationMessage : function() {
                    kango.addMessageListener('olChooseApplication', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);

                            var alertContent_ = new olFunctions.AlertContent('Choose application message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.ChooseApplicationMessage(), alertContent_);

                            //In offline mode
                            if (eventLocal_.data.PageInfo.Response.BeforeNavigateResponses[0].InOfflineModeSpecified) {
                                olPage.Data.PageFlags = eventLocal_.data.PageFlags;
                                olPage.Data.PageFlags.InOfflineMode = eventLocal_.data.PageInfo.Response.BeforeNavigateResponses[0].InOfflineMode;
                            }

                            //Resource choose application prompt
                            olPage.Content.HtmlAppends.AddChooseApplicationPrompt(eventLocal_.data.PageInfo);

                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('ChooseApplicationMessage', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                DeletePersonalDetailRequestResponse : function() {
                    kango.addMessageListener('olResponseToDeletePersonalDetailRequest', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var alertContent_ = new olFunctions.AlertContent('Delete personal detail request response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.DeletePersonalDetail(), alertContent_);
                            var receivedMessageContent_ = eventLocal_.data;

                            olPage.Content.Divs._common.UpdateLogonData(receivedMessageContent_.ResponseContent, 'delete');

                            olPage.Content.Divs.Load.PromptLogon(true);
                            olPage.Messages.UpdateResponse();
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('DeletePersonalDetailRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                LogoutTabMember : function() {
                    kango.addMessageListener('olLogoutMember', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var alertContent_ = new olFunctions.AlertContent('Logout tab member', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.LogoutTabMember(), alertContent_);
                            olPage.Content.Logout.ProcessLogoutSequence(eventLocal_.data);
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('LogoutTabMember', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                PersonalDetailsChosenRequestResponse : function() {
                    kango.addMessageListener('olResponseToPersonalDetailsChosenRequest', function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Personal details chosen request response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.PersonalDetailsChosen(), alertContent_);

                            olPage.Data.PageFlags.LogonDone = true;
                            olPage.Messages.Flags.LogonDone(true);
                            olPage.Content.Divs.Close.PromptLogon(false);

                            olPage.Content.Inject();
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('PersonalDetailsChosenRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                ResourceTimeout : function() {
                    kango.addMessageListener('olResourceTimeout', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var alertContent_ = new olFunctions.AlertContent('Resource timeout message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.ResourceTimeout(), alertContent_);

                            // update page pause duration info
                            if (olPage.Data.PageInfo && olPage.Data.PageInfo.Response && olPage.Data.PageInfo.Response.BeforeNavigateResponses && olPage.Data.PageInfo.Response.BeforeNavigateResponses[0]) {
                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = eventLocal_.data.ResponseContent.PauseDuration;
                            }

                            //Resource timeout prompt
                            olPage.Content.HtmlAppends.AddTimeoutPrompt(eventLocal_.data);
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('ResourceTimeout page', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                Error : function() {
                    kango.addMessageListener('olError', function(event) {
                        setTimeout(function() {
                            try {
                                var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                                var alertContent_ = new olFunctions.AlertContent('Error message', 'Received by page');
                                olFunctions.Alert(olOptions.Debug.Page.Messages.Received.Error(), alertContent_);

                                //Error prompt
                                olPage.Content.HtmlAppends.AddErrorPrompt(eventLocal_.data);
                            } catch(e) {
                                var alertContent_ = new olFunctions.AlertContent('Error message function:', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                            }
                        }, olOptions.General.Page.TransitionTime() + 50);
                    });
                },
                PauseDuration : function() {
                    kango.addMessageListener('olPauseDuration', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var alertContent_ = new olFunctions.AlertContent('Pause duration message', 'Received by page, \nApp: ' + eventLocal_.data.ApplicationName + ',\nPause duration: ' + eventLocal_.data.ResponseContent.PauseDuration);
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.PauseDuration(), alertContent_);

                            // update page pause duration info
                            if (olPage.Data.PageInfo && olPage.Data.PageInfo.Response && olPage.Data.PageInfo.Response.BeforeNavigateResponses && olPage.Data.PageInfo.Response.BeforeNavigateResponses[0]) {
                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = eventLocal_.data.ResponseContent.PauseDuration;

                                if (eventLocal_.data.ResponseContent.InOfflineMode && olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].InOfflineMode != eventLocal_.data.ResponseContent.InOfflineMode) {
                                    olPage.Content.Divs._internal.ChangeImageSources();
                                    olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].InOfflineMode = eventLocal_.data.ResponseContent.InOfflineMode;
                                }
                            }
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('ResourceTimeout page', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                SetCurrentPersonalDetailsRequestResponse : function() {
                    kango.addMessageListener('olResponseToSetCurrentPersonalDetailsRequest', function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Set current personal details request response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.SetCurrentPersonalDetails(), alertContent_);

                            olPage.Messages.PersonalDetailsChosenRequest();
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('SetCurrentPersonalDetailsRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                SetCommentEditRequestResponse : function() {
                    kango.addMessageListener('olResponseToSetCommentEditRequest', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var alertContent_ = new olFunctions.AlertContent('Set comment edit request response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.SetCommentEdit(), alertContent_);

                            var receivedMessageContent_ = eventLocal_.data;
                            olPage.Data.PageInfo.Response.SetCommentEditResponse = receivedMessageContent_.ResponseContent;
                            if (olPage.Data.PageInfo.Response.SetCommentEditResponse && olPage.Data.PageInfo.Response.SetCommentEditResponse.StartTime) {
                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].StartTime = olPage.Data.PageInfo.Response.SetCommentEditResponse.StartTime;
                                olPage.Data.StartTime = new Date(olPage.Data.PageInfo.Response.SetCommentEditResponse.StartTime);
                            }
                            if (olPage.Data.PageInfo.Response.SetCommentEditResponse && olPage.Data.PageInfo.Response.SetCommentEditResponse.PauseDuration) {
                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = olPage.Data.PageInfo.Response.SetCommentEditResponse.PauseDuration;
                            } else {
                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = 0;
                            }

                            olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId = receivedMessageContent_.ApplicationsSessionId;
                            olPage.Content.Divs._internal.PromptMatter._internal.UpdateVariables();
                            olPage.Data.PageFlags.MatterDone = true;
                            olPage.Data.PageFlags.MatterSkiped = false;
                            olPage.Messages.Flags.MatterDone(true);
                            olPage.Content.Divs.Close.PromptMatter(true);
                            olPage.Content.Divs._internal.PromptMatter._internal.FillMatterValues();
                            olPage.Content.Inject();
                            olPage.Content.Divs._internal.PromptMatter.Initialise();
                            olPage.Content.Divs._internal.EnableElements(olPage.Content.Divs._internal.PromptMatter._internal.ArrayElements);
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('SetCommentEditRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                SetCommentRequestResponse : function() {
                    kango.addMessageListener('olResponseToSetCommentRequest', function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Set comment request response message', 'Received by page');

                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.SetComment(), alertContent_);

                            olPage.Content.Divs._internal.PromptMatter._internal.UpdateVariables();
                            olPage.Data.PageFlags.MatterDone = true;
                            olPage.Data.PageFlags.MatterSkiped = false;
                            olPage.Messages.Flags.MatterDone(true);
                            olPage.Content.Divs.Close.PromptMatter(true);
                            olPage.Content.Divs._internal.PromptMatter._internal.FillMatterValues();
                            olPage.Content.Inject();
                            olPage.Content.Divs._internal.PromptMatter.Initialise();
                            olPage.Content.Divs._internal.EnableElements(olPage.Content.Divs._internal.PromptMatter._internal.ArrayElements);
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('SetCommentRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                SetPersonalDetailsRequestResponse : function() {
                    kango.addMessageListener('olResponseToSetPersonalDetailsRequest', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            if (!olPage.Data.LocalPageFlags.WindowUnloading) {
                                var alertContent_ = new olFunctions.AlertContent('Set personal details response message', 'Received by page');
                                olFunctions.Alert(olOptions.Debug.Page.Messages.Received.SetPersonalDetails(), alertContent_);

                                var receivedMessageContent_ = eventLocal_.data;
                                var receivedId_ = receivedMessageContent_.ResponseContent.SetPersonalDetailsResponse.DetailsId;

                                olPage.Content.Divs.Close.PromptLogonDetails(true);
                                olPage.Content.Divs._common.UpdateLogonData(receivedId_, 'add-update');
                                $('#olPromptLogonDetails').data('InitialPrompt', true);

                                olPage.Content.Divs.Load.PromptLogon(true);
                            }
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('SetPersonalDetailsRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                        olPage.Listeners._internal.Events._processingKey = false;
                    });
                },
                SetCommonDetailsRequestResponse : function() {
                    kango.addMessageListener('olResponseToSetCommonDetailsRequest', function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Set personal details response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.SetCommonDetails(), alertContent_);

                            olPage.Content.Divs.Close.PromptLogonDetails(true);
                            olPage.Content.Divs._common.UpdateLogonData('olCommonId', 'add-update');
                            $('#olPromptLogonDetails').data('InitialPrompt', true);

                            olPage.Content.Divs.Load.PromptLogon(true);
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('SetCommonDetailsRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                SkipPersonalDetailsRequestResponse : function() {
                    kango.addMessageListener('olResponseToSkipPersonalDetailsRequest', function(event) {
                        try {
                            var alertContent_ = new olFunctions.AlertContent('Set personal details response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.SkipPersonalDetailsRequestResponse(), alertContent_);

                            olPage.Data.PageFlags.LogonSkiped = true;
                            olPage.Data.PageFlags.LogonDone = true;
                            olPage.Messages.Flags.LogonDone(true);
                            olPage.Content.Divs.Close.PromptLogon(true);
                            olPage.Content.Inject();
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('SkipPersonalDetailsRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                ValidateSelectedMatterRequestResponse : function() {
                    kango.addMessageListener('olResponseToValidateSelectedMatterRequest', function(event) {
                        try {
                            var eventLocal_ = olPage.Functions._parseEventDataPage(event);
                            var alertContent_ = new olFunctions.AlertContent('Validate selected matter request response message', 'Received by page');
                            olFunctions.Alert(olOptions.Debug.Page.Messages.Received.ValidateSelectedMatterRequestResponse(), alertContent_);

                            var receivedMessageContent_ = eventLocal_.data;
                            olPage.Data.PageFlags.CommentRequest = false;

                            olPage.Data.PageInfo.Response.ValidateMatterResponse = receivedMessageContent_.ResponseContent;

                            //olPage.Content.Divs._internal.PromptMatter._internal.PopulateMatterDropDownList('olMatterList', olPage.Data.PageInfo.Response.CheckMatterResponse.MatterDetails);
                            olPage.Content.Divs._internal.PromptMatter._internal.PopulateMatterDropDownList();
                            olPage.Content.Divs._internal.PromptMatter._internal.UnselectMatterDropDownList();
                            if (olPage.Data.PageInfo.Response.ValidateMatterResponse.ValidatedSpecified) {
                                if ( typeof (olPage.Data.PageInfo.Response.ValidateMatterResponse.Validated ) === 'undefined') {
                                    if ( typeof (olPage.Data.PageInfo.Response.ValidateMatterResponse.ValidPersonalID) !== 'undefined') {
                                        if (!olPage.Data.PageInfo.Response.ValidateMatterResponse.ValidPersonalID) {
                                            olPage.Content.Divs._internal.PromptMatter._internal.ClearValidatingInterval();
                                            olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_TimekeeperWrong'), 'a');
                                        } else {
                                            olPage.Content.Divs._internal.PromptMatter._internal.ClearValidatingInterval();
                                            olPage.Content.Divs.SetInfoMsg('Unknown error', 'a');
                                        }
                                    }
                                } else {
                                    if (olPage.Data.PageInfo.Response.ValidateMatterResponse.Validated) {
                                        olPage.Data.StartTime = new Date();
                                        if (olPage.Data.PageInfo.Response.ValidateMatterResponse.RequiresCommentSpecified && olPage.Data.PageInfo.Response.ValidateMatterResponse.RequiresComment) {
                                            olPage.Data.PageFlags.CommentRequest = true;
                                            olPage.Content.Divs._internal.PromptMatter._internal.EnableComment();
                                            olPage.Content.Divs._internal.PromptMatter._internal.ShowComment();
                                            olPage.Content.Divs._internal.PromptMatter._internal.CheckData();
                                        } else {
                                            if (olPage.Content.Divs._internal.PromptMatter._internal.RequestNewSession()) {
                                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId = receivedMessageContent_.ApplicationsSessionId;
                                            }

                                            if (olPage.Data.PageInfo.Response.ValidateMatterResponse && olPage.Data.PageInfo.Response.ValidateMatterResponse.StartTime) {
                                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].StartTime = olPage.Data.PageInfo.Response.ValidateMatterResponse.StartTime;
                                                olPage.Data.StartTime = new Date(olPage.Data.PageInfo.Response.ValidateMatterResponse.StartTime);
                                                if (isNaN(olPage.Data.StartTime)) {
                                                    olPage.Data.StartTime = new Date(olPage.Functions.DateFromISO8601(olPage.Data.PageInfo.Response.ValidateMatterResponse.StartTime));
                                                }
                                            }

                                            if (olPage.Data.PageInfo.Response.ValidateMatterResponse && olPage.Data.PageInfo.Response.ValidateMatterResponse.PauseDuration) {
                                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = olPage.Data.PageInfo.Response.ValidateMatterResponse.PauseDuration;
                                            } else {
                                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PauseDuration = 0;
                                            }

                                            olPage.Content.Divs._internal.PromptMatter._internal.UpdateVariables();
                                            olPage.Data.PageFlags.MatterDone = true;
                                            olPage.Data.PageFlags.MatterSkiped = false;
                                            olPage.Messages.Flags.MatterDone(true);
                                            olPage.Content.Divs.Close.PromptMatter(true);
                                            olPage.Content.Divs._internal.PromptMatter._internal.FillMatterValues();
                                            olPage.Content.Inject();
                                            olPage.Content.Divs._internal.PromptMatter.Initialise();
                                        }
                                    } else {
                                        olPage.Content.Divs._internal.PromptMatter._internal.ClearValidatingInterval();
                                        olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_MatterNumberWrong'), 'a');
                                    }
                                }
                                if (!olPage.Data.PageFlags.CommentRequest) {
                                    olPage.Content.Divs._internal.EnableElements(olPage.Content.Divs._internal.PromptMatter._internal.ArrayElements);
                                }
                            } else {
                                olPage.Content.Divs._internal.PromptMatter._internal.ClearValidatingInterval();
                                if (olPage.Data.PageInfo.Response.ValidateMatterResponse.ValidPersonalIDSpecified && !olPage.Data.PageInfo.Response.ValidateMatterResponse.ValidPersonalID) {
                                    olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_TimekeeperWrong'), 'a');
                                } else {
                                    olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_MatterNumberWrong'), 'a');
                                }
                                olPage.Content.Divs._internal.EnableElements(olPage.Content.Divs._internal.PromptMatter._internal.ArrayElements);
                            }
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('ValidateSelectedMatterRequestResponse', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                }
            }
        },
        InitiateContentEventListeners : function() {
            try {
                olPage.Listeners._internal.Events.WindowBeforeUnload();
                olPage.Listeners._internal.Events.KeyEvents();
                olPage.Listeners._internal.Events.DocumentReady();
                olPage.Listeners._internal.Events.BodySubtreeChanged();
                olPage.Listeners._internal.Events.TitleSubtreeChanged();
                olPage.Listeners._internal.Events.WindowHashChange();
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('InitiateContentEventListeners', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        InitiateContentMessageListeners : function() {
            try {
                olPage.Listeners._internal.Messages.AskToStorePassword();
                olPage.Listeners._internal.Messages.BeforeNavigateRequestResponse();
                olPage.Listeners._internal.Messages.CheckMatterGlobalRequestResponse();
                olPage.Listeners._internal.Messages.ChooseApplicationMessage();
                olPage.Listeners._internal.Messages.DeletePersonalDetailRequestResponse();
                olPage.Listeners._internal.Messages.PersonalDetailsChosenRequestResponse();
                olPage.Listeners._internal.Messages.ResourceTimeout();
                olPage.Listeners._internal.Messages.Error();
                olPage.Listeners._internal.Messages.LogoutTabMember();
                olPage.Listeners._internal.Messages.SetCommentEditRequestResponse();
                olPage.Listeners._internal.Messages.SetCurrentPersonalDetailsRequestResponse();
                olPage.Listeners._internal.Messages.SetCommentRequestResponse();
                olPage.Listeners._internal.Messages.SetPersonalDetailsRequestResponse();
                olPage.Listeners._internal.Messages.SetCommonDetailsRequestResponse();
                olPage.Listeners._internal.Messages.SkipPersonalDetailsRequestResponse();
                olPage.Listeners._internal.Messages.ValidateSelectedMatterRequestResponse();
                olPage.Listeners._internal.Messages.PauseDuration();
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('InitiateContentMessageListeners', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        }
    },
    Messages : {
        _internal : {
            DispatchMessage : function(message, messageContent) {
                try {
                    messageContent = JSON.stringify(messageContent);
                    kango.dispatchMessage(message, messageContent);
                } catch(e) {
                    var alertContent_ = new olFunctions.AlertContent('DispatchMessage', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            }
        },
        Flags : {
            MatterDone : function(messageContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Matter done message', 'Sent by page');
                    olPage.Messages._internal.DispatchMessage('olMatterDone', messageContent);

                    olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.Flags.MatterDone(), alertContent_);
                } catch(e) {
                    var alertContent_ = new olFunctions.AlertContent('MatterDone', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            LogonDone : function(messageContent) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Logon done message', 'Sent by page');
                    olPage.Messages._internal.DispatchMessage('olLogonDone', messageContent);

                    olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.Flags.LogonDone(), alertContent_);
                } catch(e) {
                    var alertContent_ = new olFunctions.AlertContent('LogonDone', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            }
        },
        ApplicationRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Application request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olApplicationRequest', messageContent);

                //TODO HARD CORE westlaw reload
                if (olFunctions.CompareUrls(location.href, 'signon.thomsonreuters.com/?productid=CBT')) {
                    if (olPage.Data.PageFlags.BrowserName == 'firefox') {

                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    }
                }

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.Application(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.ApplicationRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        ContinueSessionRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Continue session request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olContinueSessionRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.ContinueSession(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.ContinueSessionRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        CheckMatterGlobalRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Check matter global request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olCheckMatterGlobalRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.CheckMatterGlobal(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.CheckMatterGlobalRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        _closeTabMessageSent : false,
        CloseTab : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Close tab message', 'Sent by page');

                if (!olPage.Messages._closeTabMessageSent) {
                    olPage.Messages._closeTabMessageSent = true;
                    olPage.Messages._internal.DispatchMessage('olCloseTab', messageContent);
                }

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.CloseTab(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.CloseTab', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        DeletePersonalDetailRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Delete personal detail message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olDeletePersonalDetailRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.DeletePersonalDetail(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.DeletePersonalDetailRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        FormSubmit : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Form submit message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olFormSubmit', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.FormSubmit(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.FormSubmit', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        DocumentReady : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Document ready message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olDocumentReady', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.DocumentReady(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.DocumentReady', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        ProcessPageCompleted : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Process page completed message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olProcessPageCompleted', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.ProcessPageCompleted(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.ProcessPageCompleted', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        PersonalDetailsChosenRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Personal details chosen message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olPersonalDetailsChosenRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.PersonalDetailsChosen(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.PersonalDetailsChosenRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        PulseRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Pulse request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olPulseRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.Pulse(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.PulseRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        LogoutSequenceCompleted : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Logout sequence completed', 'Sent by page');

                olPage.Messages._internal.DispatchMessage('olLogoutSequenceCompleted', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.LogoutSequenceCompleted(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.LogoutSequenceCompleted', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SetCommentRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set comment request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olSetCommentRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SetComment(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SetCommentRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SetCommentEditRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set comment edit request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olSetCommentEditRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SetCommentEdit(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SetCommentEditRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SetCurrentPersonalDetailsRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set current personal details message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olSetCurrentPersonalDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SetCurrentPersonalDetails(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SetCurrentPersonalDetailsRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SetPersonalDetailsRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set personal details message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olSetPersonalDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SetPersonalDetails(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SetPersonalDetailsRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SetCommonDetailsRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set common details message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olSetCommonDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SetCommonDetails(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SetCommonDetailsRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SetTempPersonalDetailsRequest : function(definedName, value) {
            try {

                var alertContent_ = new olFunctions.AlertContent('Set temp personal details message', 'Sent by page');

                var idParam_ = $('#olPromptLogonDetails').data('Id');

                //Set  to null on adding new account because service is set to take NULL as param
                if (idParam_ == 'IdNewLogon') {
                    idParam_ = null;
                }

                var variables_ = [];
                var variable_ = {
                    Name : definedName,
                    Value : value
                };
                variables_.push(variable_);

                //Send message
                var parameters_ = {
                    ApplicationSessionId : olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId,
                    Id : idParam_,
                    Details : {
                        Name : null,
                        Variables : variables_
                    }
                };

                olPage.Messages._internal.DispatchMessage('olSetTempPersonalDetailsRequest', parameters_);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SetTempPersonalDetails(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SetTempPersonalDetailsRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        StorePasswordRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Store password request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olStorePasswordRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.StorePassword(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.StorePasswordRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SkipMatterDetailsRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Skip matter details message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olSkipMatterDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SkipMatterDetails(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SkipMatterDetailsRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        SkipPersonalDetailsRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Skip personal details message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olSkipPersonalDetailsRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SkipPersonalDetails(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SkipPersonalDetailsRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        UpdateResponse : function() {
            try {
                if (olPage.Data.PageInfo) {
                    var messageContent_ = {
                        Title : document.title,
                        Response : olPage.Data.PageInfo.Response,
                        PageFlags : olPage.Data.PageFlags
                    };
                    var alertContent_ = new olFunctions.AlertContent('Update response message', 'Sent by page');
                    olPage.Messages._internal.DispatchMessage('olUpdateResponse', messageContent_);

                    olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.UpdateResponse(), alertContent_);
                }
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.UpdateResponse', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        ValidateSelectedMatterRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Validate selected matter request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olValidateSelectedMatterRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.ValidateSelectedMatter(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.ValidateSelectedMatterRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        QuittingResourceSessionRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Quitting resource session request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olQuittingResourceSessionRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.QuittingResourceSession(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.QuittingResourceSessionRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        WindowHashChange : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Window hash change message', 'Sent by page');
                var messageContent_ = {
                    Url : document.URL,
                    Title : document.title
                };
                olPage.Messages._internal.DispatchMessage('olWindowHashChange', messageContent_);
                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.WindowHashChange(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.WindowHashChange', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        //Analysis
        SetFeaturesRequest : function(messageContent) {
            try {
                var alertContent_ = new olFunctions.AlertContent('Set features request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olSetFeaturesRequest', messageContent);

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.SetFeatures(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.SetFeaturesRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        //WebControl
        StartMessageSeenRequest : function() {
            try {
                var alertContent_ = new olFunctions.AlertContent('Start message seen request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olStartMessageSeenRequest');

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.StartMessageSeen(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.StartMessageSeenRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        },
        HideStartMessageRequest : function() {
            try {
                var alertContent_ = new olFunctions.AlertContent('Hide start message seen request message', 'Sent by page');
                olPage.Messages._internal.DispatchMessage('olHideStartMessageRequest');

                olFunctions.Alert(olOptions.Debug.Page.Messages.Sent.HideStartMessage(), alertContent_);
            } catch(e) {
                var alertContent_ = new olFunctions.AlertContent('olPage.Messages.HideStartMessageRequest', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
            }
        }
    },
    Content : {
        _internal : {
            PrepareInjectionParameters : function() {
                var bnr0_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                olInjection.CurrentPrompt = olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt;
                olInjection.Parameters.Flags = olPage.Data.PageFlags;
                olInjection.Parameters.Forms = bnr0_.Forms;
                olInjection.Parameters.DefinedNames = olPage.Data.PageInfo.DefinedNames;
                olInjection.Parameters.VariableReplacement = bnr0_.VariableReplacement;
                olInjection.Parameters.LogonDataArray = olPage.Content.Divs._common.GetLogonData();
                olInjection.Parameters.InjectFieldColor = olOptions.General.Page.InjectFieldColor();
                olInjection.Parameters.DebugErrors = olOptions.Debug.Errors();
                olInjection.Parameters.DebugPageEventsSubmit = olOptions.Debug.Page.Events.Submit();
            },
            SetMatterVariables : function() {
                var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                if (beforeNavigateResponse_.VariableReplacement && olFunctions.IsFilledArray(beforeNavigateResponse_.VariableReplacement.Variables)) {

                    for (var i = 0; i < beforeNavigateResponse_.VariableReplacement.Variables.length; i++) {
                        var currentValue_ = beforeNavigateResponse_.VariableReplacement.Variables[i].Value;
                        try {
                            //matter
                            if ($.inArray(String(beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName), olPage.Data.PageInfo.DefinedNames.MatterArray) > -1) {
                                if (beforeNavigateResponse_.MatterDetailsSkippedSpecified && !beforeNavigateResponse_.MatterDetailsSkipped && beforeNavigateResponse_.MatterDetails && (!currentValue_ || currentValue_ === '')) {
                                    olPage.Data.PageFlags.MatterNumber = beforeNavigateResponse_.MatterDetails.MatterNumber;
                                    currentValue_ = beforeNavigateResponse_.MatterDetails.MatterNumber;
                                } else {
                                    olPage.Data.PageFlags.MatterNumber = currentValue_;
                                }
                            }
                            //time keeper
                            if ($.inArray(String(beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName), olPage.Data.PageInfo.DefinedNames.TimeKeeperArray) > -1) {
                                if (beforeNavigateResponse_.MatterDetailsSkippedSpecified && !beforeNavigateResponse_.MatterDetailsSkipped && beforeNavigateResponse_.MatterDetails && (!currentValue_ || currentValue_ === '')) {
                                    olPage.Data.PageFlags.TimekeeperNumber = beforeNavigateResponse_.MatterDetails.PersonalCode;
                                    currentValue_ = beforeNavigateResponse_.MatterDetails.PersonalCode;
                                } else {
                                    olPage.Data.PageFlags.TimekeeperNumber = currentValue_;
                                }
                            }
                            //comment
                            if ($.inArray(String(beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName), olPage.Data.PageInfo.DefinedNames.CommentArray) > -1) {
                                if (beforeNavigateResponse_.MatterDetailsSkippedSpecified && !beforeNavigateResponse_.MatterDetailsSkipped && beforeNavigateResponse_.MatterDetails && (!currentValue_ || currentValue_ === '')) {
                                    olPage.Data.PageFlags.Comment = beforeNavigateResponse_.MatterDetails.Comment;
                                    currentValue_ = beforeNavigateResponse_.MatterDetails.Comment;
                                } else {
                                    olPage.Data.PageFlags.Comment = currentValue_;
                                }
                            }
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('CheckAllforInjection failed to find all variables', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    }

                    if (olFunctions.IsFilledArray(beforeNavigateResponse_.Forms)) {
                        $('#olToolbarRefresh').show();
                    }
                }
            },
            SetToolbarDetails : function() {
                //all done, turn off mask and enable toolbar
                var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                olPage.Content.Divs._internal.SetMask(false);
                olPage.Content.Divs._internal.Toolbar.Enable();
                var toolTip_ = $.trim(olPage.Data.ApplicationName);
                if (beforeNavigateResponse_.ShowActiveMatterNumberSpecified && beforeNavigateResponse_.ShowActiveMatterNumber) {
                    toolTip_ = toolTip_ + ' ' + olPage.Data.PageFlags.MatterNumber;
                }
                if (toolTip_ && toolTip_ !== '') {
                    olPage.Content.Divs._internal.Toolbar._internal.SetTooltip(toolTip_);
                } else {
                    olPage.Content.Divs._internal.Toolbar._internal.SetTooltip('Onelog');
                }
                //share changes with all tabs
                olPage.Messages.UpdateResponse();
            },
            CheckAllforInjection : function() {
                try {
                    if (!olPage.Data.PageInfo) {
                        //Hash change event happend
                        return false;
                    }
                    ;
                    if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt !== '') {
                        return false;
                    }
                    if ((olPage.Data.PageFlags.LicenceLimitReachedNeeded && !olPage.Data.PageFlags.LicenceLimitReachedDone) || (olPage.Data.PageFlags.PooledDetailsLimitReachedNeeded && !olPage.Data.PageFlags.PooledDetailsLimitReachedDone)) {
                        olPage.Content._internal.ProcessLicenceLimitReached();
                        return false;
                    }
                    if (olPage.Data.PageFlags.Unauthorised) {
                        //all done, turn off mask and enable toolbar
                        olPage.Content.Divs._internal.SetMask(false);
                        olPage.Content.Divs._internal.Toolbar.CloseMenu();

                        olPage.Content.Divs._internal.Toolbar.Enable();
                        return false;
                    }
                    if (olPage.Data.PageFlags.MatterNeeded && !olPage.Data.PageFlags.MatterDone) {
                        olPage.Content._internal.ProcessMatter();
                        return false;
                    }
                    if ((olPage.Data.PageFlags.LogonNeeded || olPage.Data.PageFlags.LogonCommonNeeded) && !olPage.Data.PageFlags.LogonDone) {
                        olPage.Content._internal.ProcessLogon();
                        return false;
                    }
                    return true;
                } catch(e) {
                    var alertContent_ = new olFunctions.AlertContent('CheckAllforInjection', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    return false;
                }
            },
            AskToStorePasswordAppended : false,
            ScriptsAppended : false,
            MainPromptsAppended : false,
            ToolbarAppended : false,
            ChooseApplicationAppended : false,
            ResourceTimeoutAppended : false,
            ErrorAppended : false,
            WebControlApended : false,
            MiscAppended : false,
            StyleAppended : false,
            ProcessLicenceLimitReached : function() {
                try {
                    //process licence limit reached
                    olPage.Content.Divs.Load.PromptLicenceLimitReached(true);

                } catch(e) {
                    var alertContent_ = new olFunctions.AlertContent('PromptLicenceLimitReached', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            ProcessMatter : function() {
                try {
                    //process matter request and invoke Page when matter validation is complete
                    olPage.Content.Divs.Load.PromptMatter(true);
                } catch(e) {
                    var alertContent_ = new olFunctions.AlertContent('ProcessMatter', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            ProcessLogon : function() {
                try {
                    //process loggons
                    if (olPage.Data.PageFlags.LogonNeeded || olPage.Data.PageFlags.LogonCommonNeeded) {
                        olPage.Content.Divs.Load.PromptLogon(true);
                    } else {
                        olPage.Data.PageFlags.LogonDone = true;
                        olPage.Messages.Flags.LogonDone(true);

                        olPage.Content.Inject();
                    }
                } catch(e) {
                    var alertContent_ = new olFunctions.AlertContent('ProcessLogon', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            },
            ProcessPageInfo : function() {
                try {
                    if (olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].AppIdSpecified) {
                        olPage.Content.Divs.Initialise();
                        olPage.Content.Divs.BindEvents();

                        olPage.Content.Inject();
                    }
                    olPage.Content.Modules.FinishedResource();
                    olPage.Messages.ProcessPageCompleted();
                } catch(e) {
                    var alertContent_ = new olFunctions.AlertContent('ProcessPageInfo', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                }
            }
        },
        HtmlAppends : {
            _prepareForBrowser : function() {
                // var browserName_ = kango.browser.getName();
                // switch (olPage.Data.PageFlags.BrowserName) {
                // case 'iejs':
                // // olPage.Content.Divs._internal.Modal._$modal.find('input.olInherit').each(function() {
                // // $(this).remove();
                // // });
                // // break;
                // olPage.Content.Divs._internal.Modal._$modal.find('textarea.olInherit').each(function() {
                // $(this).remove();
                // });
                // break;
                // default :
                // olPage.Content.Divs._internal.Modal._$modal.find('textarea.olInherit').each(function() {
                // $(this).remove();
                // });
                // break;
                // }
            },
            AddMainPrompts : function() {
                kango.invokeAsync('kango.storage.getItem', 'olHtml', function(data) {
                    try {
                        if (!olPage.Content._internal.MainPromptsAppended) {
                            olPage.Content.Divs._internal.Modal._appendToModal(data);
                            // olPage.Content.HtmlAppends._prepareForBrowser();
                            olPage.Content._internal.MainPromptsAppended = true;
                        }
                        //olPage.Content.HtmlAppends.AddScripts();
                        olPage.Content.HtmlAppends.AddToolbar();
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddMainPrompts', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            },
            // AddScripts : function() {
            // kango.invokeAsync('kango.storage.getItem', 'olEvalScripts', function(data) {
            // try {
            // if (!olPage.Content._internal.ScriptsAppended) {
            // $('head').append(data);
            // olPage.Content._internal.ScriptsAppended = true;
            // }
            // } catch(e) {
            // var alertErrorContent_ = new olFunctions.AlertContent('AddScripts', e.message + '\n' + e.stack);
            // olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            // }
            // });
            // },
            AddToolbar : function() {
                kango.invokeAsync('kango.storage.getItem', 'olToolbarDiv', function(data) {
                    try {
                        if (!olPage.Content._internal.ToolbarAppended) {
                            $('body #olToolbarContainer').remove();
                            olPage.Content.Divs._internal.Modal._$backupToolbar.append(data);
                            $('.olOverlay').hide();

                            olPage.Content._internal.ToolbarAppended = true;
                        }
                        olPage.Content._internal.ProcessPageInfo();
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddToolbar', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            },
            AddChooseApplicationPrompt : function(pageInfo) {
                kango.invokeAsync('kango.storage.getItem', 'olChooseApplication', function(data) {
                    try {
                        if (!olPage.Content._internal.ChooseApplicationAppended) {
                            olPage.Content._internal.ChooseApplicationAppended = true;

                            olPage.Content.Divs._internal.Modal._appendToModal(data);
                            // olPage.Content.HtmlAppends._prepareForBrowser();
                            $('.olOverlayChooseApplication').hide();
                            olPage.Content.Divs._internal.ChangeImageSources();
                            olPage.Content.Divs._internal.PromptChooseApplication.BindEvents();
                        }
                        olPage.Data.PageInfo = pageInfo;
                        olPage.Content.Divs.Load.PromptChooseApplication(true);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddChooseApplicationPrompt', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            },
            AddAskToStorePassword : function() {
                kango.invokeAsync('kango.storage.getItem', 'olStorePassword', function(data) {
                    try {
                        if (!olPage.Content._internal.AskToStorePasswordAppended) {
                            olPage.Content._internal.AskToStorePasswordAppended = true;
                            olPage.Content.Divs._internal.Modal._appendToModal(data);
                            // olPage.Content.HtmlAppends._prepareForBrowser();
                            $('.olOverlayAskToStorePassword').hide();
                            olPage.Content.Divs._internal.AskToStorePassword.BindEvents();
                            $('#olStorePassword h2').empty().append('<div id="olImgLogo32" class="olInherit olMultipleColourImage olImg olImg32 olImgPrompt "/>');
                            $('#olStorePassword h2').append(olPage.Content.Modules._internal.PasswordManagement._parameters.ResponseContent.Title);
                            $('#olStorePasswordContent').empty().append(olPage.Content.Modules._internal.PasswordManagement._parameters.ResponseContent.Body);
                            olPage.Content.Divs._internal.ChangeImageSources();
                        }
                        olPage.Content.Divs.Load.AskToStorePassword(true);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddTimeoutPrompt', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            },
            AddTimeoutPrompt : function(receivedMessageContent) {
                kango.invokeAsync('kango.storage.getItem', 'olTimeout', function(data) {
                    try {
                        if (!olPage.Content._internal.ResourceTimeoutAppended) {
                            olPage.Content._internal.ResourceTimeoutAppended = true;
                            olPage.Content.Divs._internal.Modal._appendToModal(data);
                            // olPage.Content.HtmlAppends._prepareForBrowser();
                            $('.olOverlayTimeout').hide();
                            olPage.Content.Divs._internal.ChangeImageSources();
                            olPage.Content.Divs._internal.ResourceTimeout.BindEvents();
                        }
                        olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationSessionId = receivedMessageContent.ResponseContent.ApplicationSessionId;
                        olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationName = receivedMessageContent.ResponseContent.ApplicationName;
                        olPage.Content.Divs._internal.ResourceTimeout._internal.ResourceTimeoutText = receivedMessageContent.ResponseContent.ResourceTimeoutText;
                        olPage.Content.Divs.Load.ResourceTimeout(true);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddTimeoutPrompt', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            },
            AddWebControlMessagePrompt : function() {
                kango.invokeAsync('kango.storage.getItem', 'olWebControlMessage', function(data) {
                    try {
                        if (!olPage.Content._internal.WebControlApended) {
                            olPage.Content._internal.WebControlApended = true;
                            olPage.Content.Divs._internal.Modal._appendToModal(data);
                            // olPage.Content.HtmlAppends._prepareForBrowser();
                            $('.olOverlayWebControlMessage').hide();
                            olPage.Content.Divs._internal.ChangeImageSources();
                            olPage.Content.Divs._internal.WebControlMessage.BindEvents();
                        }
                        olPage.Content.Modules._internal.WebControl.ProcessStartMessageWebRules();
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddWebControlMessagePrompt', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            },
            AddErrorPrompt : function(receivedMessageContent) {
                kango.invokeAsync('kango.storage.getItem', 'olError', function(data) {
                    try {
                        if (!olPage.Content._internal.ErrorAppended) {
                            olPage.Content._internal.ErrorAppended = true;
                            olPage.Content.Divs._internal.Modal._appendToModal(data);
                            // olPage.Content.HtmlAppends._prepareForBrowser();
                            $('.olOverlayError').hide();
                            olPage.Content.Divs._internal.ChangeImageSources();
                            olPage.Content.Divs._internal.Error.BindEvents();
                        }
                        olPage.Content.Divs.Load.Error(true);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddErrorPrompt', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            },
            AddMisc : function() {
                kango.invokeAsync('kango.storage.getItem', 'olMisc', function(data) {
                    try {
                        if (!olPage.Content._internal.MiscAppended) {
                            olPage.Content._internal.MiscAppended = true;
                            olPage.Content.Divs._internal.Modal._$backup.append(data);
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddMisc', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            },
            AddStyle : function() {
                kango.invokeAsync('kango.storage.getItem', 'olStyle', function(data) {
                    try {
                        var olStyle_ = data;
                        if (olPage.Data.LocalPageFlags.IECompatibilityMode == 'IE7') {
                            kango.invokeAsync('kango.storage.getItem', 'olStyleIE7', function(data) {
                                var olStyleIE7_ = data;
                                olPage.Content.Divs._internal.Modal._$backup.append(olStyle_);
                                olPage.Content.Divs._internal.Modal._$backup.append(olStyleIE7_);
                            });
                        } else {
                            if (!olPage.Content._internal.StyleAppended) {
                                olPage.Content._internal.StyleAppended = true;
                                olPage.Content.Divs._internal.Modal._$backup.append(olStyle_);
                            }
                        }

                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('AddStyle', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                });
            }
        },
        Modules : {
            _internal : {
                PasswordManagement : {
                    _parameters : null,
                    _processPasswordManagementNeeded : false,
                    ProcessPasswordManagement : function() {
                        olPage.Content.HtmlAppends.AddAskToStorePassword();
                    }
                },
                Resource : {
                    _processResourceNeeded : false,
                    ProcessResource : function() {
                        if (olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId !== null) {
                            olPage.Content.Divs.AppendDivs();
                            olPage.Content.AttachEventsWithTimeouts();
                        }
                    }
                },
                Analysis : {
                    _processPageAnalysisNeeded : false,
                    FeaturesArray : [],
                    // do not change name of this object or names of method in it
                    // they are used from server scripts
                    OneLogClientResponse : {
                        OLSendData : function(messageContent) {
                            olPage.Messages._internal.DispatchMessage('olSetAnalysisRequest', messageContent);
                        }
                    },
                    CheckSetFeaturesRequestSend : function(featuresArray) {
                        var sendRequest_ = false;
                        if (featuresArray.length == olPage.Content.Modules._internal.Analysis.FeaturesArray.length) {
                            for (var i = 0; i < featuresArray.length; i++) {
                                var containsFeature_ = false;
                                for (var j = 0; j < olPage.Content.Modules._internal.Analysis.FeaturesArray.length; j++) {
                                    if (olPage.Content.Modules._internal.Analysis.FeaturesArray[j].UID == featuresArray[i].UID) {
                                        containsFeature_ = true;
                                        if (olPage.Content.Modules._internal.Analysis.FeaturesArray[j].Item.length == featuresArray[i].Item.length) {
                                            for (var k = 0; k < featuresArray[i].Item.length; k++) {
                                                var tempItemsArray_ = $.grep(olPage.Content.Modules._internal.Analysis.FeaturesArray[j].Item, function(member) {
                                                    return ((String(member.Label) == String(featuresArray[i].Item[k].Label)) && ((String(member.Value) == String(featuresArray[i].Item[k].Value))));
                                                });
                                                if (!olFunctions.IsFilledArray(tempItemsArray_)) {
                                                    sendRequest_ = true;
                                                    break;
                                                }
                                            }
                                        } else {
                                            sendRequest_ = true;
                                            break;
                                        }
                                    }
                                    if (containsFeature_) {
                                        break;
                                    }
                                }
                                if (!containsFeature_) {
                                    sendRequest_ = true;
                                }
                                if (sendRequest_) {
                                    break;
                                }
                            }
                        } else {
                            sendRequest_ = true;
                        }

                        return sendRequest_;
                    },
                    ProcessAnalysis : function() {
                        try {
                            if (olPage.Data.PageInfo !== null && olFunctions.IsFilledArray(olPage.Data.PageInfo.Response.BeforeNavigateResponses)) {
                                olInjection.ElementValue.SetDocuments();
                                for (var i = 0; i < olPage.Data.PageInfo.Response.BeforeNavigateResponses.length; i++) {
                                    var currentBnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[i];

                                    if (olFunctions.IsFilledArray(currentBnr_.Features)) {
                                        // Regular Analysis ---------------------------------------------------------------------------------------
                                        var FeaturesArray_ = new Array();

                                        for (var j = 0; j < currentBnr_.Features.length; j++) {
                                            var urls_ = currentBnr_.Features[j].URLS;
                                            var nonMatchUrls_ = currentBnr_.Features[j].NonMatchURLs;
                                            // Checking if document needs to be processed
                                            var processAnalysis_ = olFunctions.CheckUrls(urls_, nonMatchUrls_);
                                            if (processAnalysis_ && olFunctions.IsFilledArray(currentBnr_.Features[j].GrabTextItems)) {
                                                if (olFunctions.IsFilledArray(currentBnr_.Features[j].AttachEvents)) {
                                                    // attach to events
                                                    olPage.Content.AttachEvents(currentBnr_.Features[j], true, currentBnr_.Features[j]);
                                                } else {
                                                    // process on document complete
                                                    var featuresElement_ = {
                                                        UID : currentBnr_.Features[j].UID,
                                                        Label : currentBnr_.Features[j].Title,
                                                        Item : []
                                                    };
                                                    // fill feature elements item array
                                                    for (var k = 0; k < currentBnr_.Features[j].GrabTextItems.length; k++) {
                                                        olFunctions.PPA_PushItem(currentBnr_.Features[j].GrabTextItems[k], featuresElement_, FeaturesArray_);
                                                    }
                                                    if (olFunctions.IsFilledArray(featuresElement_.Item)) {
                                                        FeaturesArray_.push(featuresElement_);
                                                    }
                                                }
                                            }
                                        }

                                        if (olFunctions.IsFilledArray(FeaturesArray_)) {
                                            var sendRequest_ = olPage.Content.Modules._internal.Analysis.CheckSetFeaturesRequestSend(FeaturesArray_);
                                            if (sendRequest_) {
                                                olPage.Content.Modules._internal.Analysis.FeaturesArray = FeaturesArray_;
                                                var Features_ = {
                                                    Features : FeaturesArray_
                                                };
                                                olPage.Messages.SetFeaturesRequest(Features_);
                                            }
                                        }
                                    }

                                    if (currentBnr_.AnalysisCode && currentBnr_.AnalysisCode !== null) {
                                        // New Analysis --------------------------------------------------------------------------------------------
                                        var atobCode_ = '"olInternalJS";window.OnelogClientResponse = olPage.Content.Modules._internal.Analysis.OneLogClientResponse;' + currentBnr_.AnalysisCode;
                                        olInjection.JSExec('olJSInjectAfter', atobCode_);
                                    }
                                }
                            }
                            olPage.Content.Modules.FinishedAnalysis();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('ProcessAnalysis', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                WebControl : {
                    _processWebControlNeeded : false,
                    FindTextInThePage : function(textItemsArray) {
                        var textCheck_ = true;
                        if (olFunctions.IsFilledArray(textItemsArray)) {
                            textCheck_ = false;
                            var elementContainText_ = null;
                            for (var k = 0; k < textItemsArray.length; k++) {
                                elementContainText_ = $('*:contains("' + textItemsArray[k] + '")');

                                if (olFunctions.IsFilledArray(elementContainText_)) {
                                    textCheck_ = true;
                                    break;
                                }
                            }
                        }
                        return textCheck_;
                    },
                    _processWebRules : function() {
                        var bnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                        olPage.Functions.Hide('#olChkboxDoNotShowContainer');

                        if (olFunctions.IsFilledArray(bnr_.WebControlRules)) {
                            //if there is any unchecked rule process it
                            if (olPage.Content.Modules._internal.WebControl._currentWebRuleIndex == bnr_.WebControlRules.length) {
                                //all finished for web control atm, reset index for future checks
                                olPage.Content.Modules._internal.WebControl._resetWebRulesIndex();
                            } else {
                                for (var i = olPage.Content.Modules._internal.WebControl._currentWebRuleIndex; i < bnr_.WebControlRules.length; i++) {
                                    //current web rule will be next index
                                    olPage.Content.Modules._internal.WebControl._currentWebRuleIndex++;
                                    var currentWebRule_ = bnr_.WebControlRules[i];

                                    //check if web rule applies
                                    var webRuleApplies_ = false;
                                    var urlCheck_ = olFunctions.CheckUrls(currentWebRule_.URLs);

                                    olInjection.ElementValue.SetDocuments();

                                    var textCheck_ = olPage.Content.Modules._internal.WebControl.FindTextInThePage(currentWebRule_.TextItems);

                                    var elementCheck_ = true;
                                    if (currentWebRule_.TypeSpecified && currentWebRule_.Type == 1) {
                                        if (olFunctions.IsFilledArray(currentWebRule_.ElementsToFind)) {
                                            var succeded_ = true;
                                            for (var k = 0; k < currentWebRule_.ElementsToFind.length; k++) {
                                                var elementFound_ = false;
                                                var currentElement_ = currentWebRule_.ElementsToFind[k].Element;
                                                var elAccessType_ = olDictionaries.Dictionaries.ElAccessType(currentElement_.Id, currentElement_.Name, currentElement_.IndexSpecified);
                                                var elElementType_ = olDictionaries.Dictionaries.ElElementType(currentElement_.ElementTypeSpecified, currentElement_.ElementType);
                                                var elAccessParam_;

                                                switch(elAccessType_) {
                                                case 'byIndex':
                                                    elAccessParam_ = currentElement_.Index;
                                                    break;
                                                case 'byID':
                                                    elAccessParam_ = currentElement_.Id;
                                                    break;
                                                case 'byName':
                                                    elAccessParam_ = currentElement_.Name;
                                                    break;
                                                }
                                                switch(elAccessType_) {
                                                case 'byID':
                                                    elementFound_ = olInjection.ElementValue._internal.GetElementByID(elAccessParam_);
                                                    break;
                                                case 'byName':
                                                    elementFound_ = olInjection.ElementValue._internal.GetElementsByName(elAccessParam_);
                                                    break;
                                                case 'byIndex':

                                                    var elementIndex = elAccessParam_;
                                                    var customTagName = currentElement_.TagName;
                                                    var htmlTagType = elElementType_;

                                                    var elements_ = null;
                                                    var tagName_ = 'input';

                                                    if (customTagName) {
                                                        tagName_ = customTagName;
                                                    }

                                                    if (htmlTagType == 'Select') {
                                                        tagName_ = 'select';
                                                    }
                                                    for (var z = 0; z < olInjection.ElementValue._internal.Documents.length; z++) {
                                                        var currentDocument_ = olInjection.ElementValue._internal.Documents[z];

                                                        elements_ = currentDocument_.getElementsByTagName(tagName_);

                                                        if (elements_.length > 0) {
                                                            for (var g = 0; g < elements_.length; g++) {
                                                                if (!((g == elementIndex) && (elements_[g]))) {

                                                                    elementFound_ = true;
                                                                    break;
                                                                }
                                                            }
                                                            if (elementFound_) {
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    break;
                                                case 'other' :
                                                    var elAttributes_ = currentElement_.Attributes;
                                                    //checking attributes
                                                    if (olFunctions.IsFilledArray(elAttributes_)) {
                                                        for (var l = 0; l < elAttributes_.length; l++) {
                                                            if (elAttributes_[l].IsMatch) {
                                                                for (var m = 0; m < olInjection.ElementValue._internal.Documents.length; m++) {
                                                                    var currentDocument_ = olInjection.ElementValue._internal.Documents[m];
                                                                    if (olFunctions.IsFilledArray($(currentDocument_).find("[" + elAttributes_[l].Name + "*='" + elAttributes_[l].Value + "']"))) {
                                                                        elementFound_ = true;
                                                                        break;
                                                                    }
                                                                }
                                                                if (elementFound_) {
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    break;
                                                }
                                                if (!elementFound_) {
                                                    succeded_ = false;
                                                    break;
                                                }
                                            }
                                            elementCheck_ = succeded_;
                                        }
                                    }
                                    webRuleApplies_ = urlCheck_ && textCheck_ && elementCheck_;

                                    if (webRuleApplies_) {
                                        // set rule action
                                        olPage.Content.Modules._internal.WebControl._setRuleAction(currentWebRule_);

                                        if (currentWebRule_.ShowMessageSpecified && currentWebRule_.ShowMessage && $.inArray(i, olPage.Content.Modules._internal.WebControl._shownWebRulesMessagesArray) == -1) {
                                            // show this web rule message and remember that it was shown for current page
                                            olPage.Content.Modules._internal.WebControl._showWebRuleMessage(currentWebRule_, i);
                                        } else {
                                            // just do action for this web rule
                                            olPage.Content.Divs._internal.WebControlMessage.Events._ruleAction();
                                        }
                                        //break for
                                        break;
                                    } else {
                                        if (olPage.Content.Modules._internal.WebControl._currentWebRuleIndex == bnr_.WebControlRules.length) {
                                            //all finished for web controle, reset index for future checks
                                            olPage.Content.Modules._internal.WebControl._resetWebRulesIndex();
                                        }
                                    }
                                }
                            }
                        } else {
                            olPage.Content.Modules.FinishedWebControl();
                        }
                    },
                    ProcessStartMessageWebRules : function() {
                        if (olPage.Data.PageInfo != null) {
                            var bnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                            if (bnr_.ShowStartMessageSpecified && bnr_.ShowStartMessage && bnr_.StartMessage != null) {
                                //show start message if not shown
                                olPage.Content.Modules._internal.WebControl._processStartMessage();
                            } else {
                                //process web rules
                                olPage.Content.Modules._internal.WebControl._processWebRules();
                            }
                        } else {
                            olPage.Content.Modules.FinishedWebControl();
                        }
                    },
                    _processStartMessage : function() {
                        var bnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                        olPage.Content.Modules._internal.WebControl.LoadWebControlMessage(bnr_.StartMessage);

                        if (bnr_.HideStartMessageCheckboxSpecified && bnr_.HideStartMessageCheckbox) {
                            olPage.Functions.Hide('#olChkboxDoNotShowContainer');
                        } else {
                            $('#olChkboxDoNotShowContainer').show();
                        }

                        olPage.Content.Divs._internal.WebControlMessage.Events._okOnClick = function() {
                            olPage.Content.Divs.Close.WebControlMessage(false);
                            bnr_.ShowStartMessage = false;
                            olPage.Messages.UpdateResponse();
                            olPage.Messages.StartMessageSeenRequest();
                            if ($('#olChkboxDoNotShow').prop('checked')) {
                                olPage.Messages.HideStartMessageRequest();
                            }
                            setTimeout(function() {
                                olPage.Content.Modules._internal.WebControl.ProcessStartMessageWebRules();
                            }, olOptions.General.Page.TransitionTime() + 50);
                        };

                        olPage.Content.Divs.Load.WebControlMessage(true);
                    },
                    _currentWebRuleIndex : 0,
                    // _initialWebControl : true,
                    _shownWebRulesMessagesArray : [],
                    _resetWebRulesIndex : function() {
                        // reset web rules index for future checks
                        olPage.Content.Modules._internal.WebControl._currentWebRuleIndex = 0;
                        olPage.Content.Modules.FinishedWebControl();
                    },
                    _showWebRuleMessage : function(currentWebRule, index) {
                        olPage.Content.Modules._internal.WebControl._shownWebRulesMessagesArray.push(index);
                        //set rule message
                        olPage.Content.Modules._internal.WebControl.LoadWebControlMessage(currentWebRule.Message);
                        //set ok button action
                        olPage.Content.Divs._internal.WebControlMessage.Events._okOnClick = function() {
                        };
                        // load message
                        olPage.Content.Divs.Load.WebControlMessage(true);
                    },
                    _pageBlocked : false,
                    _setRuleAction : function(currentWebRule) {
                        if (currentWebRule.BlockActionSpecified && currentWebRule.BlockAction) {
                            // block action, set mask
                            olPage.Content.Divs._internal.WebControlMessage.Events._ruleAction = function() {
                                olPage.Content.Modules._internal.WebControl._pageBlocked = true;
                                if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt == 'olWebControlMessage') {
                                    olPage.Content.Divs.Close.WebControlMessage(true);
                                } else {
                                    olPage.Content.Divs._internal.SetMask(true);
                                }
                            };
                        } else if (currentWebRule.RedirectSpecified && currentWebRule.Redirect) {
                            // redirect action
                            olPage.Content.Divs._internal.WebControlMessage.Events._ruleAction = function() {
                                olPage.Content.Divs.Close.WebControlMessage(false);
                                window.location.replace(currentWebRule.RedirectLocation);
                            };
                        } else if (currentWebRule.ElementsToModify && (currentWebRule.ElementsToModify.JScript || currentWebRule.ElementsToModify.Element)) {
                            // modify page action
                            olPage.Content.Divs._internal.WebControlMessage.Events._ruleAction = function() {
                                olPage.Content.Divs.Close.WebControlMessage(false);
                                // elements atributes modification
                                if (olFunctions.IsFilledArray(currentWebRule.ElementsToModify.Element)) {
                                    olInjection.ElementValue.SetDocuments();
                                    for (var j = 0; j < currentWebRule.ElementsToModify.Element.length; j++) {
                                        var element_ = null;
                                        var currentElementSearch_ = {
                                            Element : currentWebRule.ElementsToModify.Element[j]
                                        };
                                        for (var i = 0; i < olInjection.ElementValue._internal.Documents.length; i++) {
                                            var elementSearchObject_ = olFunctions.ElementSearch(currentElementSearch_, olInjection.ElementValue._internal.Documents[i]);
                                            if (olFunctions.IsFilledArray(elementSearchObject_[0])) {
                                                if (elementSearchObject_[0][0]) {
                                                    element_ = elementSearchObject_[0][0];
                                                }
                                            }
                                            if (element_) {
                                                break;
                                            }
                                        }
                                        if (element_) {
                                            olInjection.ElementValue._internal.PerformAttributesChanges(element_, currentWebRule.ElementsToModify.Element[j].Attributes);
                                        }
                                    }
                                }
                                // injecting java scripts
                                if (olFunctions.IsFilledArray(currentWebRule.ElementsToModify.JScript)) {
                                    olInjection.JScriptInjection(currentWebRule.ElementsToModify.JScript);
                                }

                                setTimeout(function() {
                                    olPage.Content.Modules._internal.WebControl.ProcessStartMessageWebRules();
                                }, olOptions.General.Page.TransitionTime() + 50);
                            };
                        } else {
                            // default action, close overlay and continue
                            olPage.Content.Divs._internal.WebControlMessage.Events._ruleAction = function() {
                                olPage.Content.Divs.Close.WebControlMessage(false);
                                setTimeout(function() {
                                    olPage.Content.Modules._internal.WebControl.ProcessStartMessageWebRules();
                                }, olOptions.General.Page.TransitionTime() + 50);
                            };
                        }
                    },
                    LoadWebControlMessage : function(message) {
                        $('#olWebControlMessageIFrame').off('load');
                        $('#olWebControlMessageIFrame').on('load', function() {
                            try {
                                $('#olWebControlMessage').css('height', '');
                                $('#olWebControlMessage').css('width', '600px');
                                $('#olWebControlMessage form').css('height', '155px');
                                $('#olWebControlMessageIFrame').css('max-height', '150px');

                                var halfWindowWidth_ = Math.round(window.innerWidth / 2);
                                var halfWindowHeight_ = Math.round(window.innerHeight / 2);
                                var iFrame_ = $('#olWebControlMessageIFrame');
                                var iBody_ = iFrame_.contents().find('body');
                                iBody_.empty().html(message);

                                //ovo ne radi bez timeouta sa nulama (?!?)
                                // TODO objasniti ovo sebi
                                setTimeout(function() {
                                    if (olPage.Functions.IframeHasVerticalScrollBar(iFrame_)) {
                                        $('#olWebControlMessage').css('height', '300px');
                                        $('#olWebControlMessage form').css('height', '255px');
                                        $('#olWebControlMessageIFrame').css('max-height', '220px');
                                        setTimeout(function() {
                                            if (olPage.Functions.IframeHasVerticalScrollBar(iFrame_)) {
                                                $('#olWebControlMessage').css('width', '640px');
                                                setTimeout(function() {
                                                    if (olPage.Functions.IframeHasVerticalScrollBar(iFrame_)) {
                                                        $('#olWebControlMessage').css('height', '480px');
                                                        $('#olWebControlMessage form').css('height', '435px');
                                                        $('#olWebControlMessageIFrame').css('max-height', '420px');
                                                        setTimeout(function() {
                                                            if (olPage.Functions.IframeHasVerticalScrollBar(iFrame_)) {
                                                                if (halfWindowWidth_ >= 640) {
                                                                    $('#olWebControlMessage').css('width', halfWindowWidth_ + 'px');
                                                                } else {
                                                                    $('#olWebControlMessage').css('width', '640px');
                                                                }

                                                                if (halfWindowHeight_ >= 480) {
                                                                    $('#olWebControlMessage').css('height', halfWindowHeight_ + 'px');
                                                                    $('#olWebControlMessage form').css('height', (halfWindowHeight_ - 45) + 'px');
                                                                    $('#olWebControlMessageIFrame').css('max-height', (halfWindowHeight_ - 60) + 'px');
                                                                } else {
                                                                    $('#olWebControlMessage').css('height', '480px');
                                                                    $('#olWebControlMessage form').css('height', '435px');
                                                                    $('#olWebControlMessageIFrame').css('max-height', '420px');
                                                                }
                                                            }
                                                            olPage.Content.Divs._internal.Modal.Center();
                                                        }, 0);
                                                    }
                                                    olPage.Content.Divs._internal.Modal.Center();
                                                }, 0);
                                            }
                                            ;
                                            olPage.Content.Divs._internal.Modal.Center();
                                        }, 0);
                                    }
                                    ;
                                    olPage.Content.Divs._internal.Modal.Center();
                                }, 0);

                                $('#olWebControlMessageIFrame').contents().find('[href]').each(function() {
                                    $(this).attr('target', '_top');
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('LoadWebControlMessage', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        });

                        $('#olWebControlMessageIFrame').load();
                    },
                    ProcessWebControl : function() {
                        olPage.Content.HtmlAppends.AddWebControlMessagePrompt();
                    }
                },
                NeededModuelsArray : [],
                _processOngoing : false
            },
            InitialiseModulesArray : function() {
                try {
                    if (olFunctions.IsFilledArray(olPage.Data.PageInfo.Response.BeforeNavigateResponses)) {
                        var bnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                        if ((bnr_.ShowStartMessageSpecified && bnr_.ShowStartMessage && bnr_.StartMessage != null) || bnr_.WebControlRules) {
                            //WebControl
                            olPage.Content.Modules._internal.NeededModuelsArray.push('WebControl');
                        }

                        //Resource
                        olPage.Content.Modules._internal.NeededModuelsArray.push('Resource');

                        if (olFunctions.IsFilledArray(bnr_.Features) || (bnr_.AnalysisCode && bnr_.AnalysisCode !== null)) {
                            //Analysis
                            olPage.Content.Modules._internal.NeededModuelsArray.push('Analysis');
                        }
                    }
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('InitialiseModulesArray', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            ResetShownWebControlMessages : function() {
                try {
                    olPage.Content.Modules._internal.WebControl._shownWebRulesMessagesArray = [];
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('ResetShownWebControlMessages', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            ActivatePasswordManagement : function() {
                olPage.Content.Modules._internal.PasswordManagement._processPasswordManagementNeeded = true;
            },
            ActivateAnalysis : function() {
                if ($.inArray('Analysis', olPage.Content.Modules._internal.NeededModuelsArray) > -1) {
                    olPage.Content.Modules._internal.Analysis._processPageAnalysisNeeded = true;
                }
            },
            ActivateWebControl : function() {
                if ($.inArray('WebControl', olPage.Content.Modules._internal.NeededModuelsArray) > -1) {
                    olPage.Content.Modules._internal.WebControl._processWebControlNeeded = true;
                }
            },
            ActivateResource : function() {
                if ($.inArray('Resource', olPage.Content.Modules._internal.NeededModuelsArray) > -1) {
                    olPage.Content.Modules._internal.Resource._processResourceNeeded = true;
                }
            },
            ProcessModules : function() {
                try {
                    if (!olPage.Content.Modules._internal._processOngoing && !olPage.Content.Modules._internal.WebControl._pageBlocked) {
                        olPage.Content.Modules._internal._processOngoing = true;
                        if (olPage.Content.Modules._internal.PasswordManagement._processPasswordManagementNeeded) {
                            olPage.Content.Modules._internal.PasswordManagement.ProcessPasswordManagement();
                        } else if (olPage.Content.Modules._internal.WebControl._processWebControlNeeded) {
                            olPage.Content.Modules._internal.WebControl.ProcessWebControl();
                        } else if (olPage.Content.Modules._internal.Resource._processResourceNeeded) {
                            olPage.Content.Modules._internal.Resource.ProcessResource();
                        } else if (olPage.Content.Modules._internal.Analysis._processPageAnalysisNeeded) {
                            olPage.Content.Modules._internal.Analysis.ProcessAnalysis();
                        } else {
                            olPage.Content.Modules._internal._processOngoing = false;
                        }
                    }
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('ProcessModules', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            FinishedPasswordManagement : function() {
                olPage.Content.Modules._internal._processOngoing = false;
                olPage.Content.Modules._internal.PasswordManagement._processPasswordManagementNeeded = false;
                olPage.Content.Modules.ProcessModules();
            },
            FinishedAnalysis : function() {
                olPage.Content.Modules._internal._processOngoing = false;
                olPage.Content.Modules._internal.Analysis._processPageAnalysisNeeded = false;
                olPage.Content.Modules.ProcessModules();
            },
            FinishedWebControl : function() {
                olPage.Content.Modules._internal._processOngoing = false;
                olPage.Content.Modules._internal.WebControl._processWebControlNeeded = false;
                olPage.Content.Modules.ProcessModules();
            },
            FinishedResource : function() {
                olPage.Content.Modules._internal._processOngoing = false;
                olPage.Content.Modules._internal.Resource._processResourceNeeded = false;
                olPage.Content.Modules.ProcessModules();
            }
        },
        Divs : {
            _common : {
                GetApplicationData : function() {
                    var applications_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].Applications;

                    var applicationArray_ = [];
                    var appNameLabel_ = '';

                    if (applications_ != null) {
                        for (var i = 0; i < applications_.length; i++) {
                            appNameLabel_ = olPage.Content.Divs._internal.CreateLabels(applications_[i].Name, 370, null, 'olFontBig');

                            var applicationElement_ = {
                                AppId : applications_[i].AppId,
                                Name : appNameLabel_.Title,
                                Label : appNameLabel_.Text
                            };
                            applicationArray_.push(applicationElement_);
                        }
                    }
                    //Sorting of the existing applications array
                    //Not needed since server is sorting data now
                    //olPage.Content.Divs._common.SortApplicationData(applicationArray_);

                    return applicationArray_;
                },
                LogonDataArray : null,
                GetLogonData : function() {
                    if (!olPage.Content.Divs._common.LogonDataArray) {
                        var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                        var variableReplacement_ = beforeNavigateResponse_.VariableReplacement;
                        var logonArray_ = [];
                        if (!(variableReplacement_)) {
                            return logonArray_;
                        }

                        var elementsArray_ = [];
                        for (var p = 0; p < beforeNavigateResponse_.Forms.length; p++) {
                            var currentForm_ = beforeNavigateResponse_.Forms[p];
                            var currentElement_;
                            for (var o = 0; o < currentForm_.Elements.length; o++) {
                                currentElement_ = currentForm_.Elements[o];
                                var Defined = {
                                    DefinedName : String(currentElement_.DefinedName),
                                    DefinedType : currentElement_.Type
                                };
                                elementsArray_.push(Defined);
                            }
                        }
                        var logonElement_;

                        if (olPage.Data.PageFlags.LogonCommonNeeded || olPage.Data.PageFlags.LogonNeeded) {
                            var details_ = [];
                            if (variableReplacement_.CommonDetail) {
                                details_.push(variableReplacement_.CommonDetail);
                            } else if (olFunctions.IsFilledArray(variableReplacement_.PersonalDetail)) {
                                details_ = variableReplacement_.PersonalDetail;
                            }

                            for (var x = 0; x < details_.length; x++) {
                                logonElement_ = {
                                    Id : '',
                                    AccountName : '',
                                    AccountNameFull : '',
                                    AccountNameEdit : '',
                                    AccountNameDelete : '',
                                    AccountData : [],
                                    Error : false
                                };

                                //Account title
                                var accNameLabel_ = '';
                                if (olPage.Data.PageFlags.LogonNeeded) {
                                    if (details_[x].Name) {
                                        accNameLabel_ = olPage.Content.Divs._internal.CreateLabels(details_[x].Name, 355, null, 'olFontNormal');
                                    } else {
                                        accNameLabel_ = olPage.Content.Divs._internal.CreateLabels(olPage.Functions.GetLanguageItem('JS_Default'), 355, null, 'olFontNormal');
                                    }
                                } else if (olPage.Data.PageFlags.LogonCommonNeeded) {
                                    accNameLabel_ = olPage.Content.Divs._internal.CreateLabels(olPage.Functions.GetLanguageItem('JS_Common'), 355, null, 'olFontNormal');
                                }

                                if (accNameLabel_.Title != accNameLabel_.Text) {
                                    logonElement_.AccountName = accNameLabel_.Text;
                                } else {
                                    logonElement_.AccountName = accNameLabel_.Title;
                                }

                                logonElement_.AccountNameFull = accNameLabel_.Title;

                                var accNameLabelShort_ = '';
                                var title_ = olPage.Functions.GetLanguageItem('JS_EditPassword') + ' (' + logonElement_.AccountNameFull + ')';
                                accNameLabelShort_ = olPage.Content.Divs._internal.CreateLabels(title_, 330, null, 'olFontVeryBig');

                                if (accNameLabelShort_.Title != accNameLabelShort_.Text) {
                                    logonElement_.AccountNameEdit = accNameLabelShort_.Text + ')';
                                } else {
                                    logonElement_.AccountNameEdit = accNameLabelShort_.Text;
                                }

                                var accNameLabelShort2_ = '';
                                var title2_ = olPage.Functions.GetLanguageItem('JS_DeleteAccount') + ' (' + logonElement_.AccountNameFull + ')';
                                accNameLabelShort2_ = olPage.Content.Divs._internal.CreateLabels(title2_, 315, null, 'olFontNormal');

                                if (accNameLabelShort2_.Title != accNameLabelShort2_.Text) {
                                    logonElement_.AccountNameDelete = accNameLabelShort2_.Text + ')';
                                } else {
                                    logonElement_.AccountNameDelete = accNameLabelShort2_.Text;
                                }

                                for (var h = 0; h < variableReplacement_.Variables.length; h++) {
                                    var canBeModified_ = false;
                                    var value_ = variableReplacement_.Variables[h].Value;
                                    var label_ = variableReplacement_.Variables[h].Label;
                                    //Is personal element or common element
                                    if (variableReplacement_.Variables[h].IsPersonal || variableReplacement_.Variables[h].IsCommon) {

                                        if (olFunctions.IsFilledArray(details_[x].Variables)) {
                                            var personalDetailVariable_ = $.grep(details_[x].Variables, function(member) {
                                                return (String(member.DefinedName) == String(variableReplacement_.Variables[h].DefinedName));
                                            });

                                            if (personalDetailVariable_[0]) {
                                                value_ = personalDetailVariable_[0].Value;
                                            }
                                        }

                                        canBeModified_ = true;
                                    }
                                    var element_ = $.grep(elementsArray_, function(member) {
                                        return (String(member.DefinedName) == String(variableReplacement_.Variables[h].DefinedName));
                                    });

                                    //Push only username (type 0 ) and password (type 1)
                                    if (olFunctions.IsFilledArray(element_) && element_[0].DefinedType <= 1) {
                                        var accountObj_ = {
                                            olAdded : variableReplacement_.Variables[h].olAdded,
                                            DefinedType : element_[0].DefinedType,
                                            DefinedName : String(variableReplacement_.Variables[h].DefinedName),
                                            Value : value_,
                                            Label : label_,
                                            CanBeModified : canBeModified_
                                        };

                                        logonElement_.AccountData.push(accountObj_);
                                    }
                                }

                                //Account ID
                                if (variableReplacement_.CommonDetail) {
                                    logonElement_.Id = 'olCommonId';
                                } else if (olFunctions.IsFilledArray(variableReplacement_.PersonalDetail)) {
                                    logonElement_.Id = details_[x].Id;
                                }

                                logonArray_.push(logonElement_);
                            }
                        }

                        //New element at the end of the list, only for personal accounts if not in offline mode or not PasswordManagementType = Admin
                        if (!(olPage.Data.PageFlags && olPage.Data.PageFlags.InOfflineMode) && (logonArray_.length == 0 || !olPage.Data.PageFlags.LogonCommonNeeded) && !olPage.Data.PageFlags.PmtAdmin) {
                            //new logon
                            var newLogon_ = {
                                Id : '',
                                AccountName : '',
                                AccountNameFull : '',
                                AccountNameEdit : '',
                                AccountNameDelete : '',
                                AccountData : [],
                                Error : false
                            };

                            newLogon_.Id = 'IdNewLogon';
                            newLogon_.AccountName = olPage.Functions.GetLanguageItem('JS_ClickNewAccount');

                            for (var h = 0; h < variableReplacement_.Variables.length; h++) {
                                var canBeModified_ = false;
                                var value_ = variableReplacement_.Variables[h].Value;
                                var label_ = variableReplacement_.Variables[h].Label;

                                //Is personal element or common element
                                if (variableReplacement_.Variables[h].IsPersonal || variableReplacement_.Variables[h].IsCommon) {
                                    canBeModified_ = true;
                                    value_ = null;
                                }

                                var element_ = $.grep(elementsArray_, function(member) {
                                    return (String(member.DefinedName) == String(variableReplacement_.Variables[h].DefinedName));
                                });

                                //Push only username (type 0 ) and password (type 1)
                                if (olFunctions.IsFilledArray(element_) && element_[0].DefinedType <= 1) {
                                    var accountObj_ = {
                                        olAdded : variableReplacement_.Variables[h].olAdded,
                                        DefinedType : element_[0].DefinedType,
                                        DefinedName : String(variableReplacement_.Variables[h].DefinedName),
                                        Value : value_,
                                        Label : label_,
                                        CanBeModified : canBeModified_
                                    };
                                    newLogon_.AccountData.push(accountObj_);
                                }
                            }
                            logonArray_.push(newLogon_);
                        }
                        olPage.Content.Divs._common.LogonDataArray = logonArray_;
                    }
                    return olPage.Content.Divs._common.LogonDataArray;
                },
                SortLogonData : function(array) {
                    for (var i = 0; i < array.length - 1; i++) {
                        for (var j = i + 1; j < array.length; j++) {
                            var tmpElement_ = null;
                            if (array[i].AccountNameFull > array[j].AccountNameFull) {
                                tmpElement_ = array[j];
                                array[j] = array[i];
                                array[i] = tmpElement_;
                            }
                        }
                    }
                },
                SortApplicationData : function(array) {
                    for (var i = 0; i < array.length - 1; i++) {
                        for (var j = i + 1; j < array.length; j++) {
                            var tmpElement_ = null;
                            if (array[i].Name > array[j].Name) {
                                tmpElement_ = array[j];
                                array[j] = array[i];
                                array[i] = tmpElement_;
                            }
                        }
                    }
                },
                UpdateLogonData : function(id, parameter) {
                    try {
                        var variableReplacement_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement;

                        switch(parameter) {
                        case 'delete':
                            var newArray_ = $.grep(variableReplacement_.PersonalDetail, function(member) {
                                return (member.Id != id);
                            });
                            olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.PersonalDetail = newArray_;
                            break;
                        case 'add-update':
                            var variables_ = new Array();
                            var arrayUP_ = olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayUP;

                            for (var i = 0; i < arrayUP_.length; i++) {
                                if (arrayUP_[i].CanBeModified) {
                                    var variable_ = {
                                        DefinedName : arrayUP_[i].DefinedName,
                                        Label : arrayUP_[i].Label,
                                        Value : arrayUP_[i].Value
                                    };
                                    variables_.push(variable_);
                                }
                            }
                            if (olPage.Data.PageFlags.LogonNeeded) {
                                var title_ = $('#olTitleData').val();
                                var changedLogon_ = new Array();
                                if (variableReplacement_.PersonalDetail != null) {
                                    changedLogon_ = $.grep(variableReplacement_.PersonalDetail, function(member) {
                                        return (member.Id == id);
                                    });
                                } else {
                                    olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.PersonalDetail = [];
                                }

                                var personalDetailElement_;

                                if (changedLogon_.length > 0) {
                                    personalDetailElement_ = changedLogon_[0];
                                    //edit element data
                                    personalDetailElement_.Name = title_;
                                    personalDetailElement_.Variables = variables_;
                                } else {
                                    //add new element
                                    personalDetailElement_ = {
                                        Id : id,
                                        Name : title_,
                                        Variables : variables_
                                    };
                                    olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.PersonalDetail.push(personalDetailElement_);
                                }
                            } else if (olPage.Data.PageFlags.LogonCommonNeeded) {
                                var commonDetailElement_ = {
                                    Variables : variables_
                                };
                                olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].VariableReplacement.CommonDetail = commonDetailElement_;
                            }
                            break;
                        }
                        olPage.Messages.UpdateResponse();
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('UpdateLogonData', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                }
            },
            _internal : {
                Modal : {
                    _$backupOverlay : '',
                    _$backupModal : '',
                    _$backupToolbar : '',
                    _$backup : '',
                    _$overlay : '',
                    _$modal : '',
                    _$toolbar : '',
                    _appendToModal : function(data) {
                        var bodyOlModal_ = $('body #olModal');

                        if (bodyOlModal_.length > 0) {
                            $(olPage.Content.Divs._internal.Modal._$backupModal).remove();
                            olPage.Content.Divs._internal.Modal._$backupModal = bodyOlModal_;
                            $(olPage.Content.Divs._internal.Modal._$backup).append(olPage.Content.Divs._internal.Modal._$backupModal);
                        }
                        //TODO check this

                        $(olPage.Content.Divs._internal.Modal._$backupModal).append(data);
                    },
                    _prepareForRendering : function() {
                        try {
                            if (!olFunctions.IsFilledArray(olInjection.ElementValue._internal.Documents)) {
                                olInjection.ElementValue.SetDocuments();
                            }

                            var htmlElem_ = $(olInjection.ElementValue._internal.Documents[0]).find('html')[0];
                            var bodyElem_ = $(htmlElem_).find('body');
                            var headElem_ = $(htmlElem_).find('head');

                            if (headElem_.length == 0) {
                                var headTag_ = document.createElement('head');
                                $(htmlElem_).prepend(headTag_);
                                headElem_ = $(htmlElem_).find('head');
                            }
                            if (bodyElem_.length == 0) {
                                var bodyTag_ = document.createElement('body');
                                $('#olBackup').before(bodyTag_);
                                bodyElem_ = $(htmlElem_).find('body');
                            }
                            if ($(htmlElem_).find('#olBackup').length == 0) {
                                $(htmlElem_).append(olPage.Content.Divs._internal.Modal._$backup);
                            }

                            if ($(bodyElem_).find('#olModal').length == 0) {
                                $(bodyElem_).append($(olPage.Content.Divs._internal.Modal._$backupModal).clone(true));

                                olPage.Content.Divs._internal.UpdateDivs();
                                olPage.Content.Divs._internal.PromptComment.BindEvents();
                                olPage.Content.Divs._internal.PromptLicenceLimitReached.BindEvents();
                                olPage.Content.Divs._internal.PromptLogon.BindEvents();
                                olPage.Content.Divs._internal.PromptLogonDetails.BindEvents();
                                olPage.Content.Divs._internal.PromptMatter.BindEvents();
                                olPage.Content.Divs._internal.PromptMatterSearch.BindEvents();

                                olPage.Content.Divs._internal.ResourceTimeout.BindEvents();
                                olPage.Content.Divs._internal.AskToStorePassword.BindEvents();
                                olPage.Content.Divs._internal.Error.BindEvents();
                                olPage.Content.Divs._internal.PromptChooseApplication.BindEvents();
                            }

                            if ($(bodyElem_).find('#olOverlay').length == 0) {
                                $(bodyElem_).append($(olPage.Content.Divs._internal.Modal._$backupOverlay).clone(true));
                            }

                            if ($(bodyElem_).find('#olToolbarContainer').length == 0) {
                                $(bodyElem_).append($(olPage.Content.Divs._internal.Modal._$backupToolbar).clone(true));
                                if (olPage.Content.Divs._internal.Toolbar._initialised) {
                                    olPage.Content.Divs._internal.Toolbar.Initialise();
                                }
                                olPage.Content.Divs._internal.Toolbar.Enable(olPage.Content.Divs._internal.Toolbar._toolbarEnabled);
                                olPage.Content.Divs._internal.Toolbar.BindEvents();
                            }

                            if ($(bodyElem_).find('#olPromptLabelCalculationDiv').length == 0) {
                                $(bodyElem_).append($('#olPromptLabelCalculationDiv').clone(true));
                            }

                            if ($(headElem_).find('#olStyle').length == 0) {
                                $(headElem_).append($('#olStyle').clone());
                            }

                            if ($(headElem_).find('#olStyleIE7').length == 0 && $('#olStyleIE7').length > 0) {
                                $(headElem_).append($('#olStyleIE7').clone());
                            }

                            olPage.Content.Divs._internal.Modal.Initialise_$();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('_prepareForRendering', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    _addMaxZindex : function() {
                        olPage.Content.Divs._internal.Modal._$overlay.addClass('olMaxZ-1');
                        olPage.Content.Divs._internal.Modal._$modal.addClass('olMaxZ');
                    },
                    _removeMaxZindex : function() {
                        olPage.Content.Divs._internal.Modal._$overlay.removeClass('olMaxZ-1');
                        olPage.Content.Divs._internal.Modal._$modal.removeClass('olMaxZ');
                    },
                    Open : function(divIdToOverlay) {
                        try {
                            olPage.Content.Divs._internal.Modal._prepareForRendering();
                            olInjection.ElementValue.SetDocuments();
                            var div_ = $(olInjection.ElementValue._internal.Documents[0]).find('#' + divIdToOverlay);
                            if (div_.length == 1) {
                                $(div_[0]).show();
                                if (divIdToOverlay == 'olToolbar') {
                                    //open Toolbar
                                    //IE, jquery-prototype conflict
                                    if (olPage.Data.PageFlags) {
                                        switch(olPage.Data.PageFlags.BrowserName) {
                                        case 'iejs':
                                            if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                                olPage.Content.Divs._internal.Modal._$toolbar.show();
                                            } else {
                                                olPage.Content.Divs._internal.Modal._$toolbar.show(olOptions.General.Page.TransitionTime());
                                            }
                                            break;
                                        default:
                                            olPage.Content.Divs._internal.Modal._$toolbar.show(olOptions.General.Page.TransitionTime());
                                            break;
                                        }
                                    } else {
                                        olPage.Content.Divs._internal.Modal._$toolbar.show(olOptions.General.Page.TransitionTime());
                                    }
                                } else {
                                    //open prompt
                                    olPage.Content.Divs._internal.Modal._$modal.css({
                                        width : div_.width || 'auto',
                                        height : div_.height || 'auto'
                                    });
                                    //IE, jquery-prototype conflict
                                    if (olPage.Data.PageFlags) {
                                        switch(olPage.Data.PageFlags.BrowserName) {
                                        case 'iejs':
                                            if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                                olPage.Content.Divs._internal.Modal._$modal.show();
                                            } else {
                                                olPage.Content.Divs._internal.Modal._$modal.fadeIn(olOptions.General.Page.TransitionTime());
                                            }
                                            break;
                                        default:
                                            olPage.Content.Divs._internal.Modal._$modal.fadeIn(olOptions.General.Page.TransitionTime());
                                            break;
                                        }
                                    } else {
                                        olPage.Content.Divs._internal.Modal._$modal.fadeIn(olOptions.General.Page.TransitionTime());
                                    }

                                    olPage.Content.Divs._internal.SetMask(true);
                                    olPage.Content.Divs._internal.Modal.Center();
                                }
                            } else {
                                setTimeout(function() {
                                    olPage.Content.Divs._internal.Modal.Open(divIdToOverlay);
                                }, olOptions.General.Page.TransitionTime() + 50);
                            }
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Modal Open', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    _prepareDivSizes : function() {
                        $('#olUsernamePasswordSection').css('height', 'auto');
                        var maxPromptSize_ = window.innerHeight * 0.50;
                        var logonPromptSize_ = $('#olUsernamePasswordSection').height();

                        if (logonPromptSize_ > 0 && logonPromptSize_ > maxPromptSize_) {
                            $('#olUsernamePasswordSection').css('height', maxPromptSize_ + 'px');
                        }

                        //169 px is size of div with username password and confirm password
                        var minSize_ = 169;
                        if (logonPromptSize_ < minSize_) {
                            minSize_ = logonPromptSize_;
                            $('#olUsernamePasswordSection').css('height', minSize_ + 'px');
                        }
                    },
                    Center : function() {
                        try {
                            if (olPage.Data.PageFlags) {
                                switch(olPage.Data.PageFlags.BrowserName) {
                                case 'iejs':
                                    // try {
                                    // //BBC NEWS http://www.bbc.com/news/ (IE compatibility mode IE8)
                                    // if (olPage.Content.Divs._internal.Modal._$modal) {
                                    // var top = Math.min(window.innerHeight * 0.12, Math.max(window.innerHeight - $(olPage.Content.Divs._internal.Modal._$modal).height(), 0) / 2);
                                    // var left = Math.max(window.innerWidth - $(olPage.Content.Divs._internal.Modal._$modal).width(), 0) / 2;
                                    // //TODO check this (IE 7-9 compatibility)
                                    // if ((isNaN(top)) || (isNaN(left))) {
                                    // top = $(window).height() * 0.12;
                                    // left = Math.max($(window).width() - $(olPage.Content.Divs._internal.Modal._$modal).width(), 0) / 2;
                                    // }
                                    // $(olPage.Content.Divs._internal.Modal._$modal).css({
                                    // top : top + $(window).solbackupcrollTop(),
                                    // left : left + $(window).scrollLeft()
                                    // });
                                    // }
                                    // } catch(e) {//TODO IE 7 problem outer height
                                    // $(olPage.Content.Divs._internal.Modal._$modal).css({
                                    // top : window.innerHeight * 0.12,
                                    // left : (window.innerWidth - 400) / 2
                                    // });
                                    // }
                                    break;
                                default :
                                    var top = Math.min(window.innerHeight * 0.12, Math.max(window.innerHeight - $(olPage.Content.Divs._internal.Modal._$modal).height(), 0) / 2);
                                    var left = Math.max(window.innerWidth - $(olPage.Content.Divs._internal.Modal._$modal).width(), 0) / 2;

                                    //Correction of "top" value for the sites that have "position: relative" on body
                                    // if ($('body').offset().top && $('body').offset().top != 0) {
                                    // top = top - ($('body').offset().top);
                                    // }
                                    //
                                    // $(olPage.Content.Divs._internal.Modal._$modal).css({
                                    // top : top + $(window).scrollTop(),
                                    // left : left + $(window).scrollLeft()
                                    // });

                                    $(olPage.Content.Divs._internal.Modal._$modal).css({
                                        top : top,
                                        left : left
                                    });

                                    break;
                                }
                            } else {
                                var top = Math.min(window.innerHeight * 0.12, Math.max(window.innerHeight - $(olPage.Content.Divs._internal.Modal._$modal).height(), 0) / 2);
                                var left = Math.max(window.innerWidth - $(olPage.Content.Divs._internal.Modal._$modal).width(), 0) / 2;
                                // $(olPage.Content.Divs._internal.Modal._$modal).css({
                                // top : top + $(window).scrollTop(),
                                // left : left + $(window).scrollLeft()
                                // });

                                $(olPage.Content.Divs._internal.Modal._$modal).css({
                                    top : top,
                                    left : left
                                });

                            }
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Modal Center', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                        olPage.Content.Divs._internal.Modal._prepareDivSizes();
                    },
                    Close : function() {
                        olPage.Content.Divs._internal.Modal._$modal.hide();
                    },
                    Initialise_$ : function() {
                        olPage.Content.Divs._internal.Modal._$overlay = $('body #olOverlay');
                        olPage.Content.Divs._internal.Modal._$modal = $('body #olModal');
                        olPage.Content.Divs._internal.Modal._$toolbar = $('body #olToolbarContainer');

                        // $(olPage.Content.Divs._internal.Modal._$modal).offset({
                        // top : 0,
                        // left : 0
                        // });
                        //
                        // $(olPage.Content.Divs._internal.Modal._$toolbar).offset({
                        // top : 0,
                        // left : 0
                        // });
                        //
                        // $(olPage.Content.Divs._internal.Modal._$overlay).offset({
                        // top : 0,
                        // left : 0
                        // });
                    },
                    Initialise : function() {
                        olPage.Content.Divs._internal.Modal._$backupOverlay = $('<div id="olOverlay" ></div>');
                        olPage.Content.Divs._internal.Modal._$backupModal = $('<div id="olModal"></div>');
                        olPage.Content.Divs._internal.Modal._$backupToolbar = $('<div id="olToolbarContainer"></div>');
                        olPage.Content.Divs._internal.Modal._$backup = $('<div id="olBackup"></div>');

                        // olPage.Content.Divs._internal.Modal._$backupOverlay = $('<div id="olOverlay" class="ui-dialog olMaxZ-1"></div>');
                        // olPage.Content.Divs._internal.Modal._$backupModal = $('<div id="olModal" class="olMaxZ"></div>');
                        // olPage.Content.Divs._internal.Modal._$backupToolbar = $('<div id="olToolbarContainer" class="olMaxZ"></div>');
                        // olPage.Content.Divs._internal.Modal._$backup = $('<div id="olBackup"></div>');

                        olPage.Content.Divs._internal.Modal._$backupModal.hide();
                        olPage.Content.Divs._internal.Modal._$backupOverlay.hide();
                        olPage.Content.Divs._internal.MaskOn = false;
                        olPage.Content.Divs._internal.Modal._$backupToolbar.hide();

                        // TODO resize event, maybe move to events object like the rest
                        /*vojkan*/
                        try {
                            $(window).on('resize.modal', olPage.Content.Divs._internal.Modal.Center);
                            $(window).on('scroll', olPage.Content.Divs._internal.Modal.Center);
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Resize event error', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }

                        $('html').append(olPage.Content.Divs._internal.Modal._$backup);
                        olPage.Content.Divs._internal.Modal._$backup.append(olPage.Content.Divs._internal.Modal._$backupOverlay, olPage.Content.Divs._internal.Modal._$backupModal, olPage.Content.Divs._internal.Modal._$backupToolbar);
                    }
                },
                AlertPrompt : '',
                PromptChooseApplication : {
                    _internal : {
                        CreateDivs : function(applicationDataElement) {
                            try {
                                var appId_ = applicationDataElement.AppId;
                                var name_ = '';
                                var title_ = '';
                                var newDivLabel_ = '';

                                title_ = applicationDataElement.Name;
                                if (applicationDataElement.Name != applicationDataElement.Label) {
                                    name_ = applicationDataElement.Label;
                                    newDivLabel_ = '<div id="' + appId_ + '" class="olInherit olSelectableLabel olFont olFontBig" title="' + title_ + '">' + name_ + '</div>';
                                } else {
                                    name_ = applicationDataElement.Name;
                                    newDivLabel_ = '<div id="' + appId_ + '" class="olInherit olSelectableLabel olFont olFontBig">' + name_ + '</div>';
                                }

                                $('#olChooseApplication').append('<div id="olInterface' + appId_ + '" class="olInherit olInterfaceToggle olDivInterface olFont olFontBig olFontBlue olSelectableMenu olRounded olSelectableHeight30"><div class="olInherit  olDivInterfaceRow olDivNoWrap">' + newDivLabel_ + '</div>');

                                //on click events
                                $('#olInterface' + appId_).click({
                                    AppId : appId_,
                                    ApplicationName : title_
                                }, olPage.Content.Divs._internal.PromptChooseApplication.Events.SelectedApplication_onClick);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CreateDivs', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        PopulateApplications : function() {
                            var applicationData_ = olPage.Content.Divs._common.GetApplicationData();

                            for (var i = 0; i < applicationData_.length; i++) {
                                olPage.Content.Divs._internal.PromptChooseApplication._internal.CreateDivs(applicationData_[i]);
                            }

                            //IE7 compatibility
                            if (olPage.Data.LocalPageFlags.IECompatibilityMode == 'IE7') {
                                var height_ = 118;
                                height_ = height_ + applicationData_.length * 30;
                                $('#olPromptChooseApplication').css('height', height_ + 'px');
                            }
                            ;

                        }
                    },
                    Events : {
                        SelectedApplication_onClick : function(event) {
                            try {
                                var parameters_ = {
                                    AppId : event.data.AppId,
                                    ApplicationName : event.data.ApplicationName,
                                    ApplicationsSessionId : olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId
                                };

                                olPage.Content.Divs.Close.PromptChooseApplication(false);
                                olPage.Messages.ApplicationRequest(parameters_);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('SelectedApplication_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        Cancel_onClick : function() {
                            try {
                                $('#olCAImgChooseApplicationCancel').off('click');
                                $('#olCAImgChooseApplicationCancel').on('click', function(event) {
                                    event.stopPropagation();
                                    var applications_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].Applications;
                                    $('#' + applications_[0].AppId).click();
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Cancel_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    BindEvents : function() {
                        try {
                            olPage.Content.Divs._internal.PromptChooseApplication.Events.Cancel_onClick();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BindEvents', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                PromptComment : {
                    _internal : {
                        PopulateComments : function() {
                            try {
                                var predefinedComments_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PredefinedComments;

                                for (var i = 0; i < predefinedComments_.length; i++) {
                                    var comment_ = predefinedComments_[i].Comment;
                                    var commentUID_ = predefinedComments_[i].UID;
                                    var hoverDiv_ = 'olComInt' + commentUID_;
                                    var divElement_;

                                    var commentLabel_ = olPage.Content.Divs._internal.CreateLabels(comment_, 570, null, 'olFontNormal');

                                    if (commentLabel_.Title == commentLabel_.Text) {
                                        divElement_ = '<div id="' + hoverDiv_ + '" class="olInherit olDivInterface olFont olFontNormal olFontBlue olSelectableMenu olRounded olSelectableHeight30"><div class="olInherit olSelectableLabel olDivInterfaceRow olDivNoWrap">' + commentLabel_.Text + '</div></div>';
                                    } else {
                                        divElement_ = '<div id="' + hoverDiv_ + '" class="olInherit olDivInterface olFont olFontNormal olFontBlue olSelectableMenu olRounded olSelectableHeight30"><div class="olInherit olSelectableLabel olDivInterfaceRow olDivNoWrap" title="' + commentLabel_.Title + '">' + commentLabel_.Text + '</div></div>';
                                    }

                                    $('#olComments').append(divElement_);

                                    //click events
                                    $('#' + hoverDiv_).on('click', function() {
                                        var selectedValue_;
                                        if ($(this).find('.olDivInterfaceRow').attr('title')) {
                                            selectedValue_ = $(this).find('.olDivInterfaceRow').attr('title');
                                        } else {
                                            selectedValue_ = $(this).find('.olDivInterfaceRow').html();
                                        }
                                        if (selectedValue_) {
                                            $('#olNewComment').val(selectedValue_);
                                        } else {
                                            $('#olNewComment').val('');
                                        }
                                        $('#olNewComment').val($('#olNewComment').val());
                                        $('#olNewComment').keyup();

                                        olPage.Content.Divs.Close.PromptComment(true);
                                        olPage.Content.Divs.Load.PromptMatter(true);
                                    });
                                }

                                //IE7 compatibility
                                if (olPage.Data.LocalPageFlags.IECompatibilityMode == 'IE7') {
                                    var height_ = 104;
                                    height_ = height_ + predefinedComments_.length * 30;
                                    $('#olPromptComment ').css('height', height_ + 'px');
                                }
                                ;

                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('PopulateComments', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    Events : {
                        Cancel_onClick : function() {
                            try {
                                $('#olImgCommentCancel').off('click');
                                $('#olImgCommentCancel').on('click', function(event) {
                                    event.stopPropagation();
                                    olPage.Content.Divs.Close.PromptComment(true);
                                    olPage.Content.Divs.Load.PromptMatter(true);
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Cancel_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    BindEvents : function() {
                        try {
                            olPage.Content.Divs._internal.PromptComment.Events.Cancel_onClick();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BindEvents', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                PromptLogon : {
                    _internal : {
                        CreateDivs : function(logonDataElement) {
                            try {
                                var editImg_ = kango.io.getResourceUrl('res/olEdit16.png');
                                var deleteImg_ = kango.io.getResourceUrl('res/olCancel16.png');
                                var personalId_ = logonDataElement.Id;
                                var accountName_ = logonDataElement.AccountName;
                                var accountNameFull_ = logonDataElement.AccountNameFull;

                                if (logonDataElement.Error) {
                                    accountName_ = 'Error on Account! - ' + accountName_;
                                }

                                if (logonDataElement.Id == 'IdNewLogon') {
                                    var newDivLabel_ = '<div id="' + personalId_ + '" class="olInherit olSelectableLabel olFont olFontNormal olFontGray">' + accountName_ + '</div>';
                                    $('#olLogonAccounts').append('<div id="olInterface' + personalId_ + '" class="olInherit  olDivInterface olSelectableMenu olRounded olSelectableHeight30 olFont"><div class="olInherit olDivInterfaceRow olDivNoWrap olFont olFontNormal olFontGrey">' + newDivLabel_ + '</div>');

                                    $('#' + personalId_).data('Id', personalId_);

                                    if (olPage.Data.PageFlags && olPage.Data.PageFlags.InOfflineMode) {
                                        //hide new logon if we are in offline mode
                                        $('#olInterfaceIdNewLogon').hide();
                                    } else {
                                        //on click events if not in offline mode
                                        $('#olInterfaceIdNewLogon').click({
                                            DivId : personalId_
                                        }, olPage.Content.Divs._internal.PromptLogon.Events.Edit_onClick);
                                    }
                                } else {
                                    //Main div
                                    var buttonEdit_ = '<img id="olLogonAccountDetailsEdit" type="button" title="Edit password account" src="' + editImg_ + '" class="olInherit olImgSelectable"/>';
                                    var buttonDelete_;
                                    if (olPage.Data.PageFlags.LogonCommonNeeded) {
                                        var buttonDelete_ = '';
                                    } else {
                                        var buttonDelete_ = '<img id="olLogonAccountDetailsDelete" type="button" title="Delete password account" src="' + deleteImg_ + '" class="olInherit olImgSelectable"/>';
                                    }

                                    var divButtons_ = '';
                                    if (!olPage.Data.PageFlags.PmtAdmin) {
                                        var divButtons_ = '<div id="divBtn" class="olFloatRight olWidthAuto olDivNoWrap">' + buttonEdit_ + buttonDelete_ + '</div>';
                                    }

                                    var divLabel_ = '<div id="' + personalId_ + '" class="olInherit olSelectableLabel olFont olFontNormal olFontBlue ">' + accountName_ + '</div>';

                                    var title_ = '';
                                    if (accountNameFull_ != accountName_) {
                                        title_ = accountNameFull_;
                                    }

                                    if (title_ != '') {
                                        $('#olLogonAccounts').append('<div id="olInterface' + personalId_ + '" class="olInherit olInterfaceToggle olDivInterface olSelectableMenu olRounded olSelectableHeight30 olFont olFontNormal olFontBlue olDivNoWrap" title="' + title_ + '"><div class="olInherit  olDivInterfaceRow olDivNoWrap"><span>' + divLabel_ + '</span>' + divButtons_ + '</div></div>');
                                    } else {
                                        $('#olLogonAccounts').append('<div id="olInterface' + personalId_ + '" class="olInherit olInterfaceToggle olDivInterface olSelectableMenu olRounded olSelectableHeight30 olFont olFontNormal olFontBlue olDivNoWrap"><div class="olInherit olDivInterfaceRow olDivNoWrap"><span>' + divLabel_ + '</span>' + divButtons_ + '</div></div>');
                                    }

                                    var hoverDiv_ = 'olInterface' + personalId_;

                                    $('#' + personalId_).data('Id', personalId_);

                                    if (!((olPage.Data.PageFlags && olPage.Data.PageFlags.InOfflineMode) || olPage.Data.PageFlags.PmtAdmin)) {
                                        //on hover events if we aren't in offline mode
                                        $('#' + hoverDiv_).hover(function() {
                                            $(this).find('#divBtn').show();
                                        }, function() {
                                            $(this).find('#divBtn').hide();
                                        });
                                        //on click events if we aren't in offline mode
                                        $('#' + personalId_).click({
                                            PersonalId : personalId_
                                        }, olPage.Content.Divs._internal.PromptLogon.Events.SelectedLogon_onClick);
                                        $('#' + hoverDiv_).find('#olLogonAccountDetailsEdit').click({
                                            DivId : personalId_
                                        }, olPage.Content.Divs._internal.PromptLogon.Events.Edit_onClick);
                                        $('#' + hoverDiv_).find('#olLogonAccountDetailsDelete').click({
                                            DivId : personalId_
                                        }, olPage.Content.Divs._internal.PromptLogon.Events.Delete_onClick);
                                    } else {
                                        //on click events
                                        $('#olInterface' + personalId_).click({
                                            PersonalId : personalId_
                                        }, olPage.Content.Divs._internal.PromptLogon.Events.SelectedLogon_onClick);
                                    }

                                    //Confirmation div
                                    var buttonYes_ = '<div id="olLogonAccountConfirmYes" title="Delete password account" class="olInherit olBtnSmall olFloatLeft olWidthAuto olHeightAuto">' + olPage.Functions.GetLanguageItem('JS_YesLabel') + '</div>';
                                    var buttonNo_ = '<div id="olLogonAccountConfirmNo" title="Cancel delete password account" class="olInherit olBtnSmall olFloatRight olWidthAuto olHeightAuto" >' + olPage.Functions.GetLanguageItem('JS_NoLabel') + '</div>';
                                    var confirmDivLabel_ = '<div id="olConfirmDivLabel" class="olInherit olSelectableLabel olFontNormal olFontRed olFloatLeft">' + logonDataElement.AccountNameDelete + "'?</div>";

                                    if (title_ != '') {
                                        $('#olLogonAccounts').append('<div id="olConfirm' + personalId_ + '" class="olInherit olConfirmToggle olDivInterface olFont olFontNormal olFontBlue olSelectableMenu olRounded olSelectableHeight30" title="' + title_ + '"><div id="olConfirmContainer" class="olInherit  olDivInterfaceRow olDivNoWrap" >' + confirmDivLabel_ + buttonYes_ + buttonNo_ + '</div></div>');
                                    } else {
                                        $('#olLogonAccounts').append('<div id="olConfirm' + personalId_ + '" class="olInherit olConfirmToggle olDivInterface olFont olFontNormal olFontBlue olSelectableMenu olRounded olSelectableHeight30" ><div id="olConfirmContainer" class="olInherit olDivInterfaceRow olDivNoWrap" >' + confirmDivLabel_ + buttonYes_ + buttonNo_ + '</div></div>');
                                    }
                                    $('#olConfirm' + personalId_).hide();
                                    //.attr('display', 'none');
                                    $('#olConfirm' + personalId_).find('#olLogonAccountConfirmYes').click({
                                        PersonalId : personalId_
                                    }, olPage.Content.Divs._internal.PromptLogon.Events.ConfirmYes_onClick);
                                    $('#olConfirm' + personalId_).find('#olLogonAccountConfirmNo').click({
                                        PersonalId : personalId_
                                    }, olPage.Content.Divs._internal.PromptLogon.Events.ConfirmNo_onClick);
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CreateDivs', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        PopulateLogons : function() {
                            var logonData_ = olPage.Content.Divs._common.GetLogonData();
                            for (var i = 0; i < logonData_.length; i++) {
                                olPage.Content.Divs._internal.PromptLogon._internal.CreateDivs(logonData_[i]);
                            }

                            //IE7 compatibility
                            if (olPage.Data.LocalPageFlags.IECompatibilityMode == 'IE7') {
                                var height_ = 134;
                                height_ = height_ + logonData_.length * 30;
                                $('#olPromptLogon').css('height', height_ + 'px');
                            }
                            ;

                            return (olPage.Content.Divs._internal.PromptLogon._internal.ShowPromptLogon(logonData_));
                        },
                        ProcessInitialPrompt : function(logonData) {
                            if ( typeof ($('#olPromptLogonDetails').data('InitialPrompt')) === 'undefined' || ($('#olPromptLogonDetails').data('InitialPrompt'))) {
                                $('#olPromptLogonDetails').data('InitialPrompt', false);
                                $('#' + logonData.Id).click();
                                if (logonData.Id != 'IdNewLogon') {
                                    olPage.Content.Divs._internal.SetMask(false);
                                }
                                return false;
                            } else {
                                return true;
                            }
                        },
                        ShowPromptLogon : function(logonData) {
                            var returnValue_ = true;
                            var admin_ = olPage.Data.PageFlags.PmtAdmin;

                            if (!olPage.Data.PageFlags.PmtAutomatic) {
                                if (logonData.length <= 2 && !olInjection.InjectionHappened) {
                                    if ((olPage.Data.PageFlags && olPage.Data.PageFlags.InOfflineMode) || admin_) {
                                        // we are in offline mode or admin managed
                                        if (logonData.length == 0) {
                                            // no logon data, just set flags
                                            olPage.Data.PageFlags.LogonDone = true;
                                            olPage.Messages.Flags.LogonDone(true);
                                            olPage.Content.Divs._internal.SetMask(false);
                                            returnValue_ = false;
                                        } else if (logonData.length == 1) {
                                            returnValue_ = olPage.Content.Divs._internal.PromptLogon._internal.ProcessInitialPrompt(logonData[0]);
                                            returnValue_ = returnValue_ && !admin_;
                                        }
                                    } else {
                                        // we are not in offline mode
                                        returnValue_ = olPage.Content.Divs._internal.PromptLogon._internal.ProcessInitialPrompt(logonData[0]);
                                    }
                                } else {
                                    if (logonData.length <= 1) {
                                        returnValue_ = returnValue_ && !admin_;
                                        olPage.Data.PageFlags.LogonNeeded = olPage.Data.PageFlags.LogonNeeded && !admin_;
                                    }
                                }
                            } else {
                                //automatic pass management, only one acount can exist
                                if (logonData.length == 2) {
                                    olPage.Content.Divs._internal.PromptLogon._internal.ProcessInitialPrompt(logonData[0]);
                                } else if (logonData.length == 1) {
                                    $('#olPromptLogonDetails').data('Id', null);
                                }
                                olPage.Data.PageFlags.LogonDone = true;
                                olPage.Messages.Flags.LogonDone(true);
                                olPage.Content.Divs._internal.SetMask(false);
                                olPage.Content.Inject();
                                returnValue_ = false;
                            }

                            if (admin_ && logonData.length <= 1 || olPage.Data.PageFlags.LogonCommonNeeded) {
                                //hide manage password accounts button from toolbar menu
                                $('#olToolbarMenuLogon').hide();
                            }

                            return returnValue_;
                        }
                    },
                    Events : {
                        Cancel_onClick : function() {
                            $('#olImgLogonCancel').off('click');
                            $('#olImgLogonCancel').on('click', function(event) {
                                event.stopPropagation();
                                try {
                                    if (!olInjection.InjectionHappened) {
                                        olPage.Messages.SkipPersonalDetailsRequest();
                                    } else {
                                        olPage.Content.Divs.Close.PromptLogon(false);
                                        olPage.Content.Divs._internal.Toolbar.ResetMenu();
                                    }
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Cancel_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        Edit_onClick : function(event) {
                            try {
                                $('#olPromptLogonDetails').data('Id', event.data.DivId);
                                olPage.Content.Divs.Close.PromptLogon(true);
                                olPage.Content.Divs.Load.PromptLogonDetails(true);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Edit_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        Delete_onClick : function(event) {
                            try {
                                // Fixed ON-524
                                // $('.olConfirmToggle').hide(0, function() {
                                // $('.olInterfaceToggle').show(0);
                                // });
                                // $('#olInterface' + event.data.DivId).hide(0, function() {
                                // $('#olConfirm' + event.data.DivId).show(0);
                                // });

                                $('.olConfirmToggle').hide();
                                $('.olInterfaceToggle').show();

                                $('#olInterface' + event.data.DivId).hide();
                                $('#olConfirm' + event.data.DivId).show();

                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Delete_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        ConfirmNo_onClick : function(event) {
                            try {
                                // $('#olConfirm' + event.data.PersonalId).hide(0, function() {
                                // $('#olInterface' + event.data.PersonalId).show(0);
                                // });
                                // Fixed ON-524
                                $('#olConfirm' + event.data.PersonalId).hide();
                                $('#olInterface' + event.data.PersonalId).show();
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('ConfirmNo_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        ConfirmYes_onClick : function(event) {
                            try {
                                var parameters_ = {
                                    Id : event.data.PersonalId
                                };

                                //Changing logon array, then needs to refresh it
                                olPage.Content.Divs._common.LogonDataArray = null;
                                olPage.Messages.DeletePersonalDetailRequest(parameters_);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('ConfirmYes_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        SelectedLogon_onClick : function(event) {
                            try {
                                var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                                var variableReplacement_ = beforeNavigateResponse_.VariableReplacement;
                                var details_;

                                if (variableReplacement_.CommonDetail != null) {
                                    details_ = [variableReplacement_.CommonDetail];
                                } else if (variableReplacement_.PersonalDetail != null) {
                                    details_ = variableReplacement_.PersonalDetail;
                                }
                                var selectedAccount_ = $.grep(details_, function(member) {
                                    return (event.data.PersonalId == 'olCommonId' || member.Id == event.data.PersonalId);
                                });

                                for (var j = 0; j < selectedAccount_[0].Variables.length; j++) {
                                    var definedName_ = selectedAccount_[0].Variables[j].DefinedName;
                                    for (var i = 0; i < beforeNavigateResponse_.VariableReplacement.Variables.length; i++) {
                                        if (String(definedName_) == String(beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName)) {
                                            beforeNavigateResponse_.VariableReplacement.Variables[i].Value = selectedAccount_[0].Variables[j].Value;
                                            break;
                                        }
                                    }
                                }

                                if (!olPage.Data.PageFlags.LogonCommonNeeded && olPage.Data.PageFlags.LogonNeeded) {
                                    var parameters_ = {
                                        Id : selectedAccount_[0].Id,
                                        Details : {
                                            Name : selectedAccount_[0].Name,
                                            Variables : selectedAccount_[0].Variables
                                        }
                                    };

                                    olPage.Messages.SetCurrentPersonalDetailsRequest(parameters_);
                                } else {
                                    olPage.Data.PageFlags.LogonDone = true;
                                    olPage.Messages.Flags.LogonDone(true);
                                    olPage.Content.Divs.Close.PromptLogon(false);
                                    olPage.Content.Inject();
                                }

                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('SelectedLogon_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    BindEvents : function() {
                        try {
                            olPage.Content.Divs._internal.PromptLogon.Events.Cancel_onClick();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BindEvents', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                PromptLogonDetails : {
                    _internal : {
                        OkDisabled : false,
                        ArrayElements : [],
                        ArrayUP : [],
                        CreateDivs : function(selectedAcount) {
                            try {
                                olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayElements = ['olPromptLogonDetailsOK', 'olTitleData', 'olImgPromptLogonDetailsCancel'];
                                olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayUP = [];

                                var inputTextArea_ = '';
                                var divElement_ = '';
                                var tabindex_ = 1;
                                var heightIE7 = 0;
                                for (var j = 0; j < selectedAcount.AccountData.length; j++) {
                                    if (!selectedAcount.AccountData[j].olAdded) {
                                        switch(selectedAcount.AccountData[j].DefinedType) {
                                        case 0 :
                                            //Username
                                            var inputUserId_ = 'olUsernameData_' + j + '_' + selectedAcount.AccountData[j].DefinedName;
                                            /*IE7 compatibility*/
                                            heightIE7 = heightIE7 + 62;
                                            tabindex_++;
                                            divElement_ = '';
                                            divElement_ = divElement_ + '<div style="border-bottom: solid 1px #ccc !important;padding:2px !important" class="olInherit olFont olFontNormal olFontBlue">';
                                            divElement_ = divElement_ + '<div id="' + j + '_' + selectedAcount.AccountData[j].DefinedName + '" class="olInherit olFont olFontNormal olFontBlue olDivInterface"><div class="olInherit  olDivInterfaceRow olFont olFontNormal">';

                                            var label_ = olPage.Content.Divs._internal.CreateLabels(selectedAcount.AccountData[j].Label, 130, null, 'olFontNormal');
                                            if (label_.Title == label_.Text) {
                                                divElement_ = divElement_ + '<label class="olInherit olFont olFontNormal olFontBlue olLabelInRow olLabelSizeMid olDivNoWrap">' + label_.Text + ':</label>';
                                            } else {
                                                divElement_ = divElement_ + '<label class="olInherit olFont olFontNormal olFontBlue olLabelInRow olLabelSizeMid olDivNoWrap" title="' + label_.Title + '">' + label_.Text + ':</label>';
                                            }

                                            inputTextArea_ = '<input type="text" id="' + inputUserId_ + '" class="olInherit olInput olRounded olFont olFontNormal olFontBlue" tabindex="' + tabindex_ + '"/>';

                                            divElement_ = divElement_ + '<span class="olInherit olFont olFontNormal olFontBlue">' + inputTextArea_ + '</span></div></div>';
                                            divElement_ = divElement_ + '<br /></div><br />';
                                            $('#olUsernamePasswordSection').append(divElement_);

                                            $('[id="' + inputUserId_ + '"]').val(selectedAcount.AccountData[j].Value);
                                            if (!selectedAcount.AccountData[j].CanBeModified) {
                                                $('[id="' + inputUserId_ + '"]').attr('disabled', true);

                                                $('[id="' + inputUserId_ + '"]').attr('title', olPage.Functions.GetLanguageItem('JS_NoChangeField'));
                                                $('[id="' + inputUserId_ + '"]').addClass('olCursorNotAllowed');

                                            } else {
                                                $('[id="' + inputUserId_ + '"]').attr('disabled', false);
                                            }

                                            olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayElements.push(inputUserId_);
                                            olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayUP.push({
                                                Type : 0,
                                                DefinedName : selectedAcount.AccountData[j].DefinedName,
                                                Id : inputUserId_,
                                                Label : selectedAcount.AccountData[j].Label,
                                                CanBeModified : selectedAcount.AccountData[j].CanBeModified,
                                                Value : null
                                            });

                                            //events
                                            $('[id="' + inputUserId_ + '"]').off('keyup');
                                            $('[id="' + inputUserId_ + '"]').on('keyup', function(event) {
                                                olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckData();
                                            });

                                            $('[id="' + inputUserId_ + '"]').off('focus');
                                            $('[id="' + inputUserId_ + '"]').on('focus', function(event) {
                                                olPage.Listeners._internal.Events.ElementFocus(this);
                                            });

                                            break;
                                        case 1:
                                            //Password
                                            tabindex_++;
                                            var inputPasswordId_ = 'olPasswordData_' + j + '_' + selectedAcount.AccountData[j].DefinedName;
                                            var inputPasswordConfirmId_ = 'olPasswordConfirmData_' + j + '_' + selectedAcount.AccountData[j].DefinedName;
                                            /*IE7 compatibility*/
                                            heightIE7 = heightIE7 + 105;
                                            divElement_ = '';
                                            divElement_ = divElement_ + '<div style="border-bottom: solid 1px #ccc !important;padding:2px !important" class="olInherit olFont olFontNormal olFontBlue ">';
                                            divElement_ = divElement_ + '<div id="olPassword_' + j + '_' + selectedAcount.AccountData[j].DefinedName + '" class="olInherit olFont olFontNormal olFontBlue olDivInterface"><div class="olInherit olDivInterfaceRow olFont olFontNormal">';

                                            var label_ = olPage.Content.Divs._internal.CreateLabels(selectedAcount.AccountData[j].Label, 130, null, 'olFontNormal');
                                            if (label_.Title == label_.Text) {
                                                divElement_ = divElement_ + '<label class="olInherit olFont olFontNormal olFontBlue olLabelInRow olLabelSizeMid olDivNoWrap">' + label_.Text + ':</label>';
                                            } else {
                                                divElement_ = divElement_ + '<label class="olInherit olFont olFontNormal olFontBlue olLabelInRow olLabelSizeMid olDivNoWrap" title="' + label_.Title + '">' + label_.Text + ':</label>';
                                            }

                                            inputTextArea_ = '<input type="password" id="' + inputPasswordId_ + '" class="olInherit olInput olRounded olFont olFontNormal olFontBlue" tabindex="' + tabindex_ + '"/>';

                                            divElement_ = divElement_ + '<span class="olInherit olFont olFontNormal olFontBlue">' + inputTextArea_ + '</span></div></div><br />';

                                            //Confirm Password
                                            tabindex_++;
                                            divElement_ = divElement_ + '<div id="olPasswordConfirm_' + j + '_' + selectedAcount.AccountData[j].DefinedName + '" class="olInherit olFont olFontNormal olFontBlue olDivInterface"><div class="olInherit olDivInterfaceRow olFont olFontNormal olFontBlue ">';

                                            var confirmLabel_ = olPage.Functions.GetLanguageItem('JS_Confirm') + ' ' + selectedAcount.AccountData[j].Label;

                                            var label_ = olPage.Content.Divs._internal.CreateLabels(confirmLabel_, 130, null, 'olFontNormal');
                                            if (label_.Title == label_.Text) {
                                                divElement_ = divElement_ + '<label class="olInherit olFont olFontNormal olFontBlue olLabelInRow olLabelSizeMid olDivNoWrap">' + label_.Text + ':</label>';
                                            } else {
                                                divElement_ = divElement_ + '<label class="olInherit olFont olFontNormal olFontBlue olLabelInRow olLabelSizeMid olDivNoWrap" title="' + label_.Title + '">' + label_.Text + ':</label>';
                                            }

                                            inputTextArea_ = '<input type="password" id="' + inputPasswordConfirmId_ + '" class="olInherit olInput olRounded olFont olFontNormal olFontBlue" tabindex="' + tabindex_ + '"/>';

                                            divElement_ = divElement_ + '<span class="olInherit olFont olFontNormal olFontBlue">' + inputTextArea_ + '</span></div></div>';

                                            divElement_ = divElement_ + '<br /></div><br />';
                                            $('#olUsernamePasswordSection').append(divElement_);

                                            $('[id="' + inputPasswordId_ + '"]').val(selectedAcount.AccountData[j].Value);
                                            $('[id="' + inputPasswordConfirmId_ + '"]').val(selectedAcount.AccountData[j].Value);

                                            if (!selectedAcount.AccountData[j].CanBeModified) {
                                                $('[id="' + inputPasswordId_ + '"]').attr('disabled', true);
                                                $('[id="' + inputPasswordId_ + '"]').attr('title', olPage.Functions.GetLanguageItem('JS_NoChangeField'));
                                                $('[id="' + inputPasswordConfirmId_ + '"]').attr('disabled', true);
                                                $('[id="' + inputPasswordConfirmId_ + '"]').attr('title', olPage.Functions.GetLanguageItem('JS_NoChangeField'));
                                                $('[id="' + inputPasswordId_ + '"]').addClass('olCursorNotAllowed');
                                                $('[id="' + inputPasswordConfirmId_ + '"]').addClass('olCursorNotAllowed');
                                            } else {
                                                $('[id="' + inputPasswordId_ + '"]').attr('disabled', false);
                                                $('[id="' + inputPasswordConfirmId_ + '"]').attr('disabled', false);
                                                olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayElements.push(inputPasswordId_);
                                                olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayElements.push(inputPasswordConfirmId_);
                                            }

                                            olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayUP.push({
                                                Type : 1,
                                                DefinedName : selectedAcount.AccountData[j].DefinedName,
                                                Id : inputPasswordId_,
                                                Label : selectedAcount.AccountData[j].Label,
                                                CanBeModified : selectedAcount.AccountData[j].CanBeModified,
                                                PasswordConfirmId : inputPasswordConfirmId_,
                                                Value : null
                                            });

                                            //events
                                            $('[id="' + inputPasswordId_ + '"]').off('keyup');
                                            $('[id="' + inputPasswordId_ + '"]').on('keyup', function(event) {
                                                olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckData();
                                            });
                                            $('[id="' + inputPasswordConfirmId_ + '"]').off('keyup');
                                            $('[id="' + inputPasswordConfirmId_ + '"]').on('keyup', function(event) {
                                                olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckData();
                                            });

                                            $('[id="' + inputPasswordId_ + '"]').off('focus');
                                            $('[id="' + inputPasswordId_ + '"]').on('focus', function(event) {
                                                olPage.Listeners._internal.Events.ElementFocus(this);
                                            });

                                            $('[id="' + inputPasswordConfirmId_ + '"]').off('focus');
                                            $('[id="' + inputPasswordConfirmId_ + '"]').on('focus', function(event) {
                                                olPage.Listeners._internal.Events.ElementFocus(this);
                                            });

                                            break;
                                        }
                                    }
                                }
                                //IE7 compatibility
                                if (olPage.Data.LocalPageFlags.IECompatibilityMode == 'IE7') {
                                    var heightButtonIE7 = heightIE7 + 35;
                                    var heightLabelIE7 = heightIE7 + 60;
                                    heightIE7 = heightIE7 + 160;
                                    $('#olPromptLogonDetails').css('height', heightIE7 + 'px');
                                    $('#olPromptLogonDetailsOK').css('top', heightButtonIE7 + 'px');
                                    $('#olPromptLogonDetails #olInfoText').css('top', heightLabelIE7 + 'px');
                                }
                                ;

                                olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckData();
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CreateDivs (PromptLogonDetails)', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        CheckData : function() {
                            try {
                                olPage.Content.Divs._internal.AlertPrompt = 'olPromptLogonDetails';
                                if (olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckTitle() && olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckUP()) {
                                    var infoText_ = olPage.Functions.GetLanguageItem('JS_OKLabel');
                                    olPage.Content.Divs.SetInfoMsg(infoText_);

                                    $('#olPromptLogonDetailsOK').attr('disabled', false);
                                    return true;
                                } else {
                                    $('#olPromptLogonDetailsOK').attr('disabled', true);
                                    return false;
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CheckData', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        CheckUP : function() {
                            var ok_ = true;
                            for (var i = 0; i < olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayUP.length; i++) {
                                var currentElement_ = olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayUP[i];
                                var trimmedValue_ = $.trim($('[id="' + currentElement_.Id + '"]').val());

                                switch(currentElement_.Type) {
                                case 0:
                                    //username
                                    if (olPage.Data.PageFlags.LogonNeededForUsername || olPage.Data.PageFlags.LogonCommonNeededForUsername) {
                                        if (trimmedValue_ == '') {
                                            var infoText_ = olPage.Functions.GetLanguageItem('JS_PleaseInsert').replace('{rep1}', currentElement_.Label);
                                            olPage.Content.Divs.SetInfoMsg(infoText_);
                                            ok_ = false;
                                        } else {
                                            currentElement_.Value = trimmedValue_;
                                        }
                                    } else {
                                        currentElement_.Value = trimmedValue_;
                                    }
                                    break;
                                case 1:
                                    //password
                                    if (olPage.Data.PageFlags.LogonNeededForPassword || olPage.Data.PageFlags.LogonCommonNeededForPassword) {
                                        if (trimmedValue_ == $.trim($('[id="' + currentElement_.PasswordConfirmId + '"]').val())) {
                                            if (trimmedValue_ == '') {
                                                var infoText_ = olPage.Functions.GetLanguageItem('JS_PleaseInsert').replace('{rep1}', currentElement_.Label);
                                                olPage.Content.Divs.SetInfoMsg(infoText_);
                                                ok_ = false;
                                            } else {
                                                currentElement_.Value = trimmedValue_;
                                            }
                                        } else {
                                            var infoText_ = olPage.Functions.GetLanguageItem('JS_PasswordsWrong').replace('{rep1}', currentElement_.Label);
                                            olPage.Content.Divs.SetInfoMsg(infoText_);
                                            ok_ = false;
                                        }
                                    } else {
                                        currentElement_.Value = trimmedValue_;
                                    }
                                    break;
                                }
                                if (!ok_) {
                                    break;
                                }
                            }
                            return ok_;
                        },
                        CheckTitle : function() {
                            try {
                                var logonData_ = olPage.Content.Divs._common.GetLogonData();
                                if ($.trim($('#olTitleData').val()) != '') {
                                    var selectedAccount_ = $.grep(logonData_, function(member) {
                                        return (member.Id != $('#olPromptLogonDetails').data('Id'));
                                    });
                                    for (var i = 0; i < selectedAccount_.length; i++) {
                                        if (String($.trim($('#olTitleData').val())).toLowerCase() == String(selectedAccount_[i].AccountNameFull).toLowerCase()) {
                                            var infoText_ = olPage.Functions.GetLanguageItem('JS_AccountExist');
                                            olPage.Content.Divs.SetInfoMsg(infoText_);
                                            return false;
                                        }
                                    }
                                    return true;
                                } else {
                                    var infoText_ = olPage.Functions.GetLanguageItem('JS_InsertAccountName');
                                    olPage.Content.Divs.SetInfoMsg(infoText_);
                                    return false;
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CheckTitle', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                return false;
                            }
                        },
                        _selectedAccountId : null,
                        PopulateLogonDetails : function() {
                            try {
                                var htmlIdValue_ = $('#olPromptLogonDetails').data('Id');
                                if (htmlIdValue_) {
                                    olPage.Content.Divs._internal.PromptLogonDetails._internal._selectedAccountId = htmlIdValue_;
                                }
                                var logonData_ = olPage.Content.Divs._common.GetLogonData();
                                var selectedAccount_ = $.grep(logonData_, function(member) {
                                    return (member.Id == olPage.Content.Divs._internal.PromptLogonDetails._internal._selectedAccountId);
                                });

                                if (selectedAccount_[0].Id == 'IdNewLogon') {
                                    var infoText_ = olPage.Functions.GetLanguageItem('JS_NewAccount');

                                    $('#olPromptLogonDetails h2 label').text(infoText_);
                                    if (logonData_.length == 1) {
                                        $('#olTitleData').val(olPage.Functions.GetLanguageItem('JS_Default'));
                                    } else {
                                        $('#olTitleData').val(null);
                                    }
                                } else {
                                    $('#olPromptLogonDetails h2 label').text(selectedAccount_[0].AccountNameEdit);

                                    if (olPage.Data.PageFlags.LogonCommonNeeded) {
                                        $('#olTitleData').attr('disabled', true);
                                    }

                                    if (selectedAccount_[0].AccountName) {
                                        $('#olTitleData').val(selectedAccount_[0].AccountNameFull);
                                    } else {
                                        $('#olTitleData').val(olPage.Functions.GetLanguageItem('JS_Default'));
                                    }
                                }

                                $('#olUsernamePasswordSection').html(null);
                                olPage.Content.Divs._internal.PromptLogonDetails._internal.CreateDivs(selectedAccount_[0]);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('PopulateLogonDetails', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    Events : {
                        Cancel_onClick : function() {
                            try {
                                $('#olImgPromptLogonDetailsCancel').off('click');
                                $('#olImgPromptLogonDetailsCancel').on('click', function(event) {
                                    event.stopPropagation();
                                    var logonData_ = olPage.Content.Divs._common.GetLogonData();
                                    if (logonData_.length > 1 || (olPage.Data.PageFlags.LogonCommonNeeded && logonData_.length == 1)) {
                                        olPage.Content.Divs.Close.PromptLogonDetails(true);
                                        olPage.Content.Divs.Load.PromptLogon(true);
                                    } else {
                                        olPage.Content.Divs.Close.PromptLogonDetails(false);
                                        $('#olImgLogonCancel').click();
                                    }
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Cancel_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        OK_onClick : function() {
                            try {
                                $('#olPromptLogonDetailsOK').off('click');
                                $('#olPromptLogonDetailsOK').on('click', function(event) {
                                    if (olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckData()) {
                                        olPage.Content.Divs._internal.DisableElements(olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayElements);

                                        var newParam_ = false;
                                        var initialRequestParam_ = !olInjection.InjectionHappened;
                                        var idParam_ = $('#olPromptLogonDetails').data('Id');

                                        //Set  to null on adding new account because service is set to take NULL as param
                                        if (idParam_ == 'IdNewLogon') {
                                            idParam_ = null;
                                            newParam_ = true;
                                        }
                                        var titleValue_ = $.trim($('#olTitleData').val());
                                        //setting trimed value back into title input box
                                        $('#olTitleData').val(titleValue_);

                                        if (titleValue_ == olPage.Functions.GetLanguageItem('JS_Default')) {
                                            //titleValue_ = null; nije ovako u exploreru
                                            titleValue_ = '';
                                        }

                                        var variables_ = new Array();
                                        var arrayUP_ = olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayUP;
                                        for (var i = 0; i < arrayUP_.length; i++) {
                                            if (arrayUP_[i].CanBeModified) {
                                                var variable_ = {
                                                    Name : arrayUP_[i].DefinedName,
                                                    Value : arrayUP_[i].Value
                                                };
                                                variables_.push(variable_);
                                            }
                                        }
                                        //Send message
                                        var parameters_ = {
                                            ApplicationSessionId : olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId
                                        };

                                        if (olPage.Data.PageFlags.LogonCommonNeeded) {
                                            parameters_.Variable = variables_;
                                            switch(olPage.Data.PageFlags.BrowserName) {
                                            case 'iejs':
                                                parameters_.Variable = [];
                                                for (var p = 0; p < variables_.length; p++) {
                                                    parameters_.Variable.push(variables_[p]);
                                                }
                                                break;
                                            default :
                                                parameters_.Variable = variables_;
                                                break;
                                            }

                                            if (initialRequestParam_) {
                                                parameters_.InitialRequest = true;
                                                parameters_.InitialRequestSpecified = true;
                                            } else {
                                                parameters_.InitialRequestSpecified = false;
                                            }

                                            olPage.Messages.SetCommonDetailsRequest(parameters_);
                                        } else if (olPage.Data.PageFlags.LogonNeeded) {
                                            parameters_.Id = idParam_;
                                            parameters_.New = newParam_;
                                            parameters_.Details = {
                                                Name : titleValue_,
                                                Variables : []
                                            };

                                            switch(olPage.Data.PageFlags.BrowserName) {
                                            case 'iejs':
                                                for (var p = 0; p < variables_.length; p++) {
                                                    parameters_.Details.Variables.push(variables_[p]);
                                                }
                                                break;
                                            default :
                                                parameters_.Details.Variables = variables_;
                                                break;
                                            }

                                            if (initialRequestParam_) {
                                                parameters_.InitialRequest = true;
                                                parameters_.InitialRequestSpecified = true;
                                            } else {
                                                parameters_.InitialRequestSpecified = false;
                                            }
                                            olPage.Messages.SetPersonalDetailsRequest(parameters_);
                                        }
                                    }
                                    event.stopImmediatePropagation();
                                    event.preventDefault();
                                    event.stopPropagation();
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('OK_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        Data_onChange : function() {
                            try {
                                $('#olTitleData').off('keyup');
                                $('#olTitleData').on('keyup', function(event) {
                                    olPage.Content.Divs._internal.PromptLogonDetails._internal.CheckData();
                                });
                                $('#olTitleData').off('focus');
                                $('#olTitleData').on('focus', function(event) {
                                    olPage.Listeners._internal.Events.ElementFocus(this);
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Data_onChange', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    BindEvents : function() {
                        try {
                            olPage.Content.Divs._internal.PromptLogonDetails.Events.Cancel_onClick();
                            olPage.Content.Divs._internal.PromptLogonDetails.Events.Data_onChange();
                            olPage.Content.Divs._internal.PromptLogonDetails.Events.OK_onClick();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BindEvents', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    Initialise : function() {
                        try {
                            olPage.Content.Divs._internal.CreateLabels($('body #olTitle label').text(), 130, 'body #olTitle label', null);
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Initialise Logon Details', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                PromptLicenceLimitReached : {
                    Events : {
                        OK_onClick : function() {
                            try {
                                $('#olPromptLicenceLimitReachedOK').off('click');
                                $('#olPromptLicenceLimitReachedOK').on('click', function(event) {
                                    event.stopPropagation();
                                    olPage.Content.Divs.Close.PromptLicenceLimitReached(false);
                                    if (olPage.Data.PageFlags.LicenceLimitReachedNeeded) {
                                        olPage.Data.PageFlags.LicenceLimitReachedDone = true;
                                    }
                                    if (olPage.Data.PageFlags.PooledDetailsLimitReachedNeeded) {
                                        olPage.Data.PageFlags.PooledDetailsLimitReachedDone = true;
                                    }
                                    olPage.Messages.UpdateResponse();
                                    olPage.Content.Inject();
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('OK_onClick', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    BindEvents : function() {
                        try {
                            olPage.Content.Divs._internal.PromptLicenceLimitReached.Events.OK_onClick();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BindEvents', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    Initialise : function() {
                        try {
                            if (olPage.Data.PageFlags.LicenceLimitReachedNeeded) {

                                var appNameLabel_ = '';
                                var title_ = $.trim($('#olLicenceLimitReachedInfoText').text()) + ' (' + olPage.Data.ApplicationName + ')';
                                appNameLabel_ = olPage.Content.Divs._internal.CreateLabels(title_, 590, null, 'olFontBig');

                                if (appNameLabel_.Text != appNameLabel_.Title) {
                                    appNameLabel_.Text = appNameLabel_.Text + ')';
                                    $('#olLicenceLimitReachedInfoText').attr('title', appNameLabel_.Title);
                                }
                                $('#olLicenceLimitReachedInfoText').text(appNameLabel_.Text);
                                olPage.Content.Divs._internal.ResourceTimeout._internal._previousPrompt = olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt;
                                olPage.Content.Divs._internal.ResourceTimeout._internal._previousMask = olPage.Content.Divs._internal.MaskOn;

                                // $('#olLicenceLimitReachedInfoText').text($('#olLicenceLimitReachedInfoText').text() + ' (' + olPage.Data.ApplicationName + ')');
                                $('#olLicenceLimitReachedInfoText').show();
                                $('#olLicenceLimitReachedInfoSubText').show();

                                $('#olPooledLicenceLimitReachedInfoText').hide();
                                $('#olPooledLicenceLimitReachedInfoSubText').hide();
                            }

                            if (olPage.Data.PageFlags.PooledDetailsLimitReachedNeeded) {

                                var appNameLabel_ = '';
                                var title_ = $.trim($('#olPooledLicenceLimitReachedInfoText').text()) + ' (' + olPage.Data.ApplicationName + ')';
                                appNameLabel_ = olPage.Content.Divs._internal.CreateLabels(title_, 590, null, 'olFontBig');

                                if (appNameLabel_.Text != appNameLabel_.Title) {
                                    appNameLabel_.Text = appNameLabel_.Text + ')';
                                    $('#olPooledLicenceLimitReachedInfoText').attr('title', appNameLabel_.Title);
                                }
                                $('#olPooledLicenceLimitReachedInfoText').text(appNameLabel_.Text);

                                // $('#olPooledLicenceLimitReachedInfoText').text($('#olPooledLicenceLimitReachedInfoText').text() + ' (' + $.trim(olPage.Data.ApplicationName) + ')');
                                $('#olPooledLicenceLimitReachedInfoText').show();
                                $('#olPooledLicenceLimitReachedInfoSubText').show();

                                $('#olLicenceLimitReachedInfoText').hide();
                                $('#olLicenceLimitReachedInfoSubText').hide();
                            }
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Initialise Licence limit reached', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                PromptMatter : {
                    _internal : {
                        ArrayElements : ['olMatterOK', 'olNewMatter', 'olMatterSearch', 'olMatterList', 'olTimekeeperList', 'olNewTimekeeper', 'olCommentSelect', 'olNewComment'],
                        CopyMatterListValue : function() {
                            try {
                                if ($('select#olMatterList').val()) {
                                    var selectedValue_ = $('select#olMatterList').val();
                                    if (selectedValue_) {
                                        $('#olNewMatter').val(selectedValue_);
                                    } else {
                                        $('#olNewMatter').val('');
                                    }
                                    $('#olNewMatter').select().focus();
                                    $("#olNewMatter").val($.trim($("#olNewMatter").val()));
                                    $("#olNewMatter").keyup();

                                    $('#olMatterList').val([]);
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CopyMatterListValue', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        ValidatingInterval : null,
                        ValidatingInfoMsg : '',
                        SetValidatingInterval : function() {
                            olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInterval = setInterval(function() {
                                if (olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInfoMsg == '') {
                                    olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInfoMsg = olPage.Functions.GetLanguageItem('JS_Validating');
                                }
                                if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt == 'olPromptMatter') {
                                    if (olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInfoMsg.length < String(olPage.Functions.GetLanguageItem('JS_Validating')).length + 5) {
                                        olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInfoMsg += '.';
                                    } else {
                                        olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInfoMsg = olPage.Functions.GetLanguageItem('JS_Validating');
                                    }
                                    olPage.Content.Divs.SetInfoMsg(olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInfoMsg);
                                } else {
                                    olPage.Content.Divs._internal.PromptMatter._internal.ClearValidatingInterval();
                                }
                            }, 500);
                        },
                        ClearValidatingInterval : function() {
                            try {
                                olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInfoMsg = olPage.Functions.GetLanguageItem('JS_Validating');
                                clearInterval(olPage.Content.Divs._internal.PromptMatter._internal.ValidatingInterval);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('ClearValidatingInterval', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        CheckData : function(matter, timekeeper, comment) {
                            try {
                                olPage.Content.Divs._internal.AlertPrompt = 'olPromptMatter';

                                olPage.Content.Divs._internal.PromptMatter._internal.SetMatterFlags(matter, timekeeper, comment);
                                if (olPage.Content.Divs._internal.PromptMatter._internal.CheckMatter() && olPage.Content.Divs._internal.PromptMatter._internal.CheckTimekeeper() && olPage.Content.Divs._internal.PromptMatter._internal.CheckComment()) {
                                    if (!olInjection.InjectionHappened || olPage.Data.PageFlags.MatterChanged || olPage.Data.PageFlags.TimekeeperChanged) {
                                        $('#olMatterOK').attr('disabled', false);
                                        olPage.Listeners._internal.Events._processingKey = false;
                                        olPage.Content.Divs.SetInfoMsg('');
                                        return true;
                                    } else {
                                        $('#olMatterOK').attr('disabled', true);
                                        olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_NoChange'));
                                        return false;
                                    }
                                } else {
                                    $('#olMatterOK').attr('disabled', true);
                                    return false;
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CheckData', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        CheckMatter : function() {
                            try {
                                if (olPage.Data.PageFlags.MatterNeeded) {
                                    var currentMatterValue_ = $.trim($('#olNewMatter').val());
                                    if (currentMatterValue_) {
                                        olPage.Content.Divs.SetInfoMsg('');
                                        return true;
                                    } else {
                                        olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_InsertMatterNumber'));
                                        return false;
                                    }
                                } else {
                                    olPage.Content.Divs.SetInfoMsg('');
                                    return true;
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CheckMatter', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        CheckTimekeeper : function() {
                            try {
                                if (olPage.Data.PageFlags.PersonalCodeNeeded) {
                                    var timeKeeper_ = $.trim($('#olNewTimekeeper').val());
                                    if (olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].TimekeeperLengthSpecified) {
                                        if (timeKeeper_.length >= olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].TimekeeperLength) {
                                            olPage.Content.Divs.SetInfoMsg('');
                                            return true;
                                        } else {
                                            olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_TimekeeperShort'));
                                            return false;
                                        }
                                    } else {
                                        olPage.Content.Divs.SetInfoMsg('');
                                        return true;
                                    }
                                } else {
                                    olPage.Content.Divs.SetInfoMsg('');
                                    return true;
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CheckTimekeeper', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        CheckComment : function() {
                            try {
                                if (olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].RequireComment || olPage.Data.PageFlags.CommentRequest) {
                                    var comment_ = $.trim($('#olNewComment').val());
                                    var bnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                                    if (olFunctions.IsFilledArray(bnr_.PredefinedComments)) {
                                        // predefined comments
                                        if (comment_.length > 0) {
                                            return true;
                                        } else {
                                            olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_SelectComment'));
                                            return false;
                                        }
                                    } else {
                                        // manual comments
                                        if (olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].CommentLengthSpecified && olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].CommentLength != 0) {
                                            if (comment_.length >= olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].CommentLength) {
                                                return true;
                                            } else {
                                                olPage.Content.Divs.SetInfoMsg(olPage.Functions.GetLanguageItem('JS_CommentShort'));
                                                return false;
                                            }
                                        } else {
                                            return true;
                                        }
                                    }
                                } else {
                                    return true;
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CheckComment', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                return false;
                            }
                        },
                        SetMatterFlags : function(matter, timekeeper, comment) {
                            try {
                                if (olPage.Data.PageFlags.MatterNeeded) {
                                    var currentMatterValue_ = $.trim(matter);
                                    if (!currentMatterValue_) {
                                        currentMatterValue_ = $.trim($('#olNewMatter').val());
                                    }
                                    if (currentMatterValue_) {
                                        var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                                        if (beforeNavigateResponse_.VariableReplacement && olFunctions.IsFilledArray(beforeNavigateResponse_.VariableReplacement.Variables)) {
                                            var previousMatterValue_ = '';
                                            if (olPage.Data.PageFlags.MatterNumber) {
                                                previousMatterValue_ = olPage.Data.PageFlags.MatterNumber;
                                            }
                                            olPage.Data.PageFlags.MatterChanged = (!!olInjection.InjectionHappened && (previousMatterValue_ != currentMatterValue_));
                                        }
                                    }
                                }
                                if (olPage.Data.PageFlags.PersonalCodeNeeded) {
                                    var timeKeeper_ = $.trim(timekeeper);
                                    if (timeKeeper_ == null || timeKeeper_ == '') {
                                        timeKeeper_ = $.trim($('#olNewTimekeeper').val());
                                    }
                                    if (timeKeeper_ != null) {
                                        olPage.Data.PageFlags.TimekeeperChanged = (!!olInjection.InjectionHappened && (timeKeeper_ != olPage.Data.PageFlags.TimekeeperNumber));
                                    }
                                }
                                if (olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].RequireComment || olPage.Data.PageFlags.CommentRequest) {
                                    var comment_ = $.trim(comment);
                                    if (comment_ == null || comment_ == '') {
                                        comment_ = $.trim($('#olNewComment').val());
                                    }
                                    if (comment_ != null) {
                                        olPage.Data.PageFlags.CommentChanged = (olInjection.InjectionHappened && (comment_ != olPage.Data.PageFlags.Comment));
                                    }
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('SetMatterFlags', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        CopyTimekeeperListValue : function() {
                            try {
                                var selectedValue_ = $('select#olTimekeeperList').val();
                                if (selectedValue_) {
                                    $('#olNewTimekeeper').val(selectedValue_);
                                } else {
                                    $('#olNewTimekeeper').val('');
                                }
                                $('#olNewTimekeeper').select().focus();
                                $('#olNewTimekeeper').val($('#olNewTimekeeper').val());
                                $("#olNewTimekeeper").keyup();

                                $('#olTimekeeperList').val([]);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CopyTimekeeperListValue', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        EnableComment : function() {
                            try {
                                olPage.Content.Divs._internal.EnableElements(['olCommentSelect', 'olMatterReset']);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('EnableComment', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        FillMatterValues : function() {
                            var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                            olPage.Data.PageFlags.MatterNumber = $.trim($('#olNewMatter').val());
                            if (olPage.Data.PageFlags.PersonalCodeNeeded) {
                                olPage.Data.PageFlags.TimekeeperNumber = $.trim($('#olNewTimekeeper').val());
                            } else {
                                olPage.Data.PageFlags.TimekeeperNumber = null;
                            }
                            if (beforeNavigateResponse_.RequireComment || olPage.Data.PageFlags.CommentRequest) {
                                olPage.Data.PageFlags.Comment = $.trim($('#olNewComment').val());
                            } else {
                                olPage.Data.PageFlags.Comment = null;
                            }

                            var toolTip_ = $.trim(olPage.Data.ApplicationName);
                            if (beforeNavigateResponse_.ShowActiveMatterNumberSpecified && beforeNavigateResponse_.ShowActiveMatterNumber) {
                                toolTip_ = toolTip_ + ' ' + olPage.Data.PageFlags.MatterNumber;
                            }
                            if (toolTip_ && toolTip_ != '') {
                                olPage.Content.Divs._internal.Toolbar._internal.SetTooltip(toolTip_);
                            } else {
                                olPage.Content.Divs._internal.Toolbar._internal.SetTooltip('Onelog');
                            }
                        },
                        HideComment : function() {
                            try {
                                $('#olMatterDivComment').hide();
                                $('#olMatterReset').hide().attr('olStyleFixed', 'display: none');
                                $('#olNewComment').removeAttr('tabindex');
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('HideComment', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        HideTimekeeper : function() {
                            try {
                                $('#olMatterDivTimekeeper').hide();
                                $('#olNewTimekeeper').removeAttr('tabindex');
                                $('#olNewComment').attr('tabindex', 2);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('HideTimekeeper', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        ShowComment : function() {
                            try {
                                $('#olMatterReset').show().attr('olStyleFixed', 'display: inline-block');
                                //IE, jquery-prototype conflict
                                switch(olPage.Data.PageFlags.BrowserName) {
                                case 'iejs':
                                    if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                        $('#olMatterDivComment').show();
                                    } else {
                                        $('#olMatterDivComment').show(olOptions.General.Page.TransitionTime());
                                    }
                                    break;
                                default:
                                    $('#olMatterDivComment').show(olOptions.General.Page.TransitionTime());
                                    break;
                                }
                                //$('#olMatterDivComment').show(olOptions.General.Page.TransitionTime());
                                olPage.Content.Divs._internal.PromptMatter._internal.ClearValidatingInterval();
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('ShowComment', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        PopulateMatterDropDownList : function() {
                            try {
                                $('#olMatterList').empty();
                                var itemsToAdd_ = olPage.Data.PageInfo.Response.CheckMatterResponse.MatterDetails;
                                for (var i = 0; i < itemsToAdd_.length; i++) {
                                    var option_ = olPage.Content.Divs._internal.CreateLabels(itemsToAdd_[i].MatterNumber, 260, null, 'olFontNormal');
                                    var value_ = itemsToAdd_[i].MatterNumber;
                                    var dispText_ = option_.Text;
                                    var title_ = option_.Title;
                                    if (dispText_ == title_) {
                                        $('#olMatterList').append('<option value="' + value_ + '">' + dispText_ + '</option>');
                                    } else {
                                        $('#olMatterList').append('<option value="' + value_ + '" title="' + title_ + '">' + dispText_ + '</option>');
                                    }
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('PopulateMatterDropDownList', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        UnselectMatterDropDownList : function() {
                            try {
                                $('#olMatterList').val([]);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('UnselectMatterDropDownList', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        PopulateTimekeeperDropDownList : function() {
                            try {
                                $('#olTimekeeperList').empty();
                                var itemsToAdd_ = olPage.Data.PageInfo.Response.GetLocalPersonalCodeListResponse.LocalPersonalCodes;
                                for (var i = 0; i < itemsToAdd_.length; i++) {
                                    if (itemsToAdd_[i] && itemsToAdd_[i] != '') {
                                        var option_ = olPage.Content.Divs._internal.CreateLabels(itemsToAdd_[i], 260, null, 'olFontNormal');
                                        var value_ = itemsToAdd_[i];
                                        var dispText_ = option_.Text;
                                        var title_ = option_.Title;
                                        if (dispText_ == title_) {
                                            $('#olTimekeeperList').append('<option value="' + value_ + '">' + dispText_ + '</option>');
                                        } else {
                                            $('#olTimekeeperList').append('<option value="' + value_ + '" title="' + title_ + '">' + dispText_ + '</option>');
                                        }
                                    }
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('PopulateTimekeeperDropDownList', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        UnselectTimekeeperDropDownList : function() {
                            try {
                                $('#olTimekeeperList').val([]);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('UnselectTimekeeperDropDownList', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        UpdateVariables : function() {
                            try {
                                var matterFilled_ = false;
                                var timekeeperFilled_ = false;
                                var commentFilled_ = false;
                                var matterValue_ = $.trim($('#olNewMatter').val());
                                var timekeeperValue_ = $.trim($('#olNewTimekeeper').val());
                                var commentValue_ = '';
                                var definedMatterName_ = 'matter';
                                var definedTimeKeeperName_ = 'timekeeper';
                                var definedCommentName_ = 'comment';

                                var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                                if (beforeNavigateResponse_.RequireComment || olPage.Data.PageFlags.CommentRequest) {
                                    commentValue_ = $.trim($('#olNewComment').val());
                                }

                                if (beforeNavigateResponse_.VariableReplacement && olFunctions.IsFilledArray(beforeNavigateResponse_.VariableReplacement.Variables)) {
                                    for (var i = 0; i < beforeNavigateResponse_.VariableReplacement.Variables.length; i++) {
                                        if ($.inArray(String(beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName), olPage.Data.PageInfo.DefinedNames.MatterArray) > -1) {
                                            beforeNavigateResponse_.VariableReplacement.Variables[i].Value = matterValue_;
                                            definedMatterName_ = beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName;
                                            matterFilled_ = true;
                                        }
                                        if ($.inArray(String(beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName), olPage.Data.PageInfo.DefinedNames.TimeKeeperArray) > -1) {
                                            beforeNavigateResponse_.VariableReplacement.Variables[i].Value = timekeeperValue_;
                                            definedTimeKeeperName_ = beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName;
                                            timekeeperFilled_ = true;
                                        }
                                        if ($.inArray(String(beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName), olPage.Data.PageInfo.DefinedNames.CommentArray) > -1) {
                                            beforeNavigateResponse_.VariableReplacement.Variables[i].Value = commentValue_;
                                            definedCommentName_ = beforeNavigateResponse_.VariableReplacement.Variables[i].DefinedName;
                                            commentFilled_ = true;
                                        }
                                    }
                                }
                                olPage.Messages.UpdateResponse();
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('UpdateVariables', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        RequestNewSession : function() {
                            try {
                                return (olPage.Data.PageFlags.MatterChanged || olPage.Data.PageFlags.TimekeeperChanged);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('RequestNewSession', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        SetCommentSelect : function() {
                            try {
                                $('#olNewComment').show();
                                $('#olNewComment').attr('disabled', true);
                                //IE7 compatibility
                                if (olPage.Data.LocalPageFlags.IECompatibilityMode == 'IE7') {
                                    $('#olNewComment').css('max-width', '225px');
                                    $('#olNewComment').css('min-width', '225px');
                                }
                                $('#olCommentSelect').show().attr('olStyleFixed', 'display: inline-block');
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('SetCommentSelect', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        SetCommentInput : function() {
                            try {
                                $('#olNewComment').show();
                                $('#olNewComment').attr('disabled', false);
                                //IE7 compatibility
                                if (olPage.Data.LocalPageFlags.IECompatibilityMode == 'IE7') {
                                    $('#olNewComment').css('max-width', '259px');
                                    $('#olNewComment').css('min-width', '259px');
                                }
                                $('#olCommentSelect').hide().attr('olStyleFixed', 'display: none');
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('SetCommentInput', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    Events : {
                        Cancel_onClick : function() {
                            $('#olImgMatterCancel').off('click');
                            $('#olImgMatterCancel').on('click', function(event) {
                                event.stopPropagation();
                                try {
                                    var skipMatterDetails_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].SkipMatterDetails;
                                    if (!olInjection.InjectionHappened && skipMatterDetails_) {
                                        olPage.Messages.SkipMatterDetailsRequest();
                                        olPage.Data.PageFlags.MatterDone = true;
                                        olPage.Data.PageFlags.MatterSkiped = true;
                                        olPage.Messages.Flags.MatterDone(true);
                                        olPage.Content.Divs.Close.PromptMatter(true);
                                        olPage.Content.Inject();
                                        olPage.Content.Divs._internal.EnableElements(olPage.Content.Divs._internal.PromptMatter._internal.ArrayElements);
                                        olPage.Content.Divs._internal.PromptMatter.Initialise();
                                    } else {
                                        olPage.Content.Divs.Close.PromptMatter(false);
                                        olPage.Content.Divs._internal.Toolbar.ResetMenu();
                                        olPage.Content.Divs._internal.EnableElements(olPage.Content.Divs._internal.PromptMatter._internal.ArrayElements);
                                        olPage.Content.Divs._internal.PromptMatter.Initialise();
                                        olPage.Content.Divs._internal.UpdateDivs();
                                    }
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Cancel_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        Data_onChange : function() {
                            try {
                                // keyup
                                $('#olNewMatter').off('keyup');
                                $('#olNewMatter').on('keyup', function(event) {
                                    olPage.Content.Divs._internal.PromptMatter._internal.CheckData(event.target.value, null, null);
                                });
                                $('#olNewTimekeeper').off('keyup');
                                $('#olNewTimekeeper').on('keyup', function(event) {
                                    olPage.Content.Divs._internal.PromptMatter._internal.CheckData(null, event.target.value, null);
                                });
                                $('#olNewComment').off('keyup');
                                $('#olNewComment').on('keyup', function(event) {
                                    olPage.Content.Divs._internal.PromptMatter._internal.CheckData(null, null, event.target.value);
                                });

                                // focus
                                $('#olNewMatter').off('focus');
                                $('#olNewMatter').on('focus', function(event) {
                                    olPage.Listeners._internal.Events.ElementFocus(this);
                                });
                                $('#olNewTimekeeper').off('focus');
                                $('#olNewTimekeeper').on('focus', function(event) {
                                    olPage.Listeners._internal.Events.ElementFocus(this);
                                });
                                $('#olNewComment').off('focus');
                                $('#olNewComment').on('focus', function(event) {
                                    olPage.Listeners._internal.Events.ElementFocus(this);
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Data_onChange', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        MatterList_onChange : function() {
                            $('#olMatterList').off('change');
                            $('#olMatterList').on('change', function() {
                                try {
                                    olPage.Content.Divs._internal.PromptMatter._internal.CopyMatterListValue();
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('MatterList_onChange', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        TimekeeperList_onChange : function() {
                            $('#olTimekeeperList').off('change');
                            $('#olTimekeeperList').on('change', function() {
                                try {
                                    olPage.Content.Divs._internal.PromptMatter._internal.CopyTimekeeperListValue();
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('TimekeeperList_onChange', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        OK_onClick : function() {
                            $('#olMatterOK').off('click');
                            $('#olMatterOK').on('click', function(event) {
                                event.stopPropagation();
                                try {
                                    if (olPage.Content.Divs._internal.PromptMatter._internal.CheckData()) {
                                        olPage.Content.Divs._internal.PromptMatter._internal.SetValidatingInterval();

                                        olPage.Content.Divs._internal.DisableElements(olPage.Content.Divs._internal.PromptMatter._internal.ArrayElements);

                                        var selectedMatterValue_ = $.trim($('#olNewMatter').val());
                                        var selectedTimekeepValue_ = null;
                                        var selectedCommentValue_ = null;
                                        var selectedPredefinedComment_ = null;

                                        var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];

                                        if (olPage.Data.PageFlags.PersonalCodeNeeded) {
                                            selectedTimekeepValue_ = $.trim($('#olNewTimekeeper').val());
                                        }

                                        if (beforeNavigateResponse_.RequireComment || olPage.Data.PageFlags.CommentRequest) {
                                            selectedCommentValue_ = $.trim($('#olNewComment').val());
                                            if (olFunctions.IsFilledArray(olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PredefinedComments)) {
                                                selectedPredefinedComment_ = $.grep(olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].PredefinedComments, function(member) {
                                                    return (member.Comment == selectedCommentValue_);
                                                });
                                                selectedPredefinedComment_ = selectedPredefinedComment_[0];
                                            }
                                        }

                                        var requestNewSession_ = olPage.Content.Divs._internal.PromptMatter._internal.RequestNewSession();
                                        var RequestNewSessionSpecified_ = true;

                                        var parameters_ = {
                                            Comment : selectedCommentValue_,
                                            MatterName : null,
                                            MatterNumber : selectedMatterValue_,
                                            PersonalCode : selectedTimekeepValue_,
                                            PredefinedComment : selectedPredefinedComment_,
                                            RequestNewSession : requestNewSession_,
                                            RequestNewSessionSpecified : RequestNewSessionSpecified_
                                        };

                                        if (olPage.Data.PageFlags.CommentRequest) {
                                            if (requestNewSession_) {
                                                olPage.Messages.SetCommentEditRequest(parameters_);
                                            } else {
                                                olPage.Messages.SetCommentRequest(parameters_);
                                            }
                                        } else {
                                            olPage.Messages.ValidateSelectedMatterRequest(parameters_);
                                        }
                                    }
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('OK_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        CommentSelect_onClick : function() {
                            $('#olCommentSelect').off('click');
                            $('#olCommentSelect').on('click', function(event) {
                                event.stopPropagation();
                                try {
                                    olPage.Content.Divs.Close.PromptMatter(true);
                                    olPage.Content.Divs.Load.PromptComment(true);
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('CommentSelect_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        Search_onClick : function() {
                            $('#olMatterSearch').off('click');
                            $('#olMatterSearch').on('click', function(event) {
                                event.stopPropagation();
                                try {
                                    $('#olLabMatterNumber').show();
                                    $('#olLabMatterName').hide();
                                    $('#olMatterSearchType').val('mNumber');

                                    $('#olSearchLabel').text(olPage.Functions.GetLanguageItem('JS_MatterNumberSearch'));

                                    olPage.Content.Divs.Close.PromptMatter(true);
                                    olPage.Content.Divs.Load.PromptMatterSearch(true, $.trim($('#olNewMatter').val()));
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.Request(false);
                                    olPage.Content.Divs._internal.ChangeImageSources();

                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Search_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        Reset_onClick : function() {
                            $('#olMatterReset').off('click');
                            $('#olMatterReset').on('click', function(event) {
                                event.stopPropagation();
                                try {
                                    olPage.Content.Divs.Close.PromptMatter(true);
                                    olPage.Content.Divs._internal.EnableElements(olPage.Content.Divs._internal.PromptMatter._internal.ArrayElements);
                                    olPage.Content.Divs._internal.PromptMatter.Initialise();
                                    olPage.Content.Divs._internal.PromptMatter._internal.CheckData();
                                    olPage.Content.Divs.Load.PromptMatter(true);
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Reset_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        }
                    },
                    BindEvents : function() {
                        try {
                            olPage.Content.Divs._internal.PromptMatter.Events.Cancel_onClick();
                            olPage.Content.Divs._internal.PromptMatter.Events.CommentSelect_onClick();
                            olPage.Content.Divs._internal.PromptMatter.Events.Data_onChange();
                            olPage.Content.Divs._internal.PromptMatter.Events.MatterList_onChange();
                            olPage.Content.Divs._internal.PromptMatter.Events.TimekeeperList_onChange();
                            olPage.Content.Divs._internal.PromptMatter.Events.OK_onClick();
                            olPage.Content.Divs._internal.PromptMatter.Events.Search_onClick();
                            olPage.Content.Divs._internal.PromptMatter.Events.Reset_onClick();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BindEvents', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    Initialise : function() {
                        try {
                            if (olPage.Data.PageInfo.Response.CheckMatterResponse && olPage.Data.PageInfo.Response.CheckMatterResponse.MatterDetails) {
                                //olPage.Content.Divs._internal.PromptMatter._internal.PopulateMatterDropDownList('olMatterList', olPage.Data.PageInfo.Response.CheckMatterResponse.MatterDetails);
                                olPage.Content.Divs._internal.PromptMatter._internal.PopulateMatterDropDownList();
                                olPage.Content.Divs._internal.PromptMatter._internal.UnselectMatterDropDownList();
                            }

                            var bnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                            if (olPage.Data.PageFlags.PersonalCodeNeeded) {
                                if (olPage.Data.PageInfo.Response.GetLocalPersonalCodeListResponse && olPage.Data.PageInfo.Response.GetLocalPersonalCodeListResponse.LocalPersonalCodes) {
                                    // olPage.Content.Divs._internal.PromptMatter._internal.PopulateTimekeeperDropDownList('olTimekeeperList', olPage.Data.PageInfo.Response.GetLocalPersonalCodeListResponse.LocalPersonalCodes);
                                    olPage.Content.Divs._internal.PromptMatter._internal.PopulateTimekeeperDropDownList();
                                    var timekeeperValue_ = $.trim($('#olNewTimekeeper').val());
                                    if (!timekeeperValue_ && !($('#olTimekeeperInfo').data('InitialPromptForTimeKeeperDone'))) {
                                        $('#olTimekeeperInfo').data('InitialPromptForTimeKeeperDone', true);
                                        olPage.Content.Divs._internal.PromptMatter._internal.CopyTimekeeperListValue();
                                    }
                                    olPage.Content.Divs._internal.PromptMatter._internal.UnselectTimekeeperDropDownList();
                                    if (bnr_.TimekeeperLengthSpecified && bnr_.TimekeeperLength != 0) {
                                        $('#olTimekeeperInfo').text($('#olTimekeeperInfo').text().replace('{rep1}', bnr_.TimekeeperLength));
                                    } else {
                                        $('#olTimekeeperInfo').text('');
                                    }
                                }
                            } else {
                                olPage.Content.Divs._internal.PromptMatter._internal.HideTimekeeper();

                            }
                            if (bnr_.RequireComment) {
                                if (olFunctions.IsFilledArray(bnr_.PredefinedComments)) {
                                    olPage.Content.Divs._internal.PromptMatter._internal.SetCommentSelect();
                                    $('#olCommentInfo').text(olPage.Functions.GetLanguageItem('JS_SelectComment'));
                                } else {
                                    olPage.Content.Divs._internal.PromptMatter._internal.SetCommentInput();
                                    if (bnr_.CommentLengthSpecified && bnr_.CommentLength != 0) {
                                        $('#olCommentInfo').text($('#olCommentInfo').text().replace('{rep1}', bnr_.CommentLength));
                                    } else {
                                        $('#olCommentInfo').text('');
                                    }
                                }
                            } else {
                                olPage.Content.Divs._internal.PromptMatter._internal.HideComment();
                            }

                            $('#olMatterReset').hide().attr('olStyleFixed', 'display: none');
                            olPage.Data.PageFlags.CommentRequest = false;

                            if (olPage.Data.PageFlags && olPage.Data.PageFlags.InOfflineMode) {
                                // hide this button if we are in offline mode
                                $('#olMatterSearch').hide().attr('olStyleFixed', 'display: none');
                                ;
                            }

                            //At the end so the changes in text values for timekeeper and comment would be taken into consideration
                            olPage.Content.Divs._internal.Modal._prepareForRendering();

                            olPage.Content.Divs._internal.CreateLabels(null, 130, 'body #olMatterDivSelectLabel', null);
                            olPage.Content.Divs._internal.CreateLabels(null, 130, 'body #olMatterDivTimekeeperLabel', null);
                            olPage.Content.Divs._internal.CreateLabels(null, 392, 'body #olTimekeeperInfo', null);
                            olPage.Content.Divs._internal.CreateLabels(null, 130, 'body #olMatterDivCommentLabel', null);
                            olPage.Content.Divs._internal.CreateLabels(null, 392, 'body #olCommentInfo', null);
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Initialise Prompt matter', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                PromptMatterSearch : {
                    _internal : {
                        SelectedMatterNumber : '',
                        SelectedMatterName : '',
                        Table : null,
                        TableInitialised : false,
                        InputTimerStarted : false,
                        PageTimerStarted : false,
                        PageTotal : 0,
                        RequestPageNumberSpecified : false,
                        checkMatterResponse_ : {},
                        ClearSearchTable : function() {
                            try {
                                olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_ = {};
                                olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_.MatterDetails = [];
                                olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_.PageCount = 0;
                                olPage.Content.Divs._internal.PromptMatterSearch._internal.CreateSearchTable(olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('ClearSearchTable', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        SortTableElements : function() {
                            var matterDetails_ = olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_.MatterDetails;
                            var asc_ = true;
                            if ($('#olFirstColumnName').data('olSort') == 'desc' || $('#olSecondColumnName').data('olSort') == 'desc') {
                                asc_ = false;
                            }

                            var mNumber_ = ($('#olMatterSearchType').val() == 'mNumber');

                            if (matterDetails_) {
                                var swaped_;
                                do {
                                    swaped_ = false;
                                    if (mNumber_) {
                                        for (var i = 0; i <= matterDetails_.length - 2; i++) {
                                            if (matterDetails_[i].MatterNumber > matterDetails_[i + 1].MatterNumber) {
                                                olPage.Functions.SwapElements(matterDetails_, i, i + 1);
                                                swaped_ = true;
                                            }
                                        }
                                        if (!swaped_) {
                                            break;
                                        }
                                        for (var i = matterDetails_.length - 2; i >= 0; i--) {
                                            if (matterDetails_[i].MatterNumber > matterDetails_[i + 1].MatterNumber) {
                                                olPage.Functions.SwapElements(matterDetails_, i, i + 1);
                                                swaped_ = true;
                                            }
                                        }
                                    } else {
                                        for (var i = 0; i <= matterDetails_.length - 2; i++) {
                                            if (matterDetails_[i].MatterName > matterDetails_[i + 1].MatterName) {
                                                olPage.Functions.SwapElements(matterDetails_, i, i + 1);
                                                swaped_ = true;
                                            }
                                        }
                                        if (!swaped_) {
                                            break;
                                        }
                                        for (var i = matterDetails_.length - 2; i >= 0; i--) {
                                            if (matterDetails_[i].MatterName > matterDetails_[i + 1].MatterName) {
                                                olPage.Functions.SwapElements(matterDetails_, i, i + 1);
                                                swaped_ = true;
                                            }
                                        }
                                    }
                                } while(swaped_);

                                if (!asc_) {
                                    matterDetails_.reverse();
                                }

                            }
                            olPage.Content.Divs._internal.PromptMatterSearch._internal.PopulateSearchTable();
                            olPage.Content.Divs._internal.PromptMatterSearch.Events.TableElements_onClick();
                        },
                        PopulateSearchTable : function() {
                            var matterSearchTable_ = $('#olTblMatterSearchTable');
                            var mNumber_ = ($('#olMatterSearchType').val() == 'mNumber');

                            matterSearchTable_.find('tbody tr').each(function() {
                                if ($(this).attr('id') != 'olTableZeroRecords') {
                                    $(this).remove();
                                }
                            });

                            var matterDetails_ = olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_.MatterDetails;

                            // if (!olFunctions.IsFilledArray(matterDetails_)) {
                            // for (var i = 0; i < 10; i++) {
                            // matterDetails_.push({})
                            // }
                            //
                            // matterDetails_[0].MatterName = 'name 0000000000000000000000000000';
                            // matterDetails_[0].MatterNumber = 'number 0000000000000000000000000000';
                            //
                            // matterDetails_[1].MatterName = 'name 11111111111111';
                            // matterDetails_[1].MatterNumber = 'number 11111111111111';
                            //
                            // matterDetails_[2].MatterName = 'name 2222222222222222222222';
                            // matterDetails_[2].MatterNumber = 'number 2222222222222222222222222222222222222222222222222';
                            //
                            // matterDetails_[3].MatterName = 'name 3333333';
                            // matterDetails_[3].MatterNumber = 'number 3333333333333333';
                            //
                            // matterDetails_[4].MatterName = 'name 444444444444';
                            // matterDetails_[4].MatterNumber = 'number 4444444444444444444444444444444444444444444';
                            //
                            // matterDetails_[5].MatterName = 'name 55555';
                            // matterDetails_[5].MatterNumber = 'number 5555555555555555555555555555555555555555555555555';
                            //
                            // matterDetails_[6].MatterName = 'name 6';
                            // matterDetails_[6].MatterNumber = 'number 6';
                            //
                            // matterDetails_[7].MatterName = 'name 77';
                            // matterDetails_[7].MatterNumber = 'number 77';
                            //
                            // matterDetails_[8].MatterName = 'name 888888888888888888888888888888888888';
                            // matterDetails_[8].MatterNumber = 'number 888888888888888888888888888888888888';
                            //
                            // matterDetails_[9].MatterName = 'name 9999999';
                            // matterDetails_[9].MatterNumber = 'number 999999999999999999';
                            // }

                            if (olFunctions.IsFilledArray(matterDetails_)) {
                                $('#olTableZeroRecords').css('cssText', 'display: none !important');

                                for (var i = 0; i < matterDetails_.length; i++) {
                                    var tableRow_ = $(document.createElement('tr'));
                                    var tableFirstColumn_ = $(document.createElement('td')).addClass('olFirstCell');
                                    var tableSecondColumn_ = $(document.createElement('td')).addClass('olSecondCell');

                                    if (i % 2 == 0) {
                                        tableRow_.addClass('olTableEvenRow');
                                    } else {
                                        tableRow_.addClass('olTableOddRow');
                                    }

                                    var matterNumber_ = olPage.Content.Divs._internal.CreateLabels(matterDetails_[i].MatterNumber, 280, null, 'olFontNormal');
                                    var matterName_ = olPage.Content.Divs._internal.CreateLabels(matterDetails_[i].MatterName, 280, null, 'olFontNormal');

                                    if (mNumber_) {
                                        tableFirstColumn_.text(matterNumber_.Text);
                                        tableFirstColumn_.attr('olValue', matterNumber_.Title);
                                        tableSecondColumn_.text(matterName_.Text);
                                        tableSecondColumn_.attr('olValue', matterName_.Title);

                                        if (matterNumber_.Title != matterNumber_.Text) {
                                            tableFirstColumn_.attr('title', matterNumber_.Title);
                                        }

                                        if (matterName_.Title != matterName_.Text) {
                                            tableSecondColumn_.attr('title', matterName_.Title);
                                        }
                                    } else {
                                        tableFirstColumn_.text(matterName_.Title);
                                        tableFirstColumn_.attr('olValue', matterName_.Title);
                                        tableSecondColumn_.text(matterNumber_.Title);
                                        tableSecondColumn_.attr('olValue', matterNumber_.Title);

                                        tableFirstColumn_.text(matterName_.Text);
                                        if (matterName_.Title != matterName_.Text) {
                                            tableFirstColumn_.attr('title', matterName_.Title);
                                        }
                                        tableSecondColumn_.text(matterNumber_.Text);
                                        if (matterNumber_.Title != matterNumber_.Text) {
                                            tableSecondColumn_.attr('title', matterNumber_.Title);
                                        }
                                    }

                                    tableRow_.append(tableFirstColumn_);
                                    tableRow_.append(tableSecondColumn_);
                                    matterSearchTable_.append(tableRow_);
                                }
                            } else {
                                $('#olTableZeroRecords').css('cssText', 'display: table-row !important');
                            }
                        },
                        CreateSearchTable : function(checkMatterResponse) {
                            try {
                                olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_ = checkMatterResponse;

                                var mNumber_ = ($('#olMatterSearchType').val() == 'mNumber');

                                var firstCollumnName_ = $('#olFirstColumnName');
                                var secondCollumnName_ = $('#olSecondColumnName');
                                if (!firstCollumnName_.data('olSort')) {
                                    firstCollumnName_.data('olSort', 'asc');
                                    secondCollumnName_.data('olSort', 'unsorted');
                                }
                                var firstIconClass_, secondIconClass_;
                                switch(firstCollumnName_.data('olSort')) {
                                case 'asc':
                                    firstIconClass_ = 'olDownArrow';
                                    break;
                                case 'desc':
                                    firstIconClass_ = 'olUpArrow';
                                    break;
                                case 'unsorted':
                                    firstIconClass_ = 'olDoubleArrow';
                                    break;
                                }
                                ;
                                switch(secondCollumnName_.data('olSort')) {
                                case 'asc':
                                    secondIconClass_ = 'olDownArrow';
                                    break;
                                case 'desc':
                                    secondIconClass_ = 'olUpArrow';
                                    break;
                                case 'unsorted':
                                    secondIconClass_ = 'olDoubleArrow';
                                    break;
                                }

                                var firstSpan_ = '<span id="olFirstColumnIconSpan" class="olSortingIcons ' + firstIconClass_ + '"></span>';
                                var secondSpan_ = '<span id="olSecondColumnIconSpan" class="olSortingIcons ' + secondIconClass_ + '"></span>';

                                if (mNumber_) {
                                    firstCollumnName_.find('div').html(olPage.Functions.GetLanguageItem('JS_MatterNumberLabel') + firstSpan_);
                                    secondCollumnName_.find('div').html(olPage.Functions.GetLanguageItem('JS_MatterNameLabel') + secondSpan_);
                                } else {
                                    firstCollumnName_.find('div').html(olPage.Functions.GetLanguageItem('JS_MatterNameLabel') + firstSpan_);
                                    secondCollumnName_.find('div').html(olPage.Functions.GetLanguageItem('JS_MatterNumberLabel') + secondSpan_);
                                }

                                //Scroll section
                                if (!olPage.Content.Divs._internal.PromptMatterSearch._internal.RequestPageNumberSpecified) {
                                    if (olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_.PageCount == 0) {
                                        $('#olMatterSearchPage').text(0);
                                    } else {
                                        $('#olMatterSearchPage').text(1);
                                    }
                                    if (olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_.PageCount > 1) {
                                        $('#olMatterSearchFakeScrContent').css('width', 100 * olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_.PageCount + '%');
                                        $('#olMatterSearchScr').show();
                                    } else {
                                        $('#olMatterSearchScr').hide();
                                    }
                                }

                                olPage.Content.Divs._internal.PromptMatterSearch._internal.PageTotal = olPage.Content.Divs._internal.PromptMatterSearch._internal.checkMatterResponse_.PageCount;
                                $("#olMatterSearchPageTotal").text(olPage.Content.Divs._internal.PromptMatterSearch._internal.PageTotal);

                                olPage.Content.Divs._internal.PromptMatterSearch._internal.SortTableElements();

                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CreateSearchTable', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        Request : function(pageNumberSpecified) {
                            try {
                                var value_ = $('#olMatterSearchInp').val();
                                if (value_ && value_ != '') {
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.RequestPageNumberSpecified = pageNumberSpecified;
                                    var searchType_;
                                    searchType_ = $('#olMatterSearchType').val();

                                    var parameters_ = {};
                                    switch(searchType_) {
                                    case'mNumber':
                                        parameters_.MatterNumber = value_;
                                        parameters_.MatterName = null;
                                        break;
                                    case'mName':
                                        parameters_.MatterNumber = null;
                                        parameters_.MatterName = value_;
                                        break;
                                    }
                                    if ($('#olMatterSearchPage').text() != '') {
                                        parameters_.PageNumber = parseInt($('#olMatterSearchPage').text());
                                    } else {
                                        parameters_.PageNumber = 1;
                                    }
                                    parameters_.PageNumberSpecified = olPage.Content.Divs._internal.PromptMatterSearch._internal.RequestPageNumberSpecified;

                                    olPage.Messages.CheckMatterGlobalRequest(parameters_);
                                } else {
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.ClearSearchTable();
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Request', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        StartInputTimer : function() {
                            try {
                                $('#olMatterSearchInp').idleTimer(250);
                                $('#olMatterSearchInp').off('idle.idleTimer');
                                $('#olMatterSearchInp').on("idle.idleTimer", function() {
                                    $('#olMatterSearchInp').idleTimer('destroy');
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.InputTimerStarted = false;
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.Request(false);
                                });
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('StartInputTimer', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        StartPageTimer : function() {
                            try {
                                $('#olMatterSearchPage').idleTimer(250);
                                $('#olMatterSearchPage').off('idle.idleTimer');
                                $('#olMatterSearchPage').on("idle.idleTimer", function() {
                                    $('#olMatterSearchPage').idleTimer('destroy');
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.PageTimerStarted = false;
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.Request(true);
                                });
                            } catch(e) {
                                var alertContent_ = new olFunctions.AlertContent('StartPageTimer', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                            }
                        }
                    },
                    Events : {
                        SearchInp_onChange : function() {
                            $('#olMatterSearchInp').off('keyup');
                            $('#olMatterSearchInp').on('keyup', function(event) {
                                try {
                                    if (!olPage.Content.Divs._internal.PromptMatterSearch._internal.InputTimerStarted) {
                                        olPage.Content.Divs._internal.PromptMatterSearch._internal.InputTimerStarted = true;
                                        olPage.Content.Divs._internal.PromptMatterSearch._internal.StartInputTimer();
                                    }
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('SearchInp_onChange', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        SearchPageChange : function() {
                            try {
                                if (!olPage.Content.Divs._internal.PromptMatterSearch._internal.PageTimerStarted) {
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.PageTimerStarted = true;
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.StartPageTimer();
                                }
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('SearchPageChange', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        Cancel_onClick : function() {
                            $('#olImgMatterSearchCancel').off('click');
                            $('#olImgMatterSearchCancel').on('click', function(event) {
                                event.stopPropagation();
                                try {
                                    olPage.Content.Divs.Close.PromptMatterSearch(true);
                                    olPage.Content.Divs.Load.PromptMatter(true);
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Cancel_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        Scroll : function() {
                            $('#olMatterSearchScr').scroll(function(eventObject) {
                                try {
                                    var width_ = $('#olMatterSearchFakeScrContent').width();
                                    var left_ = $('#olMatterSearchScr').scrollLeft();
                                    var pageTotal_ = olPage.Content.Divs._internal.PromptMatterSearch._internal.PageTotal;

                                    var pageWidth_ = width_ / pageTotal_;
                                    var pageNumber_ = Math.round(left_ / pageWidth_ + 1);
                                    var currentPageNumber_ = $('#olMatterSearchPage').text();

                                    if (currentPageNumber_ != pageNumber_) {
                                        $('#olMatterSearchPage').text(pageNumber_);
                                        olPage.Content.Divs._internal.PromptMatterSearch.Events.SearchPageChange();
                                    }
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Scroll', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        MatterSearchType_onChange : function() {
                            $('#olMatterSearchType').change(function() {
                                try {
                                    $('#olMatterSearchInp').select().focus();
                                    olPage.Content.Divs._internal.PromptMatterSearch._internal.Request(false);
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('MatterSearchType_onChange', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        MatterSearchInp_onFocusout : function() {
                            $('#olMatterSearchInp').focusout(function(event) {
                                if (event.target.value == '') {
                                    event.target.value = olPage.Functions.GetLanguageItem('JS_Search');
                                    $('#olMatterSearchInp').addClass('olFontSmall olFontGray');
                                }
                            });
                        },
                        MatterSearchInp_onFocus : function() {
                            $('#olMatterSearchInp').select().focus(function(event) {
                                if (event.target.value == olPage.Functions.GetLanguageItem('JS_Search')) {
                                    event.target.value = '';
                                }
                                $('#olMatterSearchInp').removeClass('olFontSmall olFontGray');
                            });
                        },
                        TableElements_onClick : function() {
                            var searchTable_ = $('#olTblMatterSearchTable');
                            var mNumber_ = ($('#olMatterSearchType').val() == 'mNumber');

                            //Headers events
                            $('#olFirstColumnName, #olSecondColumnName').each(function() {
                                var th = $(this);

                                th.off('click');
                                th.on('click', function() {
                                    try {
                                        var secondTh;
                                        if (th.attr('id') == 'olFirstColumnName') {
                                            secondTh = $('#olSecondColumnName');
                                        } else {
                                            secondTh = $('#olFirstColumnName');
                                        }
                                        secondTh.data('olSort', 'unsorted');
                                        secondTh.find('span').removeClass('olUpArrow olDownArrow').addClass('olDoubleArrow');

                                        if (th.data('olSort') != 'asc') {
                                            // sort ascending
                                            th.data('olSort', 'asc');
                                            th.find('span').removeClass('olDoubleArrow olUpArrow').addClass('olDownArrow');
                                        } else {
                                            // sort descending
                                            th.data('olSort', 'desc');
                                            th.find('span').removeClass('olDoubleArrow olDownArrow').addClass('olUpArrow');
                                        }

                                        olPage.Content.Divs._internal.PromptMatterSearch._internal.SortTableElements();
                                    } catch(e) {
                                        var alertErrorContent_ = new olFunctions.AlertContent('TableElements_onClick', e.message + '\n' + e.stack);
                                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                    }
                                });
                            });

                            //Row events
                            searchTable_.find('tbody tr').off('click');
                            searchTable_.find('tbody tr').on('click', function() {
                                if ($(this).attr('id') != 'olTableZeroRecords') {
                                    if (mNumber_) {
                                        olPage.Content.Divs._internal.PromptMatterSearch._internal.SelectedMatterNumber = $(this).find('.olFirstCell').attr('olValue');
                                        olPage.Content.Divs._internal.PromptMatterSearch._internal.SelectedMatterName = $(this).find('.olSecondCell').attr('olValue');
                                    } else {
                                        olPage.Content.Divs._internal.PromptMatterSearch._internal.SelectedMatterName = $(this).find('.olFirstCell').attr('olValue');
                                        olPage.Content.Divs._internal.PromptMatterSearch._internal.SelectedMatterNumber = $(this).find('.olSecondCell').attr('olValue');
                                    }
                                    olPage.Content.Divs.Close.PromptMatterSearch(true);
                                    olPage.Content.Divs.Load.PromptMatter(true, true);
                                } else {
                                    olPage.Content.Divs.Close.PromptMatterSearch(true);
                                    olPage.Content.Divs.Load.PromptMatter(true);
                                }
                            });
                        }
                    },
                    BindEvents : function() {
                        try {
                            olPage.Content.Divs._internal.PromptMatterSearch.Events.SearchInp_onChange();
                            olPage.Content.Divs._internal.PromptMatterSearch.Events.Cancel_onClick();
                            olPage.Content.Divs._internal.PromptMatterSearch.Events.Scroll();
                            olPage.Content.Divs._internal.PromptMatterSearch.Events.MatterSearchType_onChange();
                            olPage.Content.Divs._internal.PromptMatterSearch.Events.MatterSearchInp_onFocusout();
                            olPage.Content.Divs._internal.PromptMatterSearch.Events.MatterSearchInp_onFocus();
                            // table events have to be inside CreateSearchTable
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BindEvents', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    Initialise : function() {
                        $('#olMatterSearchInp').val(olPage.Functions.GetLanguageItem('JS_Search'));
                        $('#olMatterSearchInp').addClass('olFontSmall olFontGray');
                    }
                },
                AskToStorePassword : {
                    _internal : {
                        _previousPrompt : '',
                        _previousMask : false
                    },
                    Events : {
                        _internal : {
                            buttonClick : function(storePassword) {
                                var parameters_ = {
                                    ApplicationSessionId : olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId,
                                    Store : storePassword
                                };

                                olPage.Messages.StorePasswordRequest(parameters_);
                                olPage.Content.Divs.Close.AskToStorePassword(false);

                                olPage.Content.Modules.FinishedPasswordManagement();
                            }
                        },
                        Cancel_onClick : function() {
                            $('#olASPImgStorePasswordCancel').bind('click', function(event) {
                                olPage.Content.Divs._internal.AskToStorePassword.Events._internal.buttonClick(false);
                            });
                        },
                        No_onClick : function() {
                            $('#olStorePasswordNo').bind('click', function(event) {
                                olPage.Content.Divs._internal.AskToStorePassword.Events._internal.buttonClick(false);
                            });
                        },
                        Yes_onClick : function() {
                            $('#olStorePasswordYes').bind('click', function(event) {
                                olPage.Content.Divs._internal.AskToStorePassword.Events._internal.buttonClick(true);

                                var bnr0_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                                for (var i = 0; i < bnr0_.VariableReplacement.Variables.length; i++) {
                                    if (bnr0_.VariableReplacement.Variables[i].IsPersonal || olPage.Data.PageFlags.PmtAutomatic) {
                                        if (bnr0_.VariableReplacement.Variables[i].AutomaticValue) {
                                            bnr0_.VariableReplacement.Variables[i].Value = bnr0_.VariableReplacement.Variables[i].AutomaticValue;
                                        }
                                    }
                                }
                                olPage.Content.Inject();
                                // share changes with all tabs
                                olPage.Messages.UpdateResponse();
                            });
                        }
                    },
                    BindEvents : function() {
                        olPage.Content.Divs._internal.AskToStorePassword.Events.Cancel_onClick();
                        olPage.Content.Divs._internal.AskToStorePassword.Events.Yes_onClick();
                        olPage.Content.Divs._internal.AskToStorePassword.Events.No_onClick();
                    }
                },
                ResourceTimeout : {
                    _internal : {
                        _previousPrompt : '',
                        _previousMask : false,
                        ApplicationSessionId : null,
                        ApplicationName : null,
                        ResourceTimeoutText : null,
                        timerValue : 60,
                        oldTitle : null,
                        timoutId : null,
                        _blink : function() {
                            if (document.title == olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationName) {
                                document.title = olPage.Content.Divs._internal.ResourceTimeout._internal.ResourceTimeoutText;
                            } else {
                                document.title = olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationName;
                            }
                        },
                        ClearTitle : function() {
                            clearInterval(olPage.Content.Divs._internal.ResourceTimeout._internal.timeoutId);
                            document.title = olPage.Content.Divs._internal.ResourceTimeout._internal.oldTitle;
                            olPage.Content.Divs._internal.ResourceTimeout._internal.timeoutId = null;
                        },
                        Yes_onClick : function() {
                            olPage.Content.Divs.Close.ResourceTimeout(false);

                            var closeTab_ = false;
                            if (olPage.Data.PageInfo && olPage.Data.PageInfo.Response && olPage.Data.PageInfo.Response.BeforeNavigateResponses && olPage.Data.PageInfo.Response.BeforeNavigateResponses[0] && olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ApplicationsSessionId == olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationSessionId) {
                                //inactivity, we are on resource so... close tab
                                closeTab_ = true;
                            }

                            var sessionInfo_ = {
                                ApplicationSessionId : olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationSessionId,
                                ApplicationName : olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationName,
                                CloseTab : closeTab_
                            };
                            olPage.Messages.QuittingResourceSessionRequest(sessionInfo_);
                        },
                        timeoutInfoText_ : null,
                        Timer : function() {
                            try {
                                if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt == 'olResourceTimeout') {
                                    olPage.Content.Divs._internal.ResourceTimeout._internal.timerValue--;
                                    if (olPage.Content.Divs._internal.ResourceTimeout._internal.timerValue > 0) {
                                        if (!olPage.Content.Divs._internal.ResourceTimeout._internal.timeoutInfoText_) {
                                            olPage.Content.Divs._internal.ResourceTimeout._internal.timeoutInfoText_ = $('#olTimeoutInfoText').text();
                                        }
                                        var infoText_ = String(olPage.Content.Divs._internal.ResourceTimeout._internal.timeoutInfoText_);
                                        infoText_ = infoText_.replace('{rep1}', olPage.Content.Divs._internal.ResourceTimeout._internal.timerValue);
                                        $('#olTimeoutInfoText').text(infoText_);
                                    } else {
                                        olPage.Content.Divs._internal.ResourceTimeout._internal.Yes_onClick();
                                    }
                                    setTimeout(function() {
                                        olPage.Content.Divs._internal.ResourceTimeout._internal.Timer();
                                    }, 1000);
                                }
                                ;
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Resource timeout Timer', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        FlashTitle : function() {
                            olPage.Content.Divs._internal.ResourceTimeout._internal.oldTitle = document.title;
                            if (!olPage.Content.Divs._internal.ResourceTimeout._internal.timeoutId) {
                                olPage.Content.Divs._internal.ResourceTimeout._internal.timeoutId = setInterval(function() {
                                    olPage.Content.Divs._internal.ResourceTimeout._internal._blink();
                                }, 1000);
                            }
                        }
                    },
                    Events : {
                        No_onClick : function() {
                            $('#olResourceNo').off('click');
                            $('#olResourceNo').on('click', function(event) {
                                olPage.Content.Divs.Close.ResourceTimeout(false);
                                var sessionInfo_ = {
                                    ApplicationSessionId : olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationSessionId,
                                    ApplicationName : olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationName
                                };
                                olPage.Messages.ContinueSessionRequest(sessionInfo_);
                            });
                        },
                        Yes_onClick : function() {
                            $('#olResourceYes').off('click');
                            $('#olResourceYes').on('click', function(event) {
                                olPage.Content.Divs._internal.ResourceTimeout._internal.Yes_onClick();
                            });
                        }
                    },
                    BindEvents : function() {
                        olPage.Content.Divs._internal.ResourceTimeout.Events.No_onClick();
                        olPage.Content.Divs._internal.ResourceTimeout.Events.Yes_onClick();
                    }
                },
                WebControlMessage : {
                    _internal : {
                        _previousPrompt : '',
                        _previousMask : false
                    },
                    Events : {
                        _okOnClick : function() {
                            // this function gets filled dynamically
                        },
                        _ruleAction : function() {
                            // this function gets filled dynamically
                        },
                        OK_onClick : function(fnArray) {
                            $('#olWebControlMessageOK').off('click');
                            $('#olWebControlMessageOK').on('click', function(event) {
                                event.stopPropagation();
                                olPage.Content.Divs._internal.WebControlMessage.Events._ruleAction();
                                olPage.Content.Divs._internal.WebControlMessage.Events._okOnClick();
                            });
                        }
                    },
                    BindEvents : function() {
                        olPage.Content.Divs._internal.WebControlMessage.Events.OK_onClick();
                    }
                },
                Error : {
                    Events : {
                        OK_onClick : function() {
                            $('#olErrorOK').off('click');
                            $('#olErrorOK').on('click', function(event) {
                                event.stopPropagation();
                                location.reload();
                            });
                        }
                    },
                    BindEvents : function() {
                        olPage.Content.Divs._internal.Error.Events.OK_onClick();
                    }
                },
                Toolbar : {
                    _internal : {
                        MenuOpened : false,
                        ChromeInvertedTime : null,
                        CurrentPrompt : '',
                        CloseCurrentPrompt : function(mask) {
                            try {
                                switch(olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt) {
                                case 'olPromptMatter':
                                    olPage.Content.Divs.Close.PromptMatter(mask);
                                    break;
                                case 'olPromptMatterSearch':
                                    olPage.Content.Divs.Close.PromptMatterSearch(mask);
                                    break;
                                case 'olPromptLogon':
                                    olPage.Content.Divs.Close.PromptLogon(mask);
                                    break;
                                case 'olPromptLogonDetails':
                                    olPage.Content.Divs.Close.PromptLogonDetails(mask);
                                    break;
                                case 'olPromptChooseApplication':
                                    olPage.Content.Divs.Close.PromptChooseApplication(mask);
                                    break;
                                case 'olResourceTimeout':
                                    olPage.Content.Divs.Close.ResourceTimeout(mask);
                                    break;
                                case 'olPromptLicenceLimitReached':
                                    olPage.Content.Divs.Close.PromptLicenceLimitReached(mask);
                                    break;
                                case 'olWebControlMessage':
                                    olPage.Content.Divs.Close.WebControlMessage(mask);
                                    break;
                                case 'olError':
                                    olPage.Content.Divs.Close.Error(mask);
                                    break;
                                default:
                                    olPage.Content.Divs._internal.SetMask(mask);
                                    break;
                                }
                                olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt = '';
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('CloseCurrentPrompt', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        SetTooltip : function(toolTip) {
                            $('#olToolbarIcon').attr('title', toolTip);
                            $('#olToolbarIcon').data('titleVal', toolTip);
                        },
                        Timer : function() {
                            try {
                                if (olPage.Data.PageInfo) {
                                    var bnr0_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                                    var dt_ = new Date();
                                    dt_ = dt_.getTime();

                                    if (!olPage.Data.StartTime) {
                                        var st_ = new Date(bnr0_.StartTime);
                                        // IE compatibility issue
                                        // resource: http://www.beck.de/  (link Impressum)
                                        if (isNaN(st_)) {
                                            var st_ = new Date(olPage.Functions.DateFromISO8601(bnr0_.StartTime));
                                        }
                                        olPage.Data.StartTime = st_.getTime();
                                    }

                                    var now_ = dt_ - olPage.Data.StartTime;
                                    if (bnr0_.PauseDuration) {
                                        now_ = now_ - bnr0_.PauseDuration * 1000;
                                    }

                                    // patching chrome date issue
                                    if (now_ < 0) {
                                        if (!olPage.Content.Divs._internal.Toolbar._internal.ChromeInvertedTime) {
                                            olPage.Content.Divs._internal.Toolbar._internal.ChromeInvertedTime = Math.abs(now_);
                                        }
                                        now_ = olPage.Content.Divs._internal.Toolbar._internal.ChromeInvertedTime + now_;
                                    }

                                    var hour_ = Math.floor(now_ / 3600000);
                                    now_ = now_ % 3600000;
                                    var min_ = Math.floor(now_ / 60000);
                                    now_ = now_ % 60000;
                                    var sec_ = Math.floor(now_ / 1000);

                                    if (min_ <= 9) {
                                        min_ = "0" + min_;
                                    }
                                    if (sec_ <= 9) {
                                        sec_ = "0" + sec_;
                                    }
                                    $('#olToolbarTimer').text(((hour_ <= 9) ? "0" + hour_ : hour_) + ":" + min_ + ":" + sec_ + " ");
                                }
                                setTimeout(function() {
                                    olPage.Content.Divs._internal.Toolbar._internal.Timer();
                                }, 1000);
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('Timer', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        TurnAllMenuButtonsOff : function() {
                            try {
                                $('#olToolbar .olSelectableMenuSelected').removeClass('olSelectableMenuSelected');
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('TurnAllMenuButtonsOff', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        },
                        ToolbarIconsSetDisabled : function(DisabledEnabled) {
                            try {
                                $('#olToolbarIcon').attr('disabled', DisabledEnabled);
                                $('#olToolbarRefresh').attr('disabled', DisabledEnabled);
                                olPage.Content.Divs._internal.ChangeImageSources();
                            } catch(e) {
                                var alertErrorContent_ = new olFunctions.AlertContent('DisableToolbarIcons', e.message + '\n' + e.stack);
                                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                            }
                        }
                    },
                    Events : {
                        Icon_onClick : function() {
                            $('#olToolbarIcon').off('click');
                            $('#olToolbarIcon').on('click', function(event) {
                                event.stopImmediatePropagation();
                                event.preventDefault();
                                event.stopPropagation();

                                try {
                                    var somethingVisible_ = (!($('#olToolbarMenuLogon').css('display') == 'none') || !($('#olToolbarMenuMatter').css('display') == 'none'));
                                    if ((olPage.Data.PageFlags.MatterNeeded || olPage.Data.PageFlags.LogonNeeded || olPage.Data.PageFlags.LogonCommonNeeded) && somethingVisible_) {
                                        //IE, jquery-prototype conflict
                                        switch(olPage.Data.PageFlags.BrowserName) {
                                        case 'iejs':
                                            //try {
                                            if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                                $('#olToolbarMenu').toggle();
                                            } else {
                                                $('#olToolbarMenu').toggle(olOptions.General.Page.TransitionTime());
                                            }
                                            break;
                                        default:
                                            $('#olToolbarMenu').toggle(olOptions.General.Page.TransitionTime());
                                            break;
                                        }
                                        olPage.Content.Divs._internal.Toolbar._internal.MenuOpened = !olPage.Content.Divs._internal.Toolbar._internal.MenuOpened;
                                        if (!olPage.Content.Divs._internal.Toolbar._internal.MenuOpened) {
                                            olPage.Content.Divs._internal.Toolbar.ResetMenu();
                                            $('#olToolbarIcon').attr('title', $('#olToolbarIcon').data('titleVal'));
                                        } else {
                                            $('#olToolbarIcon').attr('title', '');
                                        }
                                    }
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Icon_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        Maximize_onClick : function() {
                            $('#olToolbarMax').off('click');
                            $('#olToolbarMax').on('click', function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                try {
                                    //IE, jquery-prototype conflict
                                    switch(olPage.Data.PageFlags.BrowserName) {
                                    case 'iejs':
                                        if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                            // fadeOut. fadeIn problem (jquery-prototype conflict)
                                            $('#olToolbarMinimized').hide();
                                            switch(olOptions.General.Page.ToolbarWidth()) {
                                            case 0:
                                                break;
                                            case 1:
                                                $('#olToolbar').css({
                                                    width : '99%'
                                                });
                                                break;
                                            }
                                            $('#olToolbarMaximized').show();
                                        } else {
                                            $('#olToolbarMinimized').fadeOut(olOptions.General.Page.TransitionTime(), function() {
                                                switch(olOptions.General.Page.ToolbarWidth()) {
                                                case 0:
                                                    break;
                                                case 1:
                                                    $('#olToolbar').css({
                                                        width : '99%'
                                                    });
                                                    break;
                                                }
                                                $('#olToolbarMaximized').fadeIn(olOptions.General.Page.TransitionTime());
                                            });
                                        }
                                        ;
                                        break;
                                    default:
                                        $('#olToolbarMinimized').fadeOut(olOptions.General.Page.TransitionTime(), function() {
                                            switch(olOptions.General.Page.ToolbarWidth()) {
                                            case 0:
                                                break;
                                            case 1:
                                                $('#olToolbar').css({
                                                    width : '99%'
                                                });
                                                break;
                                            }
                                            $('#olToolbarMaximized').fadeIn(olOptions.General.Page.TransitionTime());
                                        });
                                        break;
                                    }

                                    // $('#olToolbarMinimized').fadeOut(olOptions.General.Page.TransitionTime(), function() {
                                    // switch (olOptions.General.Page.ToolbarWidth()) {
                                    // case 0:
                                    // break;
                                    // case 1:
                                    // $('#olToolbar').css({
                                    // width : '99%'
                                    // });
                                    // break;
                                    // }
                                    // $('#olToolbarMaximized').fadeIn(olOptions.General.Page.TransitionTime());
                                    // });

                                    olPage.Data.PageFlags.ToolbarMinimized = false;
                                    olPage.Messages.UpdateResponse();
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Maximize_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        Minimize_onClick : function() {
                            $('#olToolbarMin').off('click');
                            $('#olToolbarMin').on('click', function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                try {
                                    //IE, jquery-prototype conflict
                                    switch(olPage.Data.PageFlags.BrowserName) {
                                    case 'iejs':

                                        if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                            //fadeOut, fadeIn problem (jquery-prototype conflict)
                                            $('#olToolbarMaximized').hide();
                                            $('#olToolbarMinimized').show();
                                        } else {
                                            $('#olToolbarMaximized').fadeOut(olOptions.General.Page.TransitionTime(), function() {
                                                $('#olToolbarMinimized').fadeIn(olOptions.General.Page.TransitionTime());
                                            });
                                        }
                                        break;
                                    default:
                                        $('#olToolbarMaximized').fadeOut(olOptions.General.Page.TransitionTime(), function() {
                                            $('#olToolbarMinimized').fadeIn(olOptions.General.Page.TransitionTime());
                                        });
                                        break;
                                    }
                                    // $('#olToolbarMaximized').fadeOut(olOptions.General.Page.TransitionTime(), function() {
                                    // $('#olToolbarMinimized').fadeIn(olOptions.General.Page.TransitionTime());
                                    // });

                                    olPage.Data.PageFlags.ToolbarMinimized = true;
                                    olPage.Messages.UpdateResponse();
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Minimize_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        MenuButton_onClick : function() {
                            $('.olSelectableMenu').off('click');
                            $('.olSelectableMenu').on('click', function() {
                                try {
                                    if ($(this).hasClass('olSelectableMenuSelected')) {
                                        olPage.Content.Divs._internal.Toolbar._internal.TurnAllMenuButtonsOff();
                                    } else {
                                        olPage.Content.Divs._internal.Toolbar._internal.TurnAllMenuButtonsOff();
                                        $(this).addClass('olSelectableMenuSelected');
                                    }
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('MenuButton_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        MenuMatterClicked_ : false,
                        MenuMatter_onClick : function() {
                            $('#olToolbarMenuMatter').off('click');
                            $('#olToolbarMenuMatter').on('click', function() {
                                if (!olPage.Content.Divs._internal.Toolbar.Events.MenuMatterClicked_) {
                                    olPage.Content.Divs._internal.Toolbar.Events.MenuMatterClicked_ = true;
                                    try {
                                        olInjection.ElementValue._internal.ElementValueSet = false;
                                        if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt == '') {
                                            olPage.Content.Divs.Load.PromptMatter(true);
                                        } else {
                                            if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != 'olPromptMatter' && olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != 'olPromptMatterSearch' && olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != 'olPromptComment') {
                                                olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(true);
                                                olPage.Content.Divs.Load.PromptMatter(true);
                                            } else {
                                                olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(false);
                                            }
                                        }
                                    } catch(e) {
                                        var alertErrorContent_ = new olFunctions.AlertContent('MenuMatter_onClick', e.message + '\n' + e.stack);
                                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                    }
                                    setTimeout(function() {
                                        olPage.Content.Divs._internal.Toolbar.Events.MenuMatterClicked_ = false;
                                    }, 200);
                                }
                            });
                        },
                        MenuLogonClicked_ : false,
                        MenuLogon_onClick : function() {
                            $('#olToolbarMenuLogon').off('click');
                            $('#olToolbarMenuLogon').on('click', function() {
                                if (!olPage.Content.Divs._internal.Toolbar.Events.MenuLogonClicked_) {
                                    olPage.Content.Divs._internal.Toolbar.Events.MenuLogonClicked_ = true;
                                    try {
                                        olInjection.ElementValue._internal.ElementValueSet = false;
                                        if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt == '') {
                                            olPage.Content.Divs.Load.PromptLogon(true);
                                        } else {
                                            if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != 'olPromptLogon' && olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != 'olPromptLogonDetails') {
                                                olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(true);

                                                //TODO ???????????????????????????????????????????????????? proveriti da li treba
                                                // olPage.Content.Divs._internal.PromptMatter.Initialise();
                                                // olPage.Content.Divs._internal.UpdateDivs();
                                                olPage.Content.Divs.Load.PromptLogon(true);
                                            } else {
                                                olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(false);
                                            }
                                        }
                                    } catch(e) {
                                        var alertErrorContent_ = new olFunctions.AlertContent('MenuLogon_onClick', e.message + '\n' + e.stack);
                                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                    }
                                    setTimeout(function() {
                                        olPage.Content.Divs._internal.Toolbar.Events.MenuLogonClicked_ = false;
                                    }, 200);
                                }
                            });
                        },
                        Refresh_onClick : function() {
                            $('#olToolbarRefresh').off('click');
                            $('#olToolbarRefresh').on('click', function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                try {
                                    olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(false);
                                    olInjection.ElementValue._internal.ElementValueSet = false;
                                    olPage.Content.Inject();
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('Refresh_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        },
                        ChangePosition_onClick : function() {
                            $('#olToolbarPositionChange').off('click');
                            $('#olToolbarPositionChange').on('click', function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                try {
                                    var newPosition_;
                                    newPosition_ = (olOptions.General.Page.ToolbarPosition() + 1) % 4;

                                    olOptions._internal.SetOptionByName('GeneralPageToolbarPosition', newPosition_);
                                    kango.invokeAsync('kango.storage.setItem', 'olOptions', olOptions._internal.OptionsArray);
                                    olPage.Content.Divs.Load.Toolbar(false);
                                } catch(e) {
                                    var alertErrorContent_ = new olFunctions.AlertContent('ChangePosition_onClick', e.message + '\n' + e.stack);
                                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                                }
                            });
                        }
                    },
                    _toolbarEnabled : false,
                    Disable : function() {
                        try {
                            $('#olToolbar').hide();
                            olPage.Content.Divs._internal.Toolbar._toolbarEnabled = false;
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Disable', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    Enable : function() {
                        try {
                            if (!olPage.Content.Modules._internal.WebControl._pageBlocked) {
                                $('#olToolbarContainer').show();
                                $('#olToolbar').show();
                            }
                            olPage.Content.Divs._internal.Toolbar._toolbarEnabled = true;
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Enable', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    _initialised : false,
                    Initialise : function(toolbarEnabled) {
                        if ( typeof (toolbarEnabled) === 'undefined')
                            toolbarEnabled = false;
                        olPage.Content.Divs._internal.Toolbar._initialised = true;
                        try {
                            //display toolbar
                            if (olOptions.General.Page.ToolbarDisplay()) {
                                olPage.Content.Divs.Load.Toolbar(false);
                                $('#olToolbarTimer').data('ShowTimer', false);
                                if (!toolbarEnabled) {
                                    olPage.Content.Divs._internal.Toolbar.Disable();
                                }
                            }

                            $('#olToolbarMenuMatter').hide();
                            $('#olToolbarMenuLogon').hide();
                            if (olPage.Data.PageFlags.MatterNeeded) {
                                $('#olToolbarMenuMatter').show();
                            }
                            var logonData_ = olPage.Content.Divs._common.GetLogonData();
                            if ((!olPage.Data.PageFlags.PmtAdmin || logonData_.length > 1) && (olPage.Data.PageFlags.LogonNeeded || olPage.Data.PageFlags.LogonCommonNeeded) && (!olPage.Data.PageFlags.PmtAutomatic)) {
                                try {
                                    $('#olToolbarMenuLogon').show();
                                } catch(e) {
                                }
                            }

                            olPage.Content.Divs._internal.ChangeImageSources();
                            //No Forms, no FormFill, no RefreshButton
                            if (!olFunctions.IsFilledArray(olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].Forms)) {
                                $('#olToolbarRefresh').hide();
                            }

                            //toolbar settings
                            $('#olToolbarTimer').data('ShowTimer', olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].ShowTimeTicker);
                            if (!$('#olToolbarTimer').data('ShowTimer')) {
                                olPage.Functions.Hide('#olToolbarTimer');
                            } else {
                                olPage.Content.Divs._internal.Toolbar._internal.Timer();
                            }
                            var toolTip_ = $.trim(olPage.Data.ApplicationName);
                            if (toolTip_ && toolTip_ != '') {
                                olPage.Content.Divs._internal.Toolbar._internal.SetTooltip(toolTip_);
                            } else {
                                olPage.Content.Divs._internal.Toolbar._internal.SetTooltip('Onelog');
                            }
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('Initialise Toolbar', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    BindEvents : function() {
                        try {
                            olPage.Content.Divs._internal.Toolbar.Events.Icon_onClick();
                            olPage.Content.Divs._internal.Toolbar.Events.Maximize_onClick();
                            olPage.Content.Divs._internal.Toolbar.Events.Minimize_onClick();
                            olPage.Content.Divs._internal.Toolbar.Events.Refresh_onClick();
                            olPage.Content.Divs._internal.Toolbar.Events.ChangePosition_onClick();
                            olPage.Content.Divs._internal.Toolbar.Events.MenuButton_onClick();
                            olPage.Content.Divs._internal.Toolbar.Events.MenuMatter_onClick();
                            olPage.Content.Divs._internal.Toolbar.Events.MenuLogon_onClick();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('BindEvents Toolbar', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    CloseMenu : function() {
                        try {
                            //IE, jquery-prototype conflict
                            switch(olPage.Data.PageFlags.BrowserName) {
                            case 'iejs':
                                if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                    $('#olToolbarMenu').hide();
                                } else {
                                    $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                                }
                                break;
                            default:
                                $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                                break;
                            }

                            //$('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                            olPage.Content.Divs._internal.Toolbar._internal.MenuOpened = false;
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('CloseMenu', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    ResetMenu : function() {
                        try {
                            olPage.Content.Divs._internal.Toolbar._internal.TurnAllMenuButtonsOff();
                            olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(false);
                            olPage.Content.Divs._internal.Toolbar.CloseMenu();
                            $('#olToolbarIcon').attr('title', $('#olToolbarIcon').data('titleVal'));
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('ResetMenu', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                ArrayDivs : ['olPrompt', 'olPromptMatter', 'olPromptMatterSearch', 'olPromptLogon', 'olPromptLogonDetails', 'olPromptComment', 'olToolbar'],
                GetOptions : function() {
                    kango.invokeAsync('kango.storage.getItem', 'olOptions', function(data) {
                        try {
                            olOptions._internal.OptionsArray = data;
                            olPage.Content.HtmlAppends.AddMainPrompts();
                        } catch(e) {
                            var alertContent_ = new olFunctions.AlertContent('GetOptions', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                        }
                    });
                },
                ChangeImageSources : function() {
                    try {
                        $('.olMultipleColourImage').each(function() {
                            var currentElement_ = $(this);

                            if (currentElement_.attr('id') == 'olToolbarIcon') {
                                currentElement_.removeClass('olToolbarIconBlue');
                                currentElement_.removeClass('olToolbarIconGreen');
                                currentElement_.removeClass('olToolbarIconUnauth');
                                currentElement_.removeClass('olToolbarIconGray');

                                if (olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].TurnAway) {
                                    //If licence limit is reached and server is set not to record unauthorised access then set icon to grey
                                    $('#olToolbarIcon').addClass('olToolbarIconGray');
                                    $('#olToolbarRefresh').hide();
                                } else if (olPage.Data.PageFlags.Unauthorised) {
                                    //Unauthorised
                                    $('#olToolbarIcon').addClass('olToolbarIconUnauth');
                                    $('#olToolbarRefresh').hide();
                                } else if (olPage.Data.PageFlags && olPage.Data.PageFlags.InOfflineMode) {
                                    $('#olToolbarIcon').addClass('olToolbarIconGreen');
                                } else {
                                    $('#olToolbarIcon').addClass('olToolbarIconBlue');
                                }

                            } else {
                                var classBlue_ = String(currentElement_.attr('id')) + 'Blue';
                                var classGreen_ = String(currentElement_.attr('id')) + 'Green';

                                currentElement_.removeClass(classBlue_);
                                currentElement_.removeClass(classGreen_);
                                if (olPage.Data.PageFlags && olPage.Data.PageFlags.InOfflineMode) {
                                    currentElement_.addClass(classGreen_);
                                } else {
                                    currentElement_.addClass(classBlue_);
                                }
                            }
                        });
                    } catch(e) {
                        var alertContent_ = new olFunctions.AlertContent('ChangeImageSources', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertContent_);
                    }
                },
                CreateLabels : function(labelText, lenghtPx, labelSelector, labelClass) {
                    try {
                        if ($('html body #olPromptLabelCalculationDiv').length == 0) {
                            olPage.Content.Divs._internal.Modal._prepareForRendering();
                        }

                        if (!labelText) {
                            switch(olPage.Data.PageFlags.BrowserName) {
                            case 'iejs':
                                labelText = [];
                                break;
                            default:
                                labelText = '';
                                break;
                            }
                        }

                        $('#olPromptLabelCalculationDiv').removeClass('olDisplayNone');
                        $('#olLabelCalculation').removeClass();
                        $('#olLabelCalculation').addClass('olInherit olFont olDisplayInline');
                        $('#olLabelCalculation').text();

                        var label_ = {
                            Text : '',
                            Title : ''
                        };
                        if (!labelSelector) {
                            label_ = {
                                Text : labelText,
                                Title : labelText
                            };
                        } else {
                            if (!$(labelSelector).attr('originalLabelText')) {
                                $(labelSelector).attr('originalLabelText', $(labelSelector).text());
                                label_ = {
                                    Text : $(labelSelector).html(),
                                    Title : $(labelSelector).html()
                                };
                            } else {
                                label_ = {
                                    Text : $(labelSelector).attr('originalLabelText'),
                                    Title : $(labelSelector).attr('originalLabelText')
                                };
                            }
                            if (labelText == null || labelText == '') {
                                if (label_.Text == null || label_.Text == '') {
                                    label_ = {
                                        Text : $(labelSelector).attr('originalLabelText'),
                                        Title : $(labelSelector).attr('originalLabelText')
                                    };
                                }
                            } else {
                                label_ = {
                                    Text : labelText,
                                    Title : labelText
                                };
                            }
                        }
                        ;
                        if (labelSelector) {
                            if ($(labelSelector).hasClass('olFontVeryBig')) {
                                $('#olLabelCalculation').addClass('olFontVeryBig');
                            }
                            if ($(labelSelector).hasClass('olFontBig')) {
                                $('#olLabelCalculation').addClass('olFontBig');
                            }
                            if ($(labelSelector).hasClass('olFontMedium')) {
                                $('#olLabelCalculation').addClass('olFontMedium');
                            }
                            if ($(labelSelector).hasClass('olFontNormal')) {
                                $('#olLabelCalculation').addClass('olFontNormal');
                            }
                            if ($(labelSelector).hasClass('olFontSmall')) {
                                $('#olLabelCalculation').addClass('olFontSmall');
                            }
                        }
                        if (labelClass) {
                            $('#olLabelCalculation').addClass(labelClass);
                        }

                        $('#olLabelCalculation').text('...');
                        var lengthWith3Dots_ = lenghtPx - $('#olLabelCalculation').width();

                        $('#olLabelCalculation').text(label_.Text);

                        if ($('#olLabelCalculation').width() > lenghtPx) {
                            while ($('#olLabelCalculation').width() >= lengthWith3Dots_ && label_.Text.length > 0) {
                                label_.Text = $.trim(label_.Text.substring(0, label_.Text.length - 1));
                                $('#olLabelCalculation').text(label_.Text);
                            }
                        }

                        //Fix for problems with css where olLabelCalculation has lenght of full screen and then it shortens text till empty string
                        if (label_.Text.length == 0) {
                            label_.Text = $(labelSelector).attr('originalLabelText');
                            label_.Title = $(labelSelector).attr('originalLabelText');
                        }

                        if (label_.Text != label_.Title) {
                            label_.Text = label_.Text + '...';
                        }
                        if (labelSelector) {
                            if (label_.Text != label_.Title) {
                                $(labelSelector).text(label_.Text);
                                $(labelSelector).attr('title', label_.Title);
                            } else {
                                $(labelSelector).text(label_.Text);
                                $(labelSelector).attr('title', '');
                            }
                        }
                        $('#olPromptLabelCalculationDiv').addClass('olDisplayNone');

                        return label_;
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('CreateLabels, on label text = ' + labelText + ' labelSelector = ' + labelSelector, e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                DisableElements : function(listOfElementsIdToDisable) {
                    try {
                        olPage.Listeners._internal.Events._processingKey = true;
                        for (var i = 0; i < listOfElementsIdToDisable.length; i++) {
                            var element_ = $('#' + listOfElementsIdToDisable[i]);
                            element_.attr('disabled', true);
                        }
                        olPage.Content.Divs._internal.ChangeImageSources();
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('DisableElements', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        olPage.Listeners._internal.Events._processingKey = false;
                    }
                },
                EnableElements : function(listOfElementsIdToEnable) {
                    try {
                        for (var i = 0; i < listOfElementsIdToEnable.length; i++) {
                            var element_ = $('#' + listOfElementsIdToEnable[i]);
                            element_.attr('disabled', false);
                        }
                        olPage.Content.Divs._internal.ChangeImageSources();

                        var bnr_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
                        if (olFunctions.IsFilledArray(bnr_.PredefinedComments)) {
                            olPage.Content.Divs._internal.PromptMatter._internal.SetCommentSelect();
                            $('#olCommentInfo').text(olPage.Functions.GetLanguageItem('JS_SelectComment'));
                        } else {
                            olPage.Content.Divs._internal.PromptMatter._internal.SetCommentInput();
                            if (bnr_.CommentLengthSpecified && bnr_.CommentLength != 0) {

                                var infoText_ = olPage.Functions.GetLanguageItem('JS_CommentLengthWrong').replace('{rep1}', bnr_.CommentLength);

                                $('#olCommentInfo').text(infoText_);
                            } else {
                                $('#olCommentInfo').text('');
                            }
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('EnableElements', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                    olPage.Listeners._internal.Events._processingKey = false;
                },
                MaskOn : false,
                _maskOpacity : 0.7,
                SetMask : function(mask) {
                    try {
                        olPage.Content.Divs._internal.Modal._prepareForRendering();

                        if (olPage.Content.Modules._internal.WebControl._pageBlocked || mask) {
                            olPage.Content.Divs._internal.Modal._addMaxZindex();
                            if (olPage.Content.Modules._internal.WebControl._pageBlocked) {
                                olPage.Content.Divs._internal.Modal._$overlay.css('opacity', '0.85');
                                olPage.Content.Divs._internal.Modal._$toolbar.hide();
                            } else {
                                olPage.Content.Divs._internal.Modal._$overlay.css('opacity', olPage.Content.Divs._internal._maskOpacity);
                            }
                            if ((olPage.Data.LocalPageFlags.HasFrameset) && (!olPage.Data.FramesetRemoved)) {
                                olPage.Functions.RemoveFramesetTag(olPage.Data.HtmlFrameset);
                            }
                            olPage.Content.Divs._internal.Modal._$overlay.show();
                            $(document).trigger('olFormOpening');
                            olPage.Content.Divs._internal.MaskOn = true;
                        } else {
                            olPage.Content.Divs._internal.Modal._removeMaxZindex();
                            if ((olPage.Data.LocalPageFlags.HasFrameset) && (olPage.Data.FramesetRemoved)) {
                                olPage.Functions.InsertFramesetTag(olPage.Data.HtmlFrameset);
                            }
                            olPage.Content.Divs._internal.Modal._$overlay.hide();
                            $(document).trigger('olFormClosing');
                            olPage.Content.Divs._internal.MaskOn = false;
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('SetMask', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                UpdateDivs : function() {
                    try {
                        if (olPage.Data.PageInfo) {
                            //Prompt matter
                            $('#olNewMatter').val(olPage.Data.PageFlags.MatterNumber);
                            if (olPage.Data.PageFlags.TimekeeperNumber != null) {
                                $('#olNewTimekeeper').val(olPage.Data.PageFlags.TimekeeperNumber);
                            }
                            $('#olNewComment').val(olPage.Data.PageFlags.Comment);
                            olPage.Content.Divs._internal.PromptMatter._internal.SetMatterFlags();
                        }
                        ;
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('UpdateDivs', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                }
            },
            AppendDivs : function() {
                try {
                    olPage.Content.Divs._internal.GetOptions();
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('AppendDivs', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            RemoveDivs : function() {
                try {
                    var aDivs_ = olPage.Content.Divs._internal.ArrayDivs;
                    for (var i = 0; i < aDivs_.length; i++) {
                        try {
                            $('#' + aDivs_[i]).remove();
                        } catch(e) {
                        }
                    }
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('RemoveDivs', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            BindEvents : function() {
                try {
                    olPage.Content.Divs._internal.PromptComment.BindEvents();
                    olPage.Content.Divs._internal.PromptLicenceLimitReached.BindEvents();
                    olPage.Content.Divs._internal.PromptLogon.BindEvents();
                    olPage.Content.Divs._internal.PromptLogonDetails.BindEvents();
                    olPage.Content.Divs._internal.PromptMatter.BindEvents();
                    olPage.Content.Divs._internal.PromptMatterSearch.BindEvents();

                    olPage.Content.Divs._internal.Toolbar.BindEvents();
                    olPage.Content.Divs._internal.UpdateDivs();
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('BindEvents', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            _olPromptCheckInterval : null,
            _olPromptChecker : function() {
                try {
                    olPage.Content.Divs._internal.Modal._prepareForRendering();
                    if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt && $('#' + olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt).css('display') != 'block') {
                        $('#' + olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt).show();
                        olPage.Content.Divs._internal.Modal.Center();
                    }

                    if (olPage.Content.Divs._internal.Toolbar._toolbarEnabled && olPage.Content.Divs.Load._toolbarLoaded) {
                        olPage.Content.Divs._internal.Toolbar.Enable();
                    }

                    $('#olBackup').hide();

                    if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != '') {
                        // max z index fix
                        $('*').filter(function() {
                            if ($(this).css('z-index') >= 2147483646) {
                                if ($(this).hasClass('olMaxZ') || $(this).hasClass('olMaxZ-1') || $(this).hasClass('olInherit') || $(this).hasClass('olLogoutDivLook') || $(this).hasClass('olToolbarDivLook') || $(this).hasClass('olPromptDivLookOptions')) {
                                    //our element, do nothing
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                            return false;
                        }).each(function() {
                            $(this).css('cssText', 'z-index:2147483645 !important');
                        });
                    }

                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('_olPromptChecker', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }

            },
            Initialise : function() {
                try {
                    //change img sources
                    olPage.Content.Divs._internal.ChangeImageSources();

                    olPage.Content.Divs._internal.PromptLicenceLimitReached.Initialise();
                    olPage.Content.Divs._internal.PromptMatter.Initialise();
                    olPage.Content.Divs._internal.PromptLogonDetails.Initialise();
                    olPage.Content.Divs._internal.PromptMatterSearch.Initialise();
                    olPage.Content.Divs._internal.Toolbar.Initialise();

                    olPage.Content.Divs._olPromptChecker();
                    olPage.Content.Divs._internal._olPromptCheckInterval = setInterval(function() {
                        olPage.Content.Divs._olPromptChecker();
                    }, 2000);

                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('Initialise Divs', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            SetInfoMsg : function(msgText, type) {
                try {
                    if (olPage.Content.Divs._internal.AlertPrompt != '') {
                        if ( typeof (type) === 'undefined')
                            type = 'i';
                        var infoText_ = olPage.Functions.GetLanguageItem('JS_OKLabel');
                        if (msgText == '') {
                            msgText = infoText_;
                            type = 'h';
                        }

                        var color_ = '';
                        switch(type) {
                        case 'a':
                            //alert
                            color_ = 'red';
                            break;
                        case 'i':
                            //info
                            color_ = '#014c8e';
                            break;
                        case 'w':
                            //warning
                            color_ = 'yellow';
                            break;
                        case 'h':
                            //hidden
                            color_ = 'white';
                        }

                        var infoTextId_ = olPage.Content.Divs._internal.AlertPrompt + ' #olInfoText';
                        olPage.Content.Divs._internal.CreateLabels(msgText, 320, 'body #' + infoTextId_, null);
                    }
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SetInfoMsg', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            Load : {
                // _firstOverlay : true,
                _internal : {
                    LoadOverlay : function(divIdToOverlay, mask) {
                        try {
                            if (divIdToOverlay != 'olToolbar') {
                                // various page fixes
                                $('[tabindex=-1]').removeAttr('tabindex');

                                var prompt_ = $('#' + divIdToOverlay);
                                olPage.Listeners._internal.Events._currentTabIndex = 0;
                                prompt_.select().focus();
                                prompt_.find('input.olInherit').each(function() {
                                    var type_ = $(this).attr('type');
                                    if (type_.indexOf('olType') != -1) {
                                        $(this).attr('type', type_.substring(6));
                                    }
                                });
                                olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt = divIdToOverlay;
                            }
                            olPage.Content.Divs._internal.Modal.Open(divIdToOverlay);
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('LoadOverlay', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    SortMatterDetails : function(matterNumber, matterName) {
                        try {
                            //sort matterDetails
                            var matterDetails_ = olPage.Data.PageInfo.Response.CheckMatterResponse.MatterDetails;
                            var matterDetail_;
                            var matterIndex_ = -1;

                            for (var i = 0; i < matterDetails_.length; i++) {
                                if (matterDetails_[i].MatterNumber == matterNumber) {
                                    matterIndex_ = i;
                                    break;
                                }
                            }

                            if (matterIndex_ > -1) {
                                matterDetail_ = matterDetails_.splice(matterIndex_, 1)[0];
                            } else {
                                matterDetail_ = {
                                    MatterName : matterName,
                                    MatterNumber : matterNumber
                                };
                            }

                            matterDetails_.reverse();
                            matterDetails_.push(matterDetail_);
                            matterDetails_.reverse();
                            while (matterDetails_.length > 10) {
                                matterDetails_.pop();
                            }
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SortMatterDetails', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    },
                    SortTimekeeperDetails : function() {
                        try {
                            //sort timekeeper details
                            var timekeeper_ = olPage.Data.PageFlags.TimekeeperNumber;
                            var timekeeperDetails_ = olPage.Data.PageInfo.Response.GetLocalPersonalCodeListResponse.LocalPersonalCodes;
                            var timekeeperIndex_ = -1;

                            for (var i = 0; i < timekeeperDetails_.length; i++) {
                                if (timekeeperDetails_[i] == timekeeper_) {
                                    timekeeperIndex_ = i;
                                    break;
                                }
                            }

                            if (timekeeperIndex_ > -1) {
                                timekeeperDetails_.splice(timekeeperIndex_, 1);
                            }

                            timekeeperDetails_.reverse();
                            timekeeperDetails_.push(timekeeper_);
                            timekeeperDetails_.reverse();
                            while (timekeeperDetails_.length > 10) {
                                timekeeperDetails_.pop();
                            }
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('SortTimekeeperDetails', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                PromptById : function(divIdToOverlay, mask) {
                    if ( typeof (mask) === 'undefined')
                        mask = true;

                    try {
                        switch(divIdToOverlay) {
                        case 'olPromptLogon':
                            olPage.Content.Divs.Load.PromptLogon(mask);
                            break;
                        case 'olPromptLogonDetails':
                            olPage.Content.Divs.Load.PromptLogonDetails(mask);
                            break;
                        case 'olPromptComment':
                            olPage.Content.Divs.Load.PromptComment(mask);
                            break;
                        case 'olPromptMatterSearch':
                            olPage.Content.Divs.Load.PromptMatterSearch(mask);
                            break;
                        case 'olStorePassword':
                            olPage.Content.Divs.Load.AskToStorePassword(mask);
                            break;
                        case 'olError':
                            olPage.Content.Divs.Load.Error(mask);
                            break;
                        case 'olPromptChooseApplication':
                            olPage.Content.Divs.Load.PromptChooseApplication(mask);
                            break;
                        case 'olPromptLicenceLimitReached':
                            olPage.Content.Divs.Load.PromptLicenceLimitReached(mask);
                            break;
                        case 'olPromptMatter':
                            olPage.Content.Divs.Load.PromptMatter(mask);
                            break;
                        case 'olResourceTimeout':
                            olPage.Content.Divs.Load.ResourceTimeout(mask);
                            break;
                        case 'olToolbar':
                            olPage.Content.Divs.Load.Toolbar(mask);
                            break;
                        case 'olWebControlMessage':
                            olPage.Content.Divs.Load.WebControlMessage(mask);
                            break;
                        default:
                            olPage.Content.Divs.Load._internal.LoadOverlay(divIdToOverlay, mask);
                            break;
                        }

                        divIdToOverlay = '';
                        mask = false;
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load PromptById', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }

                },
                PromptChooseApplication : function(mask) {
                    try {
                        //Clear div from existing data if there is anything
                        $('#olChooseApplication').empty();
                        olPage.Content.Divs._internal.PromptChooseApplication._internal.PopulateApplications();

                        olPage.Content.Divs.Load._internal.LoadOverlay('olPromptChooseApplication', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load PromptChooseApplication', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptComment : function(mask) {
                    try {
                        //Clear div from existing data
                        $('#olComments').empty();
                        olPage.Content.Divs._internal.PromptComment._internal.PopulateComments();

                        olPage.Content.Divs.Load._internal.LoadOverlay('olPromptComment', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load PromptComment', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptLogon : function(mask) {
                    try {
                        //Clear existing data from div
                        $('#olLogonAccounts').empty();
                        if (olPage.Content.Divs._internal.PromptLogon._internal.PopulateLogons()) {
                            olPage.Content.Divs.Load._internal.LoadOverlay('olPromptLogon', mask);
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load PromptLogon', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptLogonDetails : function(mask) {
                    try {
                        olPage.Content.Divs._internal.PromptLogonDetails._internal.PopulateLogonDetails();
                        olPage.Content.Divs.Load._internal.LoadOverlay('olPromptLogonDetails', mask);
                        if ($('#olTitleData').val() == '') {
                            $('#olTitleData').select().focus();
                        } else {
                            var arrayUP_ = olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayUP;
                            if (olFunctions.IsFilledArray(arrayUP_)) {
                                for (var i = 0; i < arrayUP_.length; i++) {
                                    if (arrayUP_[i].CanBeModified) {
                                        $('#' + arrayUP_[i].Id).select().focus();
                                    }
                                    break;
                                }
                            }
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load PromptLogonDetails', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptLicenceLimitReached : function(mask) {
                    try {
                        olPage.Content.Divs.Load._internal.LoadOverlay('olPromptLicenceLimitReached', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load PromptLicenceLimitReached', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptMatter : function(mask, selectedRow) {
                    try {
                        if ( typeof (selectedRow) === 'undefined')
                            selectedRow = false;

                        if (selectedRow) {
                            olPage.Content.Divs.Load._internal.SortMatterDetails(olPage.Content.Divs._internal.PromptMatterSearch._internal.SelectedMatterNumber, olPage.Content.Divs._internal.PromptMatterSearch._internal.SelectedMatterName);

                            //olPage.Content.Divs._internal.PromptMatter._internal.PopulateMatterDropDownList('olMatterList', olPage.Data.PageInfo.Response.CheckMatterResponse.MatterDetails);
                            olPage.Content.Divs._internal.PromptMatter._internal.PopulateMatterDropDownList();
                            olPage.Content.Divs._internal.PromptMatter._internal.CopyMatterListValue();
                        }

                        if (olPage.Data.PageInfo.Response.GetLocalPersonalCodeListResponse && olFunctions.IsFilledArray(olPage.Data.PageInfo.Response.GetLocalPersonalCodeListResponse.LocalPersonalCodes)) {
                            olPage.Content.Divs.Load._internal.SortTimekeeperDetails();
                            olPage.Content.Divs._internal.PromptMatter._internal.PopulateTimekeeperDropDownList();
                        }

                        var skipMatterDetails_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0].SkipMatterDetails;
                        if (olInjection.InjectionHappened || skipMatterDetails_) {
                            $('#olImgMatterCancel').show();
                        } else {
                            $('#olImgMatterCancel').hide();
                        }

                        //deselect all lists so change event can fire.
                        olPage.Content.Divs._internal.PromptMatter._internal.UnselectMatterDropDownList();
                        olPage.Content.Divs._internal.PromptMatter._internal.UnselectTimekeeperDropDownList();
                        olPage.Content.Divs._internal.PromptMatter._internal.CheckData();
                        olPage.Content.Divs.Load._internal.LoadOverlay('olPromptMatter', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load PromptMatter', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptMatterSearch : function(mask, selectedMatterNumber) {
                    try {
                        if ( typeof (selectedMatterNumber) === 'undefined')
                            selectedMatterNumber = '';
                        if (selectedMatterNumber == '') {
                            //$('#olMatterSearchInp').val('Search').focusout();
                            $('#olMatterSearchInp').val(olPage.Functions.GetLanguageItem('JS_Search')).focusout();
                        } else {
                            $('#olMatterSearchInp').val(selectedMatterNumber).select().focus();
                        }

                        if (!olPage.Content.Divs._internal.PromptMatterSearch._internal.TableInitialised) {
                            olPage.Content.Divs._internal.PromptMatterSearch._internal.ClearSearchTable();
                        }

                        olPage.Content.Divs.Load._internal.LoadOverlay('olPromptMatterSearch', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load PromptMatterSearch', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                AskToStorePassword : function(mask) {
                    try {
                        if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != 'olStorePassword') {

                            //disable toolbar buttons during ask for password store
                            olPage.Content.Divs._internal.Toolbar._internal.ToolbarIconsSetDisabled(true);
                            //IE, jquery-prototype conflict
                            switch(olPage.Data.PageFlags.BrowserName) {
                            case 'iejs':
                                if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                    $('#olToolbarMenu').hide();
                                } else {
                                    $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                                }
                                break;
                            default:
                                $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                                break;
                            }
                            //$('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());

                            olPage.Content.Divs._internal.Toolbar._internal.MenuOpened = false;

                            olPage.Content.Divs.Load._internal.LoadOverlay('olStorePassword', mask);
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load AskToStorePassword Load', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                ResourceTimeout : function(mask) {
                    try {
                        if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != 'olResourceTimeout') {
                            //disable toolbar buttons during resource timeout choosing
                            olPage.Content.Divs._internal.Toolbar._internal.ToolbarIconsSetDisabled(true);
                            //IE, jquery-prototype conflict

                            if (olPage.Data && olPage.Data.PageFlags && olPage.Data.PageFlags.BrowserName) {
                                switch(olPage.Data.PageFlags.BrowserName) {
                                case 'iejs':
                                    if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                        $('#olToolbarMenu').hide();
                                    } else {
                                        $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                                    }
                                    break;
                                default:
                                    $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                                    break;
                                }
                            } else {
                                $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                            }

                            //$('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                            olPage.Content.Divs._internal.Toolbar._internal.MenuOpened = false;

                            var appNameLabel_ = '';
                            var title_ = olPage.Content.Divs._internal.ResourceTimeout._internal.ApplicationName;
                            appNameLabel_ = olPage.Content.Divs._internal.CreateLabels(title_, 600, null, 'olFontBig');
                            $('#olResourceName').text(appNameLabel_.Text);
                            if (appNameLabel_.Text != appNameLabel_.Title) {
                                $('#olResourceName').attr('title', appNameLabel_.Title);
                            }

                            olPage.Content.Divs._internal.ResourceTimeout._internal._previousPrompt = olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt;
                            olPage.Content.Divs._internal.ResourceTimeout._internal._previousMask = olPage.Content.Divs._internal.MaskOn;
                            if (olPage.Content.Divs._internal.ResourceTimeout._internal._previousPrompt != '') {
                                olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(mask);
                            }
                            olPage.Content.Divs.Load._internal.LoadOverlay('olResourceTimeout', mask);

                            olPage.Content.Divs._internal.ResourceTimeout._internal.timerValue = 61;
                            olPage.Content.Divs._internal.ResourceTimeout._internal.Timer();
                            olPage.Content.Divs._internal.ResourceTimeout._internal.FlashTitle();
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load ResouceTimeout', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                WebControlMessage : function(mask) {
                    try {
                        //disable toolbar buttons during resource timeout choosing
                        olPage.Content.Divs._internal.Toolbar._internal.ToolbarIconsSetDisabled(true);
                        //IE, jquery-prototype conflict
                        switch(olPage.Data.PageFlags.BrowserName) {
                        case 'iejs':
                            if (olPage.Data.LocalPageFlags.HasPrototypeFramework) {
                                $('#olToolbarMenu').hide();
                            } else {
                                $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                            }
                            break;
                        default:
                            $('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                            break;
                        }
                        //$('#olToolbarMenu').hide(olOptions.General.Page.TransitionTime());
                        olPage.Content.Divs._internal.Toolbar._internal.MenuOpened = false;

                        olPage.Content.Divs._internal.WebControlMessage._internal._previousPrompt = olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt;
                        olPage.Content.Divs._internal.WebControlMessage._internal._previousMask = olPage.Content.Divs._internal.MaskOn;
                        if (olPage.Content.Divs._internal.WebControlMessage._internal._previousPrompt != '') {
                            olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(mask);
                        }
                        olPage.Content.Divs._internal._maskOpacity = 0.85;
                        olPage.Content.Divs.Load._internal.LoadOverlay('olWebControlMessage', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load WebControlMessage', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                Error : function(mask) {
                    try {
                        //disable toolbar buttons during resource timeout choosing
                        olPage.Content.Divs._internal.Toolbar._internal.ToolbarIconsSetDisabled(true);
                        $('#olToolbarMenu').hide();
                        olPage.Content.Divs._internal.Toolbar._internal.MenuOpened = false;

                        if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt != '') {
                            olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(mask);
                        }
                        olPage.Content.Divs.Load._internal.LoadOverlay('olError', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load Error prompt:', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                _toolbarLoaded : false,
                Toolbar : function(mask) {
                    try {
                        olPage.Content.Divs._internal.Toolbar.Enable();
                        olPage.Content.Divs.Load._internal.LoadOverlay('olToolbar', mask);
                        olPage.Content.Divs.Load._toolbarLoaded = true;

                        switch(olOptions.General.Page.ToolbarPosition()) {
                        case 0:
                            $('#olToolbar').css({
                                top : 0,
                                bottom : '',
                                left : 0,
                                right : ''
                            });
                            break;
                        case 1:
                            $('#olToolbar').css({
                                top : '',
                                bottom : 0,
                                left : 0,
                                right : ''
                            });
                            break;
                        case 2:
                            $('#olToolbar').css({
                                top : '',
                                bottom : 0,
                                left : '',
                                right : 0
                            });
                            break;
                        case 3:
                            $('#olToolbar').css({
                                top : 0,
                                bottom : '',
                                left : '',
                                right : 0
                            });
                            break;
                        }

                        switch(olOptions.General.Page.ToolbarWidth()) {
                        case 0:
                            break;
                        case 1:
                            $('#olToolbar').css({
                                width : '99%'
                            });
                            break;
                        }

                        //on first page apearance olPage.Data.PageFlags.ToolbarMinimized is null and then default setting for toolbar is used
                        if (olPage.Data.PageFlags.ToolbarMinimized == null) {
                            olPage.Data.PageFlags.ToolbarMinimized = olOptions.General.Page.ToolbarMinimized();
                        }

                        switch(olPage.Data.PageFlags.ToolbarMinimized) {
                        case true:
                            $('#olToolbarMaximized').hide();
                            $('#olToolbarMinimized').show();
                            break;
                        case false:
                            $('#olToolbarMinimized').hide();
                            $('#olToolbarMaximized').show();
                            break;
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Load Toolbar', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                }
            },
            Close : {
                _internal : {
                    CloseOverlay : function(divIdToCloseOverlay, mask) {
                        try {
                            var prompt_ = $('#' + divIdToCloseOverlay);
                            prompt_.hide();

                            prompt_.find('input.olInherit').each(function() {
                                var type_ = 'olType' + $(this).attr('type');
                                $(this).attr('type', type_);
                            });

                            olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt = '';
                            olPage.Content.Divs._internal.Modal.Close();
                            olPage.Content.Divs._internal.SetMask(mask);
                            olPage.Content.Divs._common.LogonDataArray = null;
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('CloseOverlay', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                },
                PromptChooseApplication : function(mask) {
                    try {
                        olPage.Content.Divs.Close._internal.CloseOverlay('olPromptChooseApplication', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close PromptChooseApplication', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptComment : function(mask) {
                    try {
                        olPage.Content.Divs.Close._internal.CloseOverlay('olPromptComment', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close PromptComment', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptLogon : function(mask) {
                    try {
                        if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt == 'olPromptLogon') {
                            olPage.Content.Divs.Close._internal.CloseOverlay('olPromptLogon', mask);
                        }
                        olPage.Content.Divs._internal.Toolbar.CloseMenu();
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close PromptLogon', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptLogonDetails : function(mask) {
                    try {
                        olPage.Content.Divs.Close._internal.CloseOverlay('olPromptLogonDetails', mask);
                        olPage.Content.Divs._internal.EnableElements(olPage.Content.Divs._internal.PromptLogonDetails._internal.ArrayElements);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close PromptLogonDetails', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptLicenceLimitReached : function(mask) {
                    try {
                        olPage.Content.Divs.Close._internal.CloseOverlay('olPromptLicenceLimitReached', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close PromptLicenceLimitReached', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptMatter : function(mask) {
                    try {
                        olPage.Content.Divs.Close._internal.CloseOverlay('olPromptMatter', mask);
                        olPage.Content.Divs._internal.Toolbar.CloseMenu();
                        olPage.Content.Divs._internal.PromptMatter._internal.ClearValidatingInterval();
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close PromptMatter', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                PromptMatterSearch : function(mask) {
                    try {
                        olPage.Content.Divs.Close._internal.CloseOverlay('olPromptMatterSearch', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close PromptMatterSearch', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                AskToStorePassword : function(mask) {
                    try {
                        //enable toolbar buttons
                        olPage.Content.Divs._internal.Toolbar._internal.ToolbarIconsSetDisabled(false);

                        if (olPage.Content.Divs._internal.AskToStorePassword._internal._previousPrompt != '') {
                            olPage.Content.Divs.Close._internal.CloseOverlay('olStorePassword', olPage.Content.Divs._internal.AskToStorePassword._internal._previousMask);
                            //olPage.Content.Divs.Load._internal.LoadOverlay(olPage.Content.Divs._internal.AskToStorePassword._internal._previousPrompt, olPage.Content.Divs._internal.AskToStorePassword._internal._previousMask);
                            olPage.Content.Divs.Load.PromptById(olPage.Content.Divs._internal.AskToStorePassword._internal._previousPrompt, olPage.Content.Divs._internal.AskToStorePassword._internal._previousMask);
                        } else {
                            olPage.Content.Divs.Close._internal.CloseOverlay('olStorePassword', mask);
                        }
                        olPage.Content.Divs._internal.AskToStorePassword._internal._previousPrompt = '';
                        olPage.Content.Divs._internal.AskToStorePassword._internal._previousMask = false;
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close AskToStorePassword', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                ResourceTimeout : function(mask) {
                    try {
                        //enable toolbar buttons during resource timeout choosing
                        olPage.Content.Divs._internal.Toolbar._internal.ToolbarIconsSetDisabled(false);

                        if (olPage.Content.Divs._internal.ResourceTimeout._internal._previousPrompt != '') {
                            olPage.Content.Divs.Close._internal.CloseOverlay('olResourceTimeout', olPage.Content.Divs._internal.ResourceTimeout._internal._previousMask);
                            //olPage.Content.Divs.Load._internal.LoadOverlay(olPage.Content.Divs._internal.ResourceTimeout._internal._previousPrompt, olPage.Content.Divs._internal.ResourceTimeout._internal._previousMask);
                            olPage.Content.Divs.Load.PromptById(olPage.Content.Divs._internal.ResourceTimeout._internal._previousPrompt, olPage.Content.Divs._internal.ResourceTimeout._internal._previousMask);
                        } else {
                            olPage.Content.Divs.Close._internal.CloseOverlay('olResourceTimeout', mask);
                        }
                        olPage.Content.Divs._internal.ResourceTimeout._internal._previousPrompt = '';
                        olPage.Content.Divs._internal.ResourceTimeout._internal._previousMask = false;

                        olPage.Content.Divs._internal.ResourceTimeout._internal.ClearTitle();
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close ResourceTimeout', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                WebControlMessage : function(mask) {
                    try {
                        olPage.Content.Divs._internal._maskOpacity = 0.7;
                        if (olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt == 'olWebControlMessage') {
                            //enable toolbar buttons
                            olPage.Content.Divs._internal.Toolbar._internal.ToolbarIconsSetDisabled(false);
                            olPage.Content.Divs._internal.Toolbar.Enable();

                            if (olPage.Content.Divs._internal.WebControlMessage._internal._previousPrompt != '') {

                                olPage.Content.Divs.Close._internal.CloseOverlay('olWebControlMessage', olPage.Content.Divs._internal.WebControlMessage._internal._previousMask);
                                //olPage.Content.Divs.Load._internal.LoadOverlay(olPage.Content.Divs._internal.WebControlMessage._internal._previousPrompt, olPage.Content.Divs._internal.WebControlMessage._internal._previousMask);
                                olPage.Content.Divs.Load.PromptById(olPage.Content.Divs._internal.WebControlMessage._internal._previousPrompt, olPage.Content.Divs._internal.WebControlMessage._internal._previousMask);
                            } else {
                                olPage.Content.Divs.Close._internal.CloseOverlay('olWebControlMessage', mask);
                            }
                            olPage.Content.Divs._internal.WebControlMessage._internal._previousPrompt = '';
                            olPage.Content.Divs._internal.WebControlMessage._internal._previousMask = false;
                        }
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close WebControlMessage', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                },
                Error : function(mask) {
                    try {
                        olPage.Content.Divs.Close._internal.CloseOverlay('olError', mask);
                    } catch(e) {
                        var alertErrorContent_ = new olFunctions.AlertContent('Close Error prompt', e.message + '\n' + e.stack);
                        olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                    }
                }
            }
        },
        PageEvents : {
        },
        Logout : {
            Flags : {
                _IFrameReady : null,
                _IterrationDone : null,
                _ScriptIndex : null,
                _IFrameLoaded : false
            },
            IFrame : {
                Load : function(url, fakeParam) {
                    olPage.Content.Logout.Flags._IFrameLoaded = false;
                    var iframe_ = document.getElementById('olFrame');
                    var tmpSrc_;
                    if (url.indexOf("?") != -1) {
                        tmpSrc_ = url + '&onelog="' + fakeParam + '"';
                    } else {
                        tmpSrc_ = url + '?onelog="' + fakeParam + '"';
                    }
                    iframe_.contentWindow.location.href = tmpSrc_;
                    //iframe_.src = tmpSrc_;

                    return true;
                }
            },
            _iOlFrame : null,
            ProcessCurrentScript : function() {
                var currentScript_ = olPage.Content.Logout.Flags._closingResponses.LogoutScript[olPage.Content.Logout.Flags._ScriptIndex];
                var closingResponses_ = olPage.Content.Logout.Flags._closingResponses;
                // var applicationName_ = closingResponses_.ApplicationName;
                var applicationSessionId_ = closingResponses_.ApplicationSessionId;
                // var lastSessionWindow_ = closingResponses_.LastSessionWindow;
                // var lastSessionWindowSpecified_ = closingResponses_.LastSessionWindowSpecified;
                var lastURL_ = closingResponses_.LastURL;

                var type_ = '';

                if (currentScript_.ClickLink) {
                    type_ = 'ClickLink';
                } else if (currentScript_.Form) {
                    type_ = 'Form';
                } else if (currentScript_.GoToURL) {
                    type_ = 'GoToURL';
                }

                $('iframe').each(function(i, frame_) {
                    if (frame_.id == 'olFrame') {
                        olPage.Content.Logout._iOlFrame = frame_.contentDocument ? frame_.contentDocument : frame_.contentWindow.document;
                    }
                });

                // contain all inspections to olFrame document
                olInjection.ElementValue.SetDocuments(olPage.Content.Logout._iOlFrame);

                switch(type_) {
                case 'ClickLink':
                    //var match_ = "*:contains('" + currentScript_.ClickLink.Match + "')";
                    var match_ = currentScript_.ClickLink.Match;
                    var elements_ = new Array();

                    for (var l = 0; l < olInjection.ElementValue._internal.Documents.length; l++) {
                        var allElements_ = olInjection.ElementValue._internal.Documents[l].getElementsByTagName('*');

                        for (var m = 0; m < allElements_.length; m++) {
                            if (allElements_[m].outerHTML.indexOf(match_) !== -1) {
                                elements_.push(allElements_[m]);
                            }
                        }
                    }
                    for (var i = elements_.length - 1; i >= 0; i--) {
                        try {
                            elements_[i].click();
                        } catch(e) {
                            var alertErrorContent_ = new olFunctions.AlertContent('ClickLink', e.message + '\n' + e.stack);
                            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                        }
                    }
                    break;
                case 'Form':
                    var currentForm_ = currentScript_.Form;

                    if (olFunctions.IsFilledArray(currentForm_.URL)) {
                        for (var j = 0; j < currentForm_.URL.length; j++) {
                            if (lastURL_.toLowerCase().indexOf(currentForm_.URL[j].toLowerCase()) >= 0) {
                                var formAccessType_ = null;
                                var formAccessParam_ = null;

                                if (currentForm_.UseForm) {
                                    formAccessType_ = olDictionaries.Dictionaries.FormAccessType(currentForm_.Id, currentForm_.Name, currentForm_.IndexSpecified);
                                    switch(formAccessType_) {
                                    case 'byIndex':
                                        formAccessParam_ = currentForm_.Index;
                                        break;
                                    case 'byID':
                                        formAccessParam_ = currentForm_.Id;
                                        break;
                                    case 'byName':
                                        formAccessParam_ = currentForm_.Name;
                                        break;
                                    }
                                }

                                if (olFunctions.IsFilledArray(currentForm_.Elements)) {
                                    //click elements
                                    for (var k = 0; k < currentForm_.Elements.length; k++) {
                                        var currentElement_ = currentForm_.Elements[k];
                                        var elElementType_ = olDictionaries.Dictionaries.ElElementType(currentElement_.ElementTypeSpecified, currentElement_.ElementType);
                                        var elAccessType_ = olDictionaries.Dictionaries.ElAccessType(currentElement_.Id, currentElement_.Name, currentElement_.IndexSpecified);
                                        var elCustomTagName_ = currentElement_.TagName;

                                        var elAccessParam_ = null;
                                        switch(elAccessType_) {
                                        case 'byIndex':
                                            elAccessParam_ = currentElement_.Index;
                                            break;
                                        case 'byID':
                                            elAccessParam_ = currentElement_.Id;
                                            break;
                                        case 'byName':
                                            elAccessParam_ = currentElement_.Name;
                                            break;
                                        }

                                        olInjection.ElementValue.Click(elAccessParam_, elAccessType_, currentElement_.Instance, elElementType_, elCustomTagName_, formAccessParam_, formAccessType_);
                                    }
                                }
                                break;
                            }
                        }
                    }
                    break;
                case 'GoToURL':
                    var gotoUrl = currentScript_.GoToURL;
                    if (gotoUrl && gotoUrl.charAt(0) == '~') {
                        gotoUrl = olPage.Functions.GetDomainFromUrl(lastURL_) + currentScript_.GoToURL.substring(1);
                    }
                    olPage.Content.Logout.IFrame.Load(gotoUrl, applicationSessionId_);
                    break;
                default:
                    break;
                }
            },
            NewIteration : function() {
                try {
                    olPage.Content.Logout.Flags._ScriptIndex++;
                    if (olPage.Content.Logout.Flags._closingResponses.LogoutScript[olPage.Content.Logout.Flags._ScriptIndex]) {
                        try {
                            olPage.Content.Logout.ProcessCurrentScript();
                        } catch(e) {
                            olPage.Messages.LogoutSequenceCompleted(olPage.Content.Logout.Flags._closingResponses.ApplicationSessionId);
                            if (!olOptions.Debug.DebugMode()) {
                                olPage.Messages.CloseTab(10);
                            }
                        }
                    } else {
                        olPage.Messages.LogoutSequenceCompleted(olPage.Content.Logout.Flags._closingResponses.ApplicationSessionId);
                        if (!olOptions.Debug.DebugMode()) {
                            olPage.Messages.CloseTab(10);
                        }
                    }
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('NewIteration', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            },
            ProcessLogoutSequence : function(closingResponses) {
                try {
                    if (closingResponses.LogoutScript && olFunctions.IsFilledArray(closingResponses.LogoutScript)) {
                        olPage.Content.Divs._internal.Modal._$backup.append('<iframe id="olFrame" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation" width=500 height=500 frameborder=0 marginheight=0 marginwidth=0 scrolling=no ></iframe>');
                        olPage.Content.Logout.Flags._ScriptIndex = -1;
                        olPage.Content.Logout.Flags._closingResponses = closingResponses;

                        $('iframe#olFrame').load(function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            // olPage.Messages.LogoutSequenceCompleted(olPage.Content.Logout.Flags._closingResponses.ApplicationSessionId);
                            olPage.Content.Logout.NewIteration();
                        });

                        var lastURL_ = olPage.Content.Logout.Flags._closingResponses.LastURL;
                        olPage.Content.Logout.IFrame.Load(lastURL_, closingResponses.ApplicationSessionId);
                    }
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('ProcessLogoutSequence', e.message + '\n' + e.stack);
                    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
                }
            }
        },
        AttachEventsWithTimeouts : function() {
            olPage.Content.AttachEvents();
            olPage.Content.FormFillMode();
            olPage.intervalID = setInterval(function() {
                olPage.Content.AttachEvents();
                olPage.Content.FormFillMode();
            }, 1000);
            setTimeout(function() {
                clearInterval(olPage.intervalID);
            }, 15000);
        },
        AttachEvents : function(attachEventsObject, bAnalysis, feature) {
            if ( typeof (attachEventsObject) === 'undefined')
                attachEventsObject = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];

            if ( typeof (bAnalysis) === 'undefined')
                bAnalysis = false;

            if ( typeof (feature) === 'undefined')
                feature = [];

            var attachEvents_ = attachEventsObject.AttachEvents;
            if (olFunctions.IsFilledArray(attachEvents_)) {
                olInjection.ElementValue.SetDocuments();
                for (var i = 0; i < attachEvents_.length; i++) {
                    var urls_ = [];
                    if (bAnalysis) {
                        urls_ = attachEventsObject.URLS;
                    } else {
                        urls_ = attachEvents_[i].URLs;
                    }
                    if (olFunctions.CheckUrls(urls_)) {
                        var elements_ = attachEvents_[i].Elements;
                        if (olFunctions.IsFilledArray(elements_)) {
                            for (var k = 0; k < elements_.length; k++) {
                                var currentElement_ = elements_[k];
                                var elElementType_ = olDictionaries.Dictionaries.ElElementType(currentElement_.ElementTypeSpecified, currentElement_.ElementType);
                                var elAccessType_ = olDictionaries.Dictionaries.ElAccessType(currentElement_.Id, currentElement_.Name, currentElement_.IndexSpecified);
                                var elCustomTagName_ = currentElement_.TagName;
                                var elAttributes_ = currentElement_.Attributes;
                                var elAttachEvents_ = currentElement_.AttachEvents;
                                var elAccessParam_ = null;

                                switch(elAccessType_) {
                                case 'byIndex':
                                    elAccessParam_ = currentElement_.Index;
                                    break;
                                case 'byID':
                                    elAccessParam_ = currentElement_.Id;
                                    break;
                                case 'byName':
                                    elAccessParam_ = currentElement_.Name;
                                    break;
                                }
                                if (elAccessType_ != 'other') {
                                    olInjection.ElementValue.AttachEvent(elAccessParam_, elAccessType_, currentElement_.Instance, elElementType_, elCustomTagName_, null, null, elAttachEvents_, bAnalysis, feature);
                                } else {
                                    //other
                                    //checking attributes
                                    if (olFunctions.IsFilledArray(elAttributes_)) {
                                        for (var l = 0; l < elAttributes_.length; l++) {
                                            if (elAttributes_[l].IsMatch) {
                                                for (var m = 0; m < olInjection.ElementValue._internal.Documents.length; m++) {
                                                    var currentDocument_ = olInjection.ElementValue._internal.Documents[m];
                                                    $(currentDocument_).find("[" + elAttributes_[l].Name + "*='" + elAttributes_[l].Value + "']").each(function(i) {
                                                        if (olFunctions.IsFilledArray(elAttachEvents_)) {
                                                            for (var m = 0; m < elAttachEvents_.length; m++) {
                                                                if (bAnalysis) {
                                                                    olInjection.BindElementsForAnalysis(this, elAttachEvents_[m], feature);
                                                                } else {
                                                                    olInjection.BindElementsWithTimeout(this, elAttachEvents_[m]);
                                                                }
                                                            }
                                                        } else {
                                                            olInjection.BindElementsWithTimeout(this, 'click');
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        },
        FormFillMode : function() {
            var beforeNavigateResponse_ = olPage.Data.PageInfo.Response.BeforeNavigateResponses[0];
            if (beforeNavigateResponse_.FormFillMode && beforeNavigateResponse_.FormFillMode == 1) {
                //attach globaly... don't know if this is good enough
                $("[src]").each(function(i) {
                    olInjection.BindElementsWithTimeout(this, 'load');
                });
                $('iframe').each(function(j) {
                    olInjection.BindElementsWithTimeout(this, 'load');
                });
                $('frame').each(function(j) {
                    olInjection.BindElementsWithTimeout(this, 'load');
                });
                $("[href]").each(function(i) {
                    olInjection.BindElementsWithTimeout(this, 'click');
                });

                setTimeout(function() {
                    if (!olInjection.ElementValue._internal.ElementValueSet) {
                        olPage.Content.Inject();
                    }
                }, 3000);

                setTimeout(function() {
                    if (!olInjection.ElementValue._internal.ElementValueSet) {
                        olPage.Content.Inject();
                    }
                }, 5000);
            }
        },
        count : 0,
        ProcessPage : function() {
            try {
                olPage.Content.Modules.InitialiseModulesArray();
                olPage.Content.Modules.ActivateAnalysis();
                olPage.Content.Modules.ActivateWebControl();
                olPage.Content.Modules.ActivateResource();
                olPage.Content.Modules.ProcessModules();
            } catch(e) {
                var alertErrorContent_ = new olFunctions.AlertContent('ProcessPage', e.message + '\n' + e.stack);
                olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
            }
        },
        Inject : function() {
            olPage.Content._internal.PrepareInjectionParameters();
            if (olPage.Content._internal.CheckAllforInjection()) {
                olPage.Content._internal.SetMatterVariables();
                olPage.Content._internal.SetToolbarDetails();
                olInjection.InjectElements();
            }
        }
    },
    Initialise : function() {
        try {
            //Initialise options
            olOptions.IntialiseOptionsData();
            //Events
            olPage.Listeners.InitiateContentEventListeners();
            //Messages
            olPage.Listeners.InitiateContentMessageListeners();
            //Modal
            olPage.Content.Divs._internal.Modal.Initialise();
            //IE compatibility mode setting for page
            olPage.Functions.SetIECompatibilityMode();
            //Has prtototype framework
            olPage.Functions.SetHasPrototypeFramework();
            //Style
            olPage.Content.HtmlAppends.AddStyle();
            //Inject misc
            olPage.Content.HtmlAppends.AddMisc();
        } catch(e) {
            var alertErrorContent_ = new olFunctions.AlertContent('Initialise', e.message + '\n' + e.stack);
            olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
        }
    },
    PageReset : function() {
        olPage.Data.PageInfo = null;
        olInjection.InjectionHappened = false;
        olInjection.ElementValue._internal.SetTimeoutForInjectElements = false;
        olPage.Content.Modules._internal.NeededModuelsArray = [];
        olPage.Content.Modules._internal._processOngoing = false;
        olPage.Content.Divs._internal.MaskOn = false;
        olPage.Content.Divs._internal._maskOpacity = 0.7;
        olPage.Content.Divs._internal.AlertPrompt = '';

        olPage.Content.Modules._internal.WebControl._pageBlocked = false;
        olPage.Content.Modules._internal.WebControl._processWebControlNeeded = false;
        olPage.Content.Modules._internal.WebControl._currentWebRuleIndex = 0;
        olPage.Content.Modules._internal.WebControl._shownWebRulesMessagesArray = [];

        olPage.Content.Modules._internal.Resource._processResourceNeeded = false;

        olPage.Content.Modules._internal.Analysis._processPageAnalysisNeeded = false;
        olPage.Content.Modules._internal.Analysis.FeaturesArray = false;

        olPage.Content.Divs._internal.Toolbar._internal.CloseCurrentPrompt(false);
        olPage.Content.Divs._internal.Toolbar.CloseMenu();
        olPage.Content.Divs._internal.Toolbar.Disable();
        olPage.Content.Divs._internal.Toolbar._internal.MenuOpened = false;
        olPage.Content.Divs._internal.Toolbar._internal.ChromeInvertedTime = null;
        olPage.Content.Divs._internal.Toolbar._internal.CurrentPrompt = '';
    },
    Log : function(message) {
        if (olOptions.Debug.Errors()) {
            try {
                switch(olPage.Data.PageFlags.BrowserName) {
                case 'iejs':
                    kango.console.log('PageLOG: ');
                    kango.console.log(message);
                    break;
                default :
                    console.info(message);
                    break;
                }
            } catch(e) {
                kango.console.log(message);
            }
        }
    }
};

/**
 *  one time page content initialisation
 */

//First time initialisation
try {
    // KangoAPI.onReady(function() {
    olPage.Initialise();
    // });
} catch(e) {
    var alertErrorContent_ = new olFunctions.AlertContent('kango.storage.getItem', e.message + '\n' + e.stack);
    olFunctions.Alert(olOptions.Debug.Errors(), alertErrorContent_);
}
