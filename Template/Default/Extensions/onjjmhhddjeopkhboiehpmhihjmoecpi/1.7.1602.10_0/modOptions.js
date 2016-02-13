/**
 *  Onelog options
 */

/* global e, kango */

var olOptions = {
    DevelopmentVersion : function() {
        return olOptions._internal.DevelopmentVersion;
    },
    _internal : {
        DevelopmentVersion : false,
        Page : false,
        OptionsArray : [{
            Name : 'General',
            Visible : true,
            Label : 'Settings:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olGeneral',
            Type : 'checkbox',
            ParrentId : null
        }, {
            Name : 'GeneralPageToolbarMinimized',
            Visible : true,
            Label : 'Always start toolbar minimised:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olGeneralPageToolbarMinimized',
            Type : 'checkbox',
            ParrentId : 'olGeneral'
        }, {
            Name : 'GeneralPageToolbarPosition',
            Visible : true,
            Label : 'Toolbar position:',
            Value : '0',
            DefaultValue : 0,
            ElementOptions : [{
                Value : '0',
                Text : 'Top left'
            }, {
                Value : '1',
                Text : 'Bottom left'
            }, {
                Value : '2',
                Text : 'Bottom right'
            }, {
                Value : '3',
                Text : 'Top right'
            }],
            ObjectId : 'olGeneralPageToolbarPosition',
            Type : 'select',
            ParrentId : 'olGeneral'
        }, {
            Name : 'AdministratorSettings',
            Visible : true,
            Label : 'Administrative settings:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olAdministratorSettings',
            Type : 'checkbox',
            ParrentId : null
        }, {
            Name : 'ServerUrl',
            Visible : true,
            Label : 'Server URL:',
            Value : 'http://localhost:12345/index/',
            DefaultValue : 'http://localhost:12345/index/',
            ElementOptions : null,
            ObjectId : 'olServerURL',
            Type : 'text',
            ParrentId : 'olAdministratorSettings'
        }, {
            Name : 'DebugErrors',
            Visible : true,
            Label : 'Errors:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugErrors',
            Type : 'checkbox',
            ParrentId : 'olAdministratorSettings'
        }, {
            Name : 'DeveloperSettings',
            Visible : false,
            Label : 'Developers settings:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDeveloperSettings',
            Type : 'checkbox',
            ParrentId : null
        }, {
            Name : 'NotUsed',
            Visible : true,
            Label : 'Not used:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olNotUsed',
            Type : 'checkbox',
            ParrentId : 'olDeveloperSettings'
        }, {
            Name : 'GeneralPageToolbarDisplay',
            Visible : true,
            Label : 'Display toolbar:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olGeneralPageToolbarDisplay',
            Type : 'checkbox',
            ParrentId : 'olDeveloperSettings'
        }, {
            Name : 'GeneralPageInjectFieldColor',
            Visible : true,
            Label : 'Inject field color :',
            Value : '#FFFF80',
            DefaultValue : '#FFFF80',
            ElementOptions : [{
                Value : '#FF0000',
                Text : 'Red'
            }, {
                Value : '#00FFFF',
                Text : 'Cyan'
            }, {
                Value : '#00FF00',
                Text : 'Blue'
            }, {
                Value : '#0000A0',
                Text : 'DarkBlue'
            }, {
                Value : '#ADD8E6',
                Text : 'LightBlue'
            }, {
                Value : '#800080',
                Text : 'Purple'
            }, {
                Value : '#FFFF80',
                Text : 'Yellow'
            }, {
                Value : '#00FF00',
                Text : 'Lime'
            }, {
                Value : '#FF00FF',
                Text : 'Fuchsia'
            }, {
                Value : '#FFFFFF',
                Text : 'White'
            }, {
                Value : '#C0C0C0',
                Text : 'Silver'
            }, {
                Value : '#808080',
                Text : 'Gray'
            }, {
                Value : '#000000',
                Text : 'Black'
            }, {
                Value : '#FFA500',
                Text : 'Orange'
            }, {
                Value : '#A52A2A',
                Text : 'Brown'
            }, {
                Value : '#800000',
                Text : 'Maroon'
            }, {
                Value : '#008000',
                Text : 'Green'
            }, {
                Value : '#808000',
                Text : 'Olive'
            }],
            ObjectId : 'olGeneralPageInjectFieldColor',
            Type : 'select',
            ParrentId : 'olNotUsed'
        }, {
            Name : 'GeneralPageTransitionTime',
            Visible : true,
            Label : 'Show/hide transition time (ms):',
            Value : '200',
            DefaultValue : 200,
            ElementOptions : null,
            ObjectId : 'olGeneralPageTransitionTime',
            Type : 'text',
            ParrentId : 'olNotUsed'
        }, {
            Name : 'AjaxCallTimeout',
            Visible : true,
            Label : 'Timeout for server requests (ms):',
            Value : '30000',
            DefaultValue : 30000,
            ElementOptions : null,
            ObjectId : 'olTimeoutForServerRequests',
            Type : 'text',
            ParrentId : 'olNotUsed'
        }, {
            Name : 'GeneralPageToolbarWidth',
            Visible : true,
            Label : 'Toolbar width:',
            Value : '0',
            DefaultValue : 0,
            ElementOptions : [{
                Value : '0',
                Text : 'Minimal'
            }, {
                Value : '1',
                Text : '100% of screen size'
            }],
            ObjectId : 'olGeneralPageToolbarWidth',
            Type : 'select',
            ParrentId : 'olNotUsed'
        }, {
            Name : 'WebControl',
            Visible : true,
            Label : 'Web Control:',
            Value : '0',
            DefaultValue : 0,
            ElementOptions : [{
                Value : '0',
                Text : 'Disabled'
            }, {
                Value : '1',
                Text : 'Show a message then block access to the webpage'
            }, {
                Value : '2',
                Text : 'Show a message and then redirect to another webpage'
            }, {
                Value : '3',
                Text : 'Show a message then continue'
            }, {
                Value : '4',
                Text : 'Block access to the webpage with no message'
            }, {
                Value : '5',
                Text : 'Redirect to another webpage with no message'
            }],
            ObjectId : 'olWebControl',
            Type : 'select',
            ParrentId : 'olNotUsed'
        }, {
            Name : 'DebugMode',
            Visible : true,
            Label : 'Debug Mode:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugMode',
            Type : 'checkbox',
            ParrentId : 'olDeveloperSettings'
        }, {
            Name : 'ResourcesUrlPrefix',
            Visible : true,
            Label : 'Resource for IE:',
            Value : 'https://cloud.onelog.com/extensions/olResources/',
            DefaultValue : 'https://cloud.onelog.com/extensions/olResources/',
            ElementOptions : [{
                Value : 'https://devtest.onelog.com/mobview/olResources/',
                Text : 'Testing URL'
            }, {
                Value : 'https://cloud.onelog.com/extensions/olResources/',
                Text : 'Production URL'
            }, {
                Value : 'c:/!!!__________________OnelogExtension_deployment/olResources/',
                Text : 'Local Development'
            }],
            ObjectId : 'olResourcesUrlPrefix',
            Type : 'select',
            ParrentId : 'olDebugMode'
        }, {
            Name : 'DebugInfoAlerts',
            Visible : true,
            Label : 'Alerts during debug:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugInfoAlerts',
            Type : 'checkbox',
            ParrentId : 'olDebugMode'
        }, {
            Name : 'DebugInfoLogs',
            Visible : false,
            Label : 'Logs during debug:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugInfoLogs',
            Type : 'checkbox',
            ParrentId : 'olDebugMode'
        }, {
            Name : 'DebugInfoNotifications',
            Visible : true,
            Label : 'Notifications during debug:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugInfoNotifications',
            Type : 'checkbox',
            ParrentId : 'olDebugMode'
        }, {
            Name : 'DebugExtension',
            Visible : true,
            Label : 'Extension:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtension',
            Type : 'checkbox',
            ParrentId : 'olDebugMode'
        }, {
            Name : 'DebugExtensionBasicAuthentication',
            Visible : true,
            Label : 'Basic authentication:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionBasicAuthentication',
            Type : 'checkbox',
            ParrentId : 'olDebugExtension'
        }, {
            Name : 'DebugExtensionBasicAuthenticationDisplay401Url',
            Visible : true,
            Label : 'Display 401 url (Chrome only):',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionBasicAuthenticationDisplay401Url',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionBasicAuthentication'
        }, {
            Name : 'DebugExtensionEvents',
            Visible : true,
            Label : 'Events:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionEvents',
            Type : 'checkbox',
            ParrentId : 'olDebugExtension'
        }, {
            Name : 'DebugExtensionEventsBeforeNavigate',
            Visible : true,
            Label : 'Before navigate:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionEventsBeforeNavigate',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionEvents'
        }, {
            Name : 'DebugExtensionEventsBrowserWindowClosing',
            Visible : true,
            Label : 'Browser window closing:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionEventsBrowserWindowClosing',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionEvents'
        }, {
            Name : 'DebugExtensionEventsTabRemoved',
            Visible : true,
            Label : 'Tab removed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionEventsTabRemoved',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionEvents'
        }, {
            Name : 'DebugExtensionEventsTabChanged',
            Visible : true,
            Label : 'Tab changed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionEventsTabChanged',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionEvents'
        }, {
            Name : 'DebugExtensionEventsTabCreated',
            Visible : true,
            Label : 'Tab created:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionEventsTabCreated',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionEvents'
        }, {
            Name : 'DebugExtensionEventsTabReplaced',
            Visible : true,
            Label : 'Tab replaced:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionEventsTabReplaced',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionEvents'
        }, {
            Name : 'DebugExtensionEventsWindowChanged',
            Visible : true,
            Label : 'Window changed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionEventsWindowChanged',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionEvents'
        }, {
            Name : 'DebugExtensionMessages',
            Visible : true,
            Label : 'Messages:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessages',
            Type : 'checkbox',
            ParrentId : 'olDebugExtension'
        }, {
            Name : 'DebugExtensionMessagesReceived',
            Visible : true,
            Label : 'Received:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceived',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessages'
        }, {
            Name : 'DebugExtensionMessagesReceivedFlags',
            Visible : true,
            Label : 'Flags:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedFlags',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedFlagsMatterDone',
            Visible : true,
            Label : 'Matter done:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedFlagsMatterDone',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceivedFlags'
        }, {
            Name : 'DebugExtensionMessagesReceivedFlagsLogonDone',
            Visible : true,
            Label : 'LogonDone done:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedFlagsLogonDone',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceivedFlags'
        }, {
            Name : 'DebugExtensionMessagesReceivedApplication',
            Visible : true,
            Label : 'Application:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedApplication',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedContinueSession',
            Visible : true,
            Label : 'Continue session:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedContinueSession',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedCheckMatterGlobal',
            Visible : true,
            Label : 'Check matter global:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedCheckMatterGlobal',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedCloseTab',
            Visible : true,
            Label : 'Close tab:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedCloseTab',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedDeletePersonalDetail',
            Visible : true,
            Label : 'Delete personal detail:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedDeletePersonalDetail',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedFormSubmit',
            Visible : true,
            Label : 'Form submit:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedFormSubmit',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedDocumentReady',
            Visible : true,
            Label : 'Document ready:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedDocumentReady',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedWindowHashChange',
            Visible : true,
            Label : 'Window hash change:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedWindowHashChange',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedPulse',
            Visible : true,
            Label : 'Pulse:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedPulse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedLogoutSequenceCompleted',
            Visible : true,
            Label : 'Logout sequence completed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedLogoutSequenceCompleted',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedHandleLogoutWindow',
            Visible : true,
            Label : 'Handle logout window:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedHandleLogoutWindow',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedProcessPageCompleted',
            Visible : true,
            Label : 'Process page completed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedProcessPageCompleted',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSetCommentEdit',
            Visible : true,
            Label : 'Set comment edit:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSetCommentEdit',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedPersonalDetailsChosen',
            Visible : true,
            Label : 'Process page completed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedPersonalDetailsChosen',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSetCurrentPersonalDetails',
            Visible : true,
            Label : 'Set current personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSetCurrentPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSetComment',
            Visible : true,
            Label : 'Set comment:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSetComment',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedRefreshOptions',
            Visible : true,
            Label : 'Refresh options:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedProcessRefreshOptions',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedStorePasswordRequest',
            Visible : true,
            Label : 'Store password:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedStorePasswordRequest',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSkipMatterDetailsRequest',
            Visible : true,
            Label : 'Skip matter details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSkipMatterDetailsRequest',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSkipPersonalDetailsRequest',
            Visible : true,
            Label : 'Skip personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSkipPersonalDetailsRequest',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedUpdateResponse',
            Visible : true,
            Label : 'Update response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedUpdateResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedValidateSelectedMatter',
            Visible : true,
            Label : 'Validate selected matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedValidateSelectedMatter',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedQuittingResourceSession',
            Visible : true,
            Label : 'Quitting resource session:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedQuittingResourceSession',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSetFeatures',
            Visible : true,
            Label : 'Set features:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSetFeatures',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedStartMessageSeen',
            Visible : true,
            Label : 'Start message seen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedStartMessageSeen',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSetPersonalDetails',
            Visible : true,
            Label : 'Set personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSetPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSetCommonDetails',
            Visible : true,
            Label : 'Set common details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSetCommonDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesReceivedSetTempPersonalDetails',
            Visible : true,
            Label : 'Set temp personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesReceivedSetTempPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesReceived'
        }, {
            Name : 'DebugExtensionMessagesSent',
            Visible : true,
            Label : 'Sent:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSent',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessages'
        }, {
            Name : 'DebugExtensionMessagesSentAskToStorePassword',
            Visible : true,
            Label : 'Ask to store password:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentAskToStorePassword',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentBeforeNavigateRequestDispatchResponse',
            Visible : true,
            Label : 'Before navigate response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentBeforeNavigateRequestDispatchResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentCheckMatterGlobalRequestDispatchResponse',
            Visible : true,
            Label : 'Check matter global response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentCheckMatterGlobalRequestDispatchResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentChooseApplicationDispatchMessage',
            Visible : true,
            Label : 'Choose application:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentChooseApplicationDispatchMessage',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentDeletePersonalDetailDispatchResponse',
            Visible : true,
            Label : 'Delete personal detail response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentDeletePersonalDetailDispatchResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentValidateSelectedMatterRequestDispatchResponse',
            Visible : true,
            Label : 'Validate selected matter response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentValidateSelectedMatterRequestDispatchResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentSetCommentRequestEditDispatchResponse',
            Visible : true,
            Label : 'Set comment edit response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentSetCommentRequestEditDispatchResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentPauseDuration',
            Visible : true,
            Label : 'Pause Duration:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentPauseDuration',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentResourceTimeout',
            Visible : true,
            Label : 'Resource timeout:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentResourceTimeout',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentError',
            Visible : true,
            Label : 'Error:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentError',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentWebControlMessage',
            Visible : true,
            Label : 'Web control message:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentWebControlMessage',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentPersonalDetailsChosenRequestDisptachResponse',
            Visible : true,
            Label : 'Personal details chosen response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentPersonalDetailsChosenRequestDisptachResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentSkipPersonalDetailsRequestDisptachResponse',
            Visible : true,
            Label : 'Skip personal details response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentSkipPersonalDetailsRequestDisptachResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentSetCommentRequestDispatchResponse',
            Visible : true,
            Label : 'Set comment response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentSetCommentRequestDispatchResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionMessagesSentSetPersonalDetailsRequestDispatchResponse',
            Visible : true,
            Label : 'Set personal details response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionMessagesSentSetPersonalDetailsRequestDispatchResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionMessagesSent'
        }, {
            Name : 'DebugExtensionService',
            Visible : true,
            Label : 'Service:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionService',
            Type : 'checkbox',
            ParrentId : 'olDebugExtension'
        }, {
            Name : 'DebugExtensionServiceSentRequests',
            Visible : true,
            Label : 'Sent requests:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequests',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionService'
        }, {
            Name : 'DebugExtensionServiceSentRequestsApplicationRequestSend',
            Visible : true,
            Label : 'Application:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsApplicationRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsBeforeNavigateRequestSend',
            Visible : true,
            Label : 'Before navigate:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsBeforeNavigateRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsCheckMatterGlobalRequestSend',
            Visible : true,
            Label : 'Check global matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsCheckMatterGlobalRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsCheckMatterLocalRequestSend',
            Visible : true,
            Label : 'Check local matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsCheckMatterLocalRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsContinueSessionRequestSend',
            Visible : true,
            Label : 'Continue session:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsContinueSessionRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsDeletePersonalDetailRequestSend',
            Visible : true,
            Label : 'Delete personal detail:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsDeletePersonalDetailRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsFormSubmitRequestSend',
            Visible : true,
            Label : 'Form submit:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsFormSubmitRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsDocumentCompleteRequestSend',
            Visible : true,
            Label : 'Document complete:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsDocumentCompleteRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsGetLocalPersonalCodeListRequestSend',
            Visible : true,
            Label : 'Get local personal code list:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsGetLocalPersonalCodeListRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsLanguageItemsRequestSend',
            Visible : true,
            Label : 'Language items:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsLanguageItemsRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsLogoutCompletedRequestSend',
            Visible : true,
            Label : 'Logout completed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsLogoutCompletedRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsLogoutWindowRequestSend',
            Visible : true,
            Label : 'Logout window:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsLogoutWindowRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsMainWindowClosingRequestSend',
            Visible : true,
            Label : 'Main window closing:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsMainWindowClosingRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsNavigateCompleteRequestSend',
            Visible : true,
            Label : 'Navigate complete:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsNavigateCompleteRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsNewWindowRequestSend',
            Visible : true,
            Label : 'New window:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsNewWindowRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsPulseRequestSend',
            Visible : true,
            Label : 'Pulse:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsPulseRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsPersonalDetailsChosenRequestSend',
            Visible : true,
            Label : 'Personal details chosen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsPersonalDetailsChosenRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSetPersonalDetailsRequestSend',
            Visible : true,
            Label : 'Set personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSetPersonalDetailsRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSetCommonDetailsRequestSend',
            Visible : true,
            Label : 'Set common details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSetCommonDetailsRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSetCommentEditRequestSend',
            Visible : true,
            Label : 'Set comment edit:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSetCommentEditRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSetCommentRequestSend',
            Visible : true,
            Label : 'Set comment:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSetCommentRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSetCurrentPersonalDetailsRequestSend',
            Visible : true,
            Label : 'Set current personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSetCurrentPersonalDetailsRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSetTempPersonalDetailsRequest',
            Visible : true,
            Label : 'Set temp personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSetTempPersonalDetailsRequest',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSkipMatterDetailsRequestSend',
            Visible : true,
            Label : 'Skip matter details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSkipMatterDetailsRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSkipPersonalDetailsChosenRequestSend',
            Visible : true,
            Label : 'Skip personal details chosen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSkipPersonalDetailsChosenRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSkipPersonalDetailsRequestSend',
            Visible : true,
            Label : 'Skip personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSkipPersonalDetailsRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsStorePasswordRequestSend',
            Visible : true,
            Label : 'Store password:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsStorePasswordRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsValidateMatterRequestSend',
            Visible : true,
            Label : 'Validate matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsValidateMatterRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsWindowClosingRequestSend',
            Visible : true,
            Label : 'Window closing:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsWindowClosingRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsQuittingResourceSessionRequestSend',
            Visible : true,
            Label : 'Quitting resource session:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsQuittingResourceSessionRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsSetFeaturesRequestSend',
            Visible : true,
            Label : 'Set features:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsSetFeaturesRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsRequestFeatureRequestSend',
            Visible : true,
            Label : 'Request feature:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsRequestFeatureRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsRequestFeatureItemRequestSend',
            Visible : true,
            Label : 'Request feature item:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsRequestFeatureItemRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsStartMessageSeenRequestSend',
            Visible : true,
            Label : 'Start message seen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsStartMessageSeenRequestSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSentRequestsHideStartMessageRequesttSendSend',
            Visible : true,
            Label : 'Hide start message:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSentRequestsHideStartMessageRequesttSendSend',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSentRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequests',
            Visible : true,
            Label : 'Succeeded requests:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequests',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionService'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsApplication',
            Visible : true,
            Label : 'Application:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsApplication',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsBeforeNavigate',
            Visible : true,
            Label : 'Before navigate:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsBeforeNavigate',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsCheckMatterGlobal',
            Visible : true,
            Label : 'Check global matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsCheckMatterGlobal',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsCheckMatterLocal',
            Visible : true,
            Label : 'Check local matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsCheckMatterLocal',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsDeletePersonalDetail',
            Visible : true,
            Label : 'Delete personal detail:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsDeletePersonalDetail',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsFormSubmit',
            Visible : true,
            Label : 'Form submit:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsFormSubmit',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsDocumentComplete',
            Visible : true,
            Label : 'Document complete:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsDocumentComplete',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsGetLocalPersonalCodeList',
            Visible : true,
            Label : 'Get local personal code list:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsGetLocalPersonalCodeList',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsLanguageItems',
            Visible : true,
            Label : 'Language items:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsLanguageItems',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsLogoutCompleted',
            Visible : true,
            Label : 'Logout completed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsLogoutCompleted',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsLogoutWindow',
            Visible : true,
            Label : 'Logout window:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsLogoutWindow',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsMainWindowClosing',
            Visible : true,
            Label : 'Main window closing:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsMainWindowClosing',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsNavigateComplete',
            Visible : true,
            Label : 'Navigate complete:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsNavigateComplete',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsNewWindow',
            Visible : true,
            Label : 'New window:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsNewWindow',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsPersonalDetailsChosen',
            Visible : true,
            Label : 'Personal details chosen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsPersonalDetailsChosen',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSetPersonalDetails',
            Visible : true,
            Label : 'Set personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSetPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSetCommentEdit',
            Visible : true,
            Label : 'Set comment edit:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSetCommentEdit',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsPulse',
            Visible : true,
            Label : 'Pulse:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsPulse',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSetComment',
            Visible : true,
            Label : 'Set comment:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSetComment',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSetCommonDetails',
            Visible : true,
            Label : 'Set common details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSetCommonDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSetCurrentPersonalDetails',
            Visible : true,
            Label : 'Set current personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSetCurrentPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSetTempPersonalDetails',
            Visible : true,
            Label : 'Set temp personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSetTempPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSkipPersonalDetailsChosen',
            Visible : true,
            Label : 'Skip personal details chosen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSkipPersonalDetailsChosen',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSkipPersonalDetails',
            Visible : true,
            Label : 'Skip personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSkipPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsStorePassword',
            Visible : true,
            Label : 'Store password:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsStorePassword',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsValidateMatter',
            Visible : true,
            Label : 'Validate matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsValidateMatter',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsWindowClosing',
            Visible : true,
            Label : 'Window closing:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsWindowClosing',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsQuittingResourceSession',
            Visible : true,
            Label : 'Quitting resource session:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsQuittingResourceSession',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsSetFeatures',
            Visible : true,
            Label : 'Set features:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsSetFeatures',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsRequestFeature',
            Visible : true,
            Label : 'Request feature:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsRequestFeature',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsRequestFeatureItem',
            Visible : true,
            Label : 'Request feature:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsRequestFeatureItem',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsStartMessageSeen',
            Visible : true,
            Label : 'Start message seen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsStartMessageSeen',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugExtensionServiceSucceededRequestsHideStartMessage',
            Visible : true,
            Label : 'Hide start message:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugExtensionServiceSucceededRequestsHideStartMessage',
            Type : 'checkbox',
            ParrentId : 'olDebugExtensionServiceSucceededRequests'
        }, {
            Name : 'DebugPage',
            Visible : true,
            Label : 'Page:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPage',
            Type : 'checkbox',
            ParrentId : 'olDebugMode'
        }, {
            Name : 'DebugPageEvents',
            Visible : true,
            Label : 'Events:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageEvents',
            Type : 'checkbox',
            ParrentId : 'olDebugPage'
        }, {
            Name : 'DebugPageEventsSubmit',
            Visible : true,
            Label : 'Submit:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageEventsSubmit',
            Type : 'checkbox',
            ParrentId : 'olDebugPageEvents'
        }, {
            Name : 'DebugPageEventsDocumentReady',
            Visible : true,
            Label : 'Document ready:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageEventsDocumentReady',
            Type : 'checkbox',
            ParrentId : 'olDebugPageEvents'
        }, {
            Name : 'DebugPageEventsBodySubtreeChanged',
            Visible : true,
            Label : 'Body subtree changed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageEventsBodySubtreeChanged',
            Type : 'checkbox',
            ParrentId : 'olDebugPageEvents'
        }, {
            Name : 'DebugPageEventsTitleSubtreeChanged',
            Visible : true,
            Label : 'Title changed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageEventsTitleSubtreeChanged',
            Type : 'checkbox',
            ParrentId : 'olDebugPageEvents'
        }, {
            Name : 'DebugPageEventsWindowHashChange',
            Visible : true,
            Label : 'Window hash change:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageEventsWindowHashChange',
            Type : 'checkbox',
            ParrentId : 'olDebugPageEvents'
        }, {
            Name : 'DebugPageEventsWindowBeforeUnload',
            Visible : true,
            Label : 'Window before unload:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageEventsWindowBeforeUnload',
            Type : 'checkbox',
            ParrentId : 'olDebugPageEvents'
        }, {
            Name : 'DebugPageMessages',
            Visible : true,
            Label : 'Messages:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessages',
            Type : 'checkbox',
            ParrentId : 'olDebugPage'
        }, {
            Name : 'DebugPageMessagesReceived',
            Visible : true,
            Label : 'Received:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceived',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessages'
        }, {
            Name : 'DebugPageMessagesReceivedAskToStorePassword',
            Visible : true,
            Label : 'Ask to store password:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedAskToStorePassword',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedBeforeNavigate',
            Visible : true,
            Label : 'Before navigate response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedBeforeNavigate',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedCheckMatterGlobal',
            Visible : true,
            Label : 'Check matter global response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedCheckMatterGlobal',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedChooseApplicationMessage',
            Visible : true,
            Label : 'Choose application:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedChooseApplicationMessage',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedDeletePersonalDetail',
            Visible : true,
            Label : 'Delete personal detail response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedDeletePersonalDetail',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedLogoutTabMember',
            Visible : true,
            Label : 'Logout tab member:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedLogoutTabMember',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedPauseDuration',
            Visible : true,
            Label : 'Pause duration:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedPauseDuration',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedResourceTimeout',
            Visible : true,
            Label : 'Resource timeout:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedResourceTimeout',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedError',
            Visible : true,
            Label : 'Error:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedError',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedPersonalDetailsChosen',
            Visible : true,
            Label : 'Personal details chosen response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedPersonalDetailsChosen',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedSetCommentEdit',
            Visible : true,
            Label : 'Set comment edit response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedSetCommentEdit',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedSetCurrentPersonalDetails',
            Visible : true,
            Label : 'Set current personal details response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedSetCurrentPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedSetComment',
            Visible : true,
            Label : 'Set comment response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedSetComment',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedSetPersonalDetails',
            Visible : true,
            Label : 'Set personal details response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedSetPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedSetCommonDetails',
            Visible : true,
            Label : 'Set common details response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedSetCommonDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedSkipPersonalDetails',
            Visible : true,
            Label : 'Skip personal details response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedSkipPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesReceivedValidateSelectedMatter',
            Visible : true,
            Label : 'Validate selected matter response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesReceivedValidateSelectedMatter',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesReceived'
        }, {
            Name : 'DebugPageMessagesSent',
            Visible : true,
            Label : 'Sent:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSent',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessages'
        }, {
            Name : 'DebugPageMessagesSentFlags',
            Visible : true,
            Label : 'Flags:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentFlags',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentFlagsMatterDone',
            Visible : true,
            Label : 'Matter done:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentFlagsMatterDone',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSentFlags'
        }, {
            Name : 'DebugPageMessagesSentFlagsLogonDone',
            Visible : true,
            Label : 'Logon done:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentFlagsLogonDone',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSentFlags'
        }, {
            Name : 'DebugPageMessagesSentApplication',
            Visible : true,
            Label : 'Application:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentApplication',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentContinueSession',
            Visible : true,
            Label : 'Continue session:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentContinueSession',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentCloseTab',
            Visible : true,
            Label : 'Close tab:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentCloseTab',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentCheckMatterGlobal',
            Visible : true,
            Label : 'Check global matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentCheckMatterGlobal',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentDeletePersonalDetail',
            Visible : true,
            Label : 'Delete personal detail:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentDeletePersonalDetail',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentFormSubmit',
            Visible : true,
            Label : 'Form submit:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentFormSubmit',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentDocumentReady',
            Visible : true,
            Label : 'Document ready:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentDocumentReady',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentProcessPageCompleted',
            Visible : true,
            Label : 'Process page completed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentProcessPageCompleted',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentPulse',
            Visible : true,
            Label : 'Pulse:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentPulse',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentLogoutSequenceCompleted',
            Visible : true,
            Label : 'Logout sequence completed:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentLogoutSequenceCompleted',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentPersonalDetailsChosen',
            Visible : true,
            Label : 'Personal details chosen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentPersonalDetailsChosen',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentPersonalDetailsChosenCompleted',
            Visible : true,
            Label : 'Personal details chosen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentPersonalDetailsChosenCompleted',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSetPersonalDetailsCompleted',
            Visible : true,
            Label : 'Set personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSetPersonalDetailsCompleted',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSetCommonDetails',
            Visible : true,
            Label : 'Set common details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSetCommonDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSetTempPersonalDetails',
            Visible : true,
            Label : 'Set temp personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSetTempPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSetCurrentPersonalDetails',
            Visible : true,
            Label : 'Set current personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSetCurrentPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSetCommentEdit',
            Visible : true,
            Label : 'Set comment edit request:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSetCommentEdit',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSetComment',
            Visible : true,
            Label : 'Set comment request:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSetComment',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentUpdateResponse',
            Visible : true,
            Label : 'Update response:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentUpdateResponse',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentStorePassword',
            Visible : true,
            Label : 'Store password:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentStorePassword',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSkipMatterDetails',
            Visible : true,
            Label : 'Skip matter details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSkipMatterDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSkipPersonalDetails',
            Visible : true,
            Label : 'Skip personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSkipPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSetPersonalDetails',
            Visible : true,
            Label : 'Set personal details:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSetPersonalDetails',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentValidateSelectedMatter',
            Visible : true,
            Label : 'Validate selected matter:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentValidateSelectedMatter',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentQuittingResourceSession',
            Visible : true,
            Label : 'Quitting resource session:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentQuittingResourceSession',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentWindowHashChange',
            Visible : true,
            Label : 'Window hash change:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentWindowHashChange',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentStartMessageSeen',
            Visible : true,
            Label : 'Start message seen:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentStartMessageSeen',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentHideStartMessage',
            Visible : true,
            Label : 'Hide start message:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentHideStartMessage',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'DebugPageMessagesSentSetFeatures',
            Visible : true,
            Label : 'Set features:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olDebugPageMessagesSentSetFeatures',
            Type : 'checkbox',
            ParrentId : 'olDebugPageMessagesSent'
        }, {
            Name : 'TabInfoArraySleepInterval',
            Visible : true,
            Label : 'Sleep interval for tab array(internal):',
            DefaultValue : 200,
            ElementOptions : null,
            ObjectId : 'olTabInfoArraySleepInterval',
            Type : 'internal',
            ParrentId : 'olDebugMode'
        }, {
            Name : 'Testing',
            Visible : true,
            Label : 'Testing options:',
            Value : false,
            DefaultValue : false,
            ElementOptions : null,
            ObjectId : 'olTesting',
            Type : 'checkbox',
            ParrentId : 'olDeveloperSettings'
        }, {
            Name : 'TestingBasicAuthenticationAutoRefresh',
            Visible : true,
            Label : 'Autorefresh on basic auth done:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olTestingBasicAuthenticationAutoRefresh',
            Type : 'checkbox',
            ParrentId : 'olTesting'
        }, {
            Name : 'TestingShowLogoutWindow',
            Visible : true,
            Label : 'Show logout window:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olTestingShowLogoutWindow',
            Type : 'checkbox',
            ParrentId : 'olTesting'
        }, {
            Name : 'TestingAutoCloseLogoutWindow',
            Visible : true,
            Label : 'Automaticly close logout window:',
            Value : true,
            DefaultValue : true,
            ElementOptions : null,
            ObjectId : 'olTestingAutoCloseLogoutWindow',
            Type : 'checkbox',
            ParrentId : 'olTesting'
        }, {
            Name : 'TestingLogoutWindowMinDuration',
            Visible : true,
            Label : 'Logout window minimum duration (ms):',
            Value : '10000',
            DefaultValue : 10000,
            ElementOptions : null,
            ObjectId : 'olTestingLogoutWindowMinDuration',
            Type : 'text',
            ParrentId : 'olTesting'
        }],
        GetItem : function(optionName, array) {
            try {
                var optionValue_ = olOptions._internal.GetOptionByName(optionName);

                if (optionValue_) {
                    return optionValue_.Value;
                } else {
                    return 'olDefault';
                }
            } catch (e) {
                alert('_internal.GetItem ' + e.message);
            }
        },
        RestoreDefaults : function() {
            for (var i = 0; i < olOptions._internal.OptionsArray.length; i++) {
                olOptions._internal.OptionsArray[i].Value = olOptions._internal.OptionsArray[i].DefaultValue;
            }
            olOptions.InitialiseOptionNameValueArray();
            olOptions._internal.Set();
        },
        Get : function() {
            olOptions.InitialiseOptionNameValueArray();
            var data_ = kango.storage.getItem('olOptions');
            if (data_ && data_ != undefined) {
                for (var i = 0; i < olOptions._internal.OptionsArray.length; i++) {
                    olOptions._internal.OptionsArray[i].Value = olOptions._internal.GetOptionValue(olOptions._internal.OptionsArray[i].Name, data_);
                };
                //TODO ovo skloniti kad se sredi rad sa opcijama
                olOptions._internal.OptionsArray = data_;
            } else {
                olOptions._internal.RestoreDefaults();
            }
            olOptions.InitialiseOptionNameValueArray();
        },
        GetOptionByName : function(optionName) {
            try {
                return olOptions._internal.OptionsNameValueArray[optionName];
            } catch (e) {
                alert('_internal.GetOptionByName ' + optionName + ' - ' + e.message);
            }
        },
        GetOptionById : function(optionId) {
            return olOptions._internal.OptionsNameValueArray[String(optionId).substring(2)];
        },
        GetOptionValue : function(name, storageArray) {
            var value_;

            var storageValue_ = olOptions._internal.GetItem(name, storageArray);

            if (storageValue_ != 'olDefault') {
                value_ = storageValue_;
            } else {
                var currentOption_ = olOptions._internal.GetOptionByName(name);
                value_ = currentOption_.DefaultValue;
            }
            return value_;
        },
        GetDependedValue : function(optionName, option) {
            var currentOption_;
            if ( typeof (option) === 'undefined') {
                currentOption_ = olOptions._internal.GetOptionByName(optionName);
            } else {
                currentOption_ = option;
            }

            if (currentOption_.Value) {
                if (currentOption_.ParrentId == null) {
                    return true;
                } else {
                    var parrent_ = olOptions._internal.GetOptionById(currentOption_.ParrentId);
                    return olOptions._internal.GetDependedValue(parrent_.Name, parrent_);
                }
            } else {
                return false;
            }
        },
        Set : function() {
            kango.storage.setItem('olOptions', olOptions._internal.OptionsArray);
        },
        SetOptionByName : function(optionName, value) {
            var option_ = $.grep(olOptions._internal.OptionsArray, function(member) {
                return (optionName == member.Name);
            });
            option_[0].Value = value;
        }
    },
    DataConstructors : {
        AlertContent : function(title, message) {
            var self = this;
            if ( typeof (message) === 'undefined')
                message = '';
            self.Title = title;
            self.Message = message;

            var date_ = new Date();
            var timestamp_ = Math.round(+date_ / 1000) + ':' + Math.round(+date_ % 1000);
            self.TimeStamp = timestamp_.slice(5);
        }
    },
    General : {
        Extension : {
            ServerUrl : function() {
                return olOptions._internal.GetItem('ServerUrl', olOptions._internal.OptionsArray);
            },
            AjaxCallTimeout : function() {
                return parseInt(olOptions._internal.GetItem('AjaxCallTimeout', olOptions._internal.OptionsArray));
            },
            WebControl : function() {
                return parseInt(olOptions._internal.GetItem('WebControl', olOptions._internal.OptionsArray));
            },
            TabInfoArraySleepInterval : function() {
                return parseInt(olOptions._internal.GetItem('TabInfoArraySleepInterval', olOptions._internal.OptionsArray));
            }
        },
        Page : {
            InjectFieldColor : function() {
                return olOptions._internal.GetItem('GeneralPageInjectFieldColor', olOptions._internal.OptionsArray);
            },
            ToolbarDisplay : function() {
                return olOptions._internal.GetItem('GeneralPageToolbarDisplay', olOptions._internal.OptionsArray);
            },
            ToolbarMinimized : function() {
                return olOptions._internal.GetItem('GeneralPageToolbarMinimized', olOptions._internal.OptionsArray);
            },
            ToolbarPosition : function() {
                return parseInt(olOptions._internal.GetItem('GeneralPageToolbarPosition', olOptions._internal.OptionsArray));
            },
            ToolbarWidth : function() {
                return parseInt(olOptions._internal.GetItem('GeneralPageToolbarWidth', olOptions._internal.OptionsArray));
            },
            TransitionTime : function() {
                return parseInt(olOptions._internal.GetItem('GeneralPageTransitionTime', olOptions._internal.OptionsArray));
            }
        }
    },
    Testing : {
        BasicAuthenticationAutoRefresh : function() {
            return olOptions._internal.GetItem('TestingBasicAuthenticationAutoRefresh', olOptions._internal.OptionsArray);
        },
        ShowLogoutWindow : function() {
            return olOptions._internal.GetItem('TestingShowLogoutWindow', olOptions._internal.OptionsArray);
        },
        AutoCloseLogoutWindow : function() {
            return olOptions._internal.GetItem('TestingAutoCloseLogoutWindow', olOptions._internal.OptionsArray);
        },
        LogoutWindowMinDuration : function() {
            return parseInt(olOptions._internal.GetItem('TestingLogoutWindowMinDuration', olOptions._internal.OptionsArray));
        }
    },
    Debug : {
        Extension : {
            BasicAuthentication : {
                Display401Url : function() {
                    return olOptions._internal.GetDependedValue('DebugExtensionBasicAuthenticationDisplay401Url');
                }
            },
            Events : {
                BeforeNavigate : function() {
                    return olOptions._internal.GetDependedValue('DebugExtensionEventsBeforeNavigate');
                },
                BrowserWindowClosing : function() {
                    return olOptions._internal.GetDependedValue('DebugExtensionEventsBrowserWindowClosing');
                },
                TabRemoved : function() {
                    return olOptions._internal.GetDependedValue('DebugExtensionEventsTabRemoved');
                },
                TabChanged : function() {
                    return olOptions._internal.GetDependedValue('DebugExtensionEventsTabChanged');
                },
                TabCreated : function() {
                    return olOptions._internal.GetDependedValue('DebugExtensionEventsTabCreated');
                },
                TabReplaced : function() {
                    return olOptions._internal.GetDependedValue('DebugExtensionEventsTabReplaced');
                },
                WindowChanged : function() {
                    return olOptions._internal.GetDependedValue('DebugExtensionEventsWindowChanged');
                }
            },
            Messages : {
                Received : {
                    Flags : {
                        MatterDone : function() {
                            return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedFlagsMatterDone');
                        },
                        LogonDone : function() {
                            return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedFlagsLogonDone');
                        }
                    },
                    Application : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedApplication');
                    },
                    ContinueSession : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedContinueSession');
                    },
                    CheckMatterGlobal : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedCheckMatterGlobal');
                    },
                    CloseTab : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedCloseTab');
                    },
                    DeletePersonalDetail : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedDeletePersonalDetail');
                    },
                    FormSubmit : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedFormSubmit');
                    },
                    DocumentReady : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedDocumentReady');
                    },
                    WindowHashChange : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedWindowHashChange');
                    },
                    Pulse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedPulse');
                    },
                    LogoutSequenceCompleted : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedLogoutSequenceCompleted');
                    },
                    HandleLogoutWindow : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedHandleLogoutWindow');
                    },
                    ProcessPageCompleted : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedProcessPageCompleted');
                    },
                    PersonalDetailsChosenRequest : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedPersonalDetailsChosen');
                    },
                    SetCurrentPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSetCurrentPersonalDetails');
                    },
                    RefreshOptions : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedRefreshOptions');
                    },
                    SetCommentEdit : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSetCommentEdit');
                    },
                    SetComment : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSetComment');
                    },
                    SetPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSetPersonalDetails');
                    },
                    SetCommonDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSetCommonDetails');
                    },
                    SetTempPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSetTempPersonalDetails');
                    },
                    StorePasswordRequest : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedStorePasswordRequest');
                    },
                    SkipMatterDetailsRequest : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSkipMatterDetailsRequest');
                    },
                    SkipPersonalDetailsRequest : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSkipPersonalDetailsRequest');
                    },
                    UpdateResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedUpdateResponse');
                    },
                    // ValidateNewMatterRequest : function() {
                    // return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedValidateNewMatterRequest');
                    // },
                    ValidateSelectedMatter : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedValidateSelectedMatter');
                    },
                    QuittingResourceSession : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedQuittingResourceSession');
                    },
                    SetFeatures : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedSetFeatures');
                    },
                    StartMessageSeen : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesReceivedStartMessageSeen');
                    }
                },
                Sent : {
                    AskToStorePassword : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentAskToStorePassword');
                    },
                    BeforeNavigateRequestDispatchResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentBeforeNavigateRequestDispatchResponse');
                    },
                    CheckMatterGlobalRequestDispatchResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentCheckMatterGlobalRequestDispatchResponse');
                    },
                    ChooseApplicationDispatchMessage : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentChooseApplicationDispatchMessage');
                    },
                    DeletePersonalDetailRequestDispatchResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentDeletePersonalDetailDispatchResponse');
                    },
                    PauseDuration : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentPauseDuration');
                    },
                    ResourceTimeout : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentResourceTimeout');
                    },
                    Error : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentError');
                    },
                    WebControlMessage : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentWebControlMessage');
                    },
                    PersonalDetailsChosenRequestDisptachResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentPersonalDetailsChosenRequestDisptachResponse');
                    },
                    SkipPersonalDetailsRequestDisptachResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentSkipPersonalDetailsRequestDisptachResponse');
                    },
                    ValidateSelectedMatterRequestDispatchResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentValidateSelectedMatterRequestDispatchResponse');
                    },
                    SetCommentRequestEditDispatchResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentSetCommentRequestEditDispatchResponse');
                    },
                    SetCommentRequestDispatchResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentSetCommentRequestDispatchResponse');
                    },
                    SetPersonalDetailsRequestDispatchResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionMessagesSentSetPersonalDetailsRequestDispatchResponse');
                    }
                }
            },
            Service : {
                SentRequests : {
                    ApplicationRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsApplicationRequestSend');
                    },
                    BeforeNavigateRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsBeforeNavigateRequestSend');
                    },
                    CheckMatterGlobalRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsCheckMatterGlobalRequestSend');
                    },
                    CheckMatterLocalRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsCheckMatterLocalRequestSend');
                    },
                    ContinueSessionRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsContinueSessionRequestSend');
                    },
                    DeletePersonalDetailRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsDeletePersonalDetailRequestSend');
                    },
                    FormSubmitRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsFormSubmitRequestSend');
                    },
                    DocumentCompleteRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsDocumentCompleteRequestSend');
                    },
                    GetLocalPersonalCodeListRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsGetLocalPersonalCodeListRequestSend');
                    },
                    LanguageItemsRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsLanguageItemsRequestSend');
                    },
                    LogoutCompletedRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsLogoutCompletedRequestSend');
                    },
                    LogoutWindowRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsLogoutWindowRequestSend');
                    },
                    MainWindowClosingRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsMainWindowClosingRequestSend');
                    },
                    NavigateCompleteRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsNavigateCompleteRequestSend');
                    },
                    NewWindowRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsNewWindowRequestSend');
                    },
                    PulseRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsPulseRequestSend');
                    },
                    PersonalDetailsChosenRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsPersonalDetailsChosenRequestSend');
                    },
                    SetPersonalDetailsRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSetPersonalDetailsRequestSend');
                    },
                    SetCommonDetailsRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSetCommonDetailsRequestSend');
                    },
                    SetCommentEditRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSetCommentEditRequestSend');
                    },
                    SetCommentRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSetCommentRequestSend');
                    },
                    SetCurrentPersonalDetailsRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSetCurrentPersonalDetailsRequestSend');
                    },
                    SetTempPersonalDetailsRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSetTempPersonalDetailsRequest');
                    },
                    SkipMatterDetailsRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSkipMatterDetailsRequestSend');
                    },
                    SkipPersonalDetailsChosenRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSkipPersonalDetailsChosenRequestSend');
                    },
                    SkipPersonalDetailsRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSkipPersonalDetailsRequestSend');
                    },
                    StorePasswordRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsStorePasswordRequestSend');
                    },
                    ValidateMatterRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsValidateMatterRequestSend');
                    },
                    WindowClosingRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsWindowClosingRequestSend');
                    },
                    QuittingResourceSessionRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsQuittingResourceSessionRequestSend');
                    },
                    SetFeaturesRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsSetFeaturesRequestSend');
                    },
                    RequestFeatureRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsRequestFeatureRequestSend');
                    },
                    RequestFeatureItemRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsRequestFeatureItemRequestSend');
                    },
                    StartMessageSeenRequestSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsStartMessageSeenRequestSend');
                    },

                    HideStartMessageRequesttSendSend : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSentRequestsHideStartMessageRequesttSendSend');
                    }
                },
                SucceededRequests : {
                    ApplicationRequest : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsApplication');
                    },
                    BeforeNavigate : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsBeforeNavigate');
                    },
                    CheckMatterGlobal : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsCheckMatterGlobal');
                    },
                    CheckMatterLocal : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsCheckMatterLocal');
                    },
                    DeletePersonalDetail : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsDeletePersonalDetail');
                    },
                    FormSubmit : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsFormSubmit');
                    },
                    DocumentComplete : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsDocumentComplete');
                    },
                    GetLocalPersonalCodeList : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsGetLocalPersonalCodeList');
                    },
                    LanguageItems : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsLanguageItems');
                    },
                    LogoutCompleted : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsLogoutCompleted');
                    },
                    LogoutWindow : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsLogoutWindow');
                    },
                    MainWindowClosing : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsMainWindowClosing');
                    },
                    NavigateComplete : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsNavigateComplete');
                    },
                    NewWindow : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsNewWindow');
                    },
                    PersonalDetailsChosen : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsPersonalDetailsChosen');
                    },
                    SetPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSetPersonalDetails');
                    },
                    SetCommentEdit : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSetCommentEdit');
                    },
                    Pulse : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsPulse');
                    },
                    SetComment : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSetComment');
                    },
                    SetCommonDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSetCommonDetails');
                    },
                    SetCurrentPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSetCurrentPersonalDetails');
                    },
                    SetTempPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSetTempPersonalDetails');
                    },
                    SkipPersonalDetailsChosen : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSkipPersonalDetailsChosen');
                    },
                    SkipPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSkipPersonalDetails');
                    },
                    StorePassword : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsStorePassword');
                    },
                    ValidateMatter : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsValidateMatter');
                    },
                    WindowClosing : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsWindowClosing');
                    },
                    QuittingResourceSession : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsQuittingResourceSession');
                    },
                    SetFeatures : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsSetFeatures');
                    },
                    RequestFeature : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsRequestFeature');
                    },
                    RequestFeatureItem : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsRequestFeatureItem');
                    },
                    StartMessageSeen : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsStartMessageSeen');
                    },
                    HideStartMessage : function() {
                        return olOptions._internal.GetDependedValue('DebugExtensionServiceSucceededRequestsHideStartMessage');
                    }
                }
            }
        },
        Page : {
            Events : {
                Submit : function() {
                    return olOptions._internal.GetDependedValue('DebugPageEventsSubmit');
                },
                DocumentReady : function() {
                    return olOptions._internal.GetDependedValue('DebugPageEventsDocumentReady');
                },
                BodySubtreeChanged : function() {
                    return olOptions._internal.GetDependedValue('DebugPageEventsBodySubtreeChanged');
                },
                TitleSubtreeChanged : function() {
                    return olOptions._internal.GetDependedValue('DebugPageEventsTitleSubtreeChanged');
                },
                WindowHashChange : function() {
                    return olOptions._internal.GetDependedValue('DebugPageEventsWindowHashChange');
                },
                WindowBeforeUnload : function() {
                    return olOptions._internal.GetDependedValue('DebugPageEventsWindowBeforeUnload');
                }
            },
            Messages : {
                Received : {
                    AskToStorePassword : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedAskToStorePassword');
                    },
                    BeforeNavigate : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedBeforeNavigate');
                    },
                    CheckMatterGlobal : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedCheckMatterGlobal');
                    },
                    ChooseApplicationMessage : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedChooseApplicationMessage');
                    },
                    DeletePersonalDetail : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedDeletePersonalDetail');
                    },
                    LogoutTabMember : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedLogoutTabMember');
                    },
                    PauseDuration : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedPauseDuration');
                    },
                    ResourceTimeout : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedResourceTimeout');
                    },
                    Error : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedError');
                    },
                    PersonalDetailsChosen : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedPersonalDetailsChosen');
                    },
                    SetCurrentPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedSetCurrentPersonalDetails');
                    },
                    SetCommentEdit : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedSetCommentEdit');
                    },
                    SetComment : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedSetComment');
                    },
                    SetPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedSetPersonalDetails');
                    },
                    SetCommonDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedSetCommonDetails');
                    },
                    SkipPersonalDetailsRequestResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedSkipPersonalDetails');
                    },
                    ValidateSelectedMatterRequestResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesReceivedValidateSelectedMatter');
                    }
                },
                Sent : {
                    Flags : {
                        MatterDone : function() {
                            return olOptions._internal.GetDependedValue('DebugPageMessagesSentFlagsMatterDone');
                        },
                        LogonDone : function() {
                            return olOptions._internal.GetDependedValue('DebugPageMessagesSentFlagsLogonDone');
                        }
                    },
                    DeletePersonalDetail : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentDeletePersonalDetail');
                    },
                    FormSubmit : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentFormSubmit');
                    },
                    DocumentReady : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentDocumentReady');
                    },
                    CheckMatterGlobal : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentCheckMatterGlobal');
                    },
                    Application : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentApplication');
                    },
                    ContinueSession : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentContinueSession');
                    },
                    CloseTab : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentCloseTab');
                    },
                    ProcessPageCompleted : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentProcessPageCompleted');
                    },
                    PersonalDetailsChosen : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentPersonalDetailsChosen');
                    },
                    Pulse : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentPulse');
                    },
                    LogoutSequenceCompleted : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentLogoutSequenceCompleted');
                    },
                    SetCurrentPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSetCurrentPersonalDetails');
                    },
                    SetCommentEdit : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSetCommentEdit');
                    },
                    SetComment : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSetComment');
                    },
                    UpdateResponse : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentUpdateResponse');
                    },
                    SetPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSetPersonalDetails');
                    },
                    SetCommonDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSetCommonDetails');
                    },
                    SetTempPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSetTempPersonalDetails');
                    },
                    StorePassword : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentStorePassword');
                    },
                    SkipMatterDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSkipMatterDetails');
                    },
                    SkipPersonalDetails : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSkipPersonalDetails');
                    },
                    ValidateSelectedMatter : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentValidateSelectedMatter');
                    },
                    QuittingResourceSession : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentQuittingResourceSession');
                    },
                    WindowHashChange : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentWindowHashChange');
                    },
                    SetFeatures : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentSetFeatures');
                    },
                    StartMessageSeen : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentStartMessageSeen');
                    },
                    HideStartMessage : function() {
                        return olOptions._internal.GetDependedValue('DebugPageMessagesSentHideStartMessage');
                    }
                }
            }
        },
        DebugMode : function() {
            return olOptions._internal.GetDependedValue('DebugMode');
        },
        ResourcesUrlPrefix : function() {
            return olOptions._internal.GetItem('ResourcesUrlPrefix', olOptions._internal.OptionsArray);
        },
        Logs : function() {
            return olOptions._internal.GetDependedValue('DebugInfoLogs');
        },
        Alerts : function() {
            return olOptions._internal.GetDependedValue('DebugInfoAlerts');
        },
        Errors : function() {
            return olOptions._internal.GetOptionByName('DebugErrors').Value;
        },
        Notifications : function() {
            return olOptions._internal.GetDependedValue('DebugInfoNotifications');
        }
    },

    InitialiseOptionNameValueArray : function() {
        try {
            olOptions._internal.OptionsNameValueArray = {};
            for (var j = 0; j < olOptions._internal.OptionsArray.length; j++) {
                var optionValue_ = olOptions._internal.OptionsArray[j].Value;
                var optionName_ = olOptions._internal.OptionsArray[j].Name;
                var optionParrentId_ = olOptions._internal.OptionsArray[j].ParrentId;
                var optionDefaultValue_ = olOptions._internal.OptionsArray[j].DefaultValue;

                olOptions._internal.OptionsNameValueArray[optionName_] = {
                    Value : optionValue_,
                    ParrentId : optionParrentId_,
                    DefaultValue : optionDefaultValue_,
                    Name : optionName_
                };
            }
        } catch(e) {
            kango.console.log('InitialiseOptionNameValueArray - ' + e.message + ' - ' + e.stack);
        }
    },
    IntialiseOptionsData : function() {
        try {
            olOptions._internal.Get();
        } catch(e) {
            olOptions._internal.RestoreDefaults();
            kango.console.log('IntialiseOptionsData catch - ' + e.message + ' - ' + e.stack);
        } finally {
            olOptions._internal.Set();
        }
    }
};
