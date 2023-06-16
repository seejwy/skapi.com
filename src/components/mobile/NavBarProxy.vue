<template lang="pug">
Teleport(to="#title")
    slot(name="title")

Teleport(to="#rightButton")
    slot(name="rightButton")
</template>
<script setup>
</script>