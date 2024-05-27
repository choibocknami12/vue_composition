<?php

namespace App\Exceptions;

use Excetion;

class MyValidateException extends Exception {
    // 에러메세지 리스트

    // @return Array 에러메세지 배열

    public function context() {
        return [
            'E01' => ['status' => 400, 'msg' => '입력 데이터가 형식에 맞지 않습니다.'],
        ];
    }
}