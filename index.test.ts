import { timeStamp } from "console";
const crypto = require("crypto");
const stackname = require("./index.ts");

const sha256 = (content: string) =>
  crypto.createHash("sha256").update(content).digest("hex").toLowerCase();
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
  const unsetRepoErrorMessage =
    "GITHUB_REPOSITORY is not set." +
    "\n" +
    "It should be something like octocat/Hello-World." +
    "\n" +
    "See https://docs.github.com/en/actions/reference/environment-variables";
  const unsetRefErrorMessage =
    "GITHUB_REF is not set." +
    "\n" +
    "It should be something like refs/heads/feature-branch-1." +
    "\n" +
    "See https://docs.github.com/en/actions/reference/environment-variables";
  const slashErrorMessage =
    "Can't figure out repo name. Does GITHUB_REPOSITORY have a '/'?" +
    " It should have a '/' separating the organization or user from the " +
    "repo name.";
  test.each`
    gitHubRepository | gitHubRef              | expectedError
    ${""}            | ${"refs/heads/master"} | ${unsetRepoErrorMessage}
    ${"a/bcd"}       | ${""}                  | ${unsetRefErrorMessage}
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
  test.each`
    identifier        | gitHubRepository | gitHubRef           | expected
    ${"myappstack"}   | ${"a/bcd"}       | ${"refs/heads/xyZ"} | ${"ABcdXyz-myappstack"}
    ${"YourAppStack"} | ${"D/va"}        | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${"YourAppStack"} | ${"D/v.a"}       | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${"YourAppStack"} | ${"D/v.a."}      | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${"YourAppStack"} | ${"D/v$a+"}      | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
  `(
    "$GITHUB_REPOSITORY: $gitHubRepository, $GITHUB_REF: $gitHubRef -> $expected",
    ({ identifier, gitHubRepository, gitHubRef, expected }) => {
      process.env.GITHUB_REPOSITORY = gitHubRepository;
      process.env.GITHUB_REF = gitHubRef;
      expect(stackname(identifier)).toEqual(expected);
    }
  );

  test.each`
    hashLength | suffix            | gitHubRepository | gitHubRef           | expected
    ${1}       | ${"myappstack"}   | ${"a/bcd"}       | ${"refs/heads/xyZ"} | ${"ABcdXyz-myappstack"}
    ${2}       | ${"YourAppStack"} | ${"D/va"}        | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${6}       | ${"YourAppStack"} | ${"D/v.a"}       | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${6}       | ${"YourAppStack"} | ${"D/v.a."}      | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${11}      | ${"YourAppStack"} | ${"D/v$a+"}      | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
  `(
    "hashLength: $hashLength, suffix: $suffix, " +
    "$GITHUB_REPOSITORY: $gitHubRepository, $GITHUB_REF: $gitHubRef -> $expected",
    ({ hashLength, suffix, gitHubRepository, gitHubRef, expected }) => {
      process.env.GITHUB_REPOSITORY = gitHubRepository;
      process.env.GITHUB_REF = gitHubRef;
      expect(stackname(suffix)).toEqual(expected);
    }
  );
});
describe("how hashes work", () => {
  console.log(sha256("ff"));
  // sha256 of an empty string is e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  // https://crypto.stackexchange.com/questions/26133/sha-256-hash-of-null-input
  console.log(sha256(""));
});
