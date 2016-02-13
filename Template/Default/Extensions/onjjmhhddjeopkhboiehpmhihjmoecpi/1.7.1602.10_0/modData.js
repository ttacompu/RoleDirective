var EXPORTED_SYMBOLS = ["olData"];

/**
 *  OneLog Data
 */
var olData = {
    CleanUpArray : [],
    CleanUp : null,
    LogoPage : null,
    BrowserName : '',
    TabInfoArray : {
        TabMembersLocked : false,
        TabMembers : []
    },
    CreatedTabs : [],
    LogoutTabs : [],
    LogoutInfoArray : {
        TabMembersLocked : false,
        TabMembers : []
    },
    CookiesInfoArray : {
        TabMembersLocked : false,
        TabMembers : []
    },
    Initialised : false,
    Windows : 0,
    Initialise : function() {
        olData.Initialised = true;
    }
};

