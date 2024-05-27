<template>
    <div class="form-box">
        <h3 class="form-title">글 작성</h3>
        <img :src="preview">
        <textarea v-model="boardInfo.content" name="content" placeholder="내용을 적어주세요." maxlength="200"></textarea>
        <input @change="setFile" type="file" name="img" accept="image/*">
        <button @click="$store.dispatch('storeBoard', boardInfo)" class="btn btn-bg-black btn-submit">작성</button>
        <button @click="$router.back()" class="btn btn-submit">취소</button>
    </div>
</template>
<script setup>
    import { reactive, ref } from 'vue';
    const boardInfo = reactive({
        content: '',
        img: null,
    });
    const preview = ref('');
    function setFile(e) {
        boardInfo.img = e.target.files[0];
        preview.value = URL.createObjectURL(boardInfo.img);
    }
</script>
<style>
    
</style>