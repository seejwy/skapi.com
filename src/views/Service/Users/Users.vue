<template lang="pug">
.page-header
    h1 Users
    p Users are data that your service user's will store and read from your service database. All records are organized by table names and restrictions. With additional query points such as index names and tags, references, you can have more flexible option when fetching the records.
    sui-button.line-button(style="float: right") Read Doc
    div(style="clear:both;")
.actions-wrapper(v-if="viewport === 'desktop'")
    .select-input(style='width: 400px;margin: 8px 0;' @click.stop)
        .select-field
            sui-select(name='search_type')
                option(value="id" selected) User ID
                option(value="email") Email
                option(value="name") Name

        .input-field
            .icon(v-if="!searchValue")
                Icon search
            sui-input(type="search" autocomplete="off" placeholder="Search" :value="searchValue" @input="(e) => searchValue = e.target.value")
    
    .actions
        sui-button.text-button(@click="")
            Icon block
            span.hideOnTablet block
        sui-button.text-button(@click="")
            Icon unblock
            span.hideOnTablet unblock
        sui-button.text-button(@click="")
            Icon trash
            span.hideOnTablet delete

.table-outer-wrapper(v-if="groupedUserList?.length")
    .table-actions
        .header-actions--before(v-if="showSetting" @click="showSetting = false")
        .header-actions(@click="showSetting = true")
            div.dropdown
                span Headers
                Icon down2
            .filter-wrapper
                .filter(v-if="showSetting")
                    .label(v-for="(field, key) in visibleFields")
                        label
                            sui-input(type="checkbox" :checked="field.show || null" @input="field.show = !field.show"  :disabled="computedVisibleFields.length === 1 && field.show ? true : null")
                            span {{  field.text }}
        Icon(v-if="viewport === 'desktop'" :class="{'animation-rotation': fetchingData}") refresh
        .actions(v-if="viewport === 'mobile'")
            sui-button.icon-button(@click="")
                Icon block
            sui-button.icon-button(@click="")
                Icon unblock
            sui-button.icon-button(@click="")
                Icon trash
    .table-wrapper
        table
            thead
                tr
                    th
                        sui-input(type="checkbox")
                    th(v-for="key in computedVisibleFields" :class="{'icon-td': key === 'block' || key === 'status', 'user-id': key === 'user_id'}") {{ visibleFields[key].text }}
                    th(v-if="computedVisibleFields.length <= 2")
            tbody
                tr(v-for="(user, userIndex) in groupedUserList?.[currentSelectedUsersBatch][currentSelectedUsersPage]" :key="user['user_id']")
                    td
                        sui-input(type="checkbox" :value="user.user_id" @change="userSelectionHandler")
                    td(v-for="(key, index) in computedVisibleFields" :class="{'icon-td' : key === 'block' || key === 'status'}") 
                        //To add actual conditions to determine which icon to show
                        template(v-if="key === 'block'")
                            template(v-if="user[key]")                        
                                Icon block
                            template(v-else)
                                Icon unblock
                        template(v-else-if="key === 'status'")                  
                            Icon check_circle
                        template(v-else) {{ user[key] || '-' }}
                    td(v-if="computedVisibleFields.length <= 2")
                //- Below code needs to change to page list not full users list
                template(v-if="groupedUserList?.[currentSelectedUsersBatch][currentSelectedUsersPage].length < 10")
                    tr(v-for="num in numberOfUsersPerPage - groupedUserList?.[currentSelectedUsersBatch][currentSelectedUsersPage].length")
                        td                  
                        td(v-for="(key, index) in computedVisibleFields")
                        td(v-if="computedVisibleFields.length <= 2")
    .paginator.hideOnTablet
        Icon(
            :class="{active: currentSelectedUsersPage || currentSelectedUsersBatch}"
            @click="()=>{ if(currentSelectedUsersPage) currentSelectedUsersPage--; else if(currentSelectedUsersBatch) { currentSelectedUsersPage = numberOfPagePerBatch - 1; currentSelectedUsersBatch--; } }"
            ) left
        span.more-page(        
            :class="{active: currentSelectedUsersBatch}"
            @click="()=>{ if(currentSelectedUsersBatch > 0) {currentSelectedUsersBatch--; currentSelectedUsersPage = numberOfPagePerBatch - 1} }"
            ) ...
        span.page(
            v-for="(i, idx) in groupedUserList?.[currentSelectedUsersBatch].length"
            :class="{active: idx === currentSelectedUsersPage}"
            @click="currentSelectedUsersPage = idx"
            ) {{ currentSelectedUsersBatch * numberOfPagePerBatch + i }}
        span.more-page(
            :class="{active: !serviceUsers?.endOfList || groupedUserList.length - 1 > currentSelectedUsersBatch }"
            @click="getMoreUsers") ...
            
        Icon(
            :class="{active: currentSelectedUsersPage < groupedUserList[currentSelectedUsersBatch].length - 1 || !serviceUsers.endOfList && currentSelectedUsersPage === groupedUserList[currentSelectedUsersBatch].length - 1 }"
            @click="()=>{ if(currentSelectedUsersPage < groupedUserList[currentSelectedUsersBatch].length - 1 ) currentSelectedUsersPage++; else if(!serviceUsers.endOfList && currentSelectedUsersPage === groupedUserList[currentSelectedUsersBatch].length - 1) getMoreUsers() }"
            ) right
