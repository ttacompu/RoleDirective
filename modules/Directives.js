var roleApp;
(function (roleApp) {
    var app = roleApp.getModule();
    var hello = (function () {
        function hello() {
            this.restrict = "E";
            this.template = "<h1>Hello</h1>";
            this.link = function (scope, element, attrs) {
            };
        }
        return hello;
    })();
    roleApp.hello = hello;
    function role() {
        return {
            restrict: "E",
            templateUrl: "Template/role.html",
            scope: { titles: "=" },
            link: function (scope) {
                var linkScope = scope;
                linkScope.ExpandCollapse = function (name) {
                    name.isCollapsed = !name.isCollapsed;
                };
                linkScope.ExpandCollapseAll = function () {
                    if (linkScope.titleExpend) {
                        _.each(linkScope.titles, function (title) {
                            var _title = title;
                            _title.isCollapsed = true;
                        });
                    }
                    else {
                        _.each(linkScope.titles, function (title) {
                            var _title = title;
                            _title.isCollapsed = false;
                        });
                    }
                    linkScope.titleExpend = !linkScope.titleExpend;
                };
                linkScope.onDeleteEmployee = function (emp) {
                    emp.isDeleted = true;
                    if (linkScope.hideDeleted) {
                        emp.isChanged = true;
                    }
                    else {
                        emp.isChanged = false;
                    }
                };
                linkScope.onUnDelete = function (emp) {
                    emp.isDeleted = false;
                };
                linkScope.UndeleteAll = function () {
                    _.each(linkScope.titles, function (title) {
                        var _title = title;
                        _.each(_title.employees, function (emp) {
                            var _emp = emp;
                            _emp.isDeleted = false;
                            _emp.isChanged = false;
                        });
                    });
                };
                linkScope.onDeleteTitle = function (name, isDelete) {
                    _.each(name.employees, function (emp) {
                        var anyEmp = emp;
                        anyEmp.isDeleted = isDelete;
                        if (linkScope.hideDeleted) {
                            anyEmp.isChanged = true;
                        }
                        else {
                            anyEmp.isChanged = false;
                        }
                    });
                    if (isDelete)
                        name.showDeleteTitle = !name.showDeleteTitle;
                    else {
                        name.showUnDeleteTitle = !name.showUnDeleteTitle;
                    }
                };
                linkScope.ShowHideDeleted = function () {
                    if (linkScope.hideDeleted) {
                        _.each(linkScope.titles, function (title) {
                            _.each(title.employees, function (emp) { emp.isChanged = false; });
                        });
                    }
                    else {
                        _.each(linkScope.titles, function (title) {
                            _.each(title.employees, function (emp) {
                                var employee = emp;
                                if (employee.isDeleted) {
                                    employee.isChanged = true;
                                }
                            });
                        });
                    }
                    linkScope.hideDeleted = !linkScope.hideDeleted;
                };
                linkScope.$watch("titles", function (newValue, oldValue) {
                    var leastOneDeleted = false;
                    _.each(newValue, function (title) {
                        var anyTitle = title;
                        var result = _.filter(anyTitle.employees, function (item) { return item.isDeleted == true; });
                        var noDeleteResult = _.filter(anyTitle.employees, function (item) { return item.isDeleted == false; });
                        if (result && result.length > 0) {
                            leastOneDeleted = true;
                            anyTitle.showUnDeleteTitle = true;
                        }
                        else {
                            anyTitle.showUnDeleteTitle = false;
                        }
                        if (noDeleteResult && noDeleteResult.length > 0) {
                            anyTitle.showDeleteTitle = true;
                        }
                        else {
                            anyTitle.showDeleteTitle = false;
                        }
                        if (result && result.length === anyTitle.employees.length) {
                            if (linkScope.hideDeleted) {
                                anyTitle.isDeleted = true;
                            }
                        }
                        else if (result && result.length !== anyTitle.employees.length) {
                            anyTitle.isDeleted = false;
                        }
                        if (linkScope.hideDeleted) {
                            anyTitle.showUnDeleteTitle = false;
                        }
                    });
                    if (leastOneDeleted) {
                        linkScope.leastOneDeleted = true;
                    }
                    else {
                        linkScope.leastOneDeleted = false;
                    }
                }, true);
                linkScope.$watch("hideDeleted", function (newValue, oldValue) {
                    _.each(linkScope.titles, function (title) {
                        var anyTitle = title;
                        if (newValue === true) {
                            if (anyTitle.isDeleted == false) {
                                anyTitle.isChanged = true;
                            }
                            title.isDeleted = true;
                        }
                        else if (newValue === false) {
                            if (anyTitle.isChanged) {
                                anyTitle.isDeleted = false;
                            }
                            linkScope.titleExpend = false;
                            linkScope.ExpandCollapseAll();
                        }
                    });
                });
            }
        };
    }
    roleApp.role = role;
    app.directive("role", role);
})(roleApp || (roleApp = {}));
//# sourceMappingURL=Directives.js.map