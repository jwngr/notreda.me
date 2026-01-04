import {useParams} from '@tanstack/react-router';
import React from 'react';

import {Explorables} from '../components/explorables/Explorables';
import {ExplorablesS1E1} from '../components/explorables/season1/episode1/Season1Episode1';
import {ExplorablesS1E2} from '../components/explorables/season1/episode2/Season1Episode2';

export const ExplorablesScreen: React.FC = () => {
  const params = useParams({strict: false});

  if (params.slug === 's1e1-down-to-the-wire') {
    return <ExplorablesS1E1 />;
  }

  if (params.slug === 's1e2-chasing-perfection') {
    return <ExplorablesS1E2 />;
  }

  return <Explorables />;
};
