<?php

namespace App\Utils;

use Illuminate\Support\Str;

class MyEncrypt {
    /**
     * base64 URL 인코드
     * 
     * @param string $json
     * 
     * @return string base64 URL encode
     */
    public function base64UrlEncode(string $json) {
        
        return rtrim(strtr(base64_encode($json), '+/','-_'), '=');
    }

    /**
     * base64 URL 디코드
     * 
     *  @param string base64 URL encode
     * 
     * @return string $json
     */
    public function base64UrlDecode(string $base64) {
        return base64_decode(strtr($base64, '-_', '+/'));
    }

    /**
     * 문자열 암호화
     * 
     * @param string $alg 알고리즘명
     * @param string $str 암호화 할 문자열
     * @param int $saltLength 솔트길이
     * 
     * @return string 암호화 된 문자열
     */
    public function hasWithSalt($alg, $str, $saltLength) {
        $salt = $this->makeSalt($saltLength);

        return hash($alg, $str).$salt;
    }

    /**
     * 특정 길이 만큼의 랜덤한 문자열 생성
     * 
     * @param int $saltLength
     * 
     * @return string 랜덤문자열
     */
    public function makeSalt($saltLength) {
        return Str::random($saltLength);
    }

    /**
     * 특정 길이의 솔트를 제거한 문자열 반환
     * 
     * @param string $signature
     * @param int $saltLength
     * 
     * @return string 솔트 제거한 문자열
     */
    public function subSalt(string $signature, int $saltLength) {
        return mb_substr($signature, 0, (-1 * $saltLength));
    }
}
