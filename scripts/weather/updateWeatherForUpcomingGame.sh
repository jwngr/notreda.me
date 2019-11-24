#!/bin/bash

set -e

echo "[INFO] Updating weather for upcoming game..."

if [ "$(uname -s)" != "Linux" ]; then
  echo "[ERROR] This script is only intended to be on the production server."
  exit -1
fi

if [ "$(git symbolic-ref --short -q HEAD)" != "master" ]; then
  echo "[ERROR] This script must be run on the master branch."
  exit -1
fi

git pull origin master
if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to git pull latest source code."
  exit -1
fi

node ./updateWeatherForUpcomingGame.js
if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to update weather for upcoming game."
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

  git commit -m "[CRON] Automatically updated weather for upcoming game"
  if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to git commit files."
    exit -1
  fi

  git push origin master
  if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to git push files."
    exit -1
  fi

  echo "[INFO] Succcessfully pushed updated data files."
fi
