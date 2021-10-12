/**
 * pre: The following environment variables are set:
 *   - GITHUB_REPOSITORY
 *   - GITHUB_REF
 * @return {String} A name for a CDK stack that:
 *   - enables deploying from feature branches
 *   - enables deploying from multiple feature branches in the same account
 *   - enables deploying to multiple regions from the same account, same branch
 */
const stackname = (shortName?: string) => {
  if (!process.env.GITHUB_REPOSITORY) {
    throw (
      "GITHUB_REPOSITORY is not set." +
      "\n" +
      "It should be something like octocat/Hello-World." +
      "\n" +
      "See https://docs.github.com/en/actions/reference/environment-variables"
    );
  }
  if (!process.env.GITHUB_REF) {
    throw (
      "GITHUB_REF is not set." +
      "\n" +
      "It should be something like refs/heads/feature-branch-1." +
      "\n" +
      "See https://docs.github.com/en/actions/reference/environment-variables"
    );
  }
  const gitHubRepository: string = process.env.GITHUB_REPOSITORY as string;
  const gitHubRef: string = process.env.GITHUB_REF as string;
  if (gitHubRepository.length < 1) {
    throw "GITHUB_REPOSITORY is too short, length < 1";
  }
  if (gitHubRef.length < 1) {
    throw "GITHUB_REF is too short, length < 1";
  }
  const slashLetterRegex = /\/(.)/;
  const repoFirstLetterMatch = gitHubRepository.match(slashLetterRegex);
  if (!repoFirstLetterMatch || repoFirstLetterMatch.length < 2) {
    throw (
      "Can't figure out repo name. Does GITHUB_REPOSITORY have a '/'?" +
      " It should have a '/' separating the organization or user from the " +
      "repo name."
    );
  }
  return (
    gitHubRepository
      .toLowerCase()
      .replace(
        /^([^/])([^/]*)[/]([^/])/,
        (_, p1, p2, p3) => p1.toUpperCase() + p2 + p3.toUpperCase()
      )
      .replace(/[^A-Za-z0-9-]/g, "") +
    gitHubRef
      .toLowerCase()
      .replace(/^refs\/heads\/(.)/, (_, p1) => p1.toUpperCase()) +
    (shortName && shortName.length > 0 ? `-${shortName}` : "")
  );
};
module.exports = stackname;
