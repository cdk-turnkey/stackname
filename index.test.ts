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
    repo                             | ref                          | expected
    ${"douglasnaphas/madliberation"} | ${"refs/heads/master"}       | ${"DouglasnaphasMadliberationMaster"}
    ${"douglasNaphas/madLiberation"} | ${"refs/heads/master"}       | ${"DouglasnaphasMadliberationMaster"}
    ${"douglasNaphas/madLiberation"} | ${"refs/heads/Master"}       | ${"DouglasnaphasMadliberationMaster"}
    ${"douglasnaphas/mljsapi"}       | ${"refs/heads/dev-branch-1"} | ${"DouglasnaphasMljsapiDev-branch-1"}
    ${"a/bcd"}                       | ${"refs/heads/xyZ"}          | ${"ABcdXyz"}
    ${"D/va"}                        | ${"refs/heads/rna"}          | ${"DVaRna"}
  `("repo: $repo, ref: $ref -> $expected", ({ repo, ref, expected }) => {
    expect(stackname({ repo, ref })).toEqual(expected);
  });
  const slashErrorMessage =
    "Can't figure out repo name. Does repo have a '/'?" +
    " It should have a '/' separating the organization or user from the " +
    "repo name.";
  test.each`
    repo      | ref                 | expectedError
    ${"abcd"} | ${"refs/heads/abc"} | ${slashErrorMessage}
  `(
    "repo: $repo, ref: $ref -> throw '$expectedError'",
    ({ repo, ref, expectedError }) => {
      expect(() => {
        stackname({ repo, ref });
      }).toThrow(expectedError);
    }
  );
  test.each`
    identifier        | repo        | ref                 | expected
    ${"myappstack"}   | ${"a/bcd"}  | ${"refs/heads/xyZ"} | ${"ABcdXyz-myappstack"}
    ${"YourAppStack"} | ${"D/va"}   | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${"YourAppStack"} | ${"D/v.a"}  | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${"YourAppStack"} | ${"D/v.a."} | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
    ${"YourAppStack"} | ${"D/v$a+"} | ${"refs/heads/rna"} | ${"DVaRna-YourAppStack"}
  `(
    "repo: $repo, ref: $ref -> $expected",
    ({ identifier, repo, ref, expected }) => {
      expect(stackname({ suffix: identifier, repo, ref })).toEqual(expected);
    }
  );

  describe("Hashing strategy", () => {
    test("hash component is h(h(repository) + h(ref))", () => {
      const repo = "a/b";
      const ref = "cde";
      const suffix = "fghi";
      const hashComponent = sha256(
        sha256(
          repo
        ) /* c14cddc033f64b9dea80ea675cf280a015e672516090a5626781153dc68fea11 */ +
          sha256(
            ref
          ) /* 08a018a9549220d707e11c5c4fe94d8dd60825f010e71efaa91e5e784f364d7b */
      ); /* 1a353cbec894a34c2af92fd3fec68f9704594026520af0f0ec0b781e92550fb1 */
      const PREFIX = "s"; // for stackname, CloudFormation stack names have to
      // start with letters
      const repoComponent = "ab";
      const refComponent = "cde"; // always take first 3, even if it's longer, or take all if shorter
      const SEPARATOR = "-"; // allowed by CloudFormation
      const hashLength = 6;
      const expected =
        `${PREFIX}` +
        `${repoComponent}` +
        `${refComponent}` +
        `${SEPARATOR}` +
        `${hashComponent.substring(0, hashLength)}` +
        `${SEPARATOR}` +
        `${suffix}`;
      expect(stackname({ hash: hashLength, repo, ref, suffix })).toEqual(
        "sabcde-1a353c-fghi"
      );
    });
  });

  test.each`
    hashLength | suffix            | repo        | ref                 | expected
    ${1}       | ${"myappstack"}   | ${"a/bcd"}  | ${"refs/heads/xyZ"} | ${"sabxyZ-8-myappstack"}
    ${2}       | ${"YourAppStack"} | ${"D/va"}   | ${"refs/heads/rna"} | ${"sDvrna-fe-YourAppStack"}
    ${6}       | ${"YourAppStack"} | ${"D/v.a"}  | ${"refs/heads/rna"} | ${"sDvrna-3280ea-YourAppStack"}
    ${6}       | ${"YourAppStack"} | ${"D/v.a."} | ${"refs/heads/rna"} | ${"sDvrna-0d23be-YourAppStack"}
    ${11}      | ${"YourAppStack"} | ${"D/v$a+"} | ${"refs/heads/rna"} | ${"sDvrna-feb9950bff0-YourAppStack"}
  `(
    "hashLength: $hashLength, suffix: $suffix, " +
      "repo: $repo, ref: $ref -> $expected",
    ({ hashLength, suffix, repo, ref, expected }) => {
      expect(stackname({ hash: hashLength, repo, ref, suffix })).toEqual(
        expected
      );
    }
  );
});
describe("how hashes work", () => {
  expect(sha256("ff")).toEqual(
    "05a9bf223fedf80a9d0da5f73f5c191a665bf4a0a4a3e608f2f9e7d5ff23959c"
  );
  // sha256 of an empty string is e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  // https://crypto.stackexchange.com/questions/26133/sha-256-hash-of-null-input
  expect(sha256("")).toEqual(
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  );
});
