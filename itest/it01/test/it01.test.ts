import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as It01A from "../lib/it01-stack-a";

describe("Stack A", () => {
  test("can instantiate stack", () => {
    const app = new App();
    // WHEN
    const stack = new It01A.It01StackA(app, "MyTestStack");
    // THEN
  });
});
