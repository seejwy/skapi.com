<template lang="pug">
div(v-if='!state?.connection')
    // is loading...
ChangePassword(v-if="state?.user && state.viewport === 'mobile' && route.query.page === 'password'")
VerifyEmail(v-else-if="state?.user && state.viewport === 'mobile' && route.query.page === 'verify'")
DeleteAccount(v-else-if="state?.user && state.viewport === 'mobile' && route.query.page === 'delete'")
div(v-else-if="state?.user" :loading="isSaving || null")
    .page-header.head-space-helper
        h1.fixed Account Settings
    .settings-wrapper
        form.settings(@submit.prevent="updateUserSettings" @keydown.enter.prevent="" action="")
            hr(v-if="state.viewport === 'mobile'")
            .title Name
            .value(v-if="state.viewport === 'desktop'")
                sui-input(v-if="isEdit" type="text" @input="(e) => settings.name = e.target.value" :value="settings.name")
                span(v-else) {{  state.user.name }}
            .actions
            .mobile-value(v-if="state.viewport === 'mobile'")
                sui-input(v-if="isEdit" type="text" @input="(e) => settings.name = e.target.value" :value="settings.name")
                span(v-else) {{  state.user.name }}

            hr
            .title(style="margin-bottom: 0;") Email
            .value(v-if="state.viewport === 'desktop'")
                sui-input(
                    v-if="isEdit" 
                    type="text" 
                    :value="settings.email" 
                    @input="(e)=> { settings.email = e.target.value; e.target.setCustomValidity(''); }" 
                    @change="validateEmail"
                    inputmode="email")
                template(v-else)
                    span {{  state.user.email }}
                    .email-status(:class="{'unverified': !state.user.email_verified ? true : null, 'verified': state.user.email_verified ? true : null}")
                        Icon warning
                        span(v-if="state.user.email_verified") Verified
                        span(v-else) Unverified
                    .error(v-if="isVerifyErrorMessage") You have exceeded the number of tries. Please try again later.
            .actions(v-if="!state.user.email_verified" @click="openVerifyEmail")
                span Verify Email
            .mobile-value(v-if="state.viewport === 'mobile'")            
                sui-input(
                    v-if="isEdit" 
                    type="text" 
                    :value="settings.email" 
                    @input="(e)=> { settings.email = e.target.value; e.target.setCustomValidity(''); }" 
                    @change="validateEmail"
                    inputmode="email")
                template(v-else)
                    span {{  state.user.email }}
                    .email-status(:class="{'unverified': !state.user.email_verified ? true : null, 'verified': state.user.email_verified ? true : null}")
                        Icon warning
                        span(v-if="state.user.email_verified") Verified
                        span(v-else) Unverified
                    .error(v-if="isVerifyErrorMessage") You have exceeded the number of tries. Please try again later.
            hr   
            .title Newsletter Subscription
            .value(v-if="state.viewport === 'desktop'")
                template(v-if="isEdit")
                    label
                        sui-input(type="checkbox" :disabled="!state.user.email_verified ? true : null" :checked="settings.email_subscription ? true : null" @change="(e) => settings.email_subscription = e.target.checked")
                        span I agree to receive information and news letters from Skapi via Email.
                template(v-else-if="settings.email_subscription !== ''")
                    template(v-if="settings.email_subscription") Subscribed
                        span(v-if="!state.user.email_verified" style="margin-left: 10px; color: #FF8D3B;")   ( Needs Verification )
                    template(v-else) Not Subscribed
            .mobile-value(v-if="state.viewport === 'mobile'")
                template(v-if="isEdit")
                    label
                        sui-input(type="checkbox" :disabled="state.user.email_verified ? null : true" :checked="settings.email_subscription ? true : null" @change="(e) => settings.email_subscription = e.target.checked")
                        span I agree to receive information and news letters from Skapi via Email.
                template(v-else)
                    template(v-if="settings.email_subscription") Subscribed
                    template(v-else) Not Subscribed
                .actions(v-if="settings.email_subscription.isEdit")
                    span.cancel(@click="settings.email_subscription.isEdit = false") Cancel
                    span.save(@click="settings.email_subscription.isEdit = false") Save
            hr
            .title(style="margin-bottom: 0;") Password
            .value(v-if="state.viewport === 'desktop'")
            .actions
                span(@click="() => { if(isSaving) return false; state.viewport === 'desktop' ? passwordOverlay.open() : router.replace('?page=password')}") Change Password
            .mobile-value(v-if="state.viewport === 'mobile'")
            hr
            .submit
                template(v-if="isEdit")
                    sui-button.line-button(type="button" @click="cancelEdit") Cancel
                    SubmitButton(:loading="isSaving") Save
                sui-button(v-else type="button" @click="isEdit = true") Edit Account

    .settings-wrapper.delete     
        hr(v-if="state.viewport === 'mobile'")
        div(@click="openDeletePopup") Delete Your Account
            Icon(style="height: 20px; width: 20px; margin-left: 8px;") trash
    Transition(name="toast")
        .toast(v-if="state.user && !state.user.email_verified && state.showVerificationNotification")
            Icon warning_bell
            .title Email Verfication is Needed
            div
            .body Please verify your email to prevent your services from shutting down.
            Icon.close(@click="state.setVerificationDelay") X2
    sui-overlay(v-if="state.viewport === 'desktop'" ref="passwordOverlay" style="background: rgba(0, 0, 0, 0.6);")
        ChangePassword(v-if="state.viewport === 'desktop'" @close="passwordOverlay.close()")
    sui-overlay(v-if="state.viewport === 'desktop'" ref="emailOverlay" style="background: rgba(0, 0, 0, 0.6);")
        VerifyEmail(@close="emailOverlay.close()")
    sui-overlay(v-if="state.viewport === 'desktop' && isDelete" ref="deleteAccountOverlay" style="background: rgba(0, 0, 0, 0.6);")
        DeleteAccount(@close="deleteAccountOverlay.close(() => isDelete = false)")
