#!/bin/bash
echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

git add .
msg="🎉 包更新于 `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push github main

# push执行完成，不自动退出
exec /bin/bash