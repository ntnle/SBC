import React, { useContext } from 'react';
import { ClubDataContext } from '../ClubDataContext';

const Sidebar = () => {
  const clubData = useContext(ClubDataContext);
  const requests = clubData?.allocationRequests; 

  return (
    <div>
      <h2>Sidebar Content</h2>
      {requests?.map((request, index) => (
        <div key={index}>
          {request.period}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
