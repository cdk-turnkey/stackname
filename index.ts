/**
 * pre: The following environment variables are set:
 *   - GITHUB_REPOSITORY
 *   - GITHUB_REF
 * @return {String} A name for a CDK stack that:
 *   - enables deploying from feature branches
 *   - enables deploying from multiple feature branches in the same account
 *   - enables deploying to multiple regions from the same account, same branch
 */
const stackname = (shortName?: string, options?: { hash: number, repo: string }) => {
  if (!process.env.GITHUB_REF) {
    throw (
      "GITHUB_REF is not set." +
      "\n" +
      "It should be something like refs/heads/feature-branch-1." +
      "\n" +
      "See https://docs.github.com/en/actions/reference/environment-variables"
    );
  }
  const repo: string = options.repo || "";
  const gitHubRef: string = process.env.GITHUB_REF as string;
  if (repo.length < 1) {
    throw "GITHUB_REPOSITORY is too short, length < 1";
  }
  if (gitHubRef.length < 1) {
    throw "GITHUB_REF is too short, length < 1";
  }
  const slashLetterRegex = /\/(.)/;
  const repoFirstLetterMatch = repo.match(slashLetterRegex);
  if (!repoFirstLetterMatch || repoFirstLetterMatch.length < 2) {
    throw (
      "Can't figure out repo name. Does GITHUB_REPOSITORY have a '/'?" +
      " It should have a '/' separating the organization or user from the " +
      "repo name."
    );
  }
  const suffix = shortName && shortName.length > 0 ? `-${shortName}` : "";
  if (!options || !options.hash) {
    return (
      repo
        .toLowerCase()
        .replace(
          /^([^/])([^/]*)[/]([^/])/,
          (_, p1, p2, p3) => p1.toUpperCase() + p2 + p3.toUpperCase()
        )
        .replace(/[^A-Za-z0-9-]/g, "") +
      gitHubRef
        .toLowerCase()
        .replace(/^refs\/heads\/(.)/, (_, p1) => p1.toUpperCase()) +
      suffix
    );
  }
  const hashLength = options.hash;
  const crypto = require("crypto");
  const sha256 = (content: string) =>
    crypto.createHash("sha256").update(content).digest("hex").toLowerCase();
  const PREFIX = "s";
  const SEPARATOR = "-";
  const firstLetterOfOrg = repo.substring(0, 1);
  const REPO_INDEX = 1;
  const firstLetterOfRepo = repo
    .split("/")
    [REPO_INDEX].substring(0, 1);
  const repoComponent = firstLetterOfOrg + firstLetterOfRepo;
  const LETTERS_OF_REF = 3;
  const branch = gitHubRef.replace(/^refs\/heads\//, "");
  const refComponent = branch.substring(0, LETTERS_OF_REF);
  const hashComponent = sha256(sha256(repo) + sha256(gitHubRef));
  let ret = "sabcde-1a353c-fghi";
  ret =
    `${PREFIX}` +
    `${repoComponent}` +
    `${refComponent}` +
    `${SEPARATOR}` +
    `${hashComponent.substring(0, hashLength)}` +
    `${suffix}`;
  return ret;
};
module.exports = stackname;
