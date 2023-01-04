<template lang="pug">
div(style="background-color:black;")
    pre {{ props.record }}
</template>
<script setup>
const props = defineProps(['record']);
</script>
<style lang="less">

</style>