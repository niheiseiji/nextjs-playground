// pages/tableForm/index.tsx
import React from 'react';
import { NextPage } from 'next';
import { WorkhoursSample } from '../../components/reactGrid/sampleSrc/WorkhoursSample';

const ReactGridPage: NextPage = () => {
  return (
    <div>
      <h1>reactGrid実装例</h1>
      <WorkhoursSample />
    </div>
  );
};

export default ReactGridPage;