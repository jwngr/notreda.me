import {TVNetwork} from '../../../website/src/models/games.models';
import {CURRENT_SEASON} from '../../lib/constants';
import {ExtendedGameInfo} from '../../models';
import type {AssertFn} from './types';

const EXPECTED_TV_CHANNELS: TVNetwork[] = [
  TVNetwork.ABC,
  TVNetwork.ACCN,
  TVNetwork.CBS,
  TVNetwork.CBSSN,
  TVNetwork.CSTV,
  TVNetwork.ESPN,
  TVNetwork.ESPN2,
  TVNetwork.FOX,
  TVNetwork.KATZ,
  TVNetwork.NBC,
  TVNetwork.NBCSN,
  TVNetwork.Pac12Network,
  TVNetwork.Peacock,
  TVNetwork.RAYCOM,
  TVNetwork.SportsChannel,
  TVNetwork.TBS,
  TVNetwork.USA,
  TVNetwork.WGN_TV,
];

export function validateCoverage({season, coverage}: ExtendedGameInfo, assert: AssertFn): void {
  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {coverage});
  };

  if (season === CURRENT_SEASON) {
    // Current season game.
    wrappedAssert(
      typeof coverage === 'undefined' ||
        coverage.every((network) => EXPECTED_TV_CHANNELS.includes(network)),
      'Current season game has unexpected coverage value.'
    );
  } else if (season < CURRENT_SEASON) {
    // Previous season game.
    wrappedAssert(
      typeof coverage === 'undefined' ||
        coverage.every((network) => EXPECTED_TV_CHANNELS.includes(network)),
      'Previous season game has unexpected coverage value.'
    );
  } else {
    // Future season game.
    wrappedAssert(
      typeof coverage === 'undefined' ||
        coverage.every((network) => EXPECTED_TV_CHANNELS.includes(network)),
      'Future season game has unexpected coverage value.'
    );
  }
}
