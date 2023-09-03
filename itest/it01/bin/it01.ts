#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { It01StackA } from "../lib/it01-stack-a";
const stackname = require("../../../index");

const app = new cdk.App();
new It01StackA(
  app,
  stackname({
    repo: process.env.GITHUB_REPOSITORY,
    ref: process.env.GITHUB_REF,
    suffix: "It01StackA",
  })
);
