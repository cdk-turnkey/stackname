#!/bin/bash

test_stack() {
  local stack_dir=$1
  cd $stack_dir
  # get stackname
  echo "NOW IN: $(pwd)"
  ls ..
  npx ../..
  npm install
  npm build
  npx cdk bootstrap
  npx cdk deploy --require-approval never
  echo "AWS_ACCESS_KEY_ID length:"
  echo ${AWS_ACCESS_KEY_ID} | wc
  echo "AWS_DEFAULT_REGION length:"
  echo ${AWS_DEFAULT_REGION} | wc
}

# bootstrap

# test stacks
for stack_dir in $(ls -d */)
do
  echo "HERE IN: $(pwd)"
  # test stack
  test_stack ${stack_dir}
done