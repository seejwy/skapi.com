<template lang="pug">
div(v-if='!state?.connection')
    // is loading...
ChangePassword(v-if="state?.user && route.query.page === 'password'")
div(v-else-if="state?.user")
    .page-header.head-space-helper
        h1.fixed Account Settings
    .settings-wrapper
        form.settings(@submit.prevent="updateUserSettings")
            .title Name
            .value(v-if="state.viewport === 'desktop'") 
                sui-input(v-if="isEdit" type="text" @input="(e) => settings.name = e.target.value" :value="settings.name")
                span(v-else) {{  state.user.name }}
            .actions
            .mobile-value(v-if="state.viewport === 'mobile'")
                sui-input(v-if="isEdit" type="text" @input="(e) => settings.name = e.target.value" :value="settings.name")
                span(v-else) {{  state.user.name }}

            hr
            .title Email
            .value(v-if="state.viewport === 'desktop'")
                sui-input(v-if="isEdit" type="text" :value="settings.email" @input="(e)=>settings.email = e.target.value")
                template(v-else)
                    span {{  state.user.email }}
                    .email-status(v-if="state.user.email_verified" :class="{'unverified': !state.user.email_verified ? true : null, 'verified': state.user.email_verified ? true : null}")
                        Icon warning
                        span(v-if="state.user.email_verified") Verified
                        span(v-else) Unverified
            .actions(v-if="!isEdit" @click="emailOverlay.open()")
                span Verify Email
            .mobile-value(v-if="state.viewport === 'mobile'")            
                sui-input(v-if="isEdit" type="text" :value="settings.email" @input="(e)=>settings.email = e.target.value")
                template(v-else)
                    span {{  state.user.email }}
                    .email-status(v-if="state.user.email_verified" :class="{'unverified': !state.user.email_verified ? true : null, 'verified': state.user.email_verified ? true : null}")
                        Icon warning
                        span(v-if="state.user.email_verified") Verified
                        span(v-else) Unverified
            hr   
            .title Subscription
            .value(v-if="state.viewport === 'desktop'")
                label
                    sui-input(type="checkbox" :disabled="isEdit ? null : true" :checked="settings.email_subscription ? true : null" @change="(e) => settings.email_subscription = e.target.checked")
                    span I agree to receive information and news letters from Skapi via Email.
            .mobile-value(v-if="state.viewport === 'mobile'")
                label
                    sui-input(type="checkbox" :disabled="isEdit ? null : true" :checked="settings.email_subscription ? true : null" @change="(e) => settings.email_subscription = e.target.checked")
                    span I agree to receive information and news letters from Skapi via Email.
                
                .actions(v-if="settings.email_subscription.isEdit")
                    span.cancel(@click="settings.email_subscription.isEdit = false") Cancel
                    span.save(@click="settings.email_subscription.isEdit = false") Save
            hr
            .title Password
            .value(v-if="state.viewport === 'desktop'")
            .actions
                span(@click="state.viewport === 'desktop' ? passwordOverlay.open() : router.replace('?page=password')") Change Password
            .mobile-value(v-if="state.viewport === 'mobile'")
            hr
            .submit
                SubmitButton(v-if="isEdit" :loading="isSaving") Save
                sui-button(v-else type="button" @click="isEdit = true") Edit Account
    Transition(name="toast")
        .toast(v-if="state.user && !state.user.email_verified && state.showVerificationNotification")
            Icon warning_bell
            .title Email Verfication is Needed
            div
            .body Please verify your email to prevent your services from shutting down.
            Icon.close(@click="state.showVerificationNotification = false") X2
sui-overlay(v-else-if="state.viewport !== 'mobile'" ref="overlay" style="background: rgba(0, 0, 0, 0.6);")
    Login
Login(v-else)
sui-overlay(ref="passwordOverlay" style="background: rgba(0, 0, 0, 0.6);")
    ChangePassword(@close="passwordOverlay.close()")
sui-overlay(ref="emailOverlay" style="background: rgba(0, 0, 0, 0.6);")
    form.container(@submit.prevent="verifyEmail")
        h2 Verify Email
        p Verification Email has been sent. Please check your email and enter the verification code.
        .input
            label Verification Code
            sui-input(type="text" placeholder="Verification Code" @input="(e) => verificationCode.value = e.target.value" :value="verificationCode.value")
        .input
            label Haven't got any code?
            sui-button.line-button(type="button" @click="resendCode" :disabled="secondsTillReady")
                template(v-if="secondsTillReady") Code has been sent
                template(v-else) Re-send Code
            .error(v-if="verificationCode.error")
                    Icon warning
                    span {{ verificationCode.error }}
        .actions
            sui-button.line-button Cancel
            SubmitButton(:loading="promiseRunning") Verify
</template>
<script setup>
import { inject, ref, onMounted } from 'vue';
import { state, awaitConnection } from '@/main';
import Login from './Login.vue';
import { useRoute, useRouter } from 'vue-router';

import Icon from '@/components/Icon.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import ChangePassword from '@/components/ChangePassword.vue';

import { skapi } from '../../main';

let router = useRouter();
let route = useRoute();

let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let serviceList = ref(null);
let overlay = ref(null);
const isEdit = ref(false);
let settings = ref({
    email_subscription: '',
    name: '',
    email: ''
});

const verificationCode = ref({
    value: '',
    error: ''
})

const passwordOverlay = ref(null);
const emailOverlay = ref(null);
const secondsTillReady = ref(null);

