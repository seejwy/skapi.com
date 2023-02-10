<template lang="pug">
.page-header
    h1.hideOnTablet Users
    p Users are data that your service user's will store and read from your service database. All records are organized by table names and restrictions. With additional query points such as index names and tags, references, you can have more flexible option when fetching the records.
    sui-button.line-button(style="float: right") Read Doc
    div(style="clear:both;")
.actions-wrapper(v-if="viewport === 'desktop'")
    .select-input(style='width: 400px;margin: 8px 0;' @click.stop)
        .select-field
            sui-select(name='search_type' :value="searchParams.searchFor" @change="(e) => changeSearchType(e.target.value)")
                option(value="user_id" selected) User ID
                option(value="email") Email
                option(value="name") Name
        .input-field
            sui-input(type="search" autocomplete="off" placeholder="Search" :value="searchParams.value" @input="(e) => searchParams.value = e.target.value" @keypress.enter="search")
    
    .actions
        sui-button.text-button(@click="blockUsers" :disabled="selectedUsers.length === 0 || null")
            Icon block
            span.hideOnTablet block
        sui-button.text-button(@click="unblockUsers" :disabled="selectedUsers.length === 0 || null")
            Icon unblock
            span.hideOnTablet unblock
        sui-button.text-button(@click="deleteUsers" :disabled="selectedUsers.length === 0 || null")
            Icon trash
            span.hideOnTablet delete

