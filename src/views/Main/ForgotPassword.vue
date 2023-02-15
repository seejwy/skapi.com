<template lang="pug">
.wrapper
    .container
        template(v-if="step === 1")
            form(@submit.prevent="forgotPassword")
                h1 Forgot Password
                p Please enter the email address you ‘d like your password reset information sent to
                .input
                    label Enter your Email
                    sui-input(
                        type="email" 
                        placeholder="E.g. someone@gmail.com"
                        :value="email"
                        @input="(e) => email = e.target.value"
                        required)
                .error(v-if="forgotError") {{ forgotError }}
                sui-button(type="submit") Continue
                RouterLink(to="/dashboard") Back to Login
        template(v-else-if="step === 2")
            form(@submit.prevent="changePassword")
                h1 New Password
                p Please check your email and insert the code in order to create a new password.
                p The code has been sent to : {{email}}
                .input
                    label Code
                    sui-input(
                        type="text"
                        :value="code"
                        @input="(e) => code = e.target.value"
                        placeholder="Enter verification code"
                        required)
                .input
                    span Haven't got any code?
                    sui-button.line-button(type="button" @click="resendForgotPassword" :disabled="(secondsTillReady || forgotError || isRequestingCode) || null") 
                        template(v-if="forgotError") {{ forgotError }}
                        template(v-else-if="isRequestingCode") 
                            Icon.animation-rotation--slow-in-out loading
                        template(v-else-if="secondsTillReady") Code has been sent
                        span(:style="{color: 'var(--primary-color)', margin: 0, visibility: !forgotError && !isRequestingCode && !secondsTillReady ? 'visible' : 'hidden', position:  !forgotError && !secondsTillReady ? 'relative' : 'absolute'}") Resend Code
                .input
                    label New Password
                    sui-input(
                        type="password" 
                        :value="password"
                        @input="(e) => password = e.target.value"
                        placeholder="E.g. someone@gmail.com"
                        @change="validatePassword" 
                        required)
                .input
                    label Retype New Password
                    sui-input(
                        type="password" 
                        :value="passwordConfirm"
                        @input="(e) => passwordConfirm = e.target.value"
                        placeholder="E.g. someone@gmail.com"
                        @change="validatePasswordConfirm" 
                        required)
                
                sui-button(type="submit") Change
        template(v-else)
            Icon check_circle
            h1 New Password Success
            p Your password has been changed successfully. Please login with new password.
            sui-button(type="button" @click="router.push('/dashboard')") Login

        .navigator(v-if="step <= 2")
            .ball(v-for="num in 2" @click="num < step ? step = num : null" :class="{'active': step === num}")

</template>
<script setup>
import { inject, ref, onBeforeMount } from 'vue';
import { skapi, state } from '@/main';
import { useRouter } from 'vue-router';

import Icon from '@/components/Icon.vue';

let router = useRouter();
// set page title
let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';
let email = ref('jinyoon@broadwayinc.com');
let code = ref('');
let password = ref('');
let passwordConfirm = ref('');
let forgotError = ref(null);
let resetError = ref(null);
const secondsTillReady = ref(null);
const isRequestingCode = ref(false);

let step = ref(1);

onBeforeMount(async() => {
    await skapi.getConnection().then(() => {
        if(state.user) router.push({name: 'dashboard'});
    })
});

const validatePassword = (event) => {
    if(event.target.value.length >= 6 && event.target.value.length <= 60) {
		event.target.setCustomValidity('');
    } else {
		event.target.setCustomValidity('Invalid Password');
		event.target.reportValidity();
    }
}

const validatePasswordConfirm = (event) => {
    if(event.target.value !== password.value) {
		event.target.setCustomValidity('Password does not match');
		event.target.reportValidity();
    } else {
		event.target.setCustomValidity('');
    }
}

const forgotPassword = () => {
    forgotError.value = null;
    skapi.forgotPassword({email: email.value}).then(res => {
        step.value++;
    }).catch(e => {
        console.log({e:e.code});
        if(e.code === 'LimitExceededException') {
            forgotError.value = "You have exceeded the number of tries. Please try again later.";
        }
    });
}

const resendForgotPassword = async () => {
    if(secondsTillReady.value !== null || forgotError.value !== null) return false;
    forgotError.value = null;

    try {
        isRequestingCode.value = true;
        await skapi.forgotPassword({email: email.value})
        isRequestingCode.value = false;

        secondsTillReady.value = 30;
        let countDown = setInterval(() => {
            if(secondsTillReady.value > 0) secondsTillReady.value--;
            else {
                secondsTillReady.value = null;
                clearInterval(countDown);
            }

        }, 1000);
    } catch(e) {
        console.log({e:e.code});
        if(e.code === 'LimitExceededException') {
            forgotError.value = "Limit exceeded. Please try again later.";
        }
    }
}

const changePassword = () => {
    skapi.resetPassword({ email: email.value, code: code.value, new_password: password.value }).then(() => {    
        step.value++;
    });
}

</script>
<style lang="less" scoped>
@import '@/assets/variables.less';
.wrapper {
    display: flex;
    min-height: calc(100vh - 60px);
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    @media @tablet {
        align-items: flex-start;
        padding: 0;
    }
}
.container {
    text-align: center;
    padding: 40px;
    background: #FAFAFA;
    border-radius: 8px;
    width: 542px;
    max-width: 100%;
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 8px;

    @media @tablet {
        width: 100%;
        border-radius: 0;
        box-shadow: none;
        border: none;
        background: #FFF;
        padding: 0;
        margin-top: 40px;
    }

    & > *:not(sui-button) {
        width: 100%;
    }

    sui-button[type=submit] {
        margin-top: 40px;
    }

    sui-button {
        min-width: 140px;

        & + a {
            margin-top: 20px;
            display: block;
        }
    }

    h1 {
        font-size: 32px;
        margin: 20px 0 40px 0;
    }

    p {
        margin: 20px auto;

        &:first-of-type {
            margin-top: 40px;
        }
        &:last-of-type {
            margin-bottom: 40px;
        }
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
    }
    .action {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        label {
            cursor: pointer;

            sui-input {
                vertical-align: middle;
                margin-right: 4px;
            }

            span {
                vertical-align: middle;
                color: rgba(0, 0, 0, 0.65);
            }
        }

        a {
            font-weight: normal;
        }
    }

    .error {
        text-align: left;
        color: #EB1717;
        margin-bottom: 27px;

        svg {
            margin-right: 4px;
        }

        & + sui-button[type=submit] {
            margin-top: 0;
        }
    }

    a {
        color: #293FE6;
        text-decoration: none;
        font-weight: bold;
    }

    .line-button {
        display: block;
        color: var(--primary-color);

        svg {
            position: absolute;
            width: 20px;
            height: 20px;
        }
    }

    svg {
        height: 56px;
        width: 56px;
        color: #5AD858;
    }
}
.navigator {
    margin-top: 56px;
    .ball {
        display: inline-block;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background-color: #D9D9D9;
        cursor: pointer;
        margin-right: 12px;

        &.active {        
            background-color: var(--primary-color);
        }

        &:last-child {
            margin: 0;
        }
    }
}
</style>