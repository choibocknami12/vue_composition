<?php

namespace App\Http\Controllers;

use App\Models\User;
use MyUserValidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Exceptions\MyAuthException;
use App\Exceptions\MyValidationException;
use Illuminate\Support\Facades\Hash;
use MyToken;

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
        $resultUserInfo = User::where('account', $requset->account)->first();

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
}
