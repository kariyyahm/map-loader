import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import Guide from './components/Guide';
import Map from './components/Map';


const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        {/*<Guide />*/}
        <Map />
      </Cell>
    </ResponsiveGrid>
  );
};

export default Dashboard;
