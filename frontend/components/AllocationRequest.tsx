import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { ClubDataContext } from '../ClubDataContext';
const BASE_URL = 'https://sbc-ctbe6evi.b4a.run'

const AllocationRequest = () => {
    const { clubCode } = useParams();
    const [clubData, setClubData] = useState(null);
  
    useEffect(() => {
      const getClubData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/clubs/${clubCode}`);
          setClubData(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      getClubData();
    }, [clubCode]);
  
    return (
      <ClubDataContext.Provider value={clubData}>
        <div>
          <h1>Club Code: {clubCode}</h1>
          <Sidebar /> {/* Sidebar component */}
          <MainContent /> {/* Main content component */}
        </div>
      </ClubDataContext.Provider>
    );
  }
  
export default AllocationRequest;
