<template lang="pug">
.container
    Icon check_circle
    h1 Congratulations!
    p Your email has been confirmed. #[br] You can now login to Skapi.
    sui-button(type="button" @click="router.push('/dashboard')") Login
</template>
<script setup>
import { inject } from 'vue';
import { skapi, state } from '@/main';
import { useRouter } from 'vue-router';

import Icon from '@/components/Icon.vue';

let router = useRouter();
// set page title
let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

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

    & > *:not(sui-button) {
        width: 100%;
    }

    sui-button {
        min-width: 140px;
    }

    h1 {
        font-size: 32px;
        margin: 16px 0 20px 0;
    }

    p {
        margin: 20px auto 40px auto;
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

    a {
        color: #293FE6;
        text-decoration: none;
        font-weight: bold;
    }

    .line-button {
        color: var(--primary-color);
    }

    svg {
        height: 56px;
        width: 56px;
        color: #5AD858;
    }
}
</style>