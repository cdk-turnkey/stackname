#!/bin/bash
GITHUB_REF=ccc npx .. --repo ddd/eee
o1=$(GITHUB_REF=fff npx .. --repo ddd/eee)
echo $o1
o1_length=$(echo -n $o1 | wc -c | awk '{print $1}')
echo $o1_length

# -h6 should output something like:
# s-abcde-abc123
# Check the length
# prove this test method works
GITHUB_REF=rrr npx .. --repo vvv/www
output1=$(GITHUB_REF=rrr npx .. --repo vvv/www)
output1_length=$(echo -n $output1 | wc -c | awk '{print $1}')
echo $output1
if [[ $output1_length -ne 9 ]]
then
  echo "Wrong length"
  exit 2
fi
output_h6=$(GITHUB_REF=rrr npx .. -h6 --repo vvv/www)
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

output2=$(GITHUB_REF=refs/heads/main npx .. --suffix app --hash 4 --repo douglasnaphas/madliberation)
expected_output2=sdmmai-3816-app
if [[ "${output2}" -ne "${expected_output2}" ]]
then
  echo "Wrong output, expected:"
  echo $expected_output2
  echo "Got:"
  echo $output2
  exit 4
fi

output3=$(GITHUB_REF=441-react18 npx .. --hash 5 --repo douglasnaphas/madliberation)
expected_output3=sdm441-dc591
if [[ "${output3}" -ne "${expected_output3}" ]]
then
  echo "Wrong output, expected:"
  echo $expected_output3
  echo "Got:"
  echo $output3
  exit 5
fi
