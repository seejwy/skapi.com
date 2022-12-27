<template lang="pug">
.topPadding.hideOnMobile
    h1 Record
    span This is some text

.search-field
    sui-select(name="searchType" :value="searchForm.type" @input="e => searchForm.type = e.target.value" @change="searchForm.value = ''")
        option(value="table" :selected="searchForm.type === 'table'") Table Name
        option(value="user" :selected="searchForm.type === 'user'") User ID
        option(value="record" :selected="searchForm.type === 'record'") Record ID
    .input-field
        span.material-symbols-outlined.placeholder-icon(v-if="!searchForm.value") search
        div(style="display: inline-block; position: relative;")
        sui-input(type="search" name="searchValue" placeholder="Search" required :value="searchForm.value" @input="enterSearch" autocomplete="off")
        span.material-symbols-outlined(@click="searchForm.type !== 'record' ? isAdvanced = !isAdvanced : isAdvanced = false" style="cursor: pointer") tune
</template>
<!-- script below -->
<script setup>
import { inject } from 'vue';
let pageTitle = inject('pageTitle');
pageTitle.value = 'Records';
</script>
<style lang="less">
.topPadding {
    padding: 50px 0;
}

.search-field {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);
    border-radius: 4px;

    & sui-select,
    & sui-input {
        box-shadow: none;
        border: 0;
        background: transparent;
        vertical-align: middle;
    }

    & sui-select {
        width: 9em;
    }

    .input-field {
        position: relative;
        display: inline-block;
        padding: 0 16px 0 0;

        &::before {
            content: '|';
            color: rgba(255, 255, 255, .2);
        }

        & .placeholder-icon {
            position: absolute;
            top: 50%;
            left: .66em;
            transform: translateY(-50%);
        }

        &,
        & input::placeholder {
            color: rgba(255, 255, 255, .6);
        }

        & input::placeholder {
            padding: 20px;
        }

        & input {
            color: #fff;
            margin-left: 12px;

            &:focus {
                outline: none;
            }
        }
    }
}
</style>