</template>
<script setup>
import { inject, ref, onMounted, watch, nextTick } from 'vue';
import { state, awaitConnection } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '@/components/Icon.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import ChangePassword from '@/components/ChangePassword.vue';
import VerifyEmail from '@/components/VerifyEmail.vue';
import DeleteAccount from '@/components/DeleteAccount.vue';

import { skapi } from '@/main';

let router = useRouter();
let route = useRoute();

let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let serviceList = ref(null);
let overlay = ref(null);
const isEdit = ref(false);
const isDelete = ref(false);
let settings = ref({
    email_subscription: '',
    name: '',
    email: ''
});
const isVerifyErrorMessage = ref(false);

const deleteAccountOverlay = ref(null);
const passwordOverlay = ref(null);
const emailOverlay = ref(null);
const isSaving = ref(false);

const openDeletePopup = async () => {
    if (isSaving.value) return false;

    isDelete.value = true;
    await nextTick();
    if (state.viewport === 'desktop') deleteAccountOverlay.value.open();
    else router.replace('?page=delete');
};
const openVerifyEmail = async () => {
    skapi.verifyEmail().catch(err => console.log(err));
    if (state.viewport === 'desktop') emailOverlay.value.open();
    else router.replace('?page=verify');

};

const cancelEdit = () => {
    isEdit.value = false;
    settings.value.name = state.user.name;
    settings.value.email = state.user.email;
    settings.value.email_subscription = state.user.email_subscription;
};

const validateEmail = (event) => {
    if (skapi.validate.email(event.target.value)) {
        event.target.setCustomValidity('');
    } else {
        event.target.setCustomValidity('Invalid Email');
        event.target.reportValidity();
    }
};

