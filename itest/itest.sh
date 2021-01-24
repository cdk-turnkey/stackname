#!/bin/bash

# test cli
test_cli() {
  GITHUB_REPOSITORY=$1
  GITHUB_REF=$2
  if [[ $# -lt 4 ]]
  then
    SUFFIX_ARG="--suffix $3"
    EXPECTED=$4
  else
    SUFFIX_ARG=
    EXPECTED=$3
  fi
  COMMAND="GITHUB_REPOSITORY=${GITHUB_REPOSITORY} GITHUB_REF=${GITHUB_REF} npx .. ${SUFFIX_ARG}"
  ACTUAL=$(eval ${COMMAND})
  if [[ "${ACTUAL}" != "${EXPECTED}" ]]
  then
    echo "cli integration test failure: expected ${EXPECTED}, got ${ACTUAL}, ran:"
    echo "${COMMAND}"
    return 1
  fi
  return 0
}

OUT1=$(GITHUB_REPOSITORY=cdk-turnkey/stackname GITHUB_REF=refs/heads/abCde npx ..)
EXPECTED1="Cdk-turnkeyStacknameAbcde"
if [[ "${OUT1}" != ${EXPECTED1} ]]
then
  echo "cli integration test failure: expected ${EXPECTED1}, got ${OUT1}"
  exit 1
fi

OUT2=$(GITHUB_REPOSITORY=MyOrg/MyStack GITHUB_REF=refs/heads/main npx .. --suffix StackOne)
EXPECTED2="MyorgMystackMain-StackOne"
if [[ "${OUT2}" != ${EXPECTED2} ]]
then
  echo "cli integration test failure: expected ${EXPECTED2}, got ${OUT2}"
  exit 1
fi

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
