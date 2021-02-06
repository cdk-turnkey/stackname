#!/usr/bin/env node
(async () => {
  const stackname = require("./index");
  const program = require("commander");
  type DefaultsType = {
    suffix: string;
  };
  const defaults: DefaultsType = {
    suffix: "",
  };
  program
    .name("@cdk-turnkey/stackname")
    .version("1.1.0")
    .description(
      "Print a name for an AWS CDK stack based on environtment variables GITHUB_REPOSITORY, GITHUB_REF, and an optional suffix. `GITHUB_REPOSITORY=my-Name/myRepo GITHUB_REF=refs/heads/myBranch npx @cdk-turnkey/stackname --suffix StackOne` prints My-nameMyrepoMybranch-StackOne."
    )
    .option(
      "-s, --suffix <SUFFIX>",
      "A suffix to append to the stackname after a dash (-)",
      defaults.suffix
    )
    .parse(process.argv);
  const { suffix } = program.opts();

  console.log(stackname(suffix));
})().catch((err) => {
  console.error("@cdk-turnkey/stackname: error encountered:");
  console.error(err);
  process.exit(1);
});
