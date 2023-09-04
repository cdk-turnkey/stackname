import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "aws-cdk-lib";
import * as It01A from "../lib/it01-stack-a";

describe("Stack A", () => {
  test("can instantiate stack", () => {
    const app = new cdk.App();
    // WHEN
    const stack = new It01A.It01StackA(app, "MyTestStack");
    // THEN
  });
});
