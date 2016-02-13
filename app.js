/// <reference path="../PlainAngular/typings/angularjs/angular.d.ts" />
var roleApp;
(function (roleApp) {
    "user strict";
    var app = angular.module("roleApp", ['ngResource']);
    roleApp.getModule = function () {
        return angular.module("roleApp");
    };
})(roleApp || (roleApp = {}));
//# sourceMappingURL=app.js.map