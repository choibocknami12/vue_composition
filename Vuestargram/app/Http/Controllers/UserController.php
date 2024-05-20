<?php

namespace App\Http\Controllers;

use MyUserValidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function login(Request $requset) {
        Log::debug('Start Login', $requset->all());

        $requsetData = [
            'account' => $requset->account
            ,'password' => $requset->password
        ];
        
        // 유효성 검사
        $resultValidate = MyUserValidate::yValidate($requsetData);

        // 유효성 검사 실패 처리
        if($resultValidate->fails()) {

        }

        // response Data
        $responseData = [
            'code' => '0'
            ,'msg' => '인증 완료'
            ,'accessToken' => 'accessToken'
            ,'refreshToken' => 'refreshToken'
        ];
        return response()->json($responseData, 200);
    }
}
