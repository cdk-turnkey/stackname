/**
 * @return {String} A name for a CDK stack that:
 *   - enables deploying from feature branches
 *   - enables deploying from multiple feature branches in the same account
 *   - enables deploying to multiple regions from the same account, same branch
 */
const stackname = (options: { hash?: number, repo: string, ref: string, suffix?: string }) => {
  const repo: string = options.repo || "";
  const ref: string = options.ref || "";
  if (repo.length < 1) {
    throw "repo name is too short, length < 1";
  }
  if (ref.length < 1) {
    throw "ref is too short, length < 1";
  }
  const slashLetterRegex = /\/(.)/;
  const repoFirstLetterMatch = repo.match(slashLetterRegex);
  if (!repoFirstLetterMatch || repoFirstLetterMatch.length < 2) {
    throw (
      "Can't figure out repo name. Does repo have a '/'?" +
      " It should have a '/' separating the organization or user from the " +
      "repo name."
    );
  }
  const suffix = options.suffix && options.suffix.length > 0 ? `-${options.suffix}` : "";
  if (!options || !options.hash) {
    return (
      repo
        .toLowerCase()
        .replace(
          /^([^/])([^/]*)[/]([^/])/,
          (_, p1, p2, p3) => p1.toUpperCase() + p2 + p3.toUpperCase()
        )
        .replace(/[^A-Za-z0-9-]/g, "") +
      ref
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
  const branch = ref.replace(/^refs\/heads\//, "");
  const refComponent = branch.substring(0, LETTERS_OF_REF);
  const hashComponent = sha256(sha256(repo) + sha256(ref));
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
