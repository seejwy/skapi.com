<template lang="pug">
input(type="hidden" :value="tagArray?.join(',')")
.tag-container(@click="input.focus()")
  span.tag(v-for="(tag, index) in tagArray" @click.stop="")
    span {{ tag }}
    span.material-symbols-outlined(@click="removeTag(index)") cancel
    //- do not remove the extra space in .tag-input
  .tag-input(ref="input" contenteditable="true" tabindex="0" @keydown.enter.space.prevent="addTag" @keydown.delete="deleteTag" @blur="addTag")  
</template>
<script setup>
import { reactive, ref } from 'vue';

const props = defineProps(['value']);
const emits = defineEmits(['change']);
let tagArray = ref([]);

if(props.value) {
  tagArray.value = JSON.parse(JSON.stringify(props.value));
}

const input = ref(null);

const addTag = () => {
  if(input.value.innerHTML) {
    tagArray.value.push(input.value.innerHTML);
    input.value.innerHTML = '';
  }

  emits('change', tagArray);
}

const deleteTag = () => {
  let tag = input.value.innerHTML;
  if(tag === '') {
    tagArray.value.pop();
  }

  emits('change', tagArray);
}

const removeTag = (index) => {
  tagArray.value.splice(index, 1);
  emits('change', tagArray);
}

</script>
<style lang="less" scoped>
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: -1px -1px 1px rgb(0 0 0 / 25%), inset 1px 1px 1px rgb(0 0 0 / 50%);
  border-radius: 5px;
  padding: 9px 10px;
}

.tag {
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 3px 10px;
  font-size: 14px;background: #D9D9D9;
  color: rgba(0, 0, 0, 0.65);
  border: 0.5px solid #8C8C8C;
  box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25), inset 1px 1px 2px rgba(255, 255, 255, 0.65);
  border-radius: 4px;
  height: 30px;

  .material-symbols-outlined {
    font-size: 16px;
    font-variation-settings: 'FILL' 1;
    margin-left: 4px;
    cursor: pointer;
  }
}

.tag-input {
  height: calc(30px - 6px);
  margin: 3px;
  min-width: 5px;

  &:focus {
    outline: none;
  }
}
</style>
  