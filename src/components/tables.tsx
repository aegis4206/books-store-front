import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { useAtom } from "jotai";
import { checkboxSelectedAtom } from '../states/table';

export default function DataTable({ columns, rows, checkbox = true }) {
    const [checkboxSelected, setCheckboxSelected] = useAtom(checkboxSelectedAtom)

    const selectChangeHandle = (newSelectionModel: GridRowSelectionModel) => {
        // console.log('Selected rows:', newSelectionModel);
        if (checkbox) setCheckboxSelected(newSelectionModel);
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
                checkboxSelection={checkbox}
                onRowSelectionModelChange={selectChangeHandle}
                rowSelectionModel={checkboxSelected}
                getRowId={(row) => row.Id || row.CartItemId || row.OrderId}
                localeText={{
                    noRowsLabel: "尚未添加圖書"
                }}
            />
        </div >
    );
}