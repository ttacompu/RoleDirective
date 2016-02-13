var roleApp;
(function (roleApp) {
    "user strict";
    var app = roleApp.getModule();
    var roleCtrl = (function () {
        function roleCtrl($scope) {
            this.$scope = $scope;
            this.scope = $scope;
            this.scope.titlesource = [{ "title": "Partner", isCollapsed: false, isDeleted: false, employees: [{ name: "Thein", isDeleted: false, isVisible: true }, { name: "Chris", isDeleted: false }] },
                { "title": "Associate", isCollapsed: false, isDeleted: false, employees: [{ name: "Ajay", isDeleted: false }] },
                { "title": "Admin", isCollapsed: false, isDeleted: false, employees: [{ name: "Alex", isDeleted: false, isVisible: true }, { name: "Anil", isDeleted: false }, { name: "Praveen", isDeleted: false }] }
            ];
        }
        roleCtrl.$inject = ["$scope"];
        return roleCtrl;
    })();
    roleApp.roleCtrl = roleCtrl;
    app.controller("roleCtrl", roleCtrl);
})(roleApp || (roleApp = {}));
//# sourceMappingURL=roleCtrl.js.map