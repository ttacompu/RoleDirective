/// <reference path="../PlainAngular/typings/angularjs/angular.d.ts" />
module roleApp {
    "user strict";
    var app = angular.module("roleApp", ['ngResource']);

    export var getModule: () => ng.IModule = function () {
        return angular.module("roleApp");
    };
}