<template lang="pug">
NavBarProxy(backgroundColor="#505050")
    template(v-slot:title)
        div Service: "{{ service.name }}"
EditService(v-if="state?.user && route.query.edit === 'service'")
template(v-else)
    .pageHeader.headSpaceHelper
        h2 Service
        p.
            A service is a collection of serverless resources working together to form your backend.
            Simply connect to your service and start building your website.      

        div.action
            a(href="https://docs.skapi.com/the-basics/#connecting-to-your-service" target="_blank")
                sui-button.lineButton(type="button") Find out More
    .container
        .titleActionsWrapper
            .titleWrapper
                Icon information
                h2 Service Information
            .actions(@click="deleteServiceAsk" :class="{'disabled': !state.user.email_verified ? true : null}")
                Icon trash
        .innerContainer 
            .informationGrid
                .informationGridItem(v-for="info in informationGrid" :class="[info.span ? `span-${info?.span}` : '']")
                    .name {{ info.name }}
                    .value(v-if="info.filter") {{ info.filter(service[info.key]) }}
                    .value(v-else) {{ service[info.key] }}

    .container
        .titleActionsWrapper
            .titleWrapper
                Icon setting
                h2 Service Setting 
            .actions(@click="edit" :class="{'disabled': !state.user.email_verified ? true : null}")
                Icon pencil
        .innerContainer
            .settingGrid 
                .settingGridItem(v-for="setting in settingGrid")
                    .name 
                        span {{ setting.name }}
                        sui-tooltip(v-if="setting.tip")
                            Icon(slot="tool") question
                            div(slot="tip") {{ setting.tip }}
                    .value(v-if="setting.key === 'active'")
                        .indicator(:class="{'active': service[setting.key] > 0}")
                        span(v-if="service[setting.key] > 0") Enabled 
                        span(v-else) Disabled
                    .value(v-else) {{  service[setting.key] || '-' }}
    .container
        .titleActionsWrapper
            .titleWrapper
                h2 Manage your Service 
        .innerContainer.services
            .serviceGrid 
                RouterLink(:to="{name: 'users'}").serviceGridItem
                    .content
                        .title
                            Icon users
                            span Users
                        .body Within your service, users are individuals who have successfully created an account and logged in at least once. You can search for and apply access control using our easy to use user database management system.
                    .goto Go to Users >
                RouterLink(:to="{name: 'records'}").serviceGridItem  
                    .content
                        .title
                            Icon folder_open
                            span Record
                        .body Records are data objects created by you or your users and stored within your database. You can efficiently search, modify, or create new records using our database management system.
                    .goto Go to Records >
                //- RouterLink(to="/").serviceGridItem 
                    .content
                        .title
                            Icon mail
                            span Email System
                        .body Users are data that your service user's will store and read from your service database. 
                    .goto Go to Mail >
sui-overlay(ref="deleteConfirmOverlay")
    form.popup(@submit.prevent="deleteService" action="" :loading="isDisabled || null")
        .title
            Icon warning
            div Deleting Service?
        .body 
            p Are you sure you want to delete "{{ service.name }}" permanently? #[br] You will not be able to undo this action.
            p To confirm deletion, enter Service ID #[br] #[span(style="font-weight: bold") {{ service.service }}]
            sui-input(:placeholder="service.service" :value="confirmationCode" @input="(e) => confirmationCode = e.target.value")
        .foot
            sui-button(type="button" @click="()=> { deleteConfirmOverlay.close(); confirmationCode = ''}").textButton Cancel
            SubmitButton(:loading="isDisabled" class="textButton" backgroundColor="51, 51, 51") Delete
sui-overlay(ref="deleteErrorOverlay")
    .popup
        .title
            Icon warning
            div Something went wrong!
        .body {{ deleteErrorMessage }}
        .foot
            sui-button.lineButton(type="button" @click="()=> { deleteErrorOverlay.close(); }") Ok
