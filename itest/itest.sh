#!/bin/bash

# test cli
test_cli() {
  REPO=$1
  REF=$2
  if [[ $# -lt 4 ]]
  then
    SUFFIX_ARG=
    EXPECTED=$3
  else
    SUFFIX_ARG="--suffix $3"
    EXPECTED=$4
  fi
  COMMAND="GITHUB_REF=${GITHUB_REF} npx .. ${SUFFIX_ARG} --repo ${REPO} --ref ${REF}"
  ACTUAL=$(eval ${COMMAND})
  if [[ "${ACTUAL}" != "${EXPECTED}" ]]
  then
    echo "cli integration test failure: expected ${EXPECTED}, got ${ACTUAL}, ran:"
    echo "${COMMAND}"
    exit 1
  fi
  return 0
}

test_cli_error() {
  EXPECTED=$2
  COMMAND=$1
  ACTUAL=$(eval ${COMMAND} 2>&1 || true) # || true because COMMAND should fail
  if [[ "${ACTUAL}" != "${EXPECTED}" ]]
  then
    echo "========================================"
    echo "VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
    echo "cli error case failure: expected:"
    echo "----------------------------------------"
    echo "${EXPECTED}"
    echo "----------------------------------------"
    echo "got:"
    echo "----------------------------------------"
    echo "${ACTUAL}"
    echo "----------------------------------------"
    echo "ran:"
    echo "----------------------------------------"
    echo "${COMMAND}"
    echo "----------------------------------------"
    echo "GITHUB_REF: ${GITHUB_REF}"
    echo "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
    echo "========================================"
    exit 1
  fi
  return 0
}

# test what happens when the required env vars aren't set
EXPECTED_ERROR_NO_REPO="error: required option '-r, --repo <REPO>' not specified"
EXPECTED_ERROR_NO_REF="error: required option '-b, --ref <REF>' not specified"
test_cli_error "npx .." "${EXPECTED_ERROR_NO_REPO}"
test_cli_error "npx .. --repo some/repo" "${EXPECTED_ERROR_NO_REF}"
test_cli_error "npx .. --ref refs/heads/some-ref" "${EXPECTED_ERROR_NO_REPO}"

# test help output
if ! npx .. --help | grep --quiet suffix
then
  echo "cli smoke test failure: --help did not print the word 'suffix'"
  exit 1
fi

# test realistic use cases
test_cli cdk-turnkey/stackname refs/heads/abCde Cdk-turnkeyStacknameAbcde
test_cli MyOrg/MyStack refs/heads/main StackOne MyorgMystackMain-StackOne

# test lib
test_stack() {
  local stack_dir=$1
  cd $stack_dir
  npx cdk@latest bootstrap
  npx cdk@latest deploy --require-approval never
  npx cdk@latest destroy --force
}

# actually deploy to AWS with one or more stacks named using stackname
for stack_dir in $(ls -d */)
do
  test_stack ${stack_dir}
done
