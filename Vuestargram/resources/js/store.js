import { createStore } from 'vuex';
import axios from './axios';
import router from './router';

const store = createStore({
    state() {
        return {
            authFlg: localStorage.getItem('accessToken') ? true : false,
            userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
        }
    },

    mutations: {
        // ----------
        // 인증관련
        // ----------
        setAuthFlg(state, boo) {
            state.authFlg = boo;
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
    },

    actions: {
        // 로그인
        login(context, userInfo) {
            console.log(JSON.stringify(userInfo));
            const url = '/api/login';
            axios.post(url, JSON.stringify(userInfo))
            .then(response => {
                console.log(response.data);
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('userInfo', JSON.stringify(response.data.data));

                // state 갱신
                context.commit('setAuthFlg', true);
                context.commit('setUserInfo', response.data.data);
                router.replace('/board');
            })
            .catch(error => {
                console.log(error.response);
                const errorCode = error.response.data.code ? error.response.data.code : 'FE99';
                alert('로그인 실패 : ' + errorCode);
            })
        },

        // 로그아웃
        logout(context) {
            const URL = '/api/logout';
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                }
            }
            axios.post(URL, null, config)
                .then( res => {
                    console.log(res);
                    alert('로그아웃 완료');
                })
                .catch( err => {
                    console.log(err);
                    console.log(res);
                })
                .finally(() => {
                    localStorage.clear();

                    // store state 초기화
                    context.commit('setAuthFlg', false);
                    context.commit('setUserInfo', {});

                    // 보드로 이동
                    router.replace('/login');

                });
        },
    }
});

export default store;