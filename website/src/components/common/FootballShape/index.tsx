import React from 'react';

import {GameResult} from '../../../models';
import {FootballShapeSvg, Leg, Text} from './index.styles';

export const FootballShape: React.FC<{
  readonly type: 'past' | 'future';
  readonly text?: string;
  readonly title: string;
  readonly gameResult: GameResult | null;
  readonly legs?: {
    readonly left?: string | boolean;
    readonly right?: string | boolean;
  };
  readonly isHomeGame: boolean;
  readonly isSelected: boolean;
  readonly uniqueFillPatternId: string;
}> = ({type, text, title, gameResult, legs = {}, isHomeGame, isSelected, uniqueFillPatternId}) => {
  let leftLeg;
  if (legs.left) {
    leftLeg = <Leg type="left">{legs.left === 'gap' ? <div>&nbsp;</div> : <>&nbsp;</>}</Leg>;
  }

  let rightLeg;
  if (legs.right) {
    rightLeg = <Leg type="right">{legs.right === 'gap' ? <div>&nbsp;</div> : <>&nbsp;</>}</Leg>;
  }

  return (
    <>
      {/* <svg viewBox="0 0 500 500">
        <path id="curve" d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97" />
        <text width="40">
          <textPath xlinkHref="#curve">TESTING</textPath>
        </text>
      </svg> */}
      <FootballShapeSvg
        width="60"
        height="40"
        viewBox="-1 -1 55 32"
        type={type}
        gameResult={gameResult}
        isHomeGame={isHomeGame}
        isSelected={isSelected}
      >
        <title>{title}</title>
        <path
          className="football"
          fill={`url(#fill-pattern-${uniqueFillPatternId})`}
          d="M24.3585167,0.063430208 C35.1119935,-0.6284714 46.6072293,4.36977614 52.597914,13.6040857 C54.7297115,16.8900946 47.7985071,22.2410883 45.5381744,23.9389606 C40.8288076,27.476048 35.0715102,29.4979341 29.2104611,29.9219608 C18.5877272,30.6905583 5.76969773,25.7610451 0.275655548,16.0523187 C-1.54345102,12.8377005 6.1544002,7.27463607 8.34504921,5.68440188 C13.0321845,2.281693 18.5929238,0.434412586 24.3585166,0.0634300975"
        ></path>
        {type === 'future' && (
          <g className="laces" transform="translate(14, 11)">
            <line x1="-6.9388939e-16" y1="4" x2="26" y2="4"></line>
            <line x1="3" y1="8" x2="3" y2="4.4408921e-16"></line>
            <line x1="8" y1="8" x2="8" y2="4.4408921e-16"></line>
            <line x1="13" y1="8" x2="13" y2="4.4408921e-16"></line>
            <line x1="18" y1="8" x2="18" y2="4.4408921e-16"></line>
            <line x1="23" y1="8" x2="23" y2="4.4408921e-16"></line>
          </g>
        )}
        <defs>
          <pattern
            id={`fill-pattern-${uniqueFillPatternId}`}
            className="pattern"
            width="3"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45 50 50)"
          >
            <rect width="10" height="10" />
            <line y2="10" />
          </pattern>
        </defs>
      </FootballShapeSvg>
      {text && (
        <Text gameResult={gameResult} isSelected={isSelected}>
          {text}
        </Text>
      )}
      {leftLeg}
      {rightLeg}
    </>
  );
};
