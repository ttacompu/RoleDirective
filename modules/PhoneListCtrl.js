/// <reference path="partnerservice.ts" />
var roleApp;
(function (roleApp) {
    "user strict";
    var app = roleApp.getModule();
    var roleCtrl = (function () {
        function roleCtrl($scope, _PartnerService, _TestService) {
            //this.scope = $scope;
            //this.scope.phones = [{
            //    'name': 'Nexus S',
            //    'snippet': 'Fast just got faster'
            //},
            //    {
            //        'name': 'Motorola',
            //        'snippet': 'Next generation tablet'
            //    },
            //    {
            //        'name': 'Motorola Xoom',
            //        'snippet': 'Next, next generation tablet'
            //    }];
            this.$scope = $scope;
            this._PartnerService = _PartnerService;
            this._TestService = _TestService;
            //this.scope.tittles = _PartnerService.getTitle();
            //this.scope.myTestService = _TestService.getHello();
            this.scope.titlesource = [{ "title": "Partner", isCollapsed: false, isDeleted: false, employees: [{ name: "Thein", isDeleted: false, isVisible: true }, { name: "Chris", isDeleted: false }] },
                { "title": "Associate", isCollapsed: false, isDeleted: false, employees: [{ name: "Ajay", isDeleted: false }] },
                { "title": "Admin", isCollapsed: false, isDeleted: false, employees: [{ name: "Alex", isDeleted: false, isVisible: true }, { name: "Anil", isDeleted: false }, { name: "Praveen", isDeleted: false }] }
            ];
        }
        roleCtrl.$inject = ["$scope", "PartnerService", "TestService"];
        return roleCtrl;
    })();
    roleApp.roleCtrl = roleCtrl;
    app.controller("roleCtrl", roleCtrl);
})(roleApp || (roleApp = {}));
//# sourceMappingURL=PhoneListCtrl.js.map