const resendCode = async () => {
    if(secondsTillReady.value !== null) return false;

    try {
        let countDown = setInterval(() => {
            if(secondsTillReady.value > 0) secondsTillReady.value--;
            else {
                secondsTillReady.value = null;
                clearInterval(countDown);
            }

        }, 1000);
        secondsTillReady.value = 30;
        await skapi.verifyEmail();

        
    } catch(e) {
        console.log({e:e});
        // if(e.code === 'LimitExceededException') {
        //     forgotError.value = "Limit exceeded. Please try again later.";
        // }
    }
}

const verifyEmail = () => {
    skapi.verifyEmail({code: verificationCode.value.value}).then((res) => {
        console.log({res})
    });
    emailOverlay.value.close();
}

const isSaving = ref(false);
const updateUserSettings = async () => {
    try {
        isSaving.value = true;
        let res = await skapi.updateProfile({
            name: settings.value.name,
            email_subscription: settings.value.email_subscription
        });

        settings.value.name = res.name;
        settings.value.email = res.email;
        settings.value.email_subscription = res.email_subscription;
    } catch(e) {
        console.log({e});
    } finally {
        isEdit.value = false;
        isSaving.value = false;
    }
}

onMounted(() => {
    awaitConnection.then(()=>{
        if(!state.user && state.viewport === 'desktop') {
            overlay.open();
        }

        if(state.user) {
            settings.value.email_subscription = state.user.email_subscription;
            settings.value.name = state.user.name;
            settings.value.email = state.user.email;
        }
    });
});
</script>

<style lang="less" scoped>
@import '@/assets/variables.less';

.page-header {
    @media @tablet {
        text-align: center;
    }

    h1 {
        display: block;
    }
}
.settings-wrapper {
    background-color: #fafafa;
    padding: 28px 37px;
    border-radius: 8px;

    @media @tablet {
        background-color: #fff;
        padding: 0;
        margin: 0 -20px;
        border-radius: 0;
    }

    @media @phone {
        margin: 0 -16px;
    }
}
.settings {
    display: grid;
    grid-template-columns: auto 1fr min-content;
    align-items: center;
    column-gap: 80px;

    & > .title {
        font-weight: bold;
        padding: 28px 0;
    }

    .value,
    .mobile-value {
        & > span {
            margin-right: 8px;
        }
    }
    
    .email-status {
        display: inline-block;

        span {
            vertical-align: middle;
        }

        svg {
            margin-right: 4px;
        }

        &.verified {
            color: #5AD858;
        }

        &.unverified {        
            color: #FF8D3B;
        }
    }

    .actions {
        justify-self: end;
        color: var(--primary-color);
        cursor: pointer;
        white-space: nowrap;

        .save,
        .cancel {
            display: inline-block;
            font-weight: bold;
        }

        .cancel {
            margin-right: 28px;
            color: #EB1717;
        }
    }

    .value,
    .mobile-value {
        label {
            display: flex;
            gap: 7px;

            sui-input {
                flex-shrink: 0;

                &[disabled] {
                    border-color: #D9D9D9;

                    &[checked] {
                        background: rgba(0, 0, 0, 0.25);
                        box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25);
                    }
                }
            }
        }

        .actions {
            text-align: right;
            margin-top: 28px;
        }

        & > sui-input {
            width: 100%;
        }
    }

    hr {    
        grid-column: span 3;
        width: 100%;
        border: 1px solid rgba(0, 0, 0, 0.04);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.06);
    }

    .submit {
        grid-column: span 3;
        justify-self: end;
        padding-top: 28px;
    }

    @media @tablet {
        grid-template-columns: auto 1fr ;
        column-gap: 0;
        padding: 20px;

        & > .title {
            height: auto;
            padding: 20px 0;
            .actions {
                display: block;
            }
        }

        .mobile-value {
            grid-column: span 2;
            padding-bottom: 28px;
        }
        

        hr {    
            grid-column: span 2;
            margin:  0 -20px;
            width: 100vw;
        }

        .submit {
            grid-column: span 2;
            grid-row: span 2;
            justify-self: center;
        }
    }
    @media @phone {
        padding: 16px;
        
        hr {
            margin: 0 -16px;
        }
    }
}
.container {
    text-align: center;
    padding: 40px;
    background: #FAFAFA;
    color: #000000d9;
    width: 542px;
    max-width: 100%;
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px #00000040;
    border-radius: 8px;

    p {
        margin: 40px 0;
    }

    .input {
        margin: 20px auto 12px;

        label,
        span {
            display: block;
            text-align: left;
            color: rgba(0, 0, 0, 0.65);
            margin-bottom: 8px;
        }
        label {
            font-weight: bold;
        }
        sui-input {
            width: 100%;
            border: 1px solid #8C8C8C;
        }
        sui-button {
            width: 100%;
        }

        .error {
            text-align: left;
            margin-top: 4px;

            * {
                display: inline;           
                color: #EB1717;
            }

            span {
                margin-left: 4px;
            }
        }
    }
    .actions {
        margin-top: 40px;
    }
    .step-wrapper {
        margin-top: 56px;

        .step {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #D9D9D9;
            margin-right: 12px;

            &:last-child {
                margin: 0;
            }

            &.active {
                background-color: var(--primary-color);
            }
        }
    }

    &.success {
        svg {
            color: #5AD858;
            width: 56px;
            height: 56px;
        }
    }
}

.line-button {
    color: var(--primary-color);
    white-space: nowrap;

    & ~ sui-button {
        margin-left: 16px;
    }
}
</style>