const updateUserSettings = async () => {
    if (state.user.name === settings.value.name && state.user.email === settings.value.email && state.user.email_subscription === settings.value.email_subscription) {
        isEdit.value = false;
        isSaving.value = false;
        return true;
    }

    try {
        isSaving.value = true;
        let isSubscribe = settings.value.email !== state.user.email ? false : settings.value.email_subscription;
        let res = await skapi.updateProfile({
            name: settings.value.name,
            email: settings.value.email
        });

        if (state.user.email_subscription !== settings.value.email_subscription) {
            if (settings.value.email_subscription) {
                await skapi.subscribeNewsletter({ group: 1 });
                settings.value.email_subscription = true;
            } else {
                await skapi.unsubscribeNewsletter({ group: 1 });
                settings.value.email_subscription = false;
            }
        }

        state.user = res;
        if (!res.email_verified) state.showVerificationNotification = true;

    } catch (e) {
        console.log({ e });
        settings.value.name = state.user.name;
        settings.value.email = state.user.email;
        settings.value.email_subscription = state.user.email_subscription;
    } finally {
        isEdit.value = false;
        isSaving.value = false;
    }
};

const deleteAccount = async () => {
    let res = await skapi.postRecord(null, {
        table: {
            name: 'reason'
        },
        index: {
            name: 'NR',
            value: true
        }
    });
};

onMounted(() => {
    awaitConnection.then(async () => {
        if (state.user) {
            if (!state.user.hasOwnProperty('email_subscription')) {
                let subscriptions = await skapi.getNewsletterSubscription();
                state.user.email_subscription = subscriptions.length && subscriptions[0].group === 1 ? true : false;
                settings.value.email_subscription = subscriptions.length && subscriptions[0].group === 1 ? true : false;
            } else {
                settings.value.email_subscription = state.user.email_subscription;
            }
            settings.value.name = state.user.name;
            settings.value.email = state.user.email;
        }
    });
});

watch(() => state.user, async (user) => {
    await nextTick();
    if (!user) {
        overlay.value.open();
    }
});
</script>
    
<style lang="less" scoped>
@import '@/assets/variables.less';

.page-header {
    @media @tablet {
        text-align: center;
        margin-bottom: 12px;
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

    &.delete {
        line-height: 52px;
        margin-top: 24px;
        padding: 0 37px;
        user-select: none;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.65);

        &> {
            cursor: pointer;
        }

        @media @phone {
            line-height: 1;
        }

        @media @tablet {
            padding: 0 16px;
        }
    }
}

.settings {
    display: grid;
    grid-template-columns: auto 1fr min-content;
    align-items: center;
    column-gap: 80px;

    &>.title {
        font-weight: bold;
        padding: 28px 0;
        color: rgba(0, 0, 0, .65);
        white-space: nowrap;
    }

    .value,
    .mobile-value {
        @media @tablet {
            margin-top: 8px;
        }

        &>span {
            display: inline-block;
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
        font-weight: bold;
        cursor: pointer;
        white-space: nowrap;

        .save,
        .cancel {
            display: inline-block;
            font-weight: bold;
        }

        .cancel {
            margin-right: 28px;
            color: #F04E4E;
        }
    }

    .value,
    .mobile-value {
        label {
            display: flex;
            gap: 7px;

            sui-input {
                flex-shrink: 0;
                margin-top: calc((1.5em - 16px) / 2);
            }

            span {
                line-height: 1.5;
            }
        }

        .actions {
            text-align: right;
            margin-top: 28px;
        }

        &>sui-input {
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
        grid-template-columns: auto 1fr;
        column-gap: 0;
        padding: 0 20px;

        &>.title {
            height: auto;
            padding: 0;

            .actions {
                display: block;
            }
        }

        .mobile-value {
            grid-column: span 2;

            &>span {
                margin-top: 20px;
            }
        }


        hr {
            grid-column: span 2;
            margin: 28px -20px;
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
            margin: 28px -16px;
        }
    }
}

@media @phone {
    .delete {
        hr {
            border: 1px solid rgba(0, 0, 0, 0.04);
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.06);
            width: 100vw;
            margin: 80px -16px 28px;
        }
    }
}

.error {
    text-align: left;
    margin-top: 4px;
    color: #F04E4E;
}

.line-button {
    &~sui-button {
        margin-left: 16px;
    }
}
</style>
    