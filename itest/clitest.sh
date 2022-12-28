#!/bin/bash
GITHUB_REPOSITORY=aaa/bbb GITHUB_REF=ccc npx ..
o1=$(GITHUB_REPOSITORY=ddd/eee GITHUB_REF=fff npx ..)
echo $o1
o1_length=$(echo $o1 | wc -c | awk '{print $1}')
echo $o1_length