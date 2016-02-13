/**
 *  OneLog Functions
 */

// Global variables
/* global olOptions, kango */

var olFunctions = {
    Alert : function(bShow, alertContent) {
        try {
            if (bShow) {
                if (olOptions) {
                    if (olOptions.Debug.Alerts()) {
                        alert(alertContent.Title + ' - ' + alertContent.Message);
                    }
                    var browserName_ = kango.browser.getName();
                    switch (browserName_) {
                    case 'ie':
                        kango.console.log(alertContent.Title + ' - ' + alertContent.Message);
                        break;
                    default :
                        console.debug(alertContent.Title + ' - ' + alertContent.Message);
                    }

                    if (olOptions.Debug.Notifications()) {
                        if (!olOptions._internal.Page) {
                            var notification_ = kango.ui.notifications.createNotification(alertContent.Title, alertContent.TimeStamp + ' ' + alertContent.Message, kango.io.getResourceUrl('res/olNotificationIcon.png'));
                            notification_.show();
                        } else {
                            kango.dispatchMessage("olNotification", alertContent);
                        }
                    }
                } else {
                    alert(alertContent.Title + ' - ' + alertContent.Message);
                }
            }
        } catch(e) {
            console.log(alertContent.Title + ' - ' + alertContent.Message);
        }
    },
    AlertContent : function(title, message) {
        var self = this;
        if ( typeof (message) === 'undefined')
            message = '';
        self.Title = title;
        self.Message = message;

        var date_ = new Date();
        var timestamp_ = Math.round(+date_ / 1000) + ':' + Math.round(+date_ % 1000);
        self.TimeStamp = timestamp_.slice(5);
    },
    IsFilledArray : function(ar) {
        try {
            if (ar.length && ar.length > 0) {
                return true;
            } else {
                return false;
            };
        } catch (e) {
            return false;
        }
    },
    olAddEventListener : function(element, event, eventFunction) {
        if (element.addEventListener) {
            element.removeEventListener(event, eventFunction);
            element.addEventListener(event, eventFunction);
        } else if (element.attachEvent) {
            element.detachEvent('on' + event, eventFunction);
            element.attachEvent('on' + event, eventFunction);
        }
    },
    CompareTabUrl : function(url) {
        //ignoring relative urls, deleting everything from the # till the end Firefox fix
        inputUrl_ = String(url).toLowerCase();
        sourceUrl_ = String(document.URL).toLowerCase();

        //removing * from start of input url
        if (inputUrl_.indexOf('*') == 0) {
            inputUrl_ = inputUrl_.substring(1, inputUrl_.length);
        }
        //removing hashtag info from urls
        if (inputUrl_.indexOf('#') != -1) {
            inputUrl_ = inputUrl_.substring(0, inputUrl_.indexOf('#') - 1);
        }
        if (sourceUrl_.indexOf('#') != -1) {
            sourceUrl_ = sourceUrl_.substring(0, sourceUrl_.indexOf('#') - 1);
        }

        return (inputUrl_ == 'null' || inputUrl_ == sourceUrl_ || inputUrl_.indexOf(sourceUrl_) !== -1 || sourceUrl_.indexOf(inputUrl_) !== -1);
    },
    CompareTabUrlForUrlRules : function(url) {
        inputUrl_ = String(url).toLowerCase();
        sourceUrl_ = String(document.URL).toLowerCase();

        //removing * from start of input url
        if (inputUrl_.indexOf('*') == 0) {
            inputUrl_ = inputUrl_.substring(1, inputUrl_.length);
        }
        return (inputUrl_ == 'null' || inputUrl_ == sourceUrl_ || inputUrl_.indexOf(sourceUrl_) !== -1 || sourceUrl_.indexOf(inputUrl_) !== -1);
    },
    CompareUrls : function(inputUrl, sourceUrl) {
        //ignoring relative urls, deleting everything from the # till the end Firefox fix
        //but use copy of sources
        var inputUrl_ = inputUrl;
        var sourceUrl_ = sourceUrl;

        if (inputUrl.indexOf('#') != -1) {
            inputUrl_ = inputUrl.substring(0, inputUrl.indexOf('#') - 1);
        }
        if (sourceUrl.indexOf('#') != -1) {
            sourceUrl_ = sourceUrl.substring(0, sourceUrl.indexOf('#') - 1);
        }

        return (inputUrl_ == 'null' || inputUrl_ == sourceUrl_ || inputUrl_.indexOf(sourceUrl_) !== -1 || sourceUrl_.indexOf(inputUrl_) !== -1);
    },
    _checkUrlArray : function(urlArray) {
        var urlCheck_ = false;
        for (var j = 0; j < urlArray.length; j++) {
            if (olFunctions.CompareTabUrlForUrlRules(urlArray[j])) {
                urlCheck_ = true;
                break;
            }
        }
        return urlCheck_;
    },
    CheckUrls : function(matchUrls, notMatchUrls) {
        var result_;
        if (olFunctions.IsFilledArray(matchUrls)) {
            if (olFunctions._checkUrlArray(matchUrls)) {
                if (olFunctions.IsFilledArray(notMatchUrls) && olFunctions._checkUrlArray(notMatchUrls)) {
                    result_ = false;
                } else {
                    result_ = true;
                }
            } else {
                result_ = false;
            }
        } else {
            result_ = true;
        }
        return result_;
    },
    RemoveComments : function(str) {
        str = ('__' + str + '__').split('');
        var mode = {
            singleQuote : false,
            doubleQuote : false,
            regex : false,
            blockComment : false,
            lineComment : false,
            condComp : false
        };
        for (var i = 0,
            l = str.length; i < l; i++) {

            if (mode.regex) {
                if (str[i] === '/' && str[i - 1] !== '\\') {
                    mode.regex = false;
                }
                continue;
            }

            if (mode.singleQuote) {
                if (str[i] === "'" && str[i - 1] !== '\\') {
                    mode.singleQuote = false;
                }
                continue;
            }

            if (mode.doubleQuote) {
                if (str[i] === '"' && str[i - 1] !== '\\') {
                    mode.doubleQuote = false;
                }
                continue;
            }

            if (mode.blockComment) {
                if (str[i] === '*' && str[i + 1] === '/') {
                    str[i + 1] = '';
                    mode.blockComment = false;
                }
                str[i] = '';
                continue;
            }

            if (mode.lineComment) {
                if (str[i + 1] === '\n' || str[i + 1] === '\r') {
                    mode.lineComment = false;
                }
                str[i] = '';
                continue;
            }

            if (mode.condComp) {
                if (str[i - 2] === '@' && str[i - 1] === '*' && str[i] === '/') {
                    mode.condComp = false;
                }
                continue;
            }

            mode.doubleQuote = str[i] === '"';
            mode.singleQuote = str[i] === "'";

            if (str[i] === '/') {

                if (str[i + 1] === '*' && str[i + 2] === '@') {
                    mode.condComp = true;
                    continue;
                }
                if (str[i + 1] === '*') {
                    str[i] = '';
                    mode.blockComment = true;
                    continue;
                }
                if (str[i + 1] === '/') {
                    str[i] = '';
                    mode.lineComment = true;
                    continue;
                }
                mode.regex = true;
            }
        }
        return str.join('').slice(2, -2);
    },
    Clone : function(obj) {
        if (null == obj || "object" != typeof obj)
            return obj;
        var copy_ = obj.constructor();
        for (var attr_ in obj) {
            if (obj.hasOwnProperty(attr_))
                copy_[attr_] = obj[attr_];
        }
        return copy_;
    },
    PPA_PushItem : function(grabTextItem, featuresElement, featuresArray) {
        //if text item can be found push it to features element item array
        var label_ = grabTextItem.Label;
        var textFound_ = null;

        //GetTextBetween
        if (grabTextItem.GetTextBetween) {
            var startWord_ = grabTextItem.GetTextBetween.Start;
            var endWord_ = grabTextItem.GetTextBetween.End;

            for (var i = 0; i < olInjection.ElementValue._internal.Documents.length; i++) {
                var text_ = $(olInjection.ElementValue._internal.Documents[i]).text();
                text_ = text_.replace(/\n/g, "");
                textFound_ = olFunctions.GetTextBetween(text_, startWord_, endWord_);
                if (textFound_) {
                    break;
                }
            }
        }
        //ElementSearch
        if (grabTextItem.ElementSearch) {
            for (var i = 0; i < olInjection.ElementValue._internal.Documents.length; i++) {
                textFound_ = olFunctions.ElementSearch(grabTextItem.ElementSearch, olInjection.ElementValue._internal.Documents[i])[1];
                if (textFound_) {
                    break;
                }
            }
        }
        //Finaly
        if (textFound_) {
            if (grabTextItem.Transform) {
                if (grabTextItem.Transform.TruncateSpecified) {
                    textFound_ = olFunctions.TransformTruncate(textFound_, grabTextItem.Transform.Truncate);
                }
                if (olFunctions.IsFilledArray(grabTextItem.Transform.Replace)) {
                    textFound_ = olFunctions.TransformReplace(textFound_, grabTextItem.Transform.Replace);
                }
            }

            var itemElement_ = {
                Label : label_,
                Value : textFound_
            };

            if (grabTextItem.IsUniqueSpecified) {
                itemElement_.IsUniqueSpecified = true;
                itemElement_.IsUnique = grabTextItem.IsUnique;
            } else {
                itemElement_.IsUniqueSpecified = false;
                itemElement_.IsUnique = false;
            }

            if (grabTextItem.IsCostSpecified) {
                itemElement_.IsCostSpecified = true;
                itemElement_.IsCost = grabTextItem.IsCost;
            } else {
                itemElement_.IsCostSpecified = false;
                itemElement_.IsCost = false;
            }

            //Not sending items that are already sent by other features
            if (olFunctions.IsFilledArray(featuresArray)) {
                var duplicateItemElement_ = $.grep(featuresArray, function(member) {
                    for (var i = 0; i < member.Item.length; i++) {
                        return (member.Item[i].Label == itemElement_.Label && member.Item[i].Value == itemElement_.Value);
                    }
                    return false;
                });

                if (duplicateItemElement_.length == 0) {
                    featuresElement.Item.push(itemElement_);
                }
            } else {
                featuresElement.Item.push(itemElement_);
            }
        }
    },
    GetTextBetween : function(strToParse, strStart, strFinish) {
        strStart = strStart.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        strFinish = strFinish.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var result_ = '';
        var str = strToParse.match(strStart + '(.*?)' + strFinish);

        if (olFunctions.IsFilledArray(str)) {
            var result_ = $.trim(str[1]);
        }
        return result_;
    },
    TransformTruncate : function(text, truncateLength) {
        return text.substring(0, text.length - truncateLength);
    },
    TransformReplace : function(text, replaceObjArray) {
        var textResult_ = text;
        for (var i = 0; i < replaceObjArray.length; i++) {
            textResult_ = textResult_.replace(new RegExp(String(replaceObjArray[i].Find), 'g'), String(replaceObjArray[i].ReplaceWith));
        }
        return textResult_;
    },
    ElementSearch : function(elementSearch, container) {
        if ( typeof (container) === 'undefined')
            container = document;

        var elementsArray_ = [];
        var tmpElementsArray_ = [];
        var resultingArray_ = [];
        var type_;
        var typeValue_;

        //Determine search type for the element
        if (elementSearch.Element.Id) {
            type_ = 'Id';
        } else {
            if (elementSearch.Element.Name) {
                type_ = 'Name';
            } else {
                if (elementSearch.Element.TagName) {
                    type_ = 'Tag';
                } else if (elementSearch.Element.IndexSpecified) {
                    type_ = 'Index';
                }
            }
        }

        switch (type_) {
        case 'Id':
            typeValue_ = elementSearch.Element.Id;
            tmpElementsArray_ = olInjection.ElementValue._internal._getElementsByAttributeValue(type_, typeValue_, container);
            break;
        case 'Name':
            typeValue_ = elementSearch.Element.Name;
            tmpElementsArray_ = olInjection.ElementValue._internal._getElementsByAttributeValue(type_, typeValue_, container);
            break;
        case 'Tag':
            var filterTagArray_ = false;
            typeValue_ = elementSearch.Element.TagName;
            tmpElementsArray_ = container.getElementsByTagName(typeValue_);
            tmpElementsArrayFilteredByAttributes_ = [];
            if (olFunctions.IsFilledArray(elementSearch.Element.Attributes)) {
                for (var i = 0; i < elementSearch.Element.Attributes.length; i++) {
                    var currentAttribute_ = elementSearch.Element.Attributes[i];
                    if (currentAttribute_.IsMatchSpecified && currentAttribute_.IsMatch) {
                        filterTagArray_ = true;
                        tmpElementsArrayFilteredByAttributes_ = $.merge(tmpElementsArrayFilteredByAttributes_, olInjection.ElementValue._internal._getElementsByAttributeValue(currentAttribute_.Name, currentAttribute_.Value, container));
                    }
                }

                if (filterTagArray_) {
                    tmpElementsArray_ = $.grep(tmpElementsArray_, function(member) {
                        for (var j = 0; j < tmpElementsArrayFilteredByAttributes_.length; j++) {
                            if (member == tmpElementsArrayFilteredByAttributes_[j]) {
                                return true;
                            };
                        };
                        return false;
                    });
                }
            }
            break;
        case 'Index':
            var allElements_ = [];
            allElements_ = olInjection.ElementValue._internal._getElementsByAttributeValue(null, null, container);
            tmpElementsArray_ = allElements_[elementSearch.Element.Index - 1];
            break;
        default:
            olFunctions.Alert(true, 'Unknow type value!!!!');
        }

        if (olFunctions.IsFilledArray(elementSearch.FindText)) {
            for (var i = 0; i < tmpElementsArray_.length; i++) {
                var elements_ = $(tmpElementsArray_[i]);
                for (var j = 0; j < elementSearch.FindText.length; j++) {
                    elements_ = elements_.filter(':contains("' + elementSearch.FindText[j] + '")');
                }
                for (var k = 0; k < elements_.length; k++) {
                    elementsArray_.push(elements_[k]);
                }
            }
        } else {
            for (var j = 0; j < tmpElementsArray_.length; j++) {
                elementsArray_.push(tmpElementsArray_[j]);
            }
        }

        var result_ = '';

        if (olFunctions.IsFilledArray(elementsArray_)) {
            if (elementSearch.Element.InstanceSpecified) {
                resultingArray_.push(elementsArray_[elementSearch.Element.Instance - 1]);
            } else {
                resultingArray_ = elementsArray_;
            }
            switch (elementSearch.GrabFrom) {
            case 0:
                result_ = $(resultingArray_[0]).text();
                break;
            case 1:
                result_ = $(resultingArray_[0]).val();
                break;
            case 2:
                result_ = olFunctions.ElementSearch(elementSearch.InnerNode, resultingArray_[0])[1];
                break;
            case 3:
                for (var i = 0; i < elementSearch.Element.Attributes.length; i++) {
                    var currentAttribute_ = elementSearch.Element.Attributes[i];
                    if (!(currentAttribute_.IsMatchSpecified && currentAttribute_.IsMatch)) {
                        var text_ = $(resultingArray_[0]).attr(currentAttribute_.Name);
                        if (text_) {
                            result_ = result_ + text_;
                        }
                    }
                }
                break;
            default:
                olFunctions.Alert(true, 'Unknow GrabFrom value!!!!');
            }
        }

        result_ = $.trim(result_);
        return [resultingArray_, result_];
    }
};
