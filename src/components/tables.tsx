import React from 'react';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { useAtom } from "jotai";
import { checkboxSelectedAtom } from '../states/table';

export default function DataTable({ columns, rows }) {
    const [, setCheckboxSelected] = useAtom(checkboxSelectedAtom)

    const selectChangeHandle = (newSelectionModel: GridRowSelectionModel) => {
        // console.log('Selected rows:', newSelectionModel);
        setCheckboxSelected(newSelectionModel)
    }


    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={selectChangeHandle}
                getRowId={(row) => row.Id}
            />
        </div>
    );
}