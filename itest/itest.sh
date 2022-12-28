#!/bin/bash

# test cli
test_cli() {
  GITHUB_REPOSITORY=$1
  GITHUB_REF=$2
  if [[ $# -lt 4 ]]
  then
    SUFFIX_ARG=
    EXPECTED=$3
  else
    SUFFIX_ARG="--suffix $3"
    EXPECTED=$4
  fi
  COMMAND="GITHUB_REPOSITORY=${GITHUB_REPOSITORY} GITHUB_REF=${GITHUB_REF} npx .. ${SUFFIX_ARG}"
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
  EXPECTED=$1
  COMMAND="npx .."
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
    echo "GITHUB_REPOSITORY: ${GITHUB_REPOSITORY}"
    echo "GITHUB_REF: ${GITHUB_REF}"
    echo "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
    echo "========================================"
    exit 1
  fi
  return 0
}

# test what happens when the required env vars aren't set
EXPECTED_ERROR_NO_REPO="@cdk-turnkey/stackname: error encountered:
GITHUB_REPOSITORY is not set.
It should be something like octocat/Hello-World.
See https://docs.github.com/en/actions/reference/environment-variables"
EXPECTED_ERROR_NO_REF="@cdk-turnkey/stackname: error encountered:
GITHUB_REF is not set.
It should be something like refs/heads/feature-branch-1.
See https://docs.github.com/en/actions/reference/environment-variables"
GITHUB_REPOSITORY= GITHUB_REF= test_cli_error "${EXPECTED_ERROR_NO_REPO}"
GITHUB_REPOSITORY=some/repo GITHUB_REF= test_cli_error "${EXPECTED_ERROR_NO_REF}"
GITHUB_REPOSITORY= GITHUB_REF=refs/heads/some-ref test_cli_error "${EXPECTED_ERROR_NO_REPO}"

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
  echo "NOW IN: $(pwd)"
  ls ..
  npx ../..
  npx cdk bootstrap
  npx cdk deploy --require-approval never
  npx cdk destroy --force
}

# actually deploy to AWS with one or more stacks named using stackname
for stack_dir in $(ls -d */)
do
  echo "HERE IN: $(pwd)"
  test_stack ${stack_dir}
done

# -h6 should output something like:
# s-abcde-abc123
# Check the length
# prove this test method works
output1=$(GITHUB_REPOSITORY=vvv/www GITHUB_REF=rrr npx ..)
output1_length=$(echo -n $output1 | wc -c | awk '{print $1}')
if [[ $output1_length -ne 9 ]]
then
  echo "Wrong length"
  exit 2
fi
# output=$(GITHUB_REPOSITORY=vvv/www GITHUB_REF=rrr npx .. -h6)


# Similarly, with a suffix