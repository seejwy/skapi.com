<template lang="pug">
.form.container(v-if="processStep < 2")
    h2 Change Password
    form(v-if="processStep === 0" @submit.prevent="verifyPassword" action="")
        p Please enter you current password.
        .input
            label Current Password
            PasswordInput(@input="(e) => password.current.value = e.target.value" :value="password.current.value")
            .error(v-if="password.current.error")
                Icon warning
                span {{ password.current.error }}
        .actions
            sui-button.line-button(type="button" @click="closePasswordChange") Cancel
            SubmitButton(type="button" :loading="promiseRunning" @click.prevent="verifyPassword") Continue
        .step-wrapper
            .step.active
            .step
    form(v-else-if="processStep === 1" @submit.prevent="changePassword" action="")
        p Please enter you current password.
        .input
            label New Password
            PasswordInput(@input="(e) => password.new.value = e.target.value" :value="password.new.value")
        .input
            label New Password Confirm
            PasswordInput(@input="(e) => password.confirm.value = e.target.value" :value="password.confirm.value")
            .error(v-if="password.confirm.error")
                Icon warning
                span {{ password.confirm.error }}
        .actions
            sui-button.line-button(type="button" @click="closePasswordChange") Cancel
            SubmitButton(:loading="promiseRunning") Change Password
        .step-wrapper
            .step.clickable(@click="processStep = 0")
            .step.active
.form.container.success(v-else)
    Icon check_circle
    h2 Password Change Success
    p Your password has been changed successfully. Please login with new password.
    .actions
        sui-button(@click="logout") Login
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, onBeforeUnmount } from 'vue';
import { state, skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from './Icon.vue';
import PasswordInput from './PasswordInput.vue';
import SubmitButton from './SubmitButton.vue';

const router = useRouter();
const route = useRoute();

const emit = defineEmits(['close']);
const processStep = ref(0);

const password = ref({
    current: {
        value: '',
        error: ''
    },
    new: {
        value: ''
    },
    confirm: {
        value: '',
        error: ''
    }
});

const promiseRunning = ref(false);

const closePasswordChange = () => {
    if(state.viewport === 'desktop') emit('close');
    else router.replace('');
    processStep.value = 0;
    password.value.current.value = '';
    password.value.confirm.value = '';
    password.value.new.value = '';
    password.value.current.error = '';
    password.value.confirm.error = '';
}

const verifyPassword = async () => {
    promiseRunning.value = true;
    password.value.current.error = '';

    if(password.value.current.value.length < 6) {
        password.value.current.error = 'Password must be at least 6 characters'    
        promiseRunning.value = false;
        return false;
    }

    try {
        await skapi.login({email: state.user.email, password: password.value.current.value}, {logout: false});
        processStep.value = 1;
    } catch(e) {
        console.log({e: e.code});
        if(e.code === 'INCORRECT_USERNAME_OR_PASSWORD') {
            password.value.current.error = 'Current password is incorrect';
        } else if(e.code === 'LimitExceededException') {
            password.value.current.error = 'Your password change limit has exceeded. Verify your password again later.';
        }
    } finally {
        promiseRunning.value = false;
    }
}

const changePassword = async () => {
    promiseRunning.value = true;
    password.value.confirm.error = '';

    if(password.value.new.value.length < 6) {
        password.value.confirm.error = 'Password must be at least 6 characters';   
        promiseRunning.value = false;
        return false;
    }
    if(password.value.new.value !== password.value.confirm.value) {
        password.value.confirm.error = 'Your password does not match';    
        promiseRunning.value = false;
        return false;
    }

    try {
        await skapi.changePassword({
            current_password: password.value.current.value,
            new_password: password.value.new.value
        });

        processStep.value = 2;
    } catch(e) {
        console.log({e: e.code});
        if(e.code === 'LimitExceededException') {
            password.value.confirm.error = 'Your password change limit has exceeded.';
        }
    } finally {    
        promiseRunning.value = false;
    }
}

const logout = () => {
    skapi.AdminLogout().then(() => {
        state.user = null;
        router.push('dashboard');
    });
}

watch(() => state.viewport, (viewport) => {
    if(viewport === 'desktop' && route.query.page === 'password') {
        router.replace('');
    } else if(viewport === 'mobile') {
        emit('close');
    }
});

onBeforeUnmount(() => {
    router.replace('');
});
</script>

<style lang="less" scoped>
@import '@/assets/variables.less';

.form.container {
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
        line-height: 1.5;
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

    @media @tablet {
        border: none;
        box-shadow: none;
        background-color: transparent;
        padding: 0px;
        margin: var(--head-space) auto 0;
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