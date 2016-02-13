/**
 *  OneLog injection object
 */

var olInjection = {
    Parameters : {
        Flags : {
            ExtensionEnviroment : true,
            MobileEnviroment : '',
            BrowserName : '',
            Comment : '',
            CommentChanged : false,
            CommentRequest : false,
            InOfflineMode : false,
            MatterNeeded : false,
            MatterDone : false,
            MatterSkiped : false,
            MatterChanged : false,
            MatterNumber : '',
            MatterFormat : '',
            FinalMatterValue : '',
            MatterFreeInput : false,
            PersonalCodeNeeded : false,
            PersonalCodeDone : false,
            TimekeeperNumber : '',
            TimekeeperChanged : false,
            LogonNeeded : false,
            LogonNeededForUsername : false,
            LogonNeededForPassword : false,
            LogonCommonNeeded : false,
            LogonCommonNeededForUsername : false,
            LogonCommonNeededForPassword : false,
            LogonDetailsFreeInput : false,
            LogonDone : false,
            LogonSkiped : false,
            //Changed to null so preference on option page can override this on first setting of the toolbar
            ToolbarMinimized : null,
            Unauthorised : false,
            LicenceLimitReachedNeeded : false,
            LicenceLimitReachedDone : false,
            PooledDetailsLimitReachedNeeded : false,
            PooledDetailsLimitReachedDone : false,
            TabId : '',
            PmtUser : true,
            PmtAdmin : false,
            PmtAutomatic : false,
            PassDetailsToSite : true,
            LoginType : 'User'
        },
        CurrentPrompt : '',
        JScript : [],
        Forms : [],
        VariableReplacement : {},
        LogonDataArray : [],
        DefinedNames : {
            UsernameArray : ['username'],
            PasswordArray : ['password'],
            MatterArray : ['matter'],
            CustomArray : [],
            TimeKeeperArray : ['time keeper', 'timekeeper'],
            CommentArray : ['comment']
        },
        InjectFieldColor : '#FFFF80',
        //TODO change DebugErrors to false for production
        DebugErrors : true,
        DebugPageEventsSubmit : false,
        exec_ : "$('#' + document.scriptTagName_).remove();var elem = document.createElement('script');elem.type = 'text/javascript';elem.innerHTML = document.atobCode;$(elem).attr('id', document.scriptTagName_);document.head.appendChild(elem);"
    },
    PageEvents : {
        Matter_onClick : function() {
            try {
                if (olInjection.Parameters.Flags.ExtensionEnviroment) {
                    // simulate click on matter
                    $('#olToolbarMenuMatter').click();
                    // lose focus
                    $(this).blur();
                } else {
                    var alertContent_ = new olFunctions.AlertContent('Mobile', 'Matter_onClick not supported in mobile mode');
                    olFunctions.Alert(true, alertContent_);
                }
            } catch(e) {
                var alertErrorContent_ = new olFunctions.AlertContent('Matter_onClick', e.message + '\n' + e.stack);
                olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
            }
        },
        Logon_onClick : function() {
            try {
                if (olInjection.Parameters.Flags.ExtensionEnviroment) {
                    // simulate click on logon
                    $('#olToolbarMenuLogon').click();
                    // lose focus
                    $(this).blur();
                } else {
                    var alertContent_ = new olFunctions.AlertContent('Mobile', 'Logon_onClick not supported in mobile mode');
                    olFunctions.Alert(true, alertContent_);
                }
            } catch(e) {
                var alertErrorContent_ = new olFunctions.AlertContent('Logon_onClick', e.message + '\n' + e.stack);
                olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
            }
        },
        Element_onKeyUp : function(elDefinedName, value) {
            if (olInjection.Parameters.Flags.ExtensionEnviroment) {
                try {
                    for (var i = 0; i < olInjection.Parameters.VariableReplacement.Variables.length; i++) {
                        var definedNameVariables_ = String(olInjection.Parameters.VariableReplacement.Variables[i].DefinedName);
                        if (elDefinedName == definedNameVariables_) {
                            if (olInjection.Parameters.VariableReplacement.Variables[i].IsPersonal || olInjection.Parameters.Flags.PmtAutomatic) {
                                olInjection.Parameters.VariableReplacement.Variables[i].AutomaticValue = value;
                                // share changes with all tabs
                                olPage.Messages.UpdateResponse();
                            }
                            if (olInjection.Parameters.Flags.PmtAutomatic) {
                                // automatic password management, send temp personal detail request
                                olPage.Messages.SetTempPersonalDetailsRequest(elDefinedName, value);
                            }
                            break;
                        }
                    }
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('Element_onKeyUp', e.message + '\n' + e.stack);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
                }
            }
        },
        Element_onChange : function(freeInput, bOnKeyUp, elDefinedName, elValue) {
            if (!freeInput) {
                olInjection.ElementValue._internal.ElementValueSet = false;
            }
            if (bOnKeyUp) {
                olInjection.PageEvents.Element_onKeyUp(elDefinedName, elValue);
            }
        },
        SubmitElement_onClick : function() {
            if (olInjection.Parameters.Flags.ExtensionEnviroment) {
                try {
                    var alertContent_ = new olFunctions.AlertContent('Submit event', 'Caught by page');
                    olPage.Messages.FormSubmit();
                    olFunctions.Alert(olInjection.Parameters.DebugPageEventsSubmit, alertContent_);
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('SubmitElement_onClick', e.message + '\n' + e.stack);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
                }
            }
        },
        Submit : function(element) {
            if (olInjection.Parameters.Flags.ExtensionEnviroment) {
                $(element).off('submit');
                $(element).on('submit', function() {
                    try {
                        var alertContent_ = new olFunctions.AlertContent('Submit event', 'Caught by page');
                        olPage.Messages.FormSubmit();
                        olFunctions.Alert(olInjection.Parameters.DebugPageEventsSubmit, alertContent_);
                    } catch (e) {
                        var alertContent1_ = new olFunctions.AlertContent('olInject.PageEvents.Submit', e.message + '\n' + e.stack);
                        olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent1_);
                    }
                });
            }
        },
        PPA_Event : function(feature) {
            if (olInjection.Parameters.Flags.ExtensionEnviroment) {
                olInjection.ElementValue.SetDocuments();
                var FeaturesArray_ = [];

                var featuresElement_ = {
                    UID : feature.UID,
                    Label : feature.Title,
                    Item : []
                };

                // fill feature elements item array
                for (var k = 0; k < feature.GrabTextItems.length; k++) {
                    olFunctions.PPA_PushItem(feature.GrabTextItems[k], featuresElement_, FeaturesArray_);
                }
                FeaturesArray_.push(featuresElement_);
                if (olFunctions.IsFilledArray(FeaturesArray_)) {
                    var Features_ = {
                        Features : FeaturesArray_
                    };

                    olPage.Messages.SetFeaturesRequest(Features_);
                }
            }
        }
    },
    ElementValue : {
        _internal : {
            ElementValueSet : false,
            SetTimeoutForInjectElements : false,
            Documents : new Array(),
            // private: get element by id in document and frames if they exist
            GetElementByID : function(elID) {
                var element_ = null;
                for (var i = 0; i < olInjection.ElementValue._internal.Documents.length; i++) {
                    element_ = olInjection.ElementValue._internal.Documents[i].getElementById(elID.toString());
                    if (element_) {
                        break;
                    }
                }
                return element_;
            },
            // private: get elements by name in document and frames if they exist
            GetElementsByName : function(elName) {
                var elements_ = null;
                for (var i = 0; i < olInjection.ElementValue._internal.Documents.length; i++) {
                    var currentDocument = olInjection.ElementValue._internal.Documents[i];
                    elements_ = currentDocument.getElementsByName(elName.toString());
                    if (elements_ && elements_.length && elements_.length > 0) {
                        break;
                    }
                }
                return elements_;
            },
            // private: get the tag type as defined in Onelog, with possible return values: Select, Input, RadioCheck
            GetElementTagType : function(elementToCheck) {
                if (elementToCheck) {
                    if (elementToCheck.tagName.toLowerCase() == 'select') {
                        return 'Select';
                    } else if (elementToCheck.tagName.toLowerCase() == 'input') {
                        if (elementToCheck.type.toLowerCase() == 'radio') {
                            return 'RadioCheck';
                        } else if (elementToCheck.type.toLowerCase() == 'email' || elementToCheck.type.toLowerCase() == 'text' || elementToCheck.type.toLowerCase() == 'password') {
                            return 'Input';
                        } else {
                            var alertContent_ = new olFunctions.AlertContent('GetElementTagType', 'Unrecognized tag type: ' + elementToCheck.type.toLowerCase());
                            olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                            return 'Input';
                        }
                    }
                }
                return '';
            },
            _getElementsByAttributeValue : function(attribute, value, container) {
                if ( typeof (container) === 'undefined')
                    container = document;
                var result_ = new Array();
                var allElements_ = container.getElementsByTagName('*');
                if (attribute == null) {
                    result_ = allElements_;
                } else {
                    for (var i = 0; i < allElements_.length; i++) {
                        if (allElements_[i].getAttribute(attribute) == value) {
                            result_.push(allElements_[i]);
                        }
                    }
                }
                return result_;
            },
            // private: get the form with provided parameters  in document and frames if they exist
            GetForm : function(accessParam, accessType) {
                var loginFormArray_ = new Array();
                var currentLoginFormByID_ = null;
                var formsArrayByName_ = null;
                var currentLoginFormByIndex_ = null;

                if (accessType == 'noUseForm') {
                    //adding fake form for scripts that have useForm set to false
                    loginFormArray_.push(null);
                } else {
                    for (var i = 0; i < olInjection.ElementValue._internal.Documents.length; i++) {
                        var currentDocument_ = olInjection.ElementValue._internal.Documents[i];
                        switch (accessType) {
                        case 'byID':
                            var tmploginFormArray_ = olInjection.ElementValue._internal._getElementsByAttributeValue('id', accessParam.toString(), currentDocument_);
                            for (var j = 0; j < tmploginFormArray_.length; j++) {
                                loginFormArray_.push(tmploginFormArray_[j]);
                            }
                            if (loginFormArray_.length == 0) {
                                currentLoginFormByID_ = currentDocument_.getElementById(accessParam.toString());
                                if (currentLoginFormByID_) {
                                    loginFormArray_.push(currentLoginFormByID_);
                                }
                            }
                            break;
                        case 'byName':
                            formsArrayByName_ = currentDocument_.getElementsByName(accessParam);
                            if (olFunctions.IsFilledArray(formsArrayByName_)) {
                                for (var j = 0; j < formsArrayByName_.length; j++) {
                                    loginFormArray_.push(formsArrayByName_[j]);
                                }
                            }
                            break;
                        case 'byIndex':
                            currentLoginFormByIndex_ = currentDocument_.forms[accessParam];
                            if (currentLoginFormByIndex_) {
                                loginFormArray_.push(currentLoginFormByIndex_);
                            }
                            break;
                        }
                    }
                    //Attach submit events
                    for (var j = 0; j < loginFormArray_.length; j++) {
                        if (loginFormArray_[j] != null) {
                            olInjection.PageEvents.Submit(loginFormArray_[j]);
                        }
                    }
                }
                return loginFormArray_;
            },
            // private: get the element by name
            SetValueByElementName : function(value, elementName, instance, containerForm, htmlTagType, attributes, onClick, onKeyUp, onChange, freeInput, elementType, inputReplacementTypeBool, loginType) {
                var elementFound_ = false;
                try {
                    var elements_ = null;
                    if (containerForm) {
                        // This will return an array of matching elements if more than one element is found,
                        // but if only one element is found this statement will return that element, not an array.
                        elements_ = containerForm.elements[elementName];
                    } else {
                        // This will return an array of matching elements.
                        elements_ = olInjection.ElementValue._internal.GetElementsByName(elementName);
                    }
                    //?
                    if (!instance || instance.length < 1) {
                        instance = 1;
                    }
                    if (elements_ && typeof elements_ != 'undefined') {
                        if ( typeof elements_.length != 'undefined' && elements_.length > 0) {
                            for (var i = 0; i < elements_.length; i++) {
                                if (htmlTagType == 'Select') {
                                    elements_[i].selectedIndex = instance - 1;
                                } else if (htmlTagType == 'RadioCheck') {
                                    if (i == instance - 1) {
                                        elements_[i].checked = true;
                                    }
                                } else {
                                    if ((i == (instance - 1)) && (elements_[i])) {
                                        if (value && (elementType == 'matter' || inputReplacementTypeBool)) {
                                            elements_[i].value = value;
                                            elements_[i].style.backgroundColor = olInjection.Parameters.InjectFieldColor;
                                        }

                                        elementFound_ = true;

                                        if (onClick) {
                                            olFunctions.olAddEventListener(elements_[i], 'click', onClick);
                                        }
                                        if (onKeyUp) {
                                            olFunctions.olAddEventListener(elements_[i], 'keyup', onKeyUp);
                                        }
                                        if (onChange) {
                                            olFunctions.olAddEventListener(elements_[i], 'input', onChange);
                                        }
                                        if (!freeInput) {
                                            elements_[i].readOnly = true;
                                        }
                                        // LG: NEW - html element attributes processing
                                        olInjection.ElementValue._internal.PerformAttributesChanges(elements_[i], attributes);

                                        break;
                                    }
                                }
                            }
                        } else if ( typeof elements_.length == 'undefined') {
                            if (htmlTagType == 'RadioCheck') {
                                // element is not radiocheck
                                // do nothing
                            } else {
                                if (value && (elementType == 'matter' || inputReplacementTypeBool)) {
                                    elements_.value = value;
                                    elements_.style.backgroundColor = olInjection.Parameters.InjectFieldColor;
                                }

                                elementFound_ = true;

                                // LG: NEW - html element attributes processing
                                olInjection.ElementValue._internal.PerformAttributesChanges(elements_, attributes);

                                if (onClick) {
                                    olFunctions.olAddEventListener(elements_, 'click', onClick);
                                }
                                if (onKeyUp) {
                                    olFunctions.olAddEventListener(elements_, 'keyup', onKeyUp);
                                }
                                if (onChange) {
                                    olFunctions.olAddEventListener(elements_, 'input', onChange);
                                }
                                if (!freeInput) {
                                    elements_.readOnly = true;
                                }
                            }
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error SetValueByElementName', 'ElByName: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },
            AttachEventByElementName : function(elementName, instance, containerForm, htmlTagType, events, bAnalysis, feature) {
                try {
                    var elementFound_ = false;
                    var elements_ = null;

                    if (containerForm) {
                        elements_ = containerForm.elements[elementName];
                    } else {
                        elements_ = olInjection.ElementValue._internal.GetElementsByName(elementName);
                    }

                    if (!instance || instance.length < 1) {
                        instance = 1;
                    }

                    if (elements_ && typeof elements_ != 'undefined') {
                        if ( typeof elements_.length != 'undefined' && elements_.length > 0) {
                            for (var i = 0; i < elements_.length; i++) {

                                if ((i == (instance - 1)) && (elements_[i])) {
                                    if (olFunctions.IsFilledArray(events)) {
                                        for (var m = 0; m < events.length; m++) {
                                            if (bAnalysis) {
                                                olInjection.BindElementsForAnalysis(elements_[i], events[m], feature);
                                            } else {
                                                olInjection.BindElementsWithTimeout(elements_[i], events[m]);
                                            }
                                        }
                                    } else {
                                        olInjection.BindElementsWithTimeout(elements_[i], 'click');
                                    }

                                    elementFound_ = true;
                                    break;
                                }

                            }
                        } else if ( typeof elements_.length == 'undefined') {
                            if (olFunctions.IsFilledArray(events)) {
                                for (var m = 0; m < events.length; m++) {
                                    if (bAnalysis) {
                                        olInjection.BindElementsForAnalysis(elements_, events[m], feature);
                                    } else {
                                        olInjection.BindElementsWithTimeout(elements_, events[m]);
                                    }
                                }
                            } else {
                                olInjection.BindElementsWithTimeout(elements_, 'click');
                            }
                            elementFound_ = true;
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error ClickByElementName', 'Error: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },
            ClickByElementName : function(elementName, instance, containerForm, htmlTagType) {
                try {
                    var elementFound_ = false;
                    var elements_ = null;

                    if (containerForm) {
                        elements_ = containerForm.elements[elementName];
                    } else {
                        elements_ = olInjection.ElementValue._internal.GetElementsByName(elementName);
                    }

                    if (!instance || instance.length < 1) {
                        instance = 1;
                    }

                    if (elements_ && typeof elements_ != 'undefined') {
                        if ( typeof elements_.length != 'undefined' && elements_.length > 0) {
                            for (var i = 0; i < elements_.length; i++) {
                                if (htmlTagType == 'Select') {
                                    elements_[i].selectedIndex = instance - 1;
                                } else {
                                    if ((i == (instance - 1)) && (elements_[i])) {
                                        elements_[i].click();
                                        elementFound_ = true;
                                        break;
                                    }
                                }
                            }
                        } else if ( typeof elements_.length == 'undefined') {
                            elements_.click();
                            elementFound_ = true;
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error ClickByElementName', 'Error: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },
            // private: get the element by index
            SetValueByElementIndex : function(value, elementIndex, instance, containerForm, htmlTagType, customTagName, attributes, onClick, onKeyUp, onChange, freeInput, elementType, inputReplacementTypeBool, loginType) {
                var elementFound_ = false;
                try {
                    var elements_ = null;
                    var tagName_ = 'input';

                    if (customTagName) {
                        tagName_ = customTagName;
                    }

                    if (htmlTagType == 'Select') {
                        tagName_ = 'select';
                    }

                    if (containerForm) {
                        elements_ = containerForm.getElementsByTagName(tagName_);
                    } else {
                        elements_ = document.getElementsByTagName(tagName_);
                    }

                    if (elements_.length > 0) {
                        for (var i = 0; i < elements_.length; i++) {
                            if ((i == elementIndex) && (elements_[i])) {
                                if (htmlTagType == 'Select') {
                                    elements_[i].selectedIndex = instance - 1;
                                } else if (htmlTagType == 'RadioCheck') {
                                    if (i == instance - 1) {
                                        elements_[i].checked = true;
                                    }
                                } else {
                                    if (value && (elementType == 'matter' || inputReplacementTypeBool)) {
                                        elements_[i].value = value;
                                        elements_[i].style.backgroundColor = olInjection.Parameters.InjectFieldColor;
                                    }
                                    if (onClick) {
                                        olFunctions.olAddEventListener(elements_[i], 'click', onClick);
                                    }
                                    if (onKeyUp) {
                                        olFunctions.olAddEventListener(elements_[i], 'keyup', onKeyUp);
                                    }
                                    if (onChange) {
                                        olFunctions.olAddEventListener(elements_[i], 'input', onChange);
                                    }
                                    if (!freeInput) {
                                        elements_[i].readOnly = true;
                                    }
                                    // LG: NEW - html element attributes processing
                                    olInjection.ElementValue._internal.PerformAttributesChanges(elements_[i], attributes);
                                }

                                elementFound_ = true;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error SetValueByElementIndex', 'ElByIndex: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },
            AttachEventByElementIndex : function(elementIndex, instance, containerForm, htmlTagType, customTagName, events, bAnalysis, feature) {
                try {
                    var elementFound_ = false;

                    var elements_ = null;
                    var tagName_ = 'input';

                    if (customTagName) {
                        tagName_ = customTagName;
                    }

                    if (htmlTagType == 'Select') {
                        tagName_ = 'select';
                    }

                    if (containerForm) {
                        elements_ = containerForm.getElementsByTagName(tagName_);
                    } else {
                        elements_ = document.getElementsByTagName(tagName_);
                    }

                    if (elements_.length > 0) {
                        for (var i = 0; i < elements_.length; i++) {
                            if ((i == elementIndex) && (elements_[i])) {

                                if (olFunctions.IsFilledArray(events)) {
                                    for (var m = 0; m < events.length; m++) {
                                        if (bAnalysis) {
                                            olInjection.BindElementsForAnalysis(elements_[i], events[m], feature);
                                        } else {
                                            olInjection.BindElementsWithTimeout(elements_[i], events[m]);
                                        }
                                    }
                                } else {
                                    olInjection.BindElementsWithTimeout(elements_[i], 'click');
                                }

                                elementFound_ = true;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error ClickByElementIndex', 'Error: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },
            ClickByElementIndex : function(elementIndex, instance, containerForm, htmlTagType, customTagName) {
                try {
                    var elementFound_ = false;

                    var elements_ = null;
                    var tagName_ = 'input';

                    if (customTagName) {
                        tagName_ = customTagName;
                    }

                    if (htmlTagType == 'Select') {
                        tagName_ = 'select';
                    }

                    if (containerForm) {
                        elements_ = containerForm.getElementsByTagName(tagName_);
                    } else {
                        elements_ = document.getElementsByTagName(tagName_);
                    }

                    if (elements_.length > 0) {
                        for (var i = 0; i < elements_.length; i++) {
                            if ((i == elementIndex) && (elements_[i])) {
                                if (htmlTagType == 'Select') {
                                    elements_[i].selectedIndex = instance - 1;
                                } else {
                                    elements_[i].click();
                                }
                                elementFound_ = true;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error ClickByElementIndex', 'Error: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },

            // private: get the element by id
            SetValueByElementId : function(value, elementId, instance, containerForm, htmlTagType, attributes, onClick, onKeyUp, onChange, freeInput, elementType, inputReplacementTypeBool, loginType) {
                var elementFound_ = false;
                try {
                    var element_ = null;
                    if (containerForm) {
                        var allElements_ = containerForm.getElementsByTagName('*');
                        for (var i = 0; i < allElements_.length; i++) {
                            var id = (allElements_[i].id == elementId);
                            if (id) {
                                var tagType = (htmlTagType == 'Submit' || htmlTagType == olInjection.ElementValue._internal.GetElementTagType(allElements_[i]));
                                if (tagType) {
                                    element_ = allElements_[i];
                                    break;
                                }
                            }
                        }
                    } else {
                        element_ = olInjection.ElementValue._internal.GetElementByID(elementId);
                    }

                    if (element_ && typeof element_ != 'undefined') {
                        if (htmlTagType == 'Select') {
                            element_.selectedIndex = instance - 1;
                        } else if (htmlTagType == 'RadioCheck') {
                            if (i == instance - 1) {
                                elements_[i].checked = true;
                            }
                        } else {
                            if (value && (elementType == 'matter' || inputReplacementTypeBool)) {
                                element_.value = value;
                                element_.style.backgroundColor = olInjection.Parameters.InjectFieldColor;
                            }
                            if (onClick) {
                                olFunctions.olAddEventListener(element_, 'click', onClick);
                            }
                            if (onKeyUp) {
                                olFunctions.olAddEventListener(element_, 'keyup', onKeyUp);
                            }
                            if (onChange) {
                                olFunctions.olAddEventListener(element_, 'input', onChange);
                            }
                            if (!freeInput) {
                                element_.readOnly = true;
                            }
                        }

                        // LG: NEW - html element attributes processing
                        olInjection.ElementValue._internal.PerformAttributesChanges(element_, attributes);
                        elementFound_ = true;
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error SetValueByElementId', 'ElByID: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },
            AttachEventByElementId : function(elementId, instance, containerForm, htmlTagType, events, bAnalysis, feature) {
                var elementFound_ = false;
                try {
                    var element_ = null;
                    if (containerForm) {
                        for (var i = 0; i < containerForm.elements.length; i++) {
                            var id = (containerForm.elements[i].id == elementId);
                            if (id) {
                                element_ = containerForm.elements[i];
                            }
                        }
                    } else {
                        element_ = olInjection.ElementValue._internal.GetElementByID(elementId);
                    }
                    if (element_ && typeof element_ != 'undefined') {
                        if (olFunctions.IsFilledArray(events)) {
                            for (var m = 0; m < events.length; m++) {
                                if (bAnalysis) {
                                    olInjection.BindElementsForAnalysis(element_, events[m], feature);
                                } else {
                                    olInjection.BindElementsWithTimeout(element_, events[m]);
                                }
                            }
                        } else {
                            olInjection.BindElementsWithTimeout(element_, 'click');
                        }
                        elementFound_ = true;
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error AttachEventByElementId', 'Error: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },
            ClickByElementId : function(elementId, instance, containerForm, htmlTagType) {
                var elementFound_ = false;
                try {
                    var element_ = null;
                    if (containerForm) {
                        for (var i = 0; i < containerForm.elements.length; i++) {
                            var id = (containerForm.elements[i].id == elementId);
                            if (id) {
                                element_ = containerForm.elements[i];
                            }
                        }
                    } else {
                        element_ = olInjection.ElementValue._internal.GetElementByID(elementId);
                    }

                    if (element_ && typeof element_ != 'undefined') {
                        if (htmlTagType == 'Select') {
                            element_.selectedIndex = instance - 1;
                        } else {
                            element_.click();
                        }

                        elementFound_ = true;
                    }
                } catch (e) {
                    var alertContent_ = new olFunctions.AlertContent('Error ClickByElementId', 'Error: ' + e);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertContent_);
                } finally {
                    return elementFound_;
                }
            },
            //private: perform the necessary chages on style or on other attributes of an html element
            PerformAttributesChanges : function(elementToStyle, elAttributes) {
                try {
                    elementToStyle.setAttribute("autocomplete", "off");
                    try {
                        $(elementToStyle)[0].form.setAttribute("autocomplete", "off");
                    } catch(e) {
                    }

                    if (olFunctions.IsFilledArray(elAttributes)) {
                        for (var i = 0; i < elAttributes.length; i++) {
                            var attName = elAttributes[i].Name;
                            var attValue = elAttributes[i].Value;
                            if (elAttributes[i].IsStyle) {
                                if (elAttributes[i].IsRemoveSpecified) {
                                    elementToStyle.style.removeProperty(attName);
                                } else {
                                    elementToStyle.style[attName] = attValue;
                                }
                            } else {
                                if (elAttributes[i].IsRemoveSpecified) {
                                    elementToStyle.removeAttribute(attName);
                                } else {
                                    elementToStyle[attName] = attValue;
                                }
                            }
                        }
                    }
                } catch(e) {
                    var alertErrorContent_ = new olFunctions.AlertContent('PerformAttributesChanges: ', e.message + '\n' + e.stack);
                    olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
                }
            }
        },
        AttachEvent : function(elAccessParam, elAccessType, elInstance, elHtmlTagType, elCustomTagName, formAccessParam, formAccessType, events, bAnalysis, feature) {
            var loginForm_ = null;
            var succeded_ = false;
            var loginFormArray_ = [null];

            if (bAnalysis) {
                formAccessType = 'noUseForm';
            }

            loginFormArray_ = olInjection.ElementValue._internal.GetForm(formAccessParam, formAccessType);
            //Problem cause loginFormArray_ sometimes gets empty after getform
            if (!olFunctions.IsFilledArray(loginFormArray_)) {
                loginFormArray_.push(null);
            }

            for (var i = 0; i < loginFormArray_.length; i++) {
                loginForm_ = loginFormArray_[i];
                switch (elAccessType) {
                case 'byID':
                    succeded_ = olInjection.ElementValue._internal.AttachEventByElementId(elAccessParam, elInstance, loginForm_, elHtmlTagType, events, bAnalysis, feature);
                    break;
                case 'byName':
                    succeded_ = olInjection.ElementValue._internal.AttachEventByElementName(elAccessParam, elInstance, loginForm_, elHtmlTagType, events, bAnalysis, feature);
                    break;
                case 'byIndex':
                    succeded_ = olInjection.ElementValue._internal.AttachEventByElementIndex(elAccessParam, elInstance, loginForm_, elHtmlTagType, elCustomTagName, events, bAnalysis, feature);
                    break;
                }
            }
            return succeded_;
        },
        Set : function(elVariable, elAccessParam, elAccessType, elInstance, elHtmlTagType, elCustomTagName, elAttributes, elDefinedName, formAccessParam, formAccessType, inputReplacementType, loginType) {
            var loginForm_ = null;
            var succeded_ = false;
            var onClick_ = null;
            var onKeyUp_ = null;
            var bOnKeyUp_ = false;
            var onChange_ = null;
            var loginFormArray_ = [null];
            var freeInput_ = true;

            var irtInput_ = (inputReplacementType == 'Input');
            var irtTrack_ = (inputReplacementType == 'TrackOnly');
            var irtReplace_ = (inputReplacementType == 'ReplaceOnly');

            var track_ = !irtReplace_ && !elVariable.elOrg && (irtInput_ || irtTrack_) && (loginType == 'Collect' || (loginType == 'Automatic' && !irtReplace_));
            var replace_ = elVariable.elOrg || (olInjection.Parameters.Flags.PassDetailsToSite && ((irtInput_ || irtReplace_) && loginType != 'Collect'));
            loginFormArray_ = olInjection.ElementValue._internal.GetForm(formAccessParam, formAccessType);

            var elDefinedName_ = String(elDefinedName);

            var logonDetailsFreeInput_ = olInjection.Parameters.Flags.LogonDetailsFreeInput;
            var logonSkipped_ = olInjection.Parameters.Flags.LogonSkiped;
            var logonData_ = olInjection.Parameters.LogonDataArray;

            var adminFreeInput_ = (loginType == 'Admin' && !(olFunctions.IsFilledArray(logonData_)));

            var collectReplaceOnlyFreeInput_ = (loginType == 'Collect' && irtReplace_);
            logonDetailsFreeInput_ = (logonDetailsFreeInput_ || irtReplace_ || adminFreeInput_ || logonSkipped_ || track_ || collectReplaceOnlyFreeInput_);

            var matterDetailsFreeinput_ = olInjection.Parameters.Flags.MatterFreeInput;
            var elementType_ = '';

            if (olInjection.Parameters.Flags.ExtensionEnviroment) {
                if (elHtmlTagType == 'Submit') {
                    onClick_ = olInjection.PageEvents.SubmitElement_onClick;
                } else {
                    if (olInjection.Parameters.DefinedNames.UsernameArray.indexOf(elDefinedName_) > -1) {
                        //username
                        elementType_ = 'username';
                        freeInput_ = logonDetailsFreeInput_;

                        if ((olInjection.Parameters.Flags.LogonNeededForUsername || olInjection.Parameters.Flags.LogonCommonNeededForUsername)) {
                            if (!freeInput_) {
                                onClick_ = olInjection.PageEvents.Logon_onClick;
                            } else {
                                if (track_) {
                                    onKeyUp_ = function(event) {
                                        olInjection.PageEvents.Element_onKeyUp(elDefinedName_, $(event.target).val());
                                    };
                                    bOnKeyUp_ = true;
                                }
                            }
                            onChange_ = function(event) {
                                olInjection.PageEvents.Element_onChange(freeInput_, bOnKeyUp_, elDefinedName_, $(event.target).val());
                            };
                        } else {
                            if (freeInput_ && track_) {
                                onKeyUp_ = function(event) {
                                    olInjection.PageEvents.Element_onKeyUp(elDefinedName_, $(event.target).val());
                                };
                                bOnKeyUp_ = true;
                                onChange_ = function(event) {
                                    olInjection.PageEvents.Element_onChange(freeInput_, bOnKeyUp_, elDefinedName_, $(event.target).val());
                                };
                            }
                        }
                    } else {
                        if (olInjection.Parameters.DefinedNames.PasswordArray.indexOf(elDefinedName_) > -1) {
                            //password
                            elementType_ = 'password';
                            freeInput_ = logonDetailsFreeInput_;
                            if ((olInjection.Parameters.Flags.LogonNeededForPassword || olInjection.Parameters.Flags.LogonCommonNeededForPassword)) {
                                if (!freeInput_) {
                                    onClick_ = olInjection.PageEvents.Logon_onClick;
                                } else {
                                    if (track_) {
                                        onKeyUp_ = function(event) {
                                            olInjection.PageEvents.Element_onKeyUp(elDefinedName_, $(event.target).val());
                                        };
                                        bOnKeyUp_ = true;
                                    }
                                }
                                onChange_ = function(event) {
                                    olInjection.PageEvents.Element_onChange(freeInput_, bOnKeyUp_, elDefinedName_, $(event.target).val());
                                };
                            } else {
                                if (freeInput_ && track_) {
                                    onKeyUp_ = function(event) {
                                        olInjection.PageEvents.Element_onKeyUp(elDefinedName_, $(event.target).val());
                                    };
                                    bOnKeyUp_ = true;
                                    onChange_ = function(event) {
                                        olInjection.PageEvents.Element_onChange(freeInput_, bOnKeyUp_, elDefinedName_, $(event.target).val());
                                    };
                                }
                            }
                        } else {
                            if (olInjection.Parameters.DefinedNames.MatterArray.indexOf(elDefinedName_) > -1) {
                                //matter
                                elementType_ = 'matter';
                                freeInput_ = matterDetailsFreeinput_;
                                if ((olInjection.Parameters.Flags.MatterNeeded)) {
                                    if (!freeInput_) {
                                        onClick_ = olInjection.PageEvents.Matter_onClick;
                                    } else {
                                        if (track_) {
                                            onKeyUp_ = function(event) {
                                                olInjection.PageEvents.Element_onKeyUp(elDefinedName_, $(event.target).val());
                                            };
                                            bOnKeyUp_ = true;
                                        }
                                    }
                                    onChange_ = function(event) {
                                        olInjection.PageEvents.Element_onChange(freeInput_, bOnKeyUp_, elDefinedName_, $(event.target).val());
                                    };
                                } else {
                                    if (freeInput_ && track_) {
                                        onKeyUp_ = function(event) {
                                            olInjection.PageEvents.Element_onKeyUp(elDefinedName_, $(event.target).val());
                                        };
                                        bOnKeyUp_ = true;
                                        onChange_ = function(event) {
                                            olInjection.PageEvents.Element_onChange(freeInput_, bOnKeyUp_, elDefinedName_, $(event.target).val());
                                        };
                                    }
                                }
                            } else {
                                //time keeper and comment should be same logic
                                if ((olInjection.Parameters.DefinedNames.TimeKeeperArray.indexOf(elDefinedName_) > -1) || (olInjection.Parameters.DefinedNames.CommentArray.indexOf(elDefinedName_) > -1)) {
                                    elementType_ = 'matter';
                                    onClick_ = olInjection.PageEvents.Matter_onClick;
                                }
                            }
                        }
                    }
                }
            } else {
                //olFunctions.Alert(true, olFunctions.AlertContent('Mobile', 'Set events not supported in mobile mode'));
            }

            for (var i = 0; i < loginFormArray_.length; i++) {
                loginForm_ = loginFormArray_[i];

                if (loginForm_) {
                    loginForm_.setAttribute("autocomplete", "off");
                }
                switch (elAccessType) {
                case 'byID':
                    succeded_ = olInjection.ElementValue._internal.SetValueByElementId(elVariable.elValue, elAccessParam, elInstance, loginForm_, elHtmlTagType, elAttributes, onClick_, onKeyUp_, onChange_, freeInput_, elementType_, replace_, loginType);
                    break;
                case 'byName':
                    succeded_ = olInjection.ElementValue._internal.SetValueByElementName(elVariable.elValue, elAccessParam, elInstance, loginForm_, elHtmlTagType, elAttributes, onClick_, onKeyUp_, onChange_, freeInput_, elementType_, replace_, loginType);
                    break;
                case 'byIndex':
                    succeded_ = olInjection.ElementValue._internal.SetValueByElementIndex(elVariable.elValue, elAccessParam, elInstance, loginForm_, elHtmlTagType, elCustomTagName, elAttributes, onClick_, onKeyUp_, onChange_, freeInput_, elementType_, replace_, loginType);
                    break;
                }
            }
            if (!olInjection.ElementValue._internal.ElementValueSet) {
                olInjection.ElementValue._internal.ElementValueSet = succeded_;
            }
            return succeded_;
        },
        Click : function(elAccessParam, elAccessType, elInstance, elHtmlTagType, elCustomTagName, formAccessParam, formAccessType) {
            var loginForm_ = null;
            var succeded_ = false;
            var loginFormArray_ = [null];

            //if (formAccessParam && formAccessParam.toString().length > 0 && formAccessType && formAccessType.toString().length > 0) {
            loginFormArray_ = olInjection.ElementValue._internal.GetForm(formAccessParam, formAccessType);
            //}

            for (var i = 0; i < loginFormArray_.length; i++) {
                loginForm_ = loginFormArray_[i];
                switch (elAccessType) {
                case 'byID':
                    succeded_ = olInjection.ElementValue._internal.ClickByElementId(elAccessParam, elInstance, loginForm_, elHtmlTagType);
                    break;
                case 'byName':
                    succeded_ = olInjection.ElementValue._internal.ClickByElementName(elAccessParam, elInstance, loginForm_, elHtmlTagType);
                    break;
                case 'byIndex':
                    succeded_ = olInjection.ElementValue._internal.ClickByElementIndex(elAccessParam, elInstance, loginForm_, elHtmlTagType, elCustomTagName);
                    break;
                }
            }

            return succeded_;
        },
        GetElementVaribleReplacement : function(elDefinedName, variableReplacement) {
            var elValue_ = null;
            var elOrg_ = false;

            if (olFunctions.IsFilledArray(variableReplacement.Variables)) {
                //matter
                if (olInjection.Parameters.DefinedNames.MatterArray.indexOf(String(elDefinedName)) > -1) {
                    elValue_ = olInjection.Parameters.Flags.FinalMatterValue;
                } else {
                    //time keeper
                    if (olInjection.Parameters.DefinedNames.TimeKeeperArray.indexOf(String(elDefinedName)) > -1) {
                        elValue_ = olInjection.Parameters.Flags.TimekeeperNumber;
                    } else {
                        //comment
                        if (olInjection.Parameters.DefinedNames.CommentArray.indexOf(String(elDefinedName)) > -1) {
                            elValue_ = olInjection.Parameters.Flags.Comment;
                        } else {
                            //default
                            for (var i = 0; i < variableReplacement.Variables.length; i++) {
                                var currentVariable = variableReplacement.Variables[i];

                                if (currentVariable.DefinedName == elDefinedName) {
                                    elValue_ = currentVariable.Value;
                                    elOrg_ = !((currentVariable.IsPersonalSpecified && currentVariable.IsPersonal) || (currentVariable.IsCommonSpecified && currentVariable.IsCommon));
                                }
                                if (elValue_) {
                                    break;
                                }
                            }
                        }
                    }
                    // }
                }

            }
            var elVariable_ = {
                elValue : elValue_,
                elOrg : elOrg_
            };
            return elVariable_;
        },
        SetDocuments : function(inDocument) {
            try {
                //clear Documents
                olInjection.ElementValue._internal.Documents = new Array();

                var newDocuments_ = new Array();
                if (inDocument && typeof inDocument=='object') {
                    //start itterations with given document
                    newDocuments_.push(inDocument);
                } else {
                    //start itterations with main document
                    newDocuments_.push(document);
                }

                var checkAgain_ = true;

                while (checkAgain_) {
                    checkAgain_ = false;
                    var iterationDocuments_ = new Array();
                    for (var i = 0; i < newDocuments_.length; i++) {
                        try {
                            var iframes_ = newDocuments_[i].getElementsByTagName('iframe');
                            for (var iframe in iframes_) {
                                try {
                                    var frame_ = iframes_[iframe];
                                    var frameDocument_ = frame_.contentDocument ? frame_.contentDocument : frame_.contentWindow.document;
                                    if ( typeof frameDocument_ == 'object') {
                                        iterationDocuments_.push(frameDocument_);
                                        checkAgain_ = true;
                                    }
                                } catch(e) {
                                    //this try catch is here to prevent cross domain errors...
                                }
                            }
                            var frames_ = newDocuments_[i].getElementsByTagName('frame');
                            for (var frame in frames_) {
                                try {
                                    var frame_ = frames_[frame];
                                    var frameDocument_ = frame_.contentDocument ? frame_.contentDocument : frame_.contentWindow.document;
                                    if ( typeof frameDocument_ == 'object') {
                                        iterationDocuments_.push(frameDocument_);
                                        checkAgain_ = true;
                                    }
                                } catch(e) {
                                    //this try catch is here to prevent cross domain errors...
                                }
                            }

                            //newDocuments_[i] is valid document
                            olInjection.ElementValue._internal.Documents.push(newDocuments_[i]);
                        } catch(ex) {
                        }
                    }
                    newDocuments_ = iterationDocuments_;
                }
            } catch(e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetDocuments: ', e.message + '\n' + e.stack);
                olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
            } finally {
                //clear possible null documents
                var clearedDocuments_ = new Array();
                for (var doc in olInjection.ElementValue._internal.Documents) {
                    var currentDocument = olInjection.ElementValue._internal.Documents[doc];
                    if (currentDocument != null && (typeof currentDocument == 'object')) {
                        clearedDocuments_.push(currentDocument);
                    }
                }
                olInjection.ElementValue._internal.Documents = clearedDocuments_;
            }
        },
        SetMatterValues : function() {
            try {
                if (!olInjection.Parameters.Flags.MatterSkiped) {
                    var matterNumber_ = '';
                    var timekeeperNumber_ = '';
                    var comment_ = '';

                    if (olInjection.Parameters.Flags.MatterNumber) {
                        matterNumber_ = olInjection.Parameters.Flags.MatterNumber;
                    }
                    if (olInjection.Parameters.Flags.TimekeeperNumber != null) {
                        timekeeperNumber_ = olInjection.Parameters.Flags.TimekeeperNumber;
                    }
                    if (olInjection.Parameters.Flags.Comment) {
                        comment_ = olInjection.Parameters.Flags.Comment;
                    }

                    var matterFormat_ = olInjection.Parameters.Flags.MatterFormat;
                    if (matterFormat_ && matterFormat_ != '') {
                        matterFormat_ = matterFormat_.replace('MatterId', matterNumber_);
                        matterFormat_ = matterFormat_.replace('PersonalId', timekeeperNumber_);
                        olInjection.Parameters.Flags.FinalMatterValue = matterFormat_.replace('Comment', comment_);
                    } else {
                        olInjection.Parameters.Flags.FinalMatterValue = matterNumber_;
                    }
                } else {
                    olInjection.Parameters.Flags.FinalMatterValue = '';
                }
            } catch(e) {
                var alertErrorContent_ = new olFunctions.AlertContent('SetMatterValues: ', e.message + '\n' + e.stack);
                olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
            }
        }
    },
    InjectElementsWithTimeout : function() {
        setTimeout(function() {
            olInjection.InjectElements();
        }, 200);
        setTimeout(function() {
            olInjection.InjectElements();
        }, 900);
    },
    _CheckAllForInjection : function() {
        if ( typeof olPage != 'undefined') {
            return olPage.Content._internal.CheckAllforInjection();
        } else {
            return true;
        }
    },
    _injectElements : function() {
        try {
            if (olInjection._CheckAllForInjection()) {
                //at least one injection will happen
                olInjection.InjectionHappened = true;

                olInjection.ElementValue.SetDocuments();

                var loginType_ = olInjection.Parameters.Flags.LoginType;
                if (olFunctions.IsFilledArray(olInjection.Parameters.Forms)) {
                    olInjection.ElementValue.SetMatterValues();
                    for (var i = 0; i < olInjection.Parameters.Forms.length; i++) {
                        var currentForm_ = olInjection.Parameters.Forms[i];

                        if (olFunctions.IsFilledArray(currentForm_.JScript)) {
                            //JScript injection
                            olInjection.JScriptInjection(currentForm_.JScript);
                        }

                        if (olFunctions.CheckUrls(currentForm_.URL, currentForm_.IgnoreURL)) {
                            var formAccessType_ = null;
                            var formAccessParam_ = null;

                            if (currentForm_.UseForm) {
                                formAccessType_ = olDictionaries.Dictionaries.FormAccessType(currentForm_.Id, currentForm_.Name, currentForm_.IndexSpecified);
                                switch (formAccessType_) {
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
                            } else {
                                formAccessType_ = 'noUseForm';
                            }

                            if (olFunctions.IsFilledArray(currentForm_.Elements)) {
                                //process elements
                                for (var k = 0; k < currentForm_.Elements.length; k++) {
                                    var currentElement_ = currentForm_.Elements[k];
                                    var inputReplacementType_ = olDictionaries.Dictionaries.InputReplacementType(currentElement_);
                                    var elDefinedName_ = currentElement_.DefinedName;
                                    var elVariable_ = olInjection.ElementValue.GetElementVaribleReplacement(elDefinedName_, olInjection.Parameters.VariableReplacement);
                                    // var elType_ = olDictionaries.Dictionaries.ElType(currentElement_.Type);
                                    var elElementType_ = olDictionaries.Dictionaries.ElElementType(currentElement_.ElementTypeSpecified, currentElement_.ElementType);
                                    var elAccessType_ = olDictionaries.Dictionaries.ElAccessType(currentElement_.Id, currentElement_.Name, currentElement_.IndexSpecified);
                                    var elAtributes_ = currentElement_.Attributes;
                                    var elCustomTagName_ = currentElement_.TagName;

                                    var elAccessParam_ = null;
                                    switch (elAccessType_) {
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
                                    olInjection.ElementValue.Set(elVariable_, elAccessParam_, elAccessType_, currentElement_.Instance, elElementType_, elCustomTagName_, elAtributes_, elDefinedName_, formAccessParam_, formAccessType_, inputReplacementType_, loginType_);
                                }
                            }
                        }
                    }
                }
                olInjection.JScriptInjectionBA('olJSInjectAfter');

                if (!olInjection.ElementValue._internal.ElementValueSet && !olInjection.ElementValue._internal.SetTimeoutForInjectElements) {
                    olInjection.ElementValue._internal.SetTimeoutForInjectElements = true;
                    setTimeout(function() {
                        olInjection.InjectElements();
                    }, 1000);
                    setTimeout(function() {
                        olInjection.InjectElements();
                    }, 2000);
                    setTimeout(function() {
                        olInjection.InjectElements();
                    }, 3000);
                    setTimeout(function() {
                        olInjection.InjectElements();
                    }, 5000);
                }
            }
        } catch(e) {
            var alertErrorContent_ = new olFunctions.AlertContent('_injectElements', e.message + '\n' + e.stack);
            olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
        }
    },
    _intervalForInjection : null,
    InjectElements : function() {
        try {
            if (!olInjection.InjectionHappened) {
                olInjection._injectElements();
            } else {
                if (!olInjection._intervalForInjection) {
                    setTimeout(function() {
                        olInjection._injectElements();
                        clearInterval(olInjection._intervalForInjection);
                        olInjection._intervalForInjection = null;
                    }, 2000);
                }

                clearInterval(olInjection._intervalForInjection);

                olInjection._intervalForInjection = setTimeout(function() {
                    olInjection._injectElements();
                }, 1000);
            }
        } catch(e) {
            var alertErrorContent_ = new olFunctions.AlertContent('InjectElements', e.message + '\n' + e.stack);
            olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
        }
    },
    BindElementsWithTimeout : function(element, event) {
        if (olInjection.Parameters.Flags.ExtensionEnviroment) {
            var elmn_ = $(element);
            elmn_.off(event, olInjection.InjectElementsWithTimeout);
            elmn_.on(event, olInjection.InjectElementsWithTimeout);
        } else {
            var alertContent_ = new olFunctions.AlertContent('Mobile', 'BindElementsWithTimeout not supported in mobile mode');
            olFunctions.Alert(true, alertContent_);
        }
    },
    BindElementsForAnalysis : function(element, event, feature) {
        if (olInjection.Parameters.Flags.ExtensionEnviroment) {
            var elmn_ = $(element);
            elmn_.on(event, function() {
                olInjection.PageEvents.PPA_Event(feature);
            });
        } else {
            var alertContent_ = new olFunctions.AlertContent('Mobile', 'BindElementsForAnalysis not supported in mobile mode');
            olFunctions.Alert(true, alertContent_);
        }
    },
    JScriptInjectionBA : function(type) {
        try {
            var runSchedule_ = null;
            switch (type) {
            case 'olJSInjectBefore':
                runSchedule_ = 0;
                break;
            case 'olJSInjectAfter':
                runSchedule_ = 1;
                break;
            }
            if (olFunctions.IsFilledArray(olInjection.Parameters.JScript)) {
                for (var s = 0; s < olInjection.Parameters.JScript.length; s++) {
                    if (olInjection.Parameters.JScript[s].RunScheduleSpecified) {
                        if (olInjection.Parameters.JScript[s].RunSchedule == runSchedule_) {
                            var atobCode_;
                            switch (olInjection.Parameters.Flags.BrowserName) {
                            case 'iejs':
                                atobCode_ = olInjection.Parameters.JScript[s].CodeString;
                                break;
                            default :
                                atobCode_ = atob(olInjection.Parameters.JScript[s].Code);
                                break;
                            }

                            olInjection.JSExec(type, atobCode_);
                        }
                    }
                }
            }
        } catch(e) {
            var alertErrorContent_ = new olFunctions.AlertContent('JScriptInjectionBA', e.message + '\n' + e.stack);
            olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
        }
    },
    JSExec : function(type, atobCode) {
        if (olInjection.Parameters.Flags.ExtensionEnviroment) {
            atobCode = 'console.log("atob injected");' + atobCode;
            atobCode = "if (document." + type + " == undefined) {document." + type + " = function(){try{" + atobCode + "}catch(ex){console.log('Injected js error : ' + ex.message);}}};document." + type + "();";

            var exec_ = olInjection.Parameters.exec_;

            if (atobCode.indexOf('olInternalJS') != -1) {
                // internal JS
                exec_ = atobCode;
            } else {
                if (type == 'olJSInjectAfter' && !olInjection.InjectionHappened) {
                    setTimeout(function() {
                        olInjection.JSExec('olJSInjectAfter', atobCode);
                    }, 200);
                    return;
                }
                document.atobCode = atobCode;
                document.scriptTagName_ = 'olSourceEvalScript' + type;
            }

            // $.globalEval(exec_);

            switch(olInjection.Parameters.Flags.BrowserName) {
            case 'chrome':
                eval(exec_);
                break;
            case 'firefox':
                $.globalEval(exec_);
                break;
            default :
                $.globalEval(exec_);
                break;
            }
        } else {
            var alertContent_ = new olFunctions.AlertContent('Mobile', 'JSExec not supported in mobile mode');
            olFunctions.Alert(true, alertContent_);
        }
    },
    JScriptInjection : function(JScriptArray) {
        for (var s = 0; s < JScriptArray.length; s++) {
            try {
                var atobCode_;
                switch (olInjection.Parameters.Flags.BrowserName) {
                case 'iejs':
                    atobCode_ = JScriptArray[s].CodeString;
                    break;
                default :
                    atobCode_ = atob(JScriptArray[s].Code);
                    break;
                }
                atobCode_ = olFunctions.RemoveComments(atobCode_);
                olInjection.JSExec('olJSInject', atobCode_);
            } catch (e) {
                var alertErrorContent_ = new olFunctions.AlertContent('JScriptInjection', e.message + '\n' + e.stack);
                olFunctions.Alert(olInjection.Parameters.DebugErrors, alertErrorContent_);
            }
        }
    }
};

