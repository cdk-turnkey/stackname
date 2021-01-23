#!/bin/bash

test_stack() {
  local stack_dir=$1
  cd $stack_dir
  # get stackname
  echo "NOW IN: $(pwd)"
  ls ..
  npx ../..
}

# bootstrap

# test stacks
for stack_dir in $(ls -d */)
do
  echo "HERE IN: $(pwd)"
  # test stack
  test_stack ${stack_dir}
done