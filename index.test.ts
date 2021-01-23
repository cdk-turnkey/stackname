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
    ${"douglasnaphas/madliberation"} | ${"refs/heads/master"}       | ${"DouglasnaphasMadliberationMaster"}
    ${"douglasNaphas/madLiberation"} | ${"refs/heads/master"}       | ${"DouglasnaphasMadliberationMaster"}
    ${"douglasNaphas/madLiberation"} | ${"refs/heads/Master"}       | ${"DouglasnaphasMadliberationMaster"}
    ${"douglasnaphas/mljsapi"}       | ${"refs/heads/dev-branch-1"} | ${"DouglasnaphasMljsapiDev-branch-1"}
    ${"a/bcd"}                       | ${"refs/heads/xyZ"}          | ${"ABcdXyz"}
    ${"D/va"}                        | ${"refs/heads/rna"}          | ${"DVaRna"}
  `(
    "$GITHUB_REPOSITORY: $gitHubRepository, $GITHUB_REF: $gitHubRef -> $expected",
    ({ gitHubRepository, gitHubRef, expected }) => {
      process.env.GITHUB_REPOSITORY = gitHubRepository;
      process.env.GITHUB_REF = gitHubRef;
      expect(stackname()).toEqual(expected);
    }
  );
  const slashErrorMessage =
    "Can't figure out repo name. Does GITHUB_REPOSITORY have a '/'?" +
    " It should have a '/' separating the organization or user from the " +
    "repo name.";
  test.each`
    gitHubRepository | gitHubRef              | expectedError
    ${""}            | ${"refs/heads/master"} | ${"GITHUB_REPOSITORY is too short, length < 1"}
    ${"a/bcd"}       | ${""}                  | ${"GITHUB_REF is too short, length < 1"}
    ${"abcd"}        | ${"refs/heads/abc"}    | ${slashErrorMessage}
  `(
    "$GITHUB_REPOSITORY: $gitHubRepository, $GITHUB_REF: $gitHubRef -> throw '$expectedError'",
    ({ gitHubRepository, gitHubRef, expectedError }) => {
      process.env.GITHUB_REPOSITORY = gitHubRepository;
      process.env.GITHUB_REF = gitHubRef;
      expect(() => {
        stackname();
      }).toThrow(expectedError);
    }
  );
});
