import {TVNetwork} from '../../../website/src/models/games.models';
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

export function validateCoverage({coverage}: ExtendedGameInfo, assert: AssertFn): void {
  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {coverage});
  };

  wrappedAssert(
    typeof coverage === 'undefined' ||
      coverage.every((network) => EXPECTED_TV_CHANNELS.includes(network)),
    'Game has unexpected coverage value.'
  );
}
