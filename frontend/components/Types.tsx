export interface AllocationRequestItem {
    price: number;
    quantity: number;
    itemName: string;
    links: string[];
    allocatedAmount: number;
    subcode: string;
  }
  
export interface AllocationRequest {
  period: string;
  status: string;
  requestItems: AllocationRequestItem[];
}

export interface ClubData {
  presidentEmail: string;
  treasurerEmail: string;
  clubName: string;
  clubCode: string;
  allocationRequests: AllocationRequest[];
}

export const subcodes = [
  "6999: STUDENT WAGES",
  "7011: SUPPLIES",
  "7014: PRINTING",
  "7027: MEMBERSHIPS/DUES",
  "7201: TRANSPORTATION",
  "7202: LODGING",
  "7204: REGISTRATIONS",
  "7302: HONORARIUM/LECTURERS",
  "7310: FOOD/CATERING, ETC",
  "7401: EQUIPMENT",
  "7451: SOFTWARE",
  "7452: HARDWARE",
];