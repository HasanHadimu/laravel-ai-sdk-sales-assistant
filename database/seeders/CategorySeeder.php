<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            "Men's Tops",
            "Women's Tops",
            'Denim & Jeans',
            'Outerwear',
            'Activewear',
            'Footwear',
            'Accessories',
        ];

        foreach ($categories as $title) {
            Category::firstOrCreate(['title' => $title]);
        }
    }
}
