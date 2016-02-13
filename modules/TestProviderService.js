var roleApp;
(function (roleApp) {
    var app = roleApp.getModule();
    var TestService = (function () {
        function TestService() {
            this.testVal = "";
            this.$get.$inject = ['PartnerService'];
        }
        TestService.prototype.setTestVal = function (testVal) {
            this.testVal = testVal;
        };
        TestService.prototype.$get = function (PartnerService) {
            var _this = this;
            return {
                getHello: function () { return _this.testVal + PartnerService.getTitle()[0].name; }
            };
        };
        return TestService;
    })();
    roleApp.TestService = TestService;
    app.provider("TestService", TestService);
})(roleApp || (roleApp = {}));
//# sourceMappingURL=TestProviderService.js.map