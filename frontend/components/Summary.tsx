import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';

interface RequestItem {
    itemName: string;
    quantity: number;
    price: number;
    allocatedAmount: number;
    subcode: string; // Assuming subcode is part of RequestItem
}

interface SummaryProps {
    requestItems: RequestItem[];
}

interface SummaryTableProps {
    requestItems: RequestItem[];
}

// Header Component
const TableHeader = () => (
    <TableHead>
        <TableRow>
            <TableCell>Subcode #</TableCell>
            <TableCell>Subcode Name</TableCell>
            <TableCell>Total</TableCell>
        </TableRow>
    </TableHead>
);

// Individual Row Component
const TableRowComponent = ({ row }) => (
	<TableRow key={row.id}>
		<TableCell>{row.subcode}</TableCell>
		<TableCell>{row.subcodeName}</TableCell>
		<TableCell>${row.total}</TableCell>
	</TableRow>
);

// Total Row Component
const TotalRow = ({ rows }) => {
const total = rows.reduce((acc, row) => acc + row.total, 0);
	return (
		<TableRow>
		<TableCell colSpan={2} align="right">Total:</TableCell>
		<TableCell>${total}</TableCell>
		</TableRow>
	);
};
const computeRows = (requestItems) => {
    const rows = {};
    requestItems.forEach(item => {
        if (!rows[item.subcode]) {
            rows[item.subcode] = { subcode: item.subcode.split(": ")[0], subcodeName: item.subcode.split(": ")[1], total: 0 };
        }
        rows[item.subcode].total += item.price * item.quantity;
    });
    return Object.values(rows);
};

const SummaryTable: React.FC<{ rows: any[] }> = ({ rows }) => (
    <Table size="small">
        <TableHeader />
        <TableBody>
            {rows.map((row, index) => <TableRowComponent row={row} key={index} />)}
            <TotalRow rows={rows} />
        </TableBody>
    </Table>
);

const Summary: React.FC<SummaryProps> = ({ requestItems }) => {
    const rows = computeRows(requestItems || []);
    
    return (
        <div>
            <h3>Summary</h3>
            <SummaryTable rows={rows} />
        </div>
    );
}

export default Summary;