</template>
<script setup>
import { inject, reactive, ref, watch, nextTick, onMounted } from 'vue';
import { state, skapi } from '@/main';
import { localeName, dateFormat, getSize } from '@/helper/common';
import { useRoute, useRouter } from 'vue-router';

import NavBarProxy from '@/components/mobile/NavBarProxy.vue';
import EditService from '@/views/mobile/Service/EditService.vue';
import Icon from '@/components/Icon.vue';
import SubmitButton from '@/components/SubmitButton.vue';

const route = useRoute();
const router = useRouter();

let service = inject('service');
// let pageTitle = inject('pageTitle');
// pageTitle.value = 'Service "' + service.value.name + '"'

const deleteConfirmOverlay = ref(null);
const deleteErrorOverlay = ref(null);
const confirmationCode = ref('');
const deleteErrorMessage = ref('');
const isEdit = ref(false);
const isDisabled = ref(false);

const informationGrid = reactive([
    {
        name: 'Service ID',
        key: 'service',
        span: 2
    },
    {
        name: 'Owner\'s ID',
        key: 'owner',
        span: 2
    },
    // {
    //     name: 'Group',
    //     key: 'group',
    //     filter: (value) => {
    //         return value == 1 ? 'Basic' : 'Premium'
    //     }
    // },
    {
        name: 'Service Location',
        key: 'region',
        filter: (value) => {
            return localeName(value);
        }
    },
    {
        name: 'Date Created',
        key: 'timestamp',
        filter: (value) => {
            return dateFormat(value).split(' ')[0];
        }
    },
    {
        name: 'Storage Use',
        key: 'storage',
        filter: (value) => {
            let val = value || 0;
            return getSize(val);
        }
    },
    {
        name: '# of Users',
        key: 'users'
    },
    // {
    //     name: '# of Newsletter Sub',
    //     key: 'newsletter_subscribers'
    // },
]);

const settingGrid = reactive([
    {
        name: 'Enable/Disable',
        key: 'active',
        filter: () => {
            return 1
            // return .indicator(:class="{'active': service.active > 0}")
        }
    },
    {
        name: 'Name of Service',
        key: 'name',
    },
    {
        name: 'CORS',
        key: 'cors',
        tip: 'When CORS is set, your website will not be able to connect to your service unless the request comes from a valid host.',
    },
    {
        name: 'API Key',
        key: 'api_key',
        tip: 'You can set your own private API key if you wish to integrate your users\' secure requests to your external backend server.',
    },
]);

const edit = () => {
    if(!state.user.email_verified) return false;
    router.push('?edit=service');
}

const deleteServiceAsk = () => {
    if(!state.user.email_verified) return;
    deleteConfirmOverlay.value.open();
}

const deleteService = () => {
    isDisabled.value = true;
    if(confirmationCode.value !== service.value.service) {
        confirmationCode.value = '';
        deleteErrorMessage.value = "Your service code did not match.";
        if(deleteConfirmOverlay.value) deleteConfirmOverlay.value.close();
        deleteErrorOverlay.value.open();
        isDisabled.value = false;
        return;
    }

    skapi.deleteService(service.value.service).then(() => {
        if(deleteConfirmOverlay.value) deleteConfirmOverlay.value.close();
        router.replace('/admin');
    }).catch(() => {
        deleteErrorMessage.value = "Please disable your service before deleting it.";
        if(deleteConfirmOverlay.value) deleteConfirmOverlay.value.close();
        deleteErrorOverlay.value.open();
    }).finally(() => {    
        confirmationCode.value = '';
        isDisabled.value = false;
    });
}

