import { utils, writeFileXLSX } from "xlsx";

export const handleExportToExcel = async (data: any[], name?:string) =>{
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();

    utils.book_append_sheet(wb, ws, 'data');

    writeFileXLSX(wb, `${name?? `kanban-data-${Date.now()}`}.xlsx`)

};