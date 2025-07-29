import {TVNetwork} from '../../website/src/models/games.models';
import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';

const logger = new Logger({isSentryEnabled: false});

logger.info('Transforming schedule data...');

NDSchedules.transformForAllSeasons((gameData) => {
  // Transform coverage from string to array
  if (gameData.coverage && typeof gameData.coverage === 'string' && gameData.coverage !== 'TBD') {
    // Split on '/' and trim each network
    const coverageString = gameData.coverage as string;
    const networks = coverageString.split('/').map((network: string) => network.trim());

    // Convert to TVNetwork enum values
    const tvNetworks: TVNetwork[] = networks.map((network: string) => {
      switch (network) {
        case 'ABC':
          return TVNetwork.ABC;
        case 'ACCN':
          return TVNetwork.ACCN;
        case 'CBS':
          return TVNetwork.CBS;
        case 'CBSSN':
          return TVNetwork.CBSSN;
        case 'CSTV':
          return TVNetwork.CSTV;
        case 'ESPN':
          return TVNetwork.ESPN;
        case 'ESPN2':
          return TVNetwork.ESPN2;
        case 'FOX':
          return TVNetwork.FOX;
        case 'KATZ':
          return TVNetwork.KATZ;
        case 'NBC':
          return TVNetwork.NBC;
        case 'NBCSN':
          return TVNetwork.NBCSN;
        case 'PACN':
          return TVNetwork.Pac12Network;
        case 'PEACOCK':
          return TVNetwork.Peacock;
        case 'TBS':
          return TVNetwork.TBS;
        case 'USA':
          return TVNetwork.USA;
        case 'SPORTSCHANNEL':
          return TVNetwork.SportsChannel;
        case 'WGN-TV':
          return TVNetwork.WGN_TV;
        case 'RAYCOM':
          return TVNetwork.WGN_TV; // Map RAYCOM to WGN_TV since RAYCOM_WGN was removed
        default:
          logger.info(`Unknown TV network: ${network}`);
          return TVNetwork.Unknown;
      }
    });

    return {...gameData, coverage: tvNetworks};
  }

  return gameData;
});

logger.success('Schedule data transformed!');
