<template lang="pug">
.container
    h1 Confirm Your Email
    p Please check your inbox for a confirmation email. Click the link in the email to confirm your email address. 
    p Haven't got any code?
    sui-button.line-button(type="button" @click="resendSignupConfirmation" :disabled="secondsTillReady || null") Re-send Confirmation Email
        span(v-if="secondsTillReady") &nbsp; ({{  secondsTillReady }})
</template>
<script setup>
import { inject, ref } from 'vue';
import { skapi, state } from '@/main';
import { useRouter } from 'vue-router';

let router = useRouter();
const secondsTillReady = ref(null);

// set page title
let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

async function resendSignupConfirmation() {
    if(secondsTillReady.value !== null) return false;

    secondsTillReady.value = 5;
    let countDown = setInterval(() => {
        if(secondsTillReady.value > 0) secondsTillReady.value--;
        else {
            secondsTillReady.value = null;
            clearInterval(countDown);
        }

    }, 1000);
    try {
        let x = await skapi.resendSignupConfirmation();
    } catch(e) {
        console.log({e: e});
        if(e.code === 'INVALID_REQUEST') {
            router.replace('/dashboard');
        }
    }
}
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';
.container {
    position: absolute;
    text-align: center;
    padding: 40px;
    background: #FAFAFA;
    border-radius: 8px;
    width: 542px;
    max-width: 100%;
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media @tablet {
        position: absolute;
        width: 100%;
        top: unset;
        left: 0;
        transform: none;
        border-radius: 0;
        box-shadow: none;
        border: none;
        background: #FFF;
    }

    & > * {
        width: 100%;
    }

    h1 {
        font-size: 32px;
        margin: 0 0 36px 0;
    }

    .input {
        margin: 20px auto 12px;

        label {
            display: block;
            text-align: left;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.65);
            margin-bottom: 8px;
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
    }

    sui-input[type=submit] {
        margin-bottom: 24px;
    }

    a {
        color: #293FE6;
        text-decoration: none;
        font-weight: bold;
    }

    .line-button {
        color: var(--primary-color);
    }
}
</style>