<template lang="pug">
div
    .verticalPadding
        h1 Record
        span This is some text
    
    // top search bar
    form(@submit.prevent)
        // mask clicker for closing advanced search
        .mask(v-if='searchForm.isAdvanced' @click='searchForm.isAdvanced = false')
        .select-input(style='width: 400px;margin: 8px 0;' @click.stop)
            .select-field
                sui-select(name="searchType" :value="searchForm.type" @input="e => searchForm.type = e.target.value")
                    option(value="table" selected) Table Name
                    option(value="user") User ID
                    option(value="record") Record ID

            .input-field
                span.material-symbols-outlined.placeholder-icon(v-if="!searchForm.value") search
                sui-input(type="search" name="searchValue" placeholder="Search" required :value="searchForm.value" @input="e=>searchForm.value = e.target.value" autocomplete="off")
                span.material-symbols-outlined.clickable.optionButton(@click="searchForm.type === 'record' ? searchForm.isAdvanced = false : searchForm.isAdvanced = !searchForm.isAdvanced") tune

            // advanced search
            .floatBox(v-if='searchForm.isAdvanced')
                .formLabel Access Group
                .form
                    .labelRadio.clickable
                        label.iconText(for='ag-reg') Registered
                        sui-input#ag-reg(type='radio' name='access_group' @change='advancedForm.access_group = 1' :checked='advancedForm.access_group === 1 ? true : null')

                    .labelRadio.clickable
                        label.iconText(for='ag-pub') Public
                        sui-input#ag-pub(type='radio' name='access_group' @change='advancedForm.access_group = 0' :checked='advancedForm.access_group === 0 ? true : null')

                    .labelRadio.clickable
                        label.iconText(for='ag-prv') Private
                        sui-input#ag-prv(type='radio' name='access_group' @change='advancedForm.access_group = "private"' :checked='advancedForm.access_group === "private" ? true : null')

                .formLabel Index
                .form
                    // index name
                    sui-input(style='width:100%' placeholder="Index Name" :required="(advancedForm.index.value !== null) || null" :value="advancedForm.index.name" @input="e => advancedForm.index.name = e.target.value")

                    br
                    br

                    // index data type
                    sui-select(
                        style="vertical-align: middle; width: 100px; margin-right:1em;"
                        :value='indexType'
                        @change="e=>{ indexType = e.target.value; parseIndexType(); }")

                        option(disabled) Value type
                        option(value="string" selected) String
                        option(value="number") Number
                        option(value="boolean") Boolean

                    .select-input(:class='{hide:indexType === "boolean"}' style='width: calc(100% - 100px - 1em);')
                        // index value
                        .input-field
                            sui-input(
                                ref='indexValueEl'
                                placeholder="Index value"
                                :required="advancedForm.index.name || null"
                                :value='(advancedForm.index.value === null || (typeof advancedForm.index.value === "boolean")) ? "" : advancedForm.index.value.toString()'
                                @input="parseIndexType" autocomplete="off")

                        .select-field(style='overflow:hidden;')
                            // index value condition
                            sui-select(style='width:60px' :value="advancedForm.index.condition" @change="e => advancedForm.index.condition = e.target.value")
                                option(disabled) Condition
                                option(value=">=") &gt;=
                                option(value=">") &gt;
                                option(value="=" selected) =
                                option(value="<") &lt;
                                option(value="<=") &lt;=

                    .iconText(v-if='indexType === "boolean"' style='vertical-align: middle;width: calc(100% - 100px - 1em);display:inline-block;')
                        // index value (boolean)
                        .labelRadio.clickable
                            label.iconText(for='typ-bool-false') False
                            sui-input#typ-bool-false(type='radio' name='indexBool' @change='e=>{advancedForm.index.value = false; parseIndexType()}' :checked="(advancedForm.index.value === false) ? true : null")

                        .labelRadio.clickable
                            label.iconText(for='typ-bool-true') True
                            sui-input#typ-bool-true(type='radio' name='indexBool' @change='e=>{advancedForm.index.value = true; parseIndexType()}' :checked="(advancedForm.index.value === true) ? true : null")

                .formLabel Tag
                .form
                    // Tag
                    sui-input(style='width:100%' placeholder="Tag Name" :value="advancedForm.tag || ''" @input="e => advancedForm.tag = e.target.value")

                .formLabel Reference ID
                .form
                    // Reference
                    sui-input(style='width:100%' placeholder="Referenced Record ID" :value="advancedForm.reference || ''" @input="e => advancedForm.reference = e.target.value")

                div(style='text-align:center;')
                    sui-input.line-button(style='margin: 8px .5em;width: 6em;' type='reset' @click.prevent="advancedForm = advancedFormInit()") Reset
                    sui-input(style='margin: 8px .5em;width: 6em;' type='submit') Search

    sui-button(style='float:right;margin: 8px 0;') + Add Record

    
</template>
<!-- script below -->
<script setup>
import { inject, reactive, ref } from 'vue';
let pageTitle = inject('pageTitle');
pageTitle.value = 'Records';

let searchForm = reactive({
    type: 'table',
    value: '',
    isAdvanced: false
});

let indexType = ref('string');
let indexValueEl = ref(null);

function advancedFormInit() {
    indexType.value = 'string';
    // return fresh object
    return {
        access_group: 1,
        index: {
            name: null,
            value: null,
            condition: '='
        },
        tag: null,
        reference: null
    };
}
let advancedForm = ref(advancedFormInit());

function parseIndexType() {
    indexValueEl.value.el.type = indexType.value === 'number' ? 'number' : 'text';
    advancedForm.value.index.value = {
        'string': v => v ? v.toString() : null,
        'boolean': v => {
            advancedForm.value.index.condition = '=';
            // value is already set from radio, else set to false if not boolean
            return (typeof advancedForm.value.index.value === 'boolean') ? advancedForm.value.index.value : false;
        },
        'number': v => v === '' ? null : isNaN(Number(v)) ? 0 : Number(v)
    }[indexType.value](indexValueEl.value.el.value);
}
</script>

<style lang="less" scoped>
.verticalPadding {
    padding: 50px 0;
}

sui-input {
    input::placeholder {
        color: rgba(255, 255, 255, .6);
    }
}

form {
    display: inline-block;
    max-width: 100%;
}

.floatBox {
    position: absolute;
    margin-top: 8px;
    border-radius: 5px;
    width: 100%;
    border: 1px solid #808080;
    padding: 24px 20px;
    box-shadow: 4px 4px 12px rgba(0 0 0 / 25%);
    background-color: #333;
    top: 100%;

    .formLabel {
        font-weight: 700;
    }

    .form,
    .formLabel {
        margin: 8px 0;
    }

    .form {
        margin-bottom: 32px;

        &>sui-input:not([type='radio']) {
            background-color: rgba(255, 255, 255, 0.08);
        }
    }

    .labelRadio {
        display: inline-flex;
        align-items: center;
        opacity: 0.6;

        &:not(:last-child) {
            margin-right: 1.5em;
            margin-bottom: 4px;
        }

        &>* {
            vertical-align: middle;
        }

        &>label {
            padding-right: 0.5em;
        }

        &>sui-input[type="radio"] {
            color: inherit;
        }
    }
}
</style>