import React from 'react';
import UsernameInput from '../components/inputs/UsernameInput';
import RoomInput from '../components/inputs/RoomInput';
import { withGlobalCssPriority } from './GlobalCssPriority';
import RoomList from '../components/lists/RoomList';

const App = () => (
  <div className="flex flex-row">
    <div className="flex flex-col gap-y-2 w-96">
      <UsernameInput />
      <RoomInput />
      <RoomList />
    </div>
    <div>Board placeholder</div>
  </div>
);

export default withGlobalCssPriority(App);
