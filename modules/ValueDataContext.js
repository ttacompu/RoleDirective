var roleApp;
(function (roleApp) {
    var app = roleApp.getModule();
    var ResourceBuilder = (function () {
        function ResourceBuilder($resource) {
            this.$resource = $resource;
        }
        ResourceBuilder.prototype.getPhoneResource = function () {
            return this.$resource('/api/vaules/:id', { id: '@id' }, {});
        };
        ResourceBuilder.$inject = ['$resource'];
        return ResourceBuilder;
    })();
    roleApp.ResourceBuilder = ResourceBuilder;
    var ValueDataContext = (function () {
        function ValueDataContext($resource) {
            this.updateAction = {
                method: 'PUT',
                isArray: false
            };
            this.$resource = $resource;
        }
        ValueDataContext.prototype.getResourceInstance = function () {
            this.$resource('/api/Values/:id', { id: '@id' }, { update: this.updateAction });
        };
        return ValueDataContext;
    })();
    roleApp.ValueDataContext = ValueDataContext;
})(roleApp || (roleApp = {}));
//# sourceMappingURL=ValueDataContext.js.map