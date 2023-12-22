import { app } from "./index";
const BASE_URL = "http://localhost:3000";
import '../database/db.setup';
import mongoose, { mongo } from "mongoose";
import { test } from "bun:test";

// So im not really sure why my test suite works inconsistently 
// Use the following patterns to do create, read, update, delete operations

//==================================================
// Clubs
//==================================================

const createClub = async () => {
    const newClub = {
        presidentEmail: testClubData.presidentEmail,
        treasurerEmail: testClubData.treasurerEmail,
        clubName: testClubData.clubName,
        clubCode: testClubData.clubCode,
    }
    
    const req = new Request(`${BASE_URL}/clubs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClub),
    });
    
    const response = await app.fetch(req);
    const data = await response.text();
    const club = JSON.parse(data);
    return club;
}

const readClub = async (clubCode: string) => {
    const req = new Request(`${BASE_URL}/clubs/${clubCode}`, {
        method: 'GET',
    });
    
    const response = await app.fetch(req);
    const data = await response.text();
    const club = JSON.parse(data);
    return club;
}

const updateClub = async (clubCode: string, updatedClubData: any) => {
    const updateReq = new Request(`${BASE_URL}/clubs/${clubCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClubData),
    });
    const response = await app.fetch(updateReq);
    const data = await response.text();
    const club = JSON.parse(data);
    return club;
}

//==================================================
// Allocation Requests
//==================================================

const createAllocationRequest = async (clubCode: string, allocationRequest: any) => {
    const req = new Request(`${BASE_URL}/allocation-requests/${clubCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocationRequest),
    });
    const response = await app.fetch(req);
    const data = await response.text();
    const request = JSON.parse(data);
    return request;

}

const readAllocationRequests = async (clubCode: string) => {
    const req = new Request(`${BASE_URL}/allocation-requests/${clubCode}`, {
        method: 'GET',
    });
    const response = await app.fetch(req);
    const data = await response.text();
    const requests = JSON.parse(data);
    return requests;
};

const updateAllocationRequest = async (clubCode: string, allocationRequest: any) => {
    const req = new Request(`${BASE_URL}/allocation-requests/${clubCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocationRequest),
    });
    const response = await app.fetch(req);
    const data = await response.text();
    const request = JSON.parse(data);
    return request;
};


//==================================================
// Clubs
//==================================================

const testClubData = {
    presidentEmail: "student@swarthmore.edu",
    treasurerEmail: "treasurer@swarthmore.edu",
    clubName: "SBC Test Club",
    clubCode: "TEST",
};

const updateClubData = {
    presidentEmail: "dildomaster@swat.edu",
    treasurerEmail: "",
    clubName: "",
    clubCode: "",
};

//==================================================
// Allocation Requests
//==================================================

const newAllocationRequest = {
    period: "S2024",
    status: "pending",
    requestItems: []
}


const updatedAllocationRequest2 = {
}


//==================================================
// Play
//==================================================

// let clubcreate = await createClub();
// console.log("Creating club:");
// console.log(clubcreate);

    const requestcreate = await createAllocationRequest(testClubData.clubCode, newAllocationRequest);
    console.log("Creating allocation request:");
    console.log(requestcreate);
    // const requestsread = await readAllocationRequests(testClubData.clubCode);
    // console.log("Reading allocation requests:");
    // console.log(requestsread);

// let clubread = await readClub(testClubData.clubCode);
// console.log("Reading club:");
// console.log(clubread);
// let clubupdate = await updateClub(testClubData.clubCode, updateClubData);
// console.log("Updating club:");
// console.log(clubupdate);

//==================================================
// Cleanup
//==================================================

mongoose.disconnect();