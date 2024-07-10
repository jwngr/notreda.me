import React from 'react';
import {Route, Routes} from 'react-router-dom';

import {Explorables} from '../components/explorables/Explorables';
import {ExplorablesS1E1} from '../components/explorables/season1/episode1/Season1Episode1';
import {ExplorablesS1E2} from '../components/explorables/season1/episode2/Season1Episode2';

export const ExplorablesScreen = () => {
  return (
    <Routes>
      <Route path="s1e1-down-to-the-wire" element={<ExplorablesS1E1 />} />
      <Route path="s1e2-chasing-perfection" element={<ExplorablesS1E2 />} />
      <Route path="/" element={<Explorables />} />
    </Routes>
  );
};
