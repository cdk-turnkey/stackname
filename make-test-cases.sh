#!/bin/bash

awk 'NR == 116, NR == 120' index.test.ts |
while read quoted_line
do
  line=$(echo $quoted_line | sed -e 's/ [$][{]["]/ /g' -e 's/["][}] / /g') ;
  suffix=$(echo $line | awk '{print $3}') ;
  github_repository=$(echo $line | awk '{print $5}') ;
  github_ref=$(echo $line | awk '{print $7}') ;
  org_first_letter=$(echo $github_repository | cut -c1) ;
  repo_first_letter=$(echo $github_repository | cut -f2 -d '/' | cut -c1) ;
  branch=$(echo $github_ref | awk -v FS='/' '{print $NF}') ;
  branch_first_three_letters=${branch:0:3} ;
  sha_github_repository=$(openssl sha256 <(echo -n $github_repository) | awk '{print $2}') ;
  sha_github_ref=$(openssl sha256 <(echo -n $github_ref) | awk '{print $2}') ;
  sha=$(openssl sha256 <(echo -n ${sha_github_repository}${sha_github_ref}) | awk '{print $2}') ;
  stackname=s${org_first_letter}${repo_first_letter}${branch_first_three_letters}-${sha:0:6}-${suffix} ;
  echo "${quoted_line} | "'${"'"${stackname}"'"}' | awk '{$8="" ; $9=""; print}' ;
done