</template>
<script setup>
import { inject, ref, reactive, computed } from 'vue';
import { skapi, groupArray } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '@/components/Icon.vue';

const viewport = inject('viewport');
let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;
let searchValue = ref('');

let fetchLimit = 50;
let numberOfUsersPerPage = 10;
let numberOfPagePerBatch = fetchLimit / numberOfUsersPerPage;

const currentSelectedUsersBatch = ref(0);
const currentSelectedUsersPage = ref(0);


const groupedUserList = computed(() => {
    if (!serviceUsers.value || !serviceUsers.value.list.length) {
        currentSelectedUsersBatch.value = 0;
        return null;
    }

    return groupArray(serviceUsers.value.list, numberOfUsersPerPage, numberOfPagePerBatch);
});

let visibleFields = reactive({
    block: {
        text: 'Block',
        show: viewport.value === 'desktop' ? true : false,
    },
    status: {
        text: 'Status',
        show: viewport.value === 'desktop' ? true : false,
    },
    user_id: {
        text: 'User ID',
        show: true,
    },
    name: {
        text: 'Name',
        show: viewport.value === 'desktop' ? true : false,
    },
    email: {
        text: 'Email',
        show: viewport.value === 'desktop' ? true : false,
    },
    address: {
        text: 'Address',
        show: false,
    },
    gender: {
        text: 'Gender',
        show: false,
    },
    group: {
        text: 'Group',
        show: false,
    }
});

let showSetting = ref(false);
const computedVisibleFields = computed(() => {
    return Object.entries(visibleFields).filter(field => field[1].show).map(field => field[0]);
});
const selectedUsers = ref([]);
const userSelectionHandler = (e) => {
    if(e.target.checked) {
        selectedUsers.value.push(e.target.value);
    } else {
        selectedUsers.value.splice(selectedUsers.value.indexOf(e.target.value), 1);
    }
}

let pageTitle = inject('pageTitle');
pageTitle.value = 'Users';

// flag
let fetchingData = inject('fetchingData');

// data
let serviceUsers = inject('serviceUsers');
let searchResult = inject('searchResult');

let getMoreUsersQueue = null;
async function getMoreUsers() {
    fetchingData.value = true;

    if (groupedUserList.value.length - 1 > currentSelectedUsersBatch.value) {
        currentSelectedUsersBatch.value += 1;
        currentSelectedUsersPage.value = 0;
        fetchingData.value = false;
        return;
    }

    if (getMoreUsersQueue instanceof Promise) {
        return;
    }


    getMoreUsersQueue = skapi.getUsers(
        {
            service: serviceId,
            searchFor: 'timestamp',
            condition: '>',
            value: 0
        }, { limit: fetchLimit }).catch(err => {
            fetchingData.value = false;
            throw err;
        });

    let result = await getMoreUsersQueue;
    serviceUsers.value.endOfList = result.endOfList;

    result.list.map(user => {
        serviceUsers.value.list.push(user);
    });

    getMoreUsersQueue = null;
    currentSelectedUsersBatch.value++;
    currentSelectedUsersPage.value = 0;
    fetchingData.value = false;
}

function getUsers(refresh = false) {
    // initial table fetch

    if (!refresh && serviceUsers.value) {
        // bypass if already fetched
        fetchingData.value = false;
        return;
    }

    serviceUsers.value = null;
    fetchingData.value = true;

    let params = {
        service: serviceId,
        searchFor: 'timestamp',
        condition: '>',
        value: 0
    };

    skapi.getUsers(params, { refresh: true, limit: fetchLimit })
        .then(t => {
            serviceUsers.value = {
                endOfList: t.endOfList,
                list: t.list,
                params
            };

            fetchingData.value = false;
        }).catch(err => {
            fetchingData.value = false;
            throw err;
        });

    return;
}

// get users on created
getUsers();

