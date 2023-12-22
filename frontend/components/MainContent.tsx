import React, { useContext } from 'react';
import AllocationForm from './AllocationForm';
import { ClubDataContext } from '../ClubDataContext';

const MainContent = () => {
    const clubData = useContext(ClubDataContext);
    // Current request is the last request in the array of allocation requests
  
    return (
      <div>
        {/* Render your main content here */}
        <h2>Main Content</h2>
        <div>Club Name: {clubData?.clubName}</div>
        <div>President Email: {clubData?.presidentEmail}</div>
        <div>Treasurer Email: {clubData?.treasurerEmail}</div>
        <AllocationForm />
      </div>
    );
  };

export default MainContent;
