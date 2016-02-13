var OptionsPage = {
    Options : {
        _internal : {

        }
    },
    Intialise : function() {
        OptionsPage._events.OnReady();
        OptionsPage._events.OnClickSave();
        OptionsPage._events.OnClickDefault();
        OptionsPage._events.OnClickAdministrativeSectionOK();
        OptionsPage._events.onEnterClickOnAdministrativeSection();
    },
    _methods : {
        StatusMsg : function(msg) {
            $('#divOnelogStatus').html(msg);
            setTimeout(function() {
                $('#divOnelogStatus').html('');
            }, 3000);
        },
        GetElementValue : function(element) {
            switch (element.Type) {
                case 'text':
                    return $('#' + element.ObjectId).val();
                case 'checkbox':
                    return $('#' + element.ObjectId).is(':checked');
                case 'select':
                    return $('#' + element.ObjectId).val();
                case 'radio':
                    return parseInt($('#' + element.ObjectId).val());
                case 'internal':
                    //return $('#' + element.ObjectId).val();
                    break;
                default:
                    alert('Element of type ' + element.Type + ' not supported!');
                    break;
            };
        },
        SetElementValue : function(element, defaultParam) {
            var elementValue = defaultParam ? element.DefaultValue : element.Value;
            switch (element.Type) {
                case 'text':
                    $('#' + element.ObjectId).val(elementValue);
                    break;
                case 'checkbox':
                    if (element.ObjectId == 'olAdministratorSettings') {
                        $('#olAdministratorSettings').prop('checked', false);
                    } else {
                        $("#" + element.ObjectId).prop('checked', elementValue);
                    }
                    break;
                case 'select':
                    $('#' + element.ObjectId).val(elementValue);
                    break;
                case 'radio':
                    $('#' + element.ObjectId).val(elementValue);
                    break;
                case 'internal':
                    //$('#' + element.ObjectId).val(elementValue);
                    break;
                default:
                    alert('Element of type ' + element.Type + ' not supported!');
                    break;
            };
        },
        CreateHtmlElement : function(elementData) {
            var classStyle_;
            var divContainerWidth_;
            if (elementData.ParrentId == null) {
                classStyle_ = 'olDivOptionsParrent';
                divContainerWidth_ = 800;
            } else {
                classStyle_ = 'olDivOptionsChild';
                divContainerWidth_ = $('#div' + (elementData.ParrentId)).width() - 50;
            }

            var divId_ = 'div' + elementData.ObjectId;
            var divHeader_ = '<div id="' + divId_ + '" style="width:' + divContainerWidth_ + '" class="' + classStyle_ + '">';
            var divFooter_ = '</div>';
            var div_;

            var label_ = '<div id="lab' + divId_ + '" class="olDivLabel">' + elementData.Label + '</div>';

            elementWidth = divContainerWidth_ - 250;

            var element_ = '<div id="elem' + divId_ + '" style="width:' + elementWidth + '" class="olDivElement" style=visibility: "' + elementData.Visible + '">';
            var elementBody_ = '';
            switch(elementData.Type) {
                case 'text':
                    elementBody_ = '<input class="olInput" type=' + elementData.Type + ' id="' + elementData.ObjectId + '" style="width: ' + elementWidth + 'px;"/>';
                    break;
                case 'checkbox':
                    elementBody_ = '<input type=' + elementData.Type + ' id="' + elementData.ObjectId + '" checked=""/>';
                    break;
                case 'select':
                    elementBody_ = '<' + elementData.Type + ' id="' + elementData.ObjectId + '" style="width: ' + elementWidth + 'px; ">';
                    var options = '';

                    for ( j = 0; j < elementData.ElementOptions.length; j++) {
                        options = options + '<option value="' + elementData.ElementOptions[j].Value + '">' + elementData.ElementOptions[j].Text + '</option><br/>';
                    }
                    elementBody_ = elementBody_ + options + '</select>';
                    break;
                case 'radio':
                    for ( j = 0; j < elementData.ElementOptions.length; j++) {
                        elementBody_ = elementBody_ + '<input type=' + elementData.Type + ' name="' + elementData.ObjectId + '" value=' + elementData.ElementOptions[j].Value + '>' + elementData.ElementOptions[j].Text;
                    }
                    break;
                case 'internal':
                    //elementBody_ = '<input type=' + elementData.Type + ' id="' + elementData.ObjectId + '" style="width: "' + width + 'px;"/>';
                    break;
                default:
                    alert('Element of type ' + elementData.Type + ' not supported!');
                    break;
            }

            element_ = element_ + elementBody_ + divFooter_;
            div_ = divHeader_ + label_ + element_ + divFooter_;

            if (elementData.Type != 'internal') {
                if (elementData.ParrentId == null) {
                    $('#divOnelogOptions').append(div_);
                } else {
                    $('#div' + elementData.ParrentId).append(div_);
                }
            }

            if (elementData.Visible === false) {
                $('#' + divId_).css({
                    display : 'none'
                });
            }

            if (elementData.Type == 'checkbox') {
                if (elementData.ObjectId == 'olAdministratorSettings') {
                    OptionsPage._events.OnClickAdministrativeSection();
                    $('#' + elementData.ObjectId).click(OptionsPage._events.OnClickAdministrativeSection);
                } else {
                    $('#' + elementData.ObjectId).click(OptionsPage._events.OnClickCheckbox);
                }
            }
        },
        CreateHtmlElements : function() {
            for ( i = 0; i < OptionsPage.Options._internal.OptionsArray.length; i++) {
                OptionsPage._methods.CreateHtmlElement(OptionsPage.Options._internal.OptionsArray[i]);
            };
            $('#olPleaseWait').remove();
        },
        SetElementsVisibility : function() {
            var currentElement;
            for ( i = 0; i < OptionsPage.Options._internal.OptionsArray.length; i++) {
                currentElement = OptionsPage.Options._internal.OptionsArray[i];

                if (currentElement.Type == 'checkbox') {
                    var childrenOfCheckbox = $.grep(OptionsPage.Options._internal.OptionsArray, function(member) {
                        return (currentElement.ObjectId == member.ParrentId);
                    });

                    for ( j = 0; j < childrenOfCheckbox.length; j++) {
                        if (OptionsPage._methods.GetElementValue(OptionsPage.Options._internal.OptionsArray[i])) {
                            $('#div' + childrenOfCheckbox[j].ObjectId).show(200);
                        } else {
                            $('#div' + childrenOfCheckbox[j].ObjectId).hide(200);
                        }
                    }
                }
            }
        },
        LoadOptions : function(defaultParam) {
            for ( i = 0; i < OptionsPage.Options._internal.OptionsArray.length; i++) {
                OptionsPage._methods.SetElementValue(OptionsPage.Options._internal.OptionsArray[i], defaultParam);
            }
        },
        SaveOptions : function() {
            for ( i = 0; i < OptionsPage.Options._internal.OptionsArray.length; i++) {
                OptionsPage.Options._internal.OptionsArray[i].Value = OptionsPage._methods.GetElementValue(OptionsPage.Options._internal.OptionsArray[i]);
            }
            kango.invokeAsync('kango.storage.setItem', 'olOptions', OptionsPage.Options._internal.OptionsArray, function() {
                OptionsPage._dispatchMessageRefreshOptions();
            });
            OptionsPage._methods.StatusMsg('Options saved');
        },
        DefaultOptions : function() {
            OptionsPage._methods.LoadOptions(true);
            OptionsPage._methods.SaveOptions();
            OptionsPage._methods.SetElementsVisibility();
            OptionsPage._methods.StatusMsg('Reverted to default options');
        },
        InitialiseOptions : function() {
            try {
                kango.invokeAsync('kango.storage.getItem', 'olOptions', function(data) {
                    OptionsPage.Options._internal.OptionsArray = data;
                    OptionsPage._methods.CreateHtmlElements();
                    OptionsPage._methods.LoadOptions(false);
                    OptionsPage._methods.SetElementsVisibility();

                    //olPage.Content.Divs._internal.Modal.Initialise();
                    var olPromptAdmin_ = $('#olPromptAdministrativeSection');
                    olPage.Content.Divs._internal.Modal._$modal.append(olPromptAdmin_);
                });
            } catch(e) {
                alert(e);
            }
        }
    },
    _events : {
        OnReady : function() {
            try {
                KangoAPI.onReady(OptionsPage._methods.InitialiseOptions);
            } catch(e) {
                alert(e);
            }
        },
        OnClickSave : function() {
            $('#olSaveOptions').bind('click', OptionsPage._methods.SaveOptions);
        },
        OnClickDefault : function() {
            $('#olDefaultOptions').bind('click', OptionsPage._methods.DefaultOptions);
        },
        OnClickCheckbox : function() {
            OptionsPage._methods.SetElementsVisibility();
        },
        OnClickAdministrativeSection : function() {
            $('#olAdministratorSettings').click(function() {
                if ($('#olAdministratorSettings').prop('checked')) {
                    $('#olAdministrativePasswordInput').val(null);
                    olPage.Content.Divs.Load._internal.LoadOverlay('olPromptAdministrativeSection');
                } else {
                    OptionsPage._methods.SetElementsVisibility();
                }
                $('#olAdministrativePasswordInput').focus();
            });
        },
        OnClickAdministrativeSectionOK : function() {
            $('#olPromptAdministrativeSectionOK').click(function() {
                if ($('#olAdministrativePasswordInput').val() == '0n3l0g') {
                    olPage.Content.Divs.Close._internal.CloseOverlay('olPromptAdministrativeSection');
                    OptionsPage._methods.SetElementsVisibility();
                    OptionsPage._methods.StatusMsg('Access granted');
                } else {
                    OptionsPage._methods.StatusMsg('Wrong password');
                    olPage.Content.Divs.Close._internal.CloseOverlay('olPromptAdministrativeSection');
                    $('#olAdministratorSettings').prop('checked', false);
                }

            });
        },
        onEnterClickOnAdministrativeSection : function() {
            $('#olPromptAdministrativeSection').keypress(function(e) {
                if (e.which == 13) {
                    e.preventDefault();
                    $("#olPromptAdministrativeSectionOK").click();
                }
            });
        }
    },
    _dispatchMessageRefreshOptions : function() {
        kango.dispatchMessage('olRefreshOptions');
    }
};

OptionsPage.Intialise();

