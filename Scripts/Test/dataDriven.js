//class MySpiedClass {
//    testFunction(arg1: string) {
//        console.log(arg1);
//    }
//    returnNumber() {
//        return 1;
//    }
//}
//class MockAsynClass {
//    RunAsnyc(fn: (input: string) => void) {
//        setTimeout(fn("success"), 100)
//    }
//}
//function used(name, values, func) {
//    for (var i = 0, count = values.length; i < count; i++) {
//        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
//            values[i] = [values[i]];
//            func.apply(this, values[i]);
//        }
//    }
//}
//describe("test async func", () => {
//    it("expect success message", () => {
//        var returnvalue = "";
//        var asyncClass = new MockAsynClass;
//        asyncClass.RunAsnyc((message) => {
//            returnvalue = message;
//        })
//        expect(returnvalue).toBe("success");
//    })
//})
//describe("data driven tests", () => {
//    used("valid values", ["fist string", "second string", "third string"], (value) => {
//        it("shoud cotain string (" + value + ")", () => {
//            expect(value).toContain("string");
//        })
//    })
//})
//describe("simple spy", () => {
//    it("should reister a function call", () => {
//        var classInstance = new MySpiedClass();
//        spyOn(classInstance, "testFunction");
//        classInstance.testFunction("test");
//        expect(classInstance.testFunction).toHaveBeenCalled();
//    })
//    it("should return spy number", () => {
//        var classInstance = new MySpiedClass();
//        spyOn(classInstance, "returnNumber").and.returnValue(6);
//        expect(classInstance.returnNumber()).toBe(6);
//    })
//})
//# sourceMappingURL=dataDriven.js.map