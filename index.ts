/**
 * pre: The following environment variables are set:
 *   - GITHUB_REPOSITORY
 *   - GITHUB_REF
 * @return {String} A name for a CDK stack that:
 *   - enables deploying from feature branches
 *   - enables deploying from multiple feature branches in the same account
 *   - enables deploying to multiple regions from the same account, same branch
 */
const stackname = () => {
  const gitHubRepository: string = process.env.GITHUB_REPOSITORY as string;
  const gitHubRef: string = process.env.GITHUB_REF as string;
  return (
    gitHubRepository.replace(/\//g, "-") +
    "-" +
    gitHubRef.replace(/^refs\/heads\//, "")
  );
};
module.exports = stackname;
