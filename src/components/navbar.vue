<template lang="pug">
sui-nav#top-nav(auto-hide)
    .nav_align
        .title
            span.onlyOnTablet.material-symbols-outlined.clickable(v-if='!props.isParentLevel' style='margin-left: -24px;padding-left: 24px;') arrow_back_ios
            span.titleText.iconText {{ pageTitle }}
        .menu
            .hideOnTablet
                slot
            .material-symbols-outlined.more-button.onlyOnTablet.clickable(style='margin-right: -24px;padding-right: 24px;' @click='open') more_horiz

sui-overlay(ref='navOverlay' transition-time='0.2s' @click='()=>close(true)' style='background-color: rgba(31, 31, 31, .6); color:white;' position="right")
    #nav-overlay(@click="()=>close(true)")
        slot

</template>
<style lang="less">
@import '@/assets/variables.less';

#nav-overlay {
    // @media @ipad {
    //     min-width: 30vw;
    // }

    // @media @tablet {
    min-width: 50vw;
    // }

    @media @phone {
        min-width: 70vw;
    }

    background-color: #1F1F1F;
    height: 100vh;
    padding: 70px 8px;

    ul {
        margin: 0;
        list-style: none;
        padding: 0;

        li {
            a {
                color: #fff;
                text-decoration: none;
                font-family: 'Radio Canada';
                font-weight: 600;
                font-size: 20px;
            }

            display: block;
            margin: 0;
            padding: 0;
            margin-bottom: 28px;
            padding-left: 28px;
        }
    }
}

sui-nav#top-nav {
    background: #505050;
    box-shadow: none;
    color: #fff;
    padding: 0 24px;

    @media @tablet {
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
import { inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps(['isParentLevel']);

let pageTitle = inject('pageTitle');
let navOverlay = ref(null);
let router = useRoute();

watch(() => router.name, () => {
    close();
});

function close(keepScrollPosition = false) {
    let scrollY = document.body.style.top;
    let isFixed = document.body.style.position === 'fixed';
    if (isFixed) {
        document.body.style.position = '';
        document.body.style.top = '';

        if (keepScrollPosition) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    navOverlay.value.close();
}

function open() {
    navOverlay.value.open(() => {
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = 'fixed';
    });
}

</script>