</script>
<style lang="less" scoped>
@import '@/assets/variables.less';
.page-header {
    padding: 50px 0;

    @media @tablet {
        padding: 24px 0;
    }
}
.actions-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .actions {
        flex-shrink: 0;

        & > * { 
            display: inline-block;
            margin-left: 16px;

            @media @tablet {
                margin-left: 0;
            }
        }

        svg {
            width: 20px;
            height: 20px;
            margin-right: 4px;
        }

    }

    .input-field {
        margin-left: 12px;

        .icon {
            padding-right: 12px;
            svg {
                color: rgba(255, 255, 255, 0.4);
            }
        }
        sui-input {
            padding: 0;
            
            input::placeholder {
                color: rgba(255, 255, 255, .4);
            }
        }
    }
}
.table-outer-wrapper {
    position: relative;
    margin-top: 45px;
    background-color: #434343;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #434343;
        height: 52px;
        padding: 0 14px 0 20px;
        border-radius: 8px;

        & > * {
            cursor: pointer;
        }

        .header-actions {
            &--before {
                position: fixed;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                z-index: 8;
            }
            .dropdown > * {
                vertical-align: middle;
            }
        }
    }

    .filter {
        position: absolute;
        z-index: 9;
        padding: 12px;
        left: 14px;
        background: #595959;
        min-width: 200px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        z-index: 9;
        margin-top: 12px;

        .label:not(:last-child) {
            margin-bottom: 16px;
        }

        label {
            cursor: pointer;
            span {
                
                margin-left: 12px;
            }
        }
        
        sui-input {
            color: #fff;
            cursor: pointer;
        }
    }
}
.table-wrapper {
    max-height: calc(52px * 11 + 52px);
    overflow: auto;
    border-radius: 8px;

    table {
        min-width: 100%;
        border-collapse: collapse;

        sui-input {
            color: #fff;
            cursor: pointer;
        }

        thead,
        tbody {
            tr {
                background-color: #434343;

                td,
                th {          
                    padding: 12px;      
                    height: 52px;

                    &:first-child {
                        padding-left: 20px;
                        width: 48px;
                    }

                    sui-input {
                        font-size: 16px;
                    }
                }
            }
        }

        thead {
            th {
                position: sticky;
                background-color: #434343;
                top: 0;
                text-align: left;

                &.icon-td {
                    text-align: center;
                }

                &.user-id {
                    min-width: 330px;
                }
            }

            .actions {
                cursor: pointer;
                text-align: right;

                svg {                
                    margin-left: 4px;
                }
            }
        }

        tbody {
            tr {
                &:nth-child(odd) {
                    background: #4a4a4a;
                }

                td {
                    font-size: 14px;

                    &.icon-td {
                        width: 48px;
                        text-align: center;
                    }

                    &:last-child:not(.icon-td) {
                        width: 100%;
                    }
                }
            }
        }

        tr {
            height: 52px;
            td {
                white-space: nowrap;
            }
        }
    }
}
.paginator {
    margin: 24px auto;
    text-align: center;
    color: rgba(255 255 255 / 60%);
    user-select: none;

    span {
        padding: 4px 8px;
        box-sizing: content-box;

        &.page {
            cursor: pointer;

            &.active {
                cursor: default;
                color: #fff;
                font-weight: bold;
            }
        }

        &.more-page {
            visibility: hidden;

            &.active {
                cursor: pointer;
                visibility: visible;
            }
        }
    }
    svg {
            color: rgba(255, 255, 255, .15);
            vertical-align: middle;
            &.active {
                cursor: pointer;
                color: #fff;
            }
        }
}
.table-outer-wrapper {
    position: relative;
    margin-top: 45px;
    background-color: #434343;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #434343;
        height: 52px;
        padding: 0 14px 0 20px;
        border-radius: 8px;

        & > * {
            cursor: pointer;
        }

        .header-actions {
            &--before {
                position: fixed;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                z-index: 8;
            }
            .dropdown > * {
                vertical-align: middle;
            }
        }
    }

    .filter {
        position: absolute;
        z-index: 9;
        padding: 12px;
        left: 14px;
        background: #595959;
        min-width: 200px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        z-index: 9;
        margin-top: 12px;

        .label:not(:last-child) {
            margin-bottom: 16px;
        }

        label {
            cursor: pointer;
            span {
                
                margin-left: 12px;
            }
        }
        
        sui-input {
            color: #fff;
            cursor: pointer;
        }
    }
}
.table-wrapper {
    max-height: calc(52px * 11 + 52px);
    overflow: auto;
    border-radius: 8px;

    table {
        min-width: 100%;
        border-collapse: collapse;

        sui-input {
            color: #fff;
            cursor: pointer;
        }

        thead,
        tbody {
            tr {
                background-color: #434343;

                td,
                th {          
                    padding: 12px;      
                    height: 52px;

                    &:first-child {
                        padding-left: 20px;
                        width: 48px;
                    }

                    sui-input {
                        font-size: 16px;
                    }
                }
            }
        }

        thead {
            th {
                position: sticky;
                background-color: #434343;
                top: 0;
                text-align: left;

                &.icon-td {
                    text-align: center;
                }

                &.user-id {
                    min-width: 330px;
                }
            }

            .actions {
                cursor: pointer;
                text-align: right;

                svg {                
                    margin-left: 4px;
                }
            }
        }

        tbody {
            tr {
                &:nth-child(odd) {
                    background: #4a4a4a;
                }

                td {
                    font-size: 14px;

                    &.icon-td {
                        width: 48px;
                        text-align: center;
                    }

                    &:last-child:not(.icon-td) {
                        width: 100%;
                    }
                }
            }
        }

        tr {
            height: 52px;
            td {
                white-space: nowrap;
            }
        }
    }
}
.paginator {
    margin: 24px auto;
    text-align: center;
    color: rgba(255 255 255 / 60%);
    user-select: none;

    span {
        padding: 4px 8px;
        box-sizing: content-box;

        &.page {
            cursor: pointer;

            &.active {
                cursor: default;
                color: #fff;
                font-weight: bold;
            }
        }

        &.more-page {
            visibility: hidden;

            &.active {
                cursor: pointer;
                visibility: visible;
            }
        }
    }
    svg {
            color: rgba(255, 255, 255, .15);
            vertical-align: middle;
            &.active {
                cursor: pointer;
                color: #fff;
            }
        }
}
.table-outer-wrapper {
    position: relative;
    margin-top: 45px;
    background-color: #434343;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #434343;
        height: 52px;
        padding: 0 14px 0 20px;
        border-radius: 8px 8px 0 0;

        & > * {
            cursor: pointer;
        }

        .header-actions {
            &--before {
                position: fixed;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                z-index: 8;
            }
            .dropdown > * {
                vertical-align: middle;
            }
        }
    }

    .filter {
        position: absolute;
        z-index: 9;
        padding: 12px;
        left: 14px;
        background: #595959;
        min-width: 200px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        z-index: 9;
        margin-top: 12px;

        .label:not(:last-child) {
            margin-bottom: 16px;
        }

        label {
            cursor: pointer;
            span {
                
                margin-left: 12px;
            }
        }
        
        sui-input {
            color: #fff;
            cursor: pointer;

            &[disabled] {
                &,
                & + span {
                    color: rgba(255, 255, 255, 0.6);
                }
            }
        }
    }
}
.table-wrapper {
    max-height: calc(52px * 11 + 52px);
    overflow: auto;
    border-radius: 8px;

    table {
        min-width: 100%;
        border-collapse: collapse;

        sui-input {
            color: #fff;
            cursor: pointer;
        }

        thead,
        tbody {
            tr {
                background-color: #434343;

                td,
                th {          
                    padding: 12px;      
                    height: 52px;

                    &:first-child {
                        padding-left: 20px;
                        width: 48px;
                    }

                    sui-input {
                        font-size: 16px;
                    }
                }
            }
        }

        thead {
            th {
                position: sticky;
                background-color: #434343;
                top: 0;
                text-align: left;

                &.icon-td {
                    text-align: center;
                }

                &.user-id {
                    min-width: 330px;
                }
            }

            .actions {
                cursor: pointer;
                text-align: right;

                svg {                
                    margin-left: 4px;
                }
            }
        }

        tbody {
            tr {
                &:nth-child(odd) {
                    background: #4a4a4a;
                }

                td {
                    font-size: 14px;

                    &.icon-td {
                        width: 48px;
                        text-align: center;
                    }

                    &:last-child:not(.icon-td) {
                        width: 100%;
                    }
                }
            }
        }

        tr {
            height: 52px;
            td {
                white-space: nowrap;
            }
        }
    }
}
.paginator {
    margin: 24px auto;
    text-align: center;
    color: rgba(255 255 255 / 60%);
    user-select: none;

    span {
        padding: 4px 8px;
        box-sizing: content-box;

        &.page {
            cursor: pointer;

            &.active {
                cursor: default;
                color: #fff;
                font-weight: bold;
            }
        }

        &.more-page {
            visibility: hidden;

            &.active {
                cursor: pointer;
                visibility: visible;
            }
        }
    }
    svg {
            color: rgba(255, 255, 255, .15);
            vertical-align: middle;
            &.active {
                cursor: pointer;
                color: #fff;
            }
        }
}
@media @tablet {
    .table-outer-wrapper {
        margin: auto -16px;
        border-radius: 0;
        border: none;

        .table-actions {
            background: rgba(255, 255, 255, 0.04);
            border-radius: 0;
        }
    }
}

@media @phone {
    .table-outer-wrapper {
        margin: auto -8px;
    }
}
</style>