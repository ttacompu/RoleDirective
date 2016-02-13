module roleApp {
    var app = getModule();

    export class hello implements ng.IDirective {
        public restrict: string = "E";
        public template: string = "<h1>Hello</h1>";

        public link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

        }
    }


    export function role(): ng.IDirective {

        return {
            restrict: "E",
            templateUrl: "Template/role.html",
            scope: { titles: "=" },
            link: (scope) => {
                var linkScope = <any>scope;

                linkScope.ExpandCollapse = (name) => {
                    name.isCollapsed = !name.isCollapsed;
                }

                linkScope.ExpandCollapseAll = () => {
                    if (linkScope.titleExpend) {
                        _.each(linkScope.titles, (title) => {
                            var _title = <any>title;
                            _title.isCollapsed = true;
                        })
                    } else {

                        _.each(linkScope.titles, (title) => {
                            var _title = <any>title;
                            _title.isCollapsed = false;
                        })
                    }
                    linkScope.titleExpend = !linkScope.titleExpend;
                }

                linkScope.onDeleteEmployee = (emp) => {
                    emp.isDeleted = true;
                    if (linkScope.hideDeleted) {
                        emp.isChanged = true;
                    } else {
                        emp.isChanged = false;
                    }
                }

                linkScope.onUnDelete = (emp) => {
                    emp.isDeleted = false;
                }


                linkScope.UndeleteAll = () => {
                    _.each(linkScope.titles, (title) => {
                        var _title = <any>title;
                        _.each(_title.employees, (emp) => {
                            var _emp = <any>emp;
                            _emp.isDeleted = false;
                            _emp.isChanged = false;
                        })
                    })
                    
                }

                linkScope.onDeleteTitle = (name, isDelete) => {
                    _.each(name.employees, (emp) => {
                        var anyEmp = <any>emp;
                        anyEmp.isDeleted = isDelete;
                        if (linkScope.hideDeleted) {
                            anyEmp.isChanged = true;
                        } else {
                            anyEmp.isChanged = false;
                        }
                    });

                    if (isDelete)
                        name.showDeleteTitle = !name.showDeleteTitle;
                    else {
                        name.showUnDeleteTitle = !name.showUnDeleteTitle;
                    }
                }
              

                linkScope.ShowHideDeleted = () => {
                    if (linkScope.hideDeleted) {
                        _.each(linkScope.titles, (title) => {
                            _.each((<any>title).employees, (emp) => { (<any>emp).isChanged = false });
                        })
                    } else {
                        _.each(linkScope.titles, (title) => {
                            _.each((<any>title).employees, (emp) => {
                                var employee = <any>emp;
                                if (employee.isDeleted) {
                                    employee.isChanged = true;
                                }
                            });
                        })
                    }
                    linkScope.hideDeleted = !linkScope.hideDeleted;
                }

               

                linkScope.$watch("titles", (newValue, oldValue) => {
                    var leastOneDeleted = false;
                    _.each(newValue, (title) => {
                        var anyTitle = <any>title;
                        var result = <any>_.filter(anyTitle.employees, (item) => { return (<any>item).isDeleted == true });
                        var noDeleteResult = <any>_.filter(anyTitle.employees, (item) => { return (<any>item).isDeleted == false });

                        if (result && result.length > 0) {
                            leastOneDeleted = true;
                                anyTitle.showUnDeleteTitle = true;
                        }
                        else {
                            anyTitle.showUnDeleteTitle = false;
                        }

                        if (noDeleteResult && noDeleteResult.length > 0) {
                            anyTitle.showDeleteTitle = true;
                        } else {
                            anyTitle.showDeleteTitle = false;
                        }
                        

                        if (result && result.length === anyTitle.employees.length) {
                            if (linkScope.hideDeleted) {
                                anyTitle.isDeleted = true;
                            }
                            
                        } else if (result && result.length !== anyTitle.employees.length) {
                            anyTitle.isDeleted = false;
                        }


                        if (linkScope.hideDeleted) {
                            anyTitle.showUnDeleteTitle = false;
                        } 
                    });

                    if (leastOneDeleted) {
                        linkScope.leastOneDeleted = true;
                    } else {
                        linkScope.leastOneDeleted = false;
                    }

                }, true);

                linkScope.$watch("hideDeleted", (newValue, oldValue) => {
                    _.each(linkScope.titles, (title) => {
                        var anyTitle = <any>title;
                        if (newValue === true) {
                            if (anyTitle.isDeleted == false) {
                                anyTitle.isChanged = true;
                            }
                            (<any>title).isDeleted = true;

                        } else if (newValue === false) {
                            if (anyTitle.isChanged) {
                                anyTitle.isDeleted = false;
                            }

                            linkScope.titleExpend = false;
                            linkScope.ExpandCollapseAll();

                        }
                    });
                })
            }

        }
    }
    app.directive("role", role);
}