<template lang="pug">
SearchNavBar(v-if='viewport === "mobile"')
    div {{ mobilePageTitle }}
    template(v-slot:right) 
        Icon.showOnTablet.placeholder-icon(@click="()=>{ searchResult=null; currentSelectedRecordPage=0; currentSelectedRecordBatch=0; router.push({name: 'mobileSearchUser'})}") X2
.table-outer-wrapper(v-if="fetchingData || groupedUserList?.length")
    .table-actions
        .header-actions
            div.dropdown
                span Headers
                Icon down2
            sui-select(:value="mobileVisibleField" @change="(e) => mobileVisibleField = e.target.value")
                option(v-for="(field, key) in visibleFields" :value="key") {{  field.text  }}
        Icon(v-if="viewport === 'desktop'" :class="{'animation-rotation': fetchingData}" @click="getUsers") refresh
        .actions(v-if="viewport === 'mobile'")
            sui-button.icon-button(@click="blockUsers" :disabled="selectedUsers.length === 0 || null")
                Icon block
            sui-button.icon-button(@click="unblockUsers" :disabled="selectedUsers.length === 0 || null")
                Icon unblock
            sui-button.icon-button(@click="deleteUsers" :disabled="selectedUsers.length === 0 || null")
                Icon trash

    .table-wrapper
        table(v-if="fetchingData")
            tbody
                tr(v-for="x in numberOfSkeletons()").animation-skeleton
                    td
        table(v-else)
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
                            tr(v-for="(user, userIndex) in page" :key="user['user_id']"  @click="openUser(user['user_id'])")
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
template(v-else)
    .no-users-found(v-if="!fetchingData") 
        .title No users found
        p There were no users matching the query.
</template>
<script setup>
import { inject, ref, reactive, computed, watch, onMounted, onBeforeUnmount, onBeforeUpdate } from 'vue';
import { skapi, groupArray } from '@/main';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { visibleFields } from './users';

import Icon from '@/components/Icon.vue';
import SearchNavBar from '@/components/SearchNavBar.vue';

const viewport = inject('viewport');
let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;
let searchValue = ref('');
const searchField = ref(null);

let fetchLimit = 50;
let numberOfUsersPerPage = 10;
let numberOfPagePerBatch = fetchLimit / numberOfUsersPerPage;

const appStyle = inject('appStyle');
const navbarBackDestination = inject('navbarBackDestination');
const currentSelectedUsersBatch = ref(0);
const currentSelectedUsersPage = ref(0);
const searchParams = reactive({
    service: serviceId,
    searchFor: 'user_id',
    condition: '=',
    value: ''
});

const openUser = (user_id) => {
    router.push({name: 'userView', params: {user_id}})
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
    let deletePromise = selectedUsers.value.map((userId) => {
        return skapi.deleteAccount({service: serviceId, userId});
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

const getCleanSearchParams = () => {
    let params = {
        ...searchParams
    }

    if(params.searchFor === 'timestamp') {
        if(params.value === '') params.value = 0;
        else {
            params.value = new Date(params.value).getTime();
        }
    } else if(params.searchFor === 'subscribers') {
        params.value = Number(params.value);
    }

    return params;
}
const callSearch = () => {
    fetchingData.value = true;
    serviceUsers.value = null;

    let params = getCleanSearchParams();

    if(params.searchFor === 'timestamp') {
        if(params.value === '') params.value = 0;
        else {
            params.value = new Date(params.value).getTime();
        }
    }

    skapi.getUsers(params, {
        fetchMore: false,
        limit: fetchLimit 
    }).then((res) => {
        console.log(res.list);
        fetchingData.value = false;
        serviceUsers.value = {
            endOfList: res.endOfList,
            list: res.list
        };
    });
}

const mobileVisibleField = ref('user_id');

let showSetting = ref(false);
const computedVisibleFields = computed(() => {
    if(viewport.value === 'desktop') return Object.entries(visibleFields).filter(field => field[1].show).map(field => field[0]);
    return [mobileVisibleField.value];
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
const mobilePageTitle = ref('');
pageTitle.value = 'Users';

// flag
let fetchingData = inject('fetchingData');
let isFabOpen = ref(false);

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
if(route.query.search) {
    searchParams.searchFor = route.query.search;
    searchParams.condition = route.query.condition;
    searchParams.value = route.query.value;
}

if(route.query.search) {
    callSearch();
} else {
    getUsers();
}

const toggleMobileDesktopSearchView = () => {
    if(viewport.value === 'mobile' && route.query.search) {
        appStyle.mainPadding = '0';
        pageTitle.value = null;
        mobilePageTitle.value = `${visibleFields[route.query.search].text} : ${route.query.value}`;
    } else {
        pageTitle.value = 'Users';
        appStyle.mainPadding = null;
        router.replace({name: 'users', query: route.query});
    }
}

function numberOfSkeletons() {
    // calculated by available vertical space
    return parseInt((window.innerHeight / 2) / 48);
}

onMounted(() => {
    window.addEventListener('scroll', mobileScrollHandler, { passive: true });
    toggleMobileDesktopSearchView();
});
watch(() => viewport.value, (viewport) => {
    toggleMobileDesktopSearchView();
});
appStyle.background = '#333333';
onBeforeUnmount(() => {
    appStyle.background = null;
    window.removeEventListener('scroll', mobileScrollHandler, { passive: true });
});

onBeforeRouteLeave((to, from) => {
    if(from.params.search && !to.params.search) {
        getUsers(true);
    }
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
    background-color: #333333;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);
    padding: 0 var(--side-padding, 0);

    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #333333;
        padding: 14px 14px 14px 20px;
        border-radius: 8px 8px 0 0;

        & > * {
            cursor: pointer;
        }

        .header-actions {
            position: relative;

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

            sui-select {
                position: absolute;
                top: 0;
                opacity: 0;
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
                td,
                th {          
                    padding: 12px;      
                    height: 52px;
                    white-space: nowrap;

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
                background-color: #333;
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
                    background: #3B3B3B;
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

.no-users-found {
    text-align: center;
    padding: 60px 0 32px 0;
    border-radius: 0 0 8px 8px;
    color: rgba(255, 255, 255, .4);
    align-items: center;
    text-align: center;
    
    .title {
        font-size: 28px;
    }
    
    p {
        margin: 20px 0 0 0;
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
        overflow: hidden;

        table {
            thead th.user-id {
                min-width: unset;
            }

            tbody td {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 0;
                width: 100%;
            }
        }
    }

    .table-outer-wrapper {
        margin: auto -20px;
        border-radius: 0;
        box-shadow: none;
        border: none;

        .table-actions {
            border-radius: 0;

            .actions {
                margin: -14px 0;
            }
        }
    }
}

.page-action {
    position: fixed;
    bottom: 76px;
    right: 16px;
    overflow: hidden;

    &>sui-button {
        z-index: 2;
    }

    &,
    &>div {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 12px;
        width: 48px;
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity .1s ease, transform .1s ease;
        opacity: 1;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        transform: translateY(100px);
    }
}
</style>