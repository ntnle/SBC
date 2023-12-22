import { describe, expect, it, beforeEach, afterAll } from 'bun:test';
import { app } from '../src/index';
import mongoose from 'mongoose';
const BASE_URL = 'http://localhost:3000';

// Mock Data
const testClubData = {
  presidentEmail: "president@club.com",
  treasurerEmail: "treasurer@club.com",
  clubName: "Photography Club",
  clubCode: "PHOTO_01",
  allocationRequests: [
    {
      period: "W2024",
      status: "pending",
      requestItems: [
        {
          price: 100.00,
          quantity: 2,
          itemName: "Camera",
          description: "Professional DSLR Camera",
          links: ["http://example.com/camera"],
          allocatedAmount: 0,
          subcode: "CAM_01"
        }
      ]
    }
  ]
};

describe('Club CRUD Operations', () => {
  afterAll(() => {
    mongoose.disconnect();
  })

  it('should create a club', async () => {
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
  
    expect(club.presidentEmail).toBe(newClub.presidentEmail);
    expect(club.treasurerEmail).toBe(newClub.treasurerEmail);
    expect(club.clubName).toBe(newClub.clubName);
    expect(club.clubCode).toBe(newClub.clubCode);
    expect(club).toHaveProperty('_id');
  });

  it('should read a club', async () => {
    const req = new Request(`${BASE_URL}/clubs/${testClubData.clubCode}`, {
      method: 'GET',
    });
  
    const response = await app.fetch(req);
    const data = await response.text();
    const club = JSON.parse(data);
  
    expect(club.presidentEmail).toBe(testClubData.presidentEmail);
    expect(club.treasurerEmail).toBe(testClubData.treasurerEmail);
    expect(club.clubName).toBe(testClubData.clubName);
    expect(club.clubCode).toBe(testClubData.clubCode);
  });

  it('should update a club', async () => {
    const updatedClubData = {
      presidentEmail: "new_president@club.com",
      treasurerEmail: "new_treasurer@club.com",
      clubName: "New Photography Club",
      clubCode: testClubData.clubCode,
    };
  
    const updateReq = new Request(`${BASE_URL}/clubs/${testClubData.clubCode}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClubData),
    });
  
    await app.fetch(updateReq);
  
    // Verify updated data
    const verifyReq = new Request(`${BASE_URL}/clubs/${testClubData.clubCode}`, {
      method: 'GET',
    });
  
    const verifyResponse = await app.fetch(verifyReq);
    const verifyData = await verifyResponse.text();
    const updatedClub = JSON.parse(verifyData);
  
    expect(updatedClub.presidentEmail).toBe(updatedClubData.presidentEmail);
    expect(updatedClub.treasurerEmail).toBe(updatedClubData.treasurerEmail);
    expect(updatedClub.clubName).toBe(updatedClubData.clubName);
  });
  

  it('should delete a club', async () => {
    const deleteReq = new Request(`${BASE_URL}/clubs/${testClubData.clubCode}`, {
      method: 'DELETE',
    });
  
    await app.fetch(deleteReq);
  
    // Verify deletion
    const verifyReq = new Request(`${BASE_URL}/clubs/${testClubData.clubCode}`, {
      method: 'GET',
    });
  
    const verifyResponse = await app.fetch(verifyReq);
    expect(verifyResponse.status).toBe(404); // Assuming your API returns 404 for not found
  });
});