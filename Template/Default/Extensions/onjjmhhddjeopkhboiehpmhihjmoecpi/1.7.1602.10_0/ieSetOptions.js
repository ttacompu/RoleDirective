var ieSetOptions = {
    // Local, Devtest, QA, RC, NoChange
    _option : 'RC',
    Local : function() {
        //local URL
        olOptions._internal.SetOptionByName('ResourcesUrlPrefix', 'c:/!!!__________________OnelogExtension_deployment/mobview/olResources/');
        olOptions._internal.SetOptionByName('DebugMode', true);
        olOptions._internal.SetOptionByName('DebugErrors', true);
        olOptions._internal.SetOptionByName('DebugInfoLogs', true);
    },
    Devtest : function() {
        //Devtest
        olOptions._internal.SetOptionByName('ResourcesUrlPrefix', 'https://devtest.onelog.com/mobview/olResources/');
        olOptions._internal.SetOptionByName('DebugMode', true);
        olOptions._internal.SetOptionByName('DebugErrors', true);
        olOptions._internal.SetOptionByName('DebugInfoLogs', true);
    },
    QA : function() {
        //QA
        olOptions._internal.SetOptionByName('ResourcesUrlPrefix', 'https://devtest.onelog.com/mobview/olResources/');
        olOptions._internal.SetOptionByName('DebugMode', false);
        olOptions._internal.SetOptionByName('DebugErrors', false);
        olOptions._internal.SetOptionByName('DebugInfoLogs', false);
    },
    RC : function() {
        //Production
        olOptions._internal.SetOptionByName('ResourcesUrlPrefix', 'https://cloud.onelog.com/extensions/olResources/');
        olOptions._internal.SetOptionByName('DebugMode', false);
        olOptions._internal.SetOptionByName('DebugErrors', false);
        olOptions._internal.SetOptionByName('DebugInfoLogs', false);
    },

    SetOptions : function() {
        switch (ieSetOptions._option) {
        case "Local":
            ieSetOptions.Local();
            break;
        case "Devtest":
            ieSetOptions.Devtest();
            break;
        case "QA":
            ieSetOptions.QA();
            break;
        case "RC":
            ieSetOptions.RC();
            break;
        default:
            //NoChange
            break;
        }
        kango.storage.setItem('olOptions', olOptions._internal.OptionsArray);
        olOptions.IntialiseOptionsData();
        olExtension.Log(ieSetOptions._option);
    }
};

//local ie url setting if needed
ieSetOptions.SetOptions();
