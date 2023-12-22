/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { Button } from '@mui/material';
import { ClubDataContext } from '../ClubDataContext';
import RequestItemList from './RequestItemList';
import NewItemForm from './NewItemForm';
import Summary from './Summary';
import { useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000' || 'https://sbc-ctbe6evi.b4a.run'

const AllocationForm = () => {
  const clubData = useContext(ClubDataContext);
  const [currentRequest, setCurrentRequest] = useState(clubData?.allocationRequests[clubData?.allocationRequests.length - 1]);
  const [requestItems, setRequestItems] = useState(currentRequest?.requestItems);
  const status = currentRequest?.status;
  const { admin } = useParams<{ admin: string }>();

  const [newItemData, setNewItemData] = useState({ itemName: '', quantity: 0, price: 0, description: '', links: '', subcode: '' });

  useEffect(() => {
    const latestRequest = clubData?.allocationRequests[clubData?.allocationRequests.length - 1];
    setCurrentRequest(latestRequest);
    setRequestItems(latestRequest?.requestItems);
  }, [clubData]);

  const handleNewItemChange = (data: any) => {
    setNewItemData(data);
  };

  const handleDeleteItem = (itemName: string) => {
    const updatedItems = requestItems?.filter((item) => item.itemName !== itemName);
    setRequestItems(updatedItems);
  };

  // TODO itemNames must be unique
  const handleAddItem = () => {
    // itemNames must be unique
    if (requestItems?.some((item) => item.itemName === newItemData.itemName)) {
      alert("Item name must be unique!");
      return;
    }

    const newItem = {
      price: parseFloat(newItemData.price),
      quantity: parseFloat(newItemData.quantity),
      itemName: newItemData.itemName,
      description: newItemData.description,
      links: newItemData.links ? newItemData.links.split('\n') : [],
      allocatedAmount: 0,
      status: status === "pending" ? "reviewed" : "finalized",
      subcode: newItemData.subcode,
    };

    const updatedRequestItems = [...(requestItems ?? []), newItem];
    setRequestItems(updatedRequestItems);
  };
  
    const handleSubmitRequest = async () => {
      const newAllocationRequest = {
        period: currentRequest?.period,
        status: status === "pending" ? "reviewed" : "finalized",
        requestItems: requestItems?.map((item) => ({ ...item, allocatedAmount: status === "pending" ? 0 : parseFloat(item.allocatedAmount) })),
      }    
  
      console.log(newAllocationRequest)
      try {
        const response = await axios.patch(`${BASE_URL}/allocation-requests/${clubData?.clubCode}`, newAllocationRequest);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
      
      // To refetch data
      window.location.reload();
    };
  
    const handleAllocationChange = (newValue: number | string, index: number, name: string) => {
      const updatedItems = [...requestItems || []];
      updatedItems[index] = { ...updatedItems[index], [name]: newValue};
      setRequestItems(updatedItems);
    }; 

    const handleReturnToEdit = async () => {
      const newAllocationRequest = {
        period: currentRequest?.period,
        status: "pending",
        requestItems: requestItems,
      }    
  
      console.log(newAllocationRequest)
      try {
        const response = await axios.patch(`${BASE_URL}/allocation-requests/${clubData?.clubCode}`, newAllocationRequest);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
  
      window.location.reload();
    };
    
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>{clubData?.clubName}
              <p>Period: { currentRequest?.period }</p>
              <p>Status: { currentRequest?.status }</p>
              <Summary requestItems={requestItems || []} /> 
            </h1>
            <h2 style={{ textAlign: 'center' }}>Allocation Form</h2>
            <div>
              <h3>Requested Items:</h3>
              <RequestItemList 
                items={requestItems ?? []} 
                onAllocationChange={handleAllocationChange} 
                onDeleteItem={handleDeleteItem} 
                isAllocationEditable={status === "reviewed" || admin === "sbcbaddies" }
                admin={admin === "sbcbaddies"}
                status={status || ""}
              />
            </div>
            {status === "pending" && !admin && <NewItemForm onAddItem={handleAddItem} onNewItemChange={handleNewItemChange}/>}

            {status === "finalized" && (
                <div style={{ marginTop: '20px' }}>
                    Allocated Amount: ${requestItems?.reduce((acc, item) => acc + parseFloat(item.allocatedAmount), 0)}
                </div>
            )}
            {status === "reviewed" && (
                <div style={{ marginTop: '20px' }}>
                    Awaiting SBC allocation.
                </div>
            )}
            {/* TODO clean up admin view */}
            {admin === "sbcbaddies" && (
              <Button variant="contained" color="primary" onClick={handleReturnToEdit} style={{ marginTop: '20px' }}>
                Return to Edit
              </Button>
            )}
            {(status === "pending" || (status === "reviewed" && admin)) && (
              <Button variant="contained" color="primary" onClick={handleSubmitRequest} style={{ marginTop: '20px' }}>
                Submit Request
              </Button>
            )}
        </div>
    );
};
  
  

export default AllocationForm;
