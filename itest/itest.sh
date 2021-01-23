#!/bin/bash

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


# test stacks
for stack_dir in $(ls -d */)
do
  echo "HERE IN: $(pwd)"
  # test stack
  test_stack ${stack_dir}
done