<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!-- 헤더 -->
  <!-- props : 자식 컴포넌트에게 props 속성을 이용해서 데이터는 전달 -->
  <HeaderComponent
    :navList="navList"
  />
  <!-- <div class="nav">
    <a v-for="item in navList" :key="item.navName" href="#">{{ item.navName }}</a>
  </div> -->

  <!-- 상품 리스트 -->
  <BoardList
    :products="products"
    @myOpenModal="myOpenModal"
  >
    <!-- slot : 자식쪽에서 <slot></slot> 부분에 전달하여 자식컴포넌트에서 렌더링 -->
    <h3>부모쪽에서 정의한 슬롯</h3>
  </BoardList>
  <!-- <div>
    <div v-for="item in products" :key="item.productName">
      <h4 @click="myOpenModal(item)">{{ item.productName }}</h4>
      <p>{{ item.price }} 원</p>
    </div>
  </div> -->

  <!-- 모달 -->
  <ModalDetail
    :flgModal="flgModal"
    :product="product"
    @myCloseModal="myCloseModal"
  />
  <!-- <div class="bg_black" v-if="flgModal">
    <div class="bg_white">
      <img :src="product.img">
      <h4>{{ product.productName }}</h4>
      <p>{{ product.productContent }}</p>
      <p>{{ product.price }} 원</p>
      <button @click="flgModal = !flgModal">닫기</button>
    </div>
  </div> -->
</template>

<script setup>
import { provide, reactive, ref } from 'vue';
import HeaderComponent from './components/HeaderComponent.vue'; // 자식 컴포넌트 import
import ModalDetail from './components/ModalDetail.vue';
import BoardList from './components/BoardList.vue';

// --------------
// 데이터 바인딩
// --------------
// reactive : 객체 타입만 사용 가능하며, 해당 객체에 대한 반응적 참조를 위해 사용
const products = reactive([
  {productName: '바지', price: 10000, productContent: '매우 아름다운 바지입니다.', img: require('@/assets/img/2.jpg')}
  ,{productName: '티셔츠', price: 5000, productContent: '매우 아름다운 티셔츠입니다.', img: require('@/assets/img/1.jpg')}
  ,{productName: '양말', price: 1000, productContent: '매우 아름다운 양말입니다.', img: require('@/assets/img/3.jpg')}
]);

// ----------
// 헤더 처리
// ----------
const navList = reactive([
  {navName: '홈'}
  ,{navName: '상품'}
  ,{navName: '기타'}
]);

// ----------
// 모달 처리
// ----------
// ref : 타입제한 없이 사용가능하나 일반적으로 string, number, boolean 과 같은 기본유형에 대한 반응적 참조를 위해 사용
const flgModal = ref(false); // 모달 표시용 플래그
let product = reactive({});

function myOpenModal(item) {
  flgModal.value = true;
  product = item;
}
function myCloseModal(str) {
  flgModal.value = false;
  console.log(str); // 파라미터 연습용
}

// ---------------------
// Provide / Inject 연습
// ---------------------
const count = ref(0);

function addCount() {
  count.value++;
}

provide('test', {
  count
  ,addCount
});
</script>

<style>
@import url('./assets/css/common.css');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
/* CSS 파일 따로 분리 이관
.nav {
  background-color: #2c3e50;
  padding: 15px;
  border-radius: 10px;
}
.nav a {
  color: #fff;
  padding: 10px;
  text-decoration: none;
} */
</style>
