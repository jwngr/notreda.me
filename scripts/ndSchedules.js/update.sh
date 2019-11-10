#!/bin/bash

set -e

echo "[INFO] Updating data files..."

git checkout master
if [ $? eq 0 ]; then
  echo "[ERROR] Failed to check out master branch."
  exit -1
fi

git pull origin master
if [ $? eq 0 ]; then
  echo "[ERROR] Failed to git pull latest source code."
  exit -1
fi

node ./update.js
if [ $? eq 0 ]; then
  echo "[ERROR] Failed to update ND schedule."
  exit -1
fi

if [ -z "$(git status --porcelain)" ]; then 
  echo "[INFO] No updated data files detected."
else 
  echo "[INFO] Detected updated data files..."

  git add .
  if [ $? eq 0 ]; then
    echo "[ERROR] Failed to git add files."
    exit -1
  fi

  git commit -m "[CRON] Automatically updated data files"
  if [ $? eq 0 ]; then
    echo "[ERROR] Failed to git commit files."
    exit -1
  fi

  git push origin master
  if [ $? eq 0 ]; then
    echo "[ERROR] Failed to git push files."
    exit -1
  fi

  echo "[INFO] Succcessfully pushed updated data files."
fi
