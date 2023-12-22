import { app } from "../src/index";
import mongoose from "mongoose";
const BASE_URL = "http://localhost:3000";
import { afterAll, describe, expect, it } from "bun:test";

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


describe('Allocation Request CRUD Operations', () => {
    afterAll(() => {
        mongoose.disconnect();
    })

    it('should get allocation requests', async () => {
        const req = new Request(`${BASE_URL}/allocation-requests/${testClubData.clubCode}`, {
            method: 'GET',
        });
        
        const response = await app.fetch(req);
        const data = await response.text();
        const requests = JSON.parse(data);
        expect(requests).toHaveLength(1);
    });
});