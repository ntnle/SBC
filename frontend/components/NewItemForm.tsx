import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, FormControl, InputLabel, Select, Tooltip } from '@mui/material';
import { subcodes } from './Types';
import CurrencyInput from 'react-currency-input-field';

interface NewItemFormProps {
  onAddItem: (data: ItemData) => void;
  onNewItemChange: (data: ItemData) => void;
}

type ItemData = {
  itemName: string;
  quantity: number;
  price: number;
  description: string;
  links: string;
  subcode: string;
};

const NewItemForm: React.FC<NewItemFormProps> = ({ onAddItem, onNewItemChange }) => {
  const [subcode, setSubcode] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const defaultItemData = {
    itemName: '',
    quantity: 0,
    price: 0,
    description: '',
    links: '',
    subcode: '',
  };

  const [itemData, setItemData] = useState(defaultItemData);

  // Validation logic for each field
  const validateField = (name: string, value: any): boolean => {
    switch (name) {
      case 'itemName':
        return /^[a-zA-Z0-9 \-,.]+$/.test(value) && value.length <= 100;
      case 'quantity':
        return value > 0 && value <= 999;
      case 'price':
        return value > 0 && value <= 99999;
      case 'description':
        return value.length > 0;
      // Optional field
      case 'links':
        return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value) || value === '';
      default:
        return true;
    }
  };

  const handleAddItem = () => {
    onAddItem({...itemData, subcode: subcode});
    setItemData(defaultItemData);
    setSubcode('');
    setIsFormValid(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    if (!value && name === "quantity") {
      value = 0;
    }

    const updatedItemData = { ...itemData, [name]: value };
    setItemData(updatedItemData);
    onNewItemChange(updatedItemData);
  };

  const handleSubcodeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSubcode = event.target.value as string;
    setSubcode(newSubcode);
    setItemData({ ...defaultItemData, subcode: newSubcode });
    setIsFormValid(false);
  };

  const checkFormValidity = (data: any) => {
    setIsFormValid(
      validateField('itemName', data.itemName) &&
      validateField('quantity', data.quantity) &&
      validateField('price', data.price) &&
      validateField('description', data.description) &&
      validateField('links', data.links) &&
      subcode !== ''
    );
  };

  useEffect(() => {
    checkFormValidity(itemData);
  }, [itemData, subcode]);

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Add New Item:</h3>
      <div>
        <FormControl fullWidth margin="normal">
          <InputLabel id="subcode-label">Subcode</InputLabel>
          <Select
            labelId="subcode-label"
            value={subcode}
            onChange={handleSubcodeChange}
            label="Subcode"
          >
            {subcodes.map((code, index) => (
              <MenuItem key={index} value={code}>{code}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {subcode && (
          <>
            <Tooltip title="Enter a name for the requested item">
              <TextField
                label="Item Name"
                name="itemName"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleInputChange}
                value={itemData.itemName}
              />
            </Tooltip>
            <Tooltip title="Enter one or more">
              <div>
              <p>Quantity:</p>
              <CurrencyInput 
                id="quantity"
                name="quantity"
                placeholder="Quantity"
                value={itemData.quantity || ''}
                decimalsLimit={2}
                onValueChange={(value, name) => handleInputChange({ target: { name, value } })}
              />
              </div>
            </Tooltip>
            <Tooltip title="Enter price per item">
              <div>
              <p>Price:</p>
              <CurrencyInput
                id="price"
                name="price"
                placeholder="Price"
                value={itemData.price || ''}
                prefix={'$'}
                decimalScale={2}
                onValueChange={(value, name) => handleInputChange({ target: { name, value } })}
              />
              </div>
            </Tooltip>
            <Tooltip title="Please describe the purpose of the requested item.">
              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleInputChange}
                value={itemData.description}
              />
            </Tooltip>
            <Tooltip title="Enter valid URL">
              <TextField
                label="Links"
                name="links"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleInputChange}
                value={itemData.links}
              />
            </Tooltip>

            <Button
              variant="contained"
              onClick={handleAddItem}
              style={{ margin: '10px 0' }}
              disabled={!isFormValid}
            >
              Add Item
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NewItemForm;
