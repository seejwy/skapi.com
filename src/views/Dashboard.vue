<template lang="pug">
sui-nav(auto-hide)
    div
        .title.mobile
            span.back-button.mobile.material-symbols-outlined(@click="mobileBack") arrow_forward_ios
        .title.desktop {{ service?.name }}
        span.material-symbols-outlined.more-button.mobile(v-if="navbar.type !== 'search' && !$route.query.searchValue" @click="state.popup = 'menu'") more_horiz
        ul.menu
            li
                router-link(to="/" tag="li") Dashboard
            li
                router-link(to="/" tag="li") Documentation
            li
                router-link(to="/" tag="li") Account Settings
            li
                router-link(to="/" tag="li") Logout
main
    RouterView
</template>
<style lang="less" scoped>
@import '@/assets/variables.less';

sui-nav {
    display: flex;
    align-items: center;
    height: 60px;
    background: #505050;
    box-shadow: none;
    color: #fff;
    padding: 0;

    @media @tablet {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);

        &.search-bar {
            border-bottom: 1px solid rgba(255, 255, 255, .6);
            box-shadow: none;

            & sui-input {
                vertical-align: middle;
                box-shadow: none;

                & input:focus {
                    outline: none;
                }
            }
        }
    }

    &>div {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        padding: 0 20px;

        & .menu {
            @media @tablet {
                display: none;
            }

            & a {
                color: #fff;
                text-decoration: none;
            }
        }

        .more-button {
            font-size: 32px;
            cursor: pointer;
            user-select: none;
        }
    }

    .title {
        flex-grow: 1;
        font-weight: 700;
        font-size: 24px;
        line-height: 29px;

        &>div {
            flex-grow: 1;
            width: calc(100% - 28px);
        }

        &.mobile {
            width: 100%;

            & .search-query {
                display: flex;

                &>span {
                    flex-shrink: 0;
                }

                &>div {
                    flex-grow: 0;
                    display: inline-block;
                    font-weight: normal;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 100%;
                }
            }
        }

        font-size: 20px;
        color: rgba(255, 255, 255, .6);
        font-weight: 500;
        line-height: 24px;

        &.mobile {
            display: flex;
            align-items: center;
        }
    }

    ul,
    li {
        list-style: none;
        margin: 0;
        padding: 0;
        position: relative;
        display: inline-block;
    }

    li:not(:last-child) {
        margin: 0 20px 0 0;
    }

    &.mobile-search {
        background-color: #333;
        box-shadow: none;
        border-bottom: 1px solid #fff;
    }
}
</style>