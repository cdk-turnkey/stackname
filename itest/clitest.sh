#!/bin/bash
GITHUB_REPOSITORY=aaa/bbb GITHUB_REF=ccc npx ..
o1=$(GITHUB_REPOSITORY=ddd/eee GITHUB_REF=fff npx ..)
echo $o1
o1_length=$(echo -n $o1 | wc -c | awk '{print $1}')
echo $o1_length

# -h6 should output something like:
# s-abcde-abc123
# Check the length
# prove this test method works
GITHUB_REPOSITORY=vvv/www GITHUB_REF=rrr npx ..
output1=$(GITHUB_REPOSITORY=vvv/www GITHUB_REF=rrr npx ..)
output1_length=$(echo -n $output1 | wc -c | awk '{print $1}')
echo $output1
if [[ $output1_length -ne 9 ]]
then
  echo "Wrong length"
  exit 2
fi
output_h6=$(GITHUB_REPOSITORY=vvv/www GITHUB_REF=rrr npx .. -h6)
output_h6_length=$(echo -n $output_h6 | wc -c | awk '{print $1}')
# Should be like:
# svwrrr-abc123, length 13
if [[ $output_h6_length -ne 13 ]]
then
  echo "Wrong length for output_h6"
  echo "output_h6:"
  echo $output_h6
  exit 3
fi



# Similarly, with a suffix
