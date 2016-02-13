var roleApp;
(function (roleApp) {
    "user strict";
    var app = roleApp.getModule();
    var PartnerService = (function () {
        function PartnerService() {
        }
        PartnerService.prototype.getTitle = function () {
            return [{
                    name: "Partner", priority: 1, isCollapsed: false, isDeleted: false,
                    employees: [{
                            addedBy: '', addedByConflicts: '', addedByGatekeeper: '',
                            clearyKey: "12345", fullName: "Thein Aung", officeCode: 'NY', isDeleted: false, hasChanged: false
                        }]
                }];
        };
        PartnerService.getInstance = function () {
            return new PartnerService();
        };
        return PartnerService;
    })();
    roleApp.PartnerService = PartnerService;
    app.factory("PartnerService", PartnerService.getInstance);
})(roleApp || (roleApp = {}));
//# sourceMappingURL=PartnerService.js.map