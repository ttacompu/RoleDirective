module roleApp {
    "user strict";
    var app = getModule();

    export class roleCtrl {
        scope: any;

        constructor(private $scope: ng.IScope) {
            this.scope = $scope;
            this.scope.titlesource = [{ "title": "Partner", isCollapsed: false, isDeleted: false, employees: [{ name: "Thein", isDeleted: false, isVisible: true }, { name: "Chris", isDeleted: false }] },
                { "title": "Associate",  isCollapsed: false, isDeleted: false, employees: [{ name: "Ajay", isDeleted: false}] },
                { "title": "Admin",  isCollapsed: false, isDeleted: false, employees: [{ name: "Alex", isDeleted: false, isVisible: true }, { name: "Anil", isDeleted: false }, { name: "Praveen", isDeleted: false }] }
            ]
        }

        public static $inject: string[] = ["$scope"];
    }
    app.controller("roleCtrl", roleCtrl)
}