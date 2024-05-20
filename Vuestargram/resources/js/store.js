import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {

        }
    },

    mutations: {

    },

    actions: {
        // 로그인
        login(context, userInfo) {
            console.log(JSON.stringify(userInfo));
            const url = '/api/login';
        },
    }
});

export default store;