#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { It01StackA } from "../lib/it01-stack-a";
const stackname = require("../../../index");

const app = new cdk.App();
new It01StackA(app, "It01StackA" + stackname());
