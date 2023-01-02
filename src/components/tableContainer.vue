<template lang="pug">
.table-container
    .table-label
        span.table Table Name
        span.size.desktop Table Size
        span.records Record Count
    .record-table-list
        .table-wrapper(ref="rows" v-for="(table, i) in tableList")
            .record-table(@click="() => state.viewport === 'desktop' ? toggleTableRow(table.table) : $router.push({query: { table: table.table }})")
            span.table {{ table.table }}
            span.size {{ getSize(table.size) }}
            span.records {{ table.number_of_records }}
            span.actions.mobile.material-symbols-outlined arrow_forward_ios
            span.actions.material-symbols-outlined.desktop
                template(v-if="openedTables.includes(table?.table)") remove_circle
                template(v-else) add_circle
</template>
<style lang="less" scoped>
.record-container {
    background-color: #434343;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    margin: 0;
    padding: 24px 20px;

    .table-label {
        padding: 0 16px;
        color: rgba(255, 255, 255, 0.4);

        &>span {
            margin-bottom: 8px;
        }
    }

    .record-search-info {
        & .query-text {
            display: flex;
            justify-content: space-between;
            font-weight: bold;

            .clear-search {
                display: inline;
                cursor: pointer;

                span.material-symbols-outlined {
                    font-size: 24px;
                    margin-left: 8px;
                }
            }
        }

        & .query-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 16px;
            margin-bottom: 32px;

            &>div {
                display: inline-flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.12);
                color: rgba(255, 255, 255, 0.6);
                border-radius: 12px;
                padding: 6px 12px;
                height: 40px;
            }
        }

        & .record-rows-container {
            border-radius: 8px;
        }
    }

    & .table-wrapper {
        background-color: #262626;
        border-radius: 4px 4px 8px 8px;

        &:not(:first-child) {
            margin-top: 16px;
        }

        & .record-table {
            cursor: pointer;
            background: #656565;
            border-radius: 4px;
            padding: 12px 16px;

            & .open {
                display: block;
            }

            & .close {
                display: none;
            }

            &.active {
                &+.record-rows-container {
                    display: block;
                }

                & .open {
                    display: none;
                }

                & .close {
                    display: block;
                }
            }
        }

        & .record-rows-container {
            display: block;

            @media only screen and (min-width: @desktop) {
                max-height: 60vh;
            }
        }

        .record-listing {
            padding: 18px;
        }
    }

    & span {
        display: inline-block;
        vertical-align: middle;

        &.actions.mobile {
            font-size: 16px;
            color: rgba(255, 255, 255, .2);
        }

        &.table {
            text-align: left;
            width: calc(100% - 174px);
            min-width: 100px;

            @media only screen and (min-width: @desktop) {
                width: calc(100% - 374px);
            }
        }

        &.size {
            display: none;

            @media only screen and (min-width: @desktop) {
                width: 200px;
                display: inline-block;
            }
        }

        &.records {
            width: 150px;
        }

        &.actions {
            width: 24px;
            font-size: 24px;
            cursor: pointer;
            user-select: none;
        }
    }
}
</style>