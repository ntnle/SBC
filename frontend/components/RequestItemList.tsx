import React, { useContext } from 'react';
import { ClubDataContext } from '../ClubDataContext';
import CurrencyInput from 'react-currency-input-field';
import { TextField } from '@mui/material';

interface RequestItem {
  itemName: string;
  quantity: number;
  price: number;
  description: string;
  links: string[];
  allocatedAmount: number;
  status: string;
  subcode: string;

}

interface RequestItemListProps {
  items: RequestItem[];
  onAllocationChange: (value: number, index: number, name: string) => void;
  onDeleteItem: (itemName: string) => void;
  isAllocationEditable: boolean;
  status: string;
  admin: boolean;
}

const RequestItemList: React.FC<RequestItemListProps> = ({ items, onAllocationChange, onDeleteItem, isAllocationEditable, status, admin }) => {
  // Sorting items alphabetically based on itemName
  const sortedItems = items.sort((a, b) => a.itemName.localeCompare(b.itemName));

  const handleAllocationChange = (value: number, index: number) => {
    onAllocationChange?.(value, index, 'allocatedAmount');
  };
  
  const handleNotesChange = (value: string, index: number) => {
    const newDescription = items[index].description.split("\nNOTES:\n")[0] + "\nNOTES:\n" + value;
    value = newDescription;
    
    console.log(value);
    onAllocationChange?.(value, index, 'description');
  }

  const getNotes = (description: string) => {
    if (description.split("\nNOTES:\n").length > 1) {
      return description.split("\nNOTES:\n")[1];
    }
    return "";
  }

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {sortedItems.map((item, index) => (
        <div>
        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
          <div style={{ flex: 1 }}>
            <div>
              {/* Item name now bold for that extra zing! */}
              - <strong>{item.itemName}</strong> -- ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </div>
            {item.description && (
              <div style={{ paddingLeft: '20px' }}>
                <p> - {item.description.split("\nNOTES:\n")[0]} </p>
                {item.description.split("\nNOTES:\n")[1] && (
                  <>
                  <pre>SBC Notes:</pre>
                  <pre>{item.description.split("\nNOTES:\n")[1]}</pre>
                  </>
                )}
              </div>
            )}
            {item.links && item.links.map((link, linkIndex) => (
              <div key={linkIndex} style={{ paddingLeft: '20px' }}>
                - <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
              </div>
            ))}
          </div>

          { status === "pending" && (
            <>
              <div style={{ marginRight: '10px' }}>
                <small>{item.subcode.split(": ")[1]}</small>
              </div>
              <button onClick={() => onDeleteItem(item.itemName)} style={{ marginRight: '10px' }}>Delete</button>
            </>
          )}

          {status !== "pending" && (
            <div style={{ marginRight: '10px' }}>
              Allocated amount: <strong>${item.allocatedAmount}</strong>
            </div>
          )}

          {isAllocationEditable && admin && (
            <CurrencyInput
              id="allocatedAmount"
              name="allocatedAmount"
              decimalScale={2}
              decimalsLimit={2}
              value={item.allocatedAmount} 
              onValueChange={(value, name) => handleAllocationChange(value, index, name)} 
              style={{ marginLeft: '10px' }} 
            />
          )}
        </li>
          {isAllocationEditable && admin && (
          <TextField 
            label='notes'
            name='notes'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            sx={{
              width: '100%',
              overflow: 'auto',
            }}
            margin='normal'
            onChange={(e) => handleNotesChange(e.target.value, index)}
            value={getNotes(item.description)}
          />
          )}
        </div>
      ))}
    </ul>
  );
};

export default RequestItemList;