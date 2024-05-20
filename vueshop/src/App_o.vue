<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div class="nav">
    <!-- 나브의 컨텐츠를 데이터 바인딩하고, 리스트 렌더링 처리를 해주세요. -->
    <a href="#">홈</a>
    <a href="#">상품</a>
    <a href="#">기타</a>
  </div>

  <!-- 상품 리스트 -->
  <div>
    <div v-for="item in products" :key="item.productName">
      <h4 @click="myOpenModal(item)">{{ item.productName }}</h4>
      <p>{{ item.price }} 원</p>
    </div>
    <!-- <div>
      <h4 @click="myOpenModal(products[0])">{{ products[0].productName }}</h4>
      <p>{{ products[0].price }} 원</p>
    </div>
    <div>
      <h4 @click="myOpenModal(products[1])">{{ products[1].productName }}</h4>
      <p>{{ products[1].price }} 원</p>
    </div>
    <div>
      <h4 @click="myOpenModal(products[2])">{{ products[2].productName }}</h4>
      <p>{{ products[2].price }} 원</p>
    </div> -->
  </div>

  <!-- 모달 -->
  <div class="bg_black" v-if="flgModal">
    <div class="bg_white">
      <img :src="product.img">
      <h4>{{ product.productName }}</h4>
      <p>{{ product.productContent }}</p>
      <p>{{ product.price }} 원</p>
      <button @click="flgModal = !flgModal">닫기</button>
    </div>
  </div>
</template>

<script>
// Options API 방식
export default {
  name: 'App',
  // --------------
  // 데이터 저장 영역
  // --------------
  data() {
    return {
      products: [
        {productName: '바지', price: 10000, productContent: '매우 아름다운 바지입니다.', img: require('@/assets/img/2.jpg')}
        ,{productName: '티셔츠', price: 5000, productContent: '매우 아름다운 티셔츠입니다.', img: require('@/assets/img/1.jpg')}
        ,{productName: '양말', price: 1000, productContent: '매우 아름다운 양말입니다.', img: require('@/assets/img/3.jpg')}
      ],
      flgModal: false,
      product: {},
    }
  },
  // --------------
  // 함수 정의 영역
  // --------------
  methods: {
    myOpenModal(item) {
      this.flgModal = !this.flgModal;
      this.product = item;
    },
  },
}
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
/* CSS 파일 따로 분리
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
