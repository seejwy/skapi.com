import { ref } from 'vue';
import { skapi } from '@/main';
export const tableList = [];
export const recordTables = ref(null);

export async function refreshTables(serviceId, fetchLimit=50) {
    // initial table fetch

    recordTables.value = null;
    let t = await skapi.getTable({ service: serviceId }, { limit: fetchLimit })

    recordTables.value = {
        endOfList: t.endOfList,
        list: t.list.map(m => {
            m.opened = false;
            m.records = ref(null);

            skapi.getRecords({
                service: serviceId,
                table: m.table
            }, { limit: 50 }).then(r => m.records.value = r);

            if (!tableList.includes(m.table)) {
                tableList.push = m.table;
            }

            return m;
        }),
        params: {
            service: serviceId,
            table: t.table
        }
    };
}

// fetch more table records
let getMoreRecordsQueue = {};
export async function getMoreRecords(event, table) {
    if (getMoreRecordsQueue?.[table.table] instanceof Promise) {
        return;
    }

    if (event === null || event && event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 40) {
        getMoreRecordsQueue[table.table] = await skapi.getRecords({
            service: serviceId,
            table: table.table
        }, { fetchMore: true, limit: fetchLimit });
    }

    let r = getMoreRecordsQueue[table.table];
    for (let rec of r.list) {
        table.records.list.push(rec);
    }

    table.records.endOfList = r.endOfList;
    delete getMoreRecordsQueue[table.table];
}