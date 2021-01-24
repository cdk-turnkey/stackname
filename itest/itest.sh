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

npx .. --help | grep suffixx
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

for stack_dir in $(ls -d */)
do
  echo "HERE IN: $(pwd)"
  test_stack ${stack_dir}
done
