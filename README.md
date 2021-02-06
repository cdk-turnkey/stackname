# stackname

Print a name for a deployable CDK stack.

The environment variables GITHUB_REPOSITORY and GITHUB_REF should be set [as is done in GitHub Actions](https://docs.github.com/en/actions/reference/environment-variables).

## Why

So you can vary the name of your CloudFormation stack, built with the [CDK](https://aws.amazon.com/cdk/), and always know what the stack's name will be. You want to vary the stack name by the repo and branch, so that you can deploy different repos in the same account, and different branches of the same repo to the same account. You want to always know what the stack's name will be so that you can ask a question like, "What's the frontend S3 bucket name for this environment?" In that sense it's more like "envname" than "stackname," but it's called "stackname."

## How

```
$ npx @cdk-turnkey/stackname --help
Usage: @cdk-turnkey/stackname [options]

Print a name for an AWS CDK stack based on environtment variables GITHUB_REPOSITORY, GITHUB_REF, and an optional suffix. `GITHUB_REPOSITORY=my-Name/myRepo GITHUB_REF=refs/heads/myBranch npx @cdk-turnkey/stackname --suffix StackOne` prints My-nameMyrepoMybranch-StackOne.

Options:
  -V, --version          output the version number
  -s, --suffix <SUFFIX>  A suffix to append to the stackname after a dash (-) (default: "")
  -h, --help             display help for command
```

```
$ GITHUB_REPOSITORY=octocat/HelloWorld GITHUB_REF=refs/heads/main npx @cdk-turnkey/stackname
OctocatHelloworldMain
```

```
$ GITHUB_REPOSITORY=octocat/HelloWorld GITHUB_REF=refs/heads/feature-branch-1 npx @cdk-turnkey/stackname --suffix webapp
OctocatHelloworldFeature-branch-1-webapp
```
