<template lang="pug">
router-view
</template>

<script setup>
import { inject, provide, ref } from 'vue';
import { state } from '@/main';
import { useRouter } from 'vue-router';
let router = useRouter();
provide('searchResult', ref(null));
provide('recordToOpen', ref(null));
</script>

<style lang="less">
@import '@/assets/variables.less';

.view-record-overlay {
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    width: 500px;
    max-width: 100%;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
}

.close-record-overlay {
    position: absolute;
    right: -16px;
    top: -16px;
    z-index: 1;
    background-color: #D9D9D9;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: #434343;
    cursor: pointer;

    svg {
        user-select: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.mobile-search-nav {
    position: sticky;
    top: 0;
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 28px;
    background-color: #333;
    z-index: 1;
    padding: 0 8px;

    &::after {
        display: block;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        content: '';
        height: 1px;
        background-color: rgba(255 255 255 / 60%);
        box-shadow: 0px 2px 0 0 rgba(0, 0, 0, 0.2);
    }

    .back-button {
        display: inline;
        height: 32px;
        width: 32px;
        color: rgba(255, 255, 255, .4);
    }

    sui-input {
        box-shadow: none;
        width: 100%;

        input:focus {
            outline: none;
        }

        &+span {
            position: absolute;
            right: 8px;
        }
    }
}
</style>