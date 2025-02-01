#!/bin/bash

set -e

echo "[INFO] Updating data files..."

if [ "$(uname -s)" != "Linux" ]; then
  echo "[ERROR] This script is only intended to be on the production server."
  exit -1
fi

if [ "$(git symbolic-ref --short -q HEAD)" != "main" ]; then
  echo "[ERROR] This script must be run on the main branch."
  exit -1
fi

git pull origin main
if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to git pull latest source code."
  exit -1
fi

node ./update.js
if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to update ND schedule."
  exit -1
fi

node ./validate.js
if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to validate updated ND schedule."
  exit -1
fi

if [ -z "$(git status --porcelain)" ]; then
  echo "[INFO] No updated data files detected."
else
  echo "[INFO] Detected updated data files..."

  git add -A
  if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to git add files."
    exit -1
  fi

  git commit -m "[CRON] Automatically updated data files"
  if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to git commit files."
    exit -1
  fi

  git push origin main
  if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to git push files."
    exit -1
  fi

  echo "[INFO] Succcessfully pushed updated data files."
fi
