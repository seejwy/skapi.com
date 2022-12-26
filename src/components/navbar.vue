<template lang="pug">
sui-nav(auto-hide)
    .nav_align
        .title
            span.onlyOnMobile.material-symbols-outlined.clickable(v-if='!props.isParentLevel' style='margin-left: -24px;padding-left: 24px;') arrow_back_ios
            span.titleText.iconText {{ pageTitle }}
        .menu
            ul.hideOnMobile.iconText
                slot

            .material-symbols-outlined.more-button.onlyOnMobile.clickable(style='margin-right: -24px;padding-right: 24px;') more_horiz
</template>
<style lang="less">
@import '@/assets/variables.less';
sui-nav {
    background: #505050;
    box-shadow: none;
    color: #fff;
    padding: 0 24px;

    @media @ipad {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    }

    &>.nav_align {
        display: flex;
        max-width: 1000px;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        height: 60px;

        .menu {
            ul {
                margin: 0;
                list-style: none;
                padding: 0;

                li {
                    margin: 0;
                    padding: 0;
                    position: relative;
                    display: inline-block;

                    &:not(:last-child) {
                        margin: 0 20px 0 0;
                    }

                    a {
                        color: #fff;
                        text-decoration: none;
                    }
                }
            }

            .more-button {
                font-size: 32px;
            }
        }

        .title {
            flex-grow: 1;

            span {
                &.mobile {
                    font-size: 24px;
                    color: rgba(255, 255, 255, .4);
                    margin-right: 4px;
                }

                &.titleText {
                    font-weight: 700;
                    font-size: 24px;
                }
            }
        }
    }
}
</style>

<script setup>
import { inject } from 'vue';
const props = defineProps(['isParentLevel']);
let pageTitle = inject('pageTitle');
</script>