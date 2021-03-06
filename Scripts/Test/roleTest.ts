﻿describe("Inject services to Role Directive Test", function () {
    var compile, scope, templateCache;
    beforeEach(() => {
        angular.mock.module("roleApp");
        inject(
            ($rootScope, $compile, $templateCache) => {
                compile = $compile;
                scope = $rootScope.$new();
                templateCache = $templateCache;
            });
        templateCache.put('Template/role.html', '');

        scope.titlesource = [{ "title": "Partner", isCollapsed: false, isDeleted: false, employees: [{ name: "Thein", isDeleted: false, isVisible: true }, { name: "Chris", isDeleted: false }] },
            { "title": "Associate", isCollapsed: false, isDeleted: false, employees: [{ name: "Ajay", isDeleted: false }] },
            { "title": "Admin", isCollapsed: false, isDeleted: false, employees: [{ name: "Alex", isDeleted: false, isVisible: true }, { name: "Anil", isDeleted: false }, { name: "Praveen", isDeleted: false }] }
        ];
        getElement();
    });

    it("Initial State 3 entries", () => {
        expect(scope.titles.length).toBe(3);
    })

    it("Toggle first Item false to true ", () => {

        expect(scope.titles[0].isCollapsed).toBe(false);
        scope.ExpandCollapse(scope.titles[0]);
        expect(scope.titles[0].isCollapsed).toBe(true);
    })

    it("All title can expand/collapse when press expand/collapse button", () => {
        scope.titleExpend = true;
        scope.ExpandCollapseAll();
        expect(scope.titles[0].isCollapsed).toBe(true);
        expect(scope.titles[1].isCollapsed).toBe(true);
        expect(scope.titles[2].isCollapsed).toBe(true);
        expect(scope.titleExpend).toBe(false);
        scope.ExpandCollapseAll();
        expect(scope.titles[0].isCollapsed).toBe(false);
        expect(scope.titles[1].isCollapsed).toBe(false);
        expect(scope.titles[2].isCollapsed).toBe(false);
        expect(scope.titleExpend).toBe(true);
    })

    it("Delete one Employee from First Title ", () => {
        scope.hideDeleted = true;
        var emp = scope.titles[0].employees[0];
        scope.onDeleteEmployee(emp);
        expect(emp.isDeleted).toBe(true);
        expect(emp.isChanged).toBe(true);

    })

    it("UnDelete one Employee from First Title ", () => {
        var emp = scope.titles[0].employees[0];
        emp.isDeleted = true;
        scope.onUnDelete(emp);
        expect(emp.isDeleted).toBe(false);
    })

    it("UnDelete from All Title ", () => {
        var samples = [scope.titles[0].employees[0], scope.titles[1].employees[0], scope.titles[2].employees[2]];
        samples[0].isDeleted = true;
        samples[0].isChanged = true;
        samples[1].isDeleted = true;
        samples[1].isChanged = true;
        samples[2].isDeleted = true;
        samples[2].isChanged = true;
        scope.UndeleteAll();
        _.each(samples, (emp) => {
            expect(emp.isDeleted).toBe(false);
            expect(emp.isChanged).toBe(false);
        })
    })

    it("Delete a Title", () => {
        var emps = scope.titles[0].employees;
        emps[0].isDeleted = false;
        emps[1].isDeleted = false;
        scope.hideDeleted = true;

        scope.titles[0].showDeleteTitle = true;


        scope.onDeleteTitle(scope.titles[0], true);

        _.each(emps, (emp) => {
            var _emp = <any>emp;
            expect(_emp.isDeleted).toBe(true);
            expect(_emp.isChanged).toBe(true);
        })

        expect(scope.titles[0].showDeleteTitle).toBe(false);

    })

    it("Un Delete a Title", () => {
        var emps = scope.titles[0].employees;
        emps[0].isDeleted = true;
        emps[1].isDeleted = true;
        scope.hideDeleted = false;
        scope.titles[0].showUnDeleteTitle = true;
        scope.onDeleteTitle(scope.titles[0], false);

        _.each(emps, (emp) => {
            var _emp = <any>emp;
            expect(_emp.isDeleted).toBe(false);
            expect(_emp.isChanged).toBe(false);
        })
        expect(scope.titles[0].showUnDeleteTitle).toBe(false);
    })

    it("Hide Deleted Button Test", () => {
        scope.hideDeleted = true;
        scope.titles[0].employees[0].isChanged = true;
        scope.ShowHideDeleted();

        expect(scope.titles[0].employees[0].isChanged).toBe(false);
        expect(scope.hideDeleted).toBe(false);


    })

    it("Show Deleted Button Test", () => {
        scope.hideDeleted = false;
        scope.titles[0].employees[0].isChanged = false;
        scope.titles[0].employees[0].isDeleted = true;

        scope.ShowHideDeleted();
        expect(scope.titles[0].employees[0].isChanged).toBe(true);
        expect(scope.hideDeleted).toBe(true);
    })

    it("hideDelete=true Watch test", (done) => {
        //Initial state
        scope.titles[0].isDeleted = false;

        scope.$apply(() => {
            scope.hideDeleted = true;
            done();
        });
        expect(scope.titles[0].isChanged).toBe(true);
        expect(scope.titles[0].isDeleted).toBe(true);
    });

    it("hideDelete=false Watch test", (done) => {
        //Initial state
        scope.titles[0].isDeleted = true;
        scope.titles[0].isChanged = false;

        scope.$apply(() => {
            scope.hideDeleted = false;
            done();
        });

        expect(scope.titles[0].isDeleted).toBe(false);
    });

    it("Initial State of show Delete=true, unDelete = false", (done) => {
        scope.$apply(() => {
            done();
        });
        _.each(scope.titles, (title) => {
            var _title = <any>title;
            expect(_title.showDeleteTitle).toBe(true);
            expect(_title.showUnDeleteTitle).toBe(false);
        })
    })

    it("one employee deleted and ShowDelete=true and Undelete title=true", (done) => {
        scope.hideDeleted = false;
        var firstTitle = scope.titles[0];
        scope.$apply(() => {
            firstTitle.employees[0].isDeleted = true;
            done();
        });

        expect(scope.titles[0].showDeleteTitle).toBe(true);
        expect(scope.titles[0].showUnDeleteTitle).toBe(true);

    })

    it("all employees deleted and ShowDelete=false and Undelete title=true", (done) => {
        scope.hideDeleted = false;
        var firstTitle = scope.titles[0];
        firstTitle.employees[0].isDeleted = true;

        scope.$apply(() => {
            firstTitle.employees[1].isDeleted = true;
            done();
        });

        expect(scope.titles[0].showDeleteTitle).toBe(false);
        expect(scope.titles[0].showUnDeleteTitle).toBe(true);

    })


    it("all employees deleted and cotaining title will deleted ", (done) => {
        scope.hideDeleted = true;
        var firstTitle = scope.titles[0];
        firstTitle.employees[0].isDeleted = true;

        scope.$apply(() => {
            firstTitle.employees[1].isDeleted = true;
            done();
        });

        expect(scope.titles[0].isDeleted).toBe(true);
    })


    function getElement(): any {
        var ele = compile('<role titles="titlesource"></role>')(scope);
        scope.$digest();
        scope = ele.isolateScope();
    };

});
