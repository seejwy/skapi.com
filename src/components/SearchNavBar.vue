<template lang="pug">
.mobile-search-nav
    slot(name="left")
    div(style="width: 100%;")
        slot
    slot(name="right")
</template>
<style lang="less">
@import '@/assets/variables.less';

.mobile-search-nav {
    position: sticky;
    top: 0;
    height: 60px;
    display: flex;
    align-items: center;
    background-color: #333;
    z-index: 1;
    padding: 0 var(--side-padding);

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
        flex-shrink: 0;
        margin-left: -8px;
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

    svg {
        cursor: pointer;
    }
}
</style>