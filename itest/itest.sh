#!/bin/bash

test_stack() {
  local stack_dir=$1
  cd $stack_dir
  # get stackname
  echo "NOW IN: $(pwd)"
  ls ..
}

# bootstrap

# test stacks
for stack_dir in $(ls -d itest/*/)
do
  echo "HERE IN: $(pwd)"
  # test stack
  test_stack ${stack_dir}
done