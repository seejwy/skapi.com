import { ref } from 'vue';
import { skapi } from '@/main';
export const tableList = [];
export const recordTables = ref(null);

export async function refreshTables(serviceId) {
    // initial table fetch

    recordTables.value = null;
    let t = await skapi.getTable({ service: serviceId }, { limit: 50 });

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
                tableList.push(m.table);
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
export async function getMoreRecords(event, table, serviceId, fetchMore = true) {
    if (getMoreRecordsQueue?.[table.table] instanceof Promise) {
        return;
    }

    if (event === null || event && event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 40) {
        getMoreRecordsQueue[table.table] = skapi.getRecords({
            service: serviceId,
            table: table.table
        }, { fetchMore, limit: 50 });
    }
    else {
        return;
    }

    let r = await getMoreRecordsQueue[table.table];

    if (fetchMore) {
        for (let rec of r.list) {
            table.records.list.push(rec);
        }
    }
    else {
        table.records.list = r.list;
    }

    table.records.endOfList = r.endOfList;
    delete getMoreRecordsQueue[table.table];
    return r;
}