#!/usr/bin/env node
(async () => {
  const stackname = require("./index");
  console.log(stackname());
})().catch((err) => {
  console.error("error encountered:");
  console.error(err);
  process.exit(1);
});
