import { createStore } from 'vuex';
import axios from './axios';
import router from './router';

const store = createStore({
    state() {
        return {
            authFlg: localStorage.getItem('accessToken') ? true : false,
            userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
            boardList: [],
            lastID: localStorage.getItem('lastID') ? localStorage.getItem('lastID') : 0,
            noMoreBoardListFlg: false,
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
        setUserBoardsCount(state) {
            state.userInfo.boards_count++;
        },

        // -------------
        // 게시글 관련
        // -------------
        setBoardList(state, data) {
            state.boardList = data;
        },
        setLastID(state, id) {
            state.lastID = id;
        },
        setConcatBoardList(state, data) {
            state.boardList = state.boardList.concat(data);
        },
        setUnshiftBoardList(state, data) {
            state.boardList.unshift(data);
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
                .then( response => {
                    console.log(response);
                    alert('로그아웃 완료');
                })
                .catch( err => {
                    console.log(err);
                    console.log(response);
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

        /**
         * 보드 리스트 정보 획득
         * 
         * @param {*} context 
         */
        getBoardList(context) {
            const url = '/api/board/' + context.state.lastID + '/list';
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                }
            }

            axios.get(url, config)
            .then(response => {
                const data = response.data.data;
                context.commit('setBoardList', data);

                const id = data[data.length - 1].id;
                localStorage.setItem('lastID', id);
                context.commit('setLastID', id);
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
                const code = error.response ? error.response.data.code : '';
                alert('게시글 습득에 실패했습니다.(' + code + ')');
            });
        },

        /**
         * 추가 게시글 리스트 획득
         * 
         * @param {*} context 
         */
        getAddBoardList(context) {
            const url = '/api/board/' + context.state.lastID;
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                }
            }

            // axios 처리
            axios.get(url, config)
            .then(response => {
                const data = response.data.data;
                if(data.length > 0 ) {
                    // 게시글 정보가 있을 때 처리
                    context.commit('setConcatBoardList', data); // 추가 게시글 저장

                    // 마지막 게시글 id 저장
                    context.commit('setLastID', data[data.length - 1].id); 
                    localStorage.setItem('lastID', data[data.length - 1].id);
                } else {
                    // 게시글 정보가 없을 때 처리
                    // 더이상 게시글이 없기 때문에 서버에 요청을 하지않기 위한 플래그 true로 셋팅
                    context.commit('setNoMoreBoardListFlg', true);

                    // 마지막 게시글 아이디 제거
                    context.commit('setLastID', 0);
                    localStorage.removeItem('lastID');
                }
                // console.log('추가 게시글 획득 완료');
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
                const code = error.response ? error.response.data.code : '';
                alert('게시글 습득에 실패했습니다.(' + code + ')');
            });
        },
        /**
         * 게시글 작성
         * 
         * @param {store} context 
         * @param {object} boardInfo 
         */
        storeBoard(context, boardInfo) {
            // 토큰만료 체크
            const payload = localStorage.getItem('accessToken').split('.')[1]; // 페이로드 획득
            const base64Payload = payload.replaceAll('-','+').replaceAll('_','/');
            const objPayload = JSON.parse(window.atob(base64Payload));

            const exp = objPayload.exp + '000'; // 토큰 만료시간 획득 (밀리초)
            const now = new Date(); // 현재 시간 획득

            if(exp < now.getTime()) {
                console.log('토큰만료');
                // 토큰 재발급
                const url = '/api/reissue';
                const config = {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('refreshToken'),
                    }
                }
                axios.post(url, null, config)
                .then(response => {
                    console.log('재발급 데이터');
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);

                    // 게시글 작성 ajax처리
                    const url = '/api/board';
                    const config = {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                        }
                    }
                    const data = new FormData();
                    data.append('content', boardInfo.content);
                    data.append('img', boardInfo.img);

                    // axios 처리
                    axios.post(url, data, config)
                    .then(response => {
                        if(context.state.boardList.length > 1) {
                            // 보드리스트의 가장 앞에 작성한 글 정보 추가
                            context.commit('setUnshiftBoardList', response.data.data);
                        }
        
                        // 유저의 작성글 수 1 증가
                        context.commit('setUserBoardsCount');
                        localStorage.setItem('userInfo', JSON.stringify(context.state.userInfo));
        
                        // 게시글 인덱스로 이동
                        router.replace('/board');
                    })
                    .catch(error => {
                        // console.log(error);
                        // console.log(error.response);
                        const code = error.response ? error.response.data.code : '';
                        alert('게시글 작성에 실패했습니다.(' + code + ')');
                    });
                })
                .catch(error => {
                    // console.log(error);
                    // console.log(error.response);
                    const code = error.response ? error.response.data.code : '';
                    alert('토큰 발급에 실패했습니다.(' + code + ')');
                });
                
            } else {
                console.log('토큰유효');
                const url = '/api/board';
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                    }
                }
                const data = new FormData();
                data.append('content', boardInfo.content);
                data.append('img', boardInfo.img);
    
                // axios 처리
                axios.post(url, data, config)
                .then(response => {
                    if(context.state.boardList.length > 1) {
                        // 보드리스트의 가장 앞에 작성한 글 정보 추가
                        context.commit('setUnshiftBoardList', response.data.data);
                    }
    
                    // 유저의 작성글 수 1 증가
                    context.commit('setUserBoardsCount');
                    localStorage.setItem('userInfo', JSON.stringify(context.state.userInfo));
    
                    // 게시글 인덱스로 이동
                    router.replace('/board');
                })
                .catch(error => {
                    // console.log(error);
                    // console.log(error.response);
                    const code = error.response ? error.response.data.code : '';
                    alert('게시글 작성에 실패했습니다.(' + code + ')');
                });
            }

        },
    }
});

export default store;