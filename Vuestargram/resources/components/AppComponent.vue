<template>
    <div>
        <header>
            <div class="header-container">
                <div class="header-content">
                    <div class="title">
                        <router-link to="/">
                            <h1>Vuestargram</h1>
                        </router-link>
                    </div>
                        <img src="/logo.png" class="img-logo">
                        <div class="btn-group">
                            <div v-if="true">
                                <router-link to="/login">
                                    <button class="btn btn-header btn-bg-black">로그인</button>
                                </router-link>
                                <router-link to="/login">
                                    <button class="btn btn-header btn-bg-white">가입하기</button>
                                </router-link>
                            </div>
                            <div v-else>
                                <button class="btn btn-header btn-bg-black">로그아웃</button>
                            </div>
                        </div>
                </div>
            </div>
        </header>
        <hr>

        <main>
            <div class="container">
                <router-view></router-view>
            </div>
        </main>

        <footer>
            <p>20240520 copy right</p>
        </footer>
    </div>
</template>

<script setup>

</script>

<style>
    @import url('../css/common.css');
</style>