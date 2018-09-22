#!/bin/bash

for NUM in `seq 1 569`;
do
  echo $NUM
  wget "http://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/$NUM.png&h=80&w=80" -O "teamLogos/$NUM.png"
done


