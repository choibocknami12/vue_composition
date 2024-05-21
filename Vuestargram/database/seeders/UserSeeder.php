<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['account' => 'admin', 'password' => Hash::make('admin'), 'name' => '관리자', 'gender' => '0','profile' => '/profile/default.png'],
            ['account' => 'admin2', 'password' => Hash::make('admin'), 'name' => '관리자2', 'gender' => '1','profile' => '/profile/default.png'],
            ['account' => 'admin3', 'password' => Hash::make('admin'), 'name' => '관리자3', 'gender' => '1','profile' => '/profile/default.png'],
            ['account' => 'admin4', 'password' => Hash::make('admin'), 'name' => '관리자4', 'gender' => '1','profile' => '/profile/default.png'],
        ];
        foreach($data as $item) {
            User::create($item);
        }
    }
}
