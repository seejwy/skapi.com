<template lang="pug">
form.form.container(@submit.prevent="verifyEmail" action="")
    h2 Verify Email
    p Verification Email has been sent. Please check your email and enter the verification code.
    .input
        label Verification Code
        sui-input(:disabled="promiseRunning" type="text" placeholder="Verification Code" @input="(e) => verificationCode.value = e.target.value" :value="verificationCode.value")
    .input
        label Haven't got any code?
        sui-button.line-button(type="button" @click="resendCode" :disabled="promiseRunning || secondsTillReady")
            template(v-if="secondsTillReady") Code has been sent
            template(v-else) Re-send Code
        .error(v-if="verificationCode.error")
                Icon warning
                span {{ verificationCode.error }}
    .actions
        sui-button.line-button(type="button" @click="close" :disabled="promiseRunning") Cancel
        SubmitButton(:loading="promiseRunning") Verify
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, onBeforeUnmount } from 'vue';
import { state, skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from './Icon.vue';
import SubmitButton from './SubmitButton.vue';

const router = useRouter();
const route = useRoute();

const emit = defineEmits(['close']);
const verificationCode = ref({
    value: '',
    error: ''
});
const promiseRunning = ref(false);

const verifyEmail = () => {
    verificationCode.value.error = '';
    promiseRunning.value = true;
    skapi.verifyEmail({code: verificationCode.value.value}).then((res) => {
        state.user.email_verified = true;
        verificationCode.value.value = '';
        verificationCode.value.error = '';

        if(state.viewport === 'desktop') emit('close');
        else router.replace('');
    }).catch((e) => {
        console.log({e: e.code});
        console.log(e.code);
        verificationCode.value.error = 'Verification Failed';
    }).finally(() => {    
        promiseRunning.value = false;
    });
}

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
        if(e.code === 'LimitExceededException') {
            verificationCode.value.error = "Limit exceeded. Please try again later.";
        }
    }
}

const close = () => {
    verificationCode.value.value = '';
    verificationCode.value.error = '';

    state.viewport === 'desktop' ? emit('close') : router.replace('');
}

watch(() => state.viewport, (viewport) => {
    if(viewport === 'desktop' && route.query.page === 'verify') {
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
        }
        sui-button {
            width: 100%;
        }

        .error {
            text-align: left;
            margin-top: 4px;

            * {
                display: inline;           
                color: #F04E4E;
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
    & ~ sui-button {
        margin-left: 16px;
    }
}
</style>