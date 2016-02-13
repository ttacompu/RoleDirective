angular.module("roleApp").controller("PersonCtrl", (function () {
    function PersonCtrl($scope) {
        var personFactory = new PersonFactory();
        var personArray = new Array();
        personArray.push(personFactory.getPerson(new Date(2014, 09, 29))); // infant
        personArray.push(personFactory.getPerson(new Date(2000, 09, 29))); // child
        personArray.push(personFactory.getPerson(new Date(1950, 09, 29))); // adult
        $scope.persons = personArray;
    }
    return PersonCtrl;
})());
//# sourceMappingURL=PersonCtrl.js.map