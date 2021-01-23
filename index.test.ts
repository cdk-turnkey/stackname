import { timeStamp } from "console";

const stackname = require("./index.ts");
describe("stackname", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });
  test.each`
    gitHubRepository                 | gitHubRef                    | expected
    ${"douglasnaphas/madliberation"} | ${"refs/heads/master"}       | ${"douglasnaphas-madliberation-master"}
    ${"douglasnaphas/mljsapi"}       | ${"refs/heads/dev-branch-1"} | ${"douglasnaphas-mljsapi-dev-branch-1"}
  `(
    "$GITHUB_REPOSITORY: $gitHubRepository -> $expected",
    ({ gitHubRepository, gitHubRef, expected }) => {
      process.env.GITHUB_REPOSITORY = gitHubRepository;
      process.env.GITHUB_REF = gitHubRef;
      expect(stackname()).toEqual(expected);
    }
  );
});
