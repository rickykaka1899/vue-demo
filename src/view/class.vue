<template>
    <div>
        <h2 v-text="title"></h2>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: 'class'
        }
    },
}
</script>

<style scoped>
    h2{
        font-size: 1.25rem;
        text-align: center;
        padding: 12.5rem 0;
    }
</style>
