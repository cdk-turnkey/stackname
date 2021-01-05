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
    gitHubRepository                 | expected
    ${"douglasnaphas/madliberation"} | ${"douglasnaphas-madliberation"}
    ${"douglasnaphas/mljsapi"}       | ${"douglasnaphas-mljsapi"}
  `(
    "$GITHUB_REPOSITORY: $gitHubRepository -> $expected",
    ({ gitHubRepository, expected }) => {
      process.env.GITHUB_REPOSITORY = gitHubRepository;
      expect(stackname()).toEqual(expected);
    }
  );
});
