<?php

namespace App\Http\Controllers;

use App\Exceptions\MyAuthException;
use App\Exceptions\MyValidateException;
use App\Models\User;
use MyUserValidate;
use MyToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
// use App\Utils\MyToken;

class UserController extends Controller
{
    public function login(Request $requset) {
        Log::debug('Start Login', $requset->all());

        $requsetData = [
            'account' => $requset->account
            ,'password' => $requset->password
        ];
        
        // 유효성 검사
        $resultValidate = MyUserValidate::MyValidate($requsetData);

        // 유효성 검사 실패 처리
        if($resultValidate->fails()) {
            Log::debug("login Validation Error", $resultValidate->errors()->all());
            throw new MyValidateException('E01');
        }

        // 유저 정보 조회
        $resultUserInfo = User::where('account', $requset->account)
                            ->withCount('boards')
                            ->first();

        // 미등록 유저 체크
        if(!isset($resultUserInfo)) {
            // 유저 없음
            throw new MyAuthException('E20');
        }

        // 패스워드 체크
        if(!(Hash::check($requset->password, $resultUserInfo->password))) {
            throw new MyAuthException('E21');
        }

        // 토큰 발행
        list($accessToken, $refreshToken) = MyToken::createTokens($resultUserInfo);

        // 리프래시 토큰 저장
        MyToken::updateRefreshToken($resultUserInfo, $refreshToken);

        // response Data
        $responseData = [
            'code' => '0'
            ,'msg' => '인증 완료'
            ,'accessToken' => $accessToken
            ,'refreshToken' => $refreshToken
            ,'data' => $resultUserInfo
        ];
        return response()->json($responseData, 200);
    }

    
    /**
     * 로그아웃
     * 
     * @param   Illuminate\Http\Request $request
     * 
     * @return  response() json
     */
    public function logout(Request $request) {

        Log::debug("리퀘스트". $request);
        $id = MyToken::getValueInPayload($request->bearerToken(), 'idt');

        $userInfo = User::find($id);

        MyToken::removeRefreshToken($userInfo);

        $responseData = [
            'code' => '0',
            'msg' => '',
            'data' => $userInfo
        ];

        return response()->json($responseData, 200);
    }

    /**
     * 토큰 재발급
     * 
     * @param   Illuminate\Http\Request $request
     * 
     * @return  response() json
     */
    public function reissue(Request $request) {
        Log::debug("------------------------ 토큰 재발급 시작 ------------------------");
        // 유저 pk 획득
        $id = MyToken::getValueInPayload($request->bearerToken(), 'idt');
        Log::debug('bearerToken'.$request->bearerToken());
        Log::debug('유저 PK'.$id);

        // 유저 정보 획득
        $resultUserInfo = User::find($id);

        // 유효한 유저 확인
        if(!isset($resultUserInfo)) {
            throw new MyAuthException('E20');
        }

        // 리플레시 토큰 체크
        if($request->bearerToken() !== $resultUserInfo->refresh_token) {
            throw new MyAuthException('E23');
        }

        
        // 토큰 발행
        list($accessToken, $refreshToken) = MyToken::createTokens($resultUserInfo);

        // 리프래시 토큰 저장
        MyToken::updateRefreshToken($resultUserInfo, $refreshToken);

        // response Data
        $responseData = [
            'code' => '0'
            ,'msg' => '인증 완료'
            ,'accessToken' => $accessToken
            ,'refreshToken' => $refreshToken
            ,'data' => $resultUserInfo
        ];
        
        Log::debug("------------------------ 토큰 재발급 완료 ------------------------");
        return response()->json($responseData, 200);

    }
}
