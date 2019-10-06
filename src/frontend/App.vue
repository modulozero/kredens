<template>
    <div>
        <h1>Hmm...</h1>
        <p> There's a message: {{ message }}.</p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: ["message"]
});
</script>
