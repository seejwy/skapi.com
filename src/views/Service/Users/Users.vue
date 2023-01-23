<template lang="pug">
.page-header
    h1 Users
    p Users are data that your service user's will store and read from your service database. All records are organized by table names and restrictions. With additional query points such as index names and tags, references, you can have more flexible option when fetching the records.
    sui-button.line-button(style="float: right") Read Doc
    div(style="clear:both;")
.actions-wrapper
    .select-input(style='width: 400px;margin: 8px 0;' @click.stop)
        .select-field
            sui-select(name='search_type')
                option(value="id" selected) User ID
                option(value="email") Email
                option(value="name") Name

        .input-field
            span.material-symbols-outlined.placeholder-icon(v-if="!searchValue") search
            sui-input(type="search" autocomplete="off" :value="searchValue" @input="(e) => searchValue = e.target.value")
    
    .actions
        sui-button.text-button(@click="")
            Icon trash
            span block
        sui-button.text-button(@click="")
            Icon trash
            span unblock
        sui-button.text-button(@click="")
            Icon trash
            span delete
pre {{ visibleFields }}
.table-outer-wrapper
    .table-actions
        Icon(@click="showSetting = !showSetting") setting
        Icon(:class="{'animation-rotation': fetchingData}") refresh
    .filter(v-if="showSetting")
        .label(v-for="(field, key) in visibleFields")
            label
                // sui-input no longer clickable when in label
                input(type="checkbox" :checked="field.show || null" @input="field.show = !field.show"  :disabled="computedVisibleFields.length === 1 && field.show ? true : null")
                span {{  field.text }}
    .table-wrapper
        table
            thead
                tr
                    td.fixed
                        sui-input(type="checkbox")
                    td(v-for="key in computedVisibleFields") {{ visibleFields[key].text }}
            tbody
                tr(v-for="(user, userIndex) in serviceUsers?.list")
                    td.fixed
                        sui-input(type="checkbox")
                    td(v-for="(key, index) in computedVisibleFields") {{ user['user_id'] || '-' }}
template(v-if="serviceUsers")
    h5 These are your users:
    pre {{ serviceUsers.list }}

</template>
<script setup>
import { inject, ref, reactive, computed } from 'vue';
import { skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '@/components/Icon.vue';

// import {Skapi} from 'skapi-js';

// let skapi = new Skapi('ap22TP6h6dSLezsRQO8T', '5c7798b2-dfee-43a6-aef9-d8c508238193');

// (async () => {
//     let x = await skapi.signup({
//         email: 'jinyoon+user3@broadwayinc.com',
//         password: 'Bwq14321!!'
//     }, {login: true});
//     // let x = await skapi.login({
//     //     email: 'jinyoon+user3@broadwayinc.com',
//     //     password: 'Bwq14321!!'
//     // })
//     console.log({x});
// })();

let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;
let searchValue = ref('');

let visibleFields = reactive({
    user_id: {
        text: 'User ID',
        show: true,
    },
    name: {
        text: 'Name',
        show: true,
    },
    block: {
        text: 'Block',
        show: true,
    },
    status: {
        text: 'Status',
        show: true,
    },
    email: {
        text: 'Email',
        show: true,
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

let pageTitle = inject('pageTitle');
pageTitle.value = 'Users';

// flag
let fetchingData = inject('fetchingData');

// data
let serviceUsers = inject('serviceUsers');
let searchResult = inject('searchResult');

let fetchLimit = 50;
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
        & > * { 
            display: inline-block;
            margin-left: 16px;
        }

        svg {
            width: 20px;
            height: 20px;
            margin-right: 4px;
        }

    }
}
.table-outer-wrapper {
    position: relative;
    margin-top: 45px;
    background-color: #434343;
    border-radius: 8px;
    overflow: hidden;

    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #434343;
        height: 52px;
        padding: 0 14px 0 20px;

        svg {
            cursor: pointer;
        }
    }

    .filter {
        position: absolute;
        padding: 12px;
        left: 14px;
        background: #595959;
        min-width: 200px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        z-index: 2;

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
    overflow-x: scroll;
    margin-left: 64px;
    height: 676px;

    table {
        min-width: 100%;
        border-collapse: collapse;

        sui-input {
            transform: translate(-50%, -50%);
            position: absolute;
            top: 50%;
            color: #fff;
            cursor: pointer;
        }

        thead,
        tbody {
            tr,
            tr .fixed {
                background-color: #434343;

                td {                
                    height: 52px;
                }
            }
        }

        thead {

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
                &:nth-child(odd),
                &:nth-child(odd) .fixed {
                    background: #4a4a4a;
                }
            }
        }

        tr {
            height: 52px;
            td {
                white-space: nowrap;
                &.fixed {
                    position: absolute;
                    margin-left: -64px;
                    width: 64px;
                    height: 52px;
                    text-align: center;

                    & > input {
                        position: relative;
                        top: 19px;
                        transform: translateY(-50%);
                    }
                    
                }
            }
        }
    }
}
</style>