.table-outer-wrapper
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
        Icon(v-if="viewport === 'desktop'" :class="{'animation-rotation': fetchingData}" @click="getUsers") refresh
        .actions(v-if="viewport === 'mobile'")
            sui-button.icon-button(@click="blockUsers" :disabled="selectedUsers.length === 0 || null")
                Icon block
            sui-button.icon-button(@click="unblockUsers" :disabled="selectedUsers.length === 0 || null")
                Icon unblock
            sui-button.icon-button(@click="deleteUsers" :disabled="selectedUsers.length === 0 || null")
                Icon trash

    .table-wrapper
        table
            thead
                tr(:class="{rounded: fetchingData || null}")
                    th
                        sui-input(type="checkbox" :checked="selectedUsers.length === groupedUserList?.[currentSelectedUsersBatch][currentSelectedUsersPage].length || null" @change="selectAllHandler")
                    th(v-for="key in computedVisibleFields" :class="{'icon-td': key === 'block' || key === 'status', 'user-id': key === 'user_id'}") {{ visibleFields[key].text }}
                    th(v-if="computedVisibleFields.length <= 2")
            tbody(v-if="groupedUserList?.length")
                template(v-if="viewport === 'desktop'")
                    tr(v-for="(user, userIndex) in groupedUserList?.[currentSelectedUsersBatch][currentSelectedUsersPage]" :key="user['user_id']")
                        td
                            sui-input(type="checkbox" :value="user.user_id" :checked="selectedUsers.includes(user.user_id) || null" @change="userSelectionHandler")
                        td(v-for="(key, index) in computedVisibleFields" :class="{'icon-td' : key === 'block' || key === 'status'}") 
                            template(v-if="key === 'suspended'")
                                Icon(v-if="user[key]?.includes('suspended')" style="opacity: 40%;") block
                                Icon(v-else) unblock
                            template(v-else-if="key === 'group'")                     
                                Icon(v-if="user[key] > 0") check_circle
                                Icon(v-else) x
                            template(v-else) {{ user[key] || '-' }}
                        td(v-if="computedVisibleFields.length <= 2")
                    //- Below code needs to change to page list not full users list
                    template(v-if="groupedUserList?.[currentSelectedUsersBatch][currentSelectedUsersPage].length < 10")
                        tr(v-for="num in numberOfUsersPerPage - groupedUserList?.[currentSelectedUsersBatch][currentSelectedUsersPage].length")
                            td  
                            td(v-for="(key, index) in computedVisibleFields")
                            td(v-if="computedVisibleFields.length <= 2")
                    
                template(v-else)
                    template(v-for="batch in groupedUserList")
                        template(v-for="page in batch")
                            tr(v-for="(user, userIndex) in page" :key="user['user_id']")
                                td
                                    sui-input(type="checkbox" :value="user.user_id" :checked="selectedUsers.includes(user.user_id) || null" @change="userSelectionHandler")
                                td(v-for="(key, index) in computedVisibleFields" :class="{'icon-td' : key === 'block' || key === 'status'}") 
                                    template(v-if="key === 'suspended'")
                                        Icon(v-if="user[key]?.includes('suspended')" style="opacity: 40%;") block
                                        Icon(v-else) unblock
                                    template(v-else-if="key === 'group'")                     
                                        Icon(v-if="user[key] > 0") check_circle
                                        Icon(v-else) x
                                    template(v-else) {{ user[key] || '-' }}
                                td(v-if="computedVisibleFields.length <= 2")
    .paginator.hideOnTablet(v-if="groupedUserList?.length")
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
import { inject, ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
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
const searchParams = reactive({
    service: serviceId,
    searchFor: 'user_id',
    condition: '=',
    value: ''
});

const changeSearchType = (value) => {
    searchParams.searchFor = value;
    if(value === 'user_id') searchParams.condition = '=';
    else searchParams.condition = '>=';
}

const blockUsers = async () => {
    let blockPromise = selectedUsers.value.map((user) => {
        return skapi.blockAccount({service: serviceId, userId: user});
    });

    await Promise.all(blockPromise);
    selectedUsers.value.forEach((sel) => {
        let idx = groupedUserList.value[currentSelectedUsersBatch.value][currentSelectedUsersPage.value].findIndex((item) => {
            return item.user_id === sel
        });
        groupedUserList.value[currentSelectedUsersBatch.value][currentSelectedUsersPage.value][idx].suspended = 'admin:suspended';
    });
}

const unblockUsers = async () => {
    let unblockPromise = selectedUsers.value.map((user) => {
        return skapi.unblockAccount({service: serviceId, userId: user});
    });

    await Promise.all(unblockPromise);
    selectedUsers.value.forEach((sel) => {
        let idx = groupedUserList.value[currentSelectedUsersBatch.value][currentSelectedUsersPage.value].findIndex((item) => {
            return item.user_id === sel
        });
        groupedUserList.value[currentSelectedUsersBatch.value][currentSelectedUsersPage.value][idx].suspended = 'admin:approved';
    })
}

const deleteUsers = async () => {
    let deletePromise = selectedUsers.value.map((user) => {
        return skapi.deleteAccount({service: serviceId, user});
    });

    await Promise.all(deletePromise);
}

const groupedUserList = computed(() => {
    if (!serviceUsers.value || !serviceUsers.value.list.length) {
        currentSelectedUsersBatch.value = 0;
        return null;
    }

    return groupArray(serviceUsers.value.list, numberOfUsersPerPage, numberOfPagePerBatch);
});

const search = () => {
    skapi.getUsers(searchParams, { 
        refresh: true, 
        limit: fetchLimit 
    }).then((res) => {
        console.log(res.list);
        serviceUsers.value = {
            endOfList: res.endOfList,
            list: res.list
        };
    });
}

let visibleFields = reactive({
    suspended: {
        text: 'Block',
        show: viewport.value === 'desktop' ? true : false,
    },
    group: {
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
const selectAllHandler = (e) => {
    selectedUsers.value = [];
    if(e.target.checked) {
        groupedUserList.value[currentSelectedUsersBatch.value][currentSelectedUsersPage.value].map(user => {
            selectedUsers.value.push(user.user_id);
        })
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
    if (serviceUsers.value.endOfList && groupedUserList.value.length - 1 === currentSelectedUsersBatch.value) {
        return;
    }
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
        }, { fetchMore: true, limit: fetchLimit }).catch(err => {
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


const mobileScrollHandler = (e) => {
    if (viewport.value === 'mobile' && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 40) {
        console.log("GetmoreUsers");
        getMoreUsers();
    }
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

    skapi.getUsers(params, { limit: fetchLimit })
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

onMounted(() => {
    window.addEventListener('scroll', mobileScrollHandler, { passive: true });
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', mobileScrollHandler, { passive: true });
});
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';
.page-header {
    padding: 50px 0;

    p {
        line-height: 1.5;
    }
    
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
            padding: 9px 12px;

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
                background-image: url(/src/assets/img/icons/search.svg);
                color: rgba(255, 255, 255, .4);
                background-size: contain;
                background-position:  1px center;
                background-repeat: no-repeat;
                text-indent: 26px;
            }
        }
    }
}
.table-outer-wrapper {
    position: relative;
    margin-top: 36px;
    background-color: #434343;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);

    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #434343;
        padding: 14px 14px 14px 20px;
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
        }
    }
}
.table-wrapper {
    max-height: calc(52px * 11 + 52px);
    overflow: auto;

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

                &.rounded,
                &.rounded th {
                    border-radius: 0 0 8px 8px;
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
                    width: 48px;
                    text-align: center;
                }

                &.user-id {
                    min-width: 330px;
                }

                &:last-child:not(.icon-td) {
                    width: 100%;
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
    padding: 24px 0;
    text-align: center;
    color: rgba(255 255 255 / 60%);
    background: #434343;
    user-select: none;
    border-radius: 0 0 8px 8px;

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
    .table-wrapper {
        max-height: unset;
    }

    .table-outer-wrapper {
        margin: auto -16px;
        border-radius: 0;
        box-shadow: none;
        border: none;

        .table-actions {
            background: rgba(255, 255, 255, 0.04);
            border-radius: 0;

            .actions {
                margin: -14px 0;
            }
        }
    }
}

@media @phone {
    .table-outer-wrapper {
        margin: auto -8px;
    }
}
</style>