if(!service.value.hasOwnProperty('storage')) {
    skapi.storageInformation(service.value.service).then((storage) => {
        service.value.storage = storage.cloud + storage.database + storage.email;
    });
}
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';
.container {
    margin: 40px 0 0;
    border-radius: 0;

    .innerContainer {    
        padding: 20px;
        background: #434343;
        border-radius: 12px;
        .titleActionsWrapper {
            margin-bottom: 32px;

            h2 {
                font-size: 20px;
                font-weight: normal;
            }
        }

        &.services {
            padding: 0;
            background-color: transparent;
        }
    }

    h2,
    p {
        color: rgba(255, 255, 255, .85);
        margin: 0;
    }

    h2 {
        display: inline-block;
        vertical-align: middle;
        font-size: 24px;
        margin-bottom: 28px;
        font-weight: bold;
    }

    p {
        color: rgba(255, 255, 255, .85);
        line-height: 1.5;
    }

    .titleActionsWrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;

        h2 {        
            font-size: 20px;
            font-weight: normal;
        }
    }

    .titleWrapper {
        h2 {
            margin: 0;
        }

        svg {
            margin-right: 8px;
        }
    }

    .actions {
        cursor: pointer;
        user-select: none;
        svg {
            margin-right: 4px;
        }
        span {
            vertical-align: middle;
        }

        &.disabled {
            opacity: 0.4;
        }
    }

    &:first-child {
        margin-top: 0;
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.informationGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    row-gap: 28px;

    @media @phone {
        grid-template-columns: 1fr;
    }

    &Item {
        min-width: 0;

        .name {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;
        }

        .value {
            font-weight: bold;
            color: rgba(255, 255, 255, 0.85);
            word-break: break-all;
        }
        
        @media @phone {
        // @media screen and (max-width: 520px) {
            &.span-2 {
                grid-column: span 2;
            }
        }

    }
}

.settingGrid {
    display: flex;
    justify-content: space-between;
    grid-template-columns: repeat(2, 1fr);

    &Item {
        .name {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;
        }

        .value {
            font-weight: bold;
            color: rgba(255, 255, 255, 0.85);
        }

        &.span-2 {
            grid-column: span 2;
        }
    }

    @media @phone {
        grid-template-columns: repeat(1, 1fr);
        &Item {
            &.span-2 {
                grid-column: span 1;
            }
        }
    }
}

.settingGrid {
    display: grid;
    column-gap: 12px;
    row-gap:28px;

    &Item {
        .name {
            font-size: 14px;
            line-height: 1;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;

            span {
                vertical-align: middle;
            }
        }

        .value {
            font-weight: bold;
            color: rgba(255, 255, 255, 0.85);
            word-break: break-all;

            span {    
                vertical-align: middle;
            }
        }

        &.actions {
            align-self: flex-end;
            justify-self: flex-end;
        }
    }

    @media screen and (max-width: 1000px) {
        grid-template-columns: repeat(2, calc(50% - 6px));
        &Item {
            &.actions {
                grid-column: span 2;
                align-self: flex-end;
                justify-self: flex-end;
            }
        }
    }

    @media @phone {
        display: flex;
        flex-direction: column;

        &Item {
            &.actions {         
                grid-column: span 2;
                justify-self: flex-end;
            }
        }
    }

    
}

.serviceGrid {
    &Item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        background: #434343;
        padding: 24px;
        border-radius: 8px;
        margin-bottom: 20px;

        .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            .title {
                display: inline-block;
                margin-bottom: 28px;
                font-size: 20px;

                span {        
                    margin-left: 8px;    
                    vertical-align: middle;
                }
            }

            .body {    
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.5;
            }
        }

        .goto {
            text-align: left;
            margin-top: 40px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            text-decoration: none;
        }
    }
    a.serviceGridItem {
        text-align: left;
        color: rgba(255, 255, 255, 0.85);
        font-size: 14px;
        text-decoration: none;
    }

}
sui-tooltip {
    margin-top: -7px;
    margin-left: 8px;
}
.indicator {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #D9D9D9;
    border: 0.3px solid #595959;
    box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25), inset 1px 1px 2px rgba(255, 255, 255, 0.65);
    margin-right: 8px;
    
    &.active {
        background: #5AD858;
    }
}
</style>