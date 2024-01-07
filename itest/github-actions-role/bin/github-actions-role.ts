#!/usr/bin/env npx ts-node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { GithubActionsRoleStack } from "../lib/github-actions-role-stack";
const response2GitHubProviderArn =
  require("aws-github-oidc").response2GitHubProviderArn;
const stackname = require("../../index.ts");

const app = new cdk.App();
const STACKNAME_HASH_LENGTH = 6;
const roleStackName = stackname({
  repo: "aaa/bbb",
  ref: "refs/heads/master",
  hash: 6,
  suffix: "github-actions-role",
});
console.log(roleStackName);
// new GithubActionsRoleStack(app, 'GithubActionsRoleStack', {

// });
