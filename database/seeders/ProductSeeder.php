<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('title');

        $products = [
            [
                'title' => 'Classic Cotton Crew Tee',
                'price' => 24.00,
                'stock' => 120,
                'description' => 'Soft 100% cotton tee with a regular fit.',
                'categories' => ["Men's Tops"],
            ],
            [
                'title' => 'Relaxed Fit Linen Shirt',
                'price' => 48.00,
                'stock' => 65,
                'description' => 'Breathable linen shirt with a relaxed drape.',
                'categories' => ["Men's Tops"],
            ],
            [
                'title' => 'Ribbed Tank Top',
                'price' => 22.00,
                'stock' => 140,
                'description' => 'Everyday ribbed tank with a soft stretch.',
                'categories' => ["Women's Tops"],
            ],
            [
                'title' => 'High-Rise Skinny Jeans',
                'price' => 68.00,
                'stock' => 80,
                'description' => 'High-rise denim with a skinny leg and stretch.',
                'categories' => ['Denim & Jeans'],
            ],
            [
                'title' => 'Straight-Leg Jeans',
                'price' => 72.00,
                'stock' => 90,
                'description' => 'Classic straight-leg denim with a clean finish.',
                'categories' => ['Denim & Jeans'],
            ],
            [
                'title' => 'Lightweight Puffer Jacket',
                'price' => 110.00,
                'stock' => 40,
                'description' => 'Packable puffer with a warm, lightweight fill.',
                'categories' => ['Outerwear'],
            ],
            [
                'title' => 'Water-Resistant Anorak',
                'price' => 95.00,
                'stock' => 35,
                'description' => 'Weather-ready anorak with a drawstring waist.',
                'categories' => ['Outerwear'],
            ],
            [
                'title' => 'Performance Joggers',
                'price' => 54.00,
                'stock' => 75,
                'description' => 'Moisture-wicking joggers with tapered ankles.',
                'categories' => ['Activewear'],
            ],
            [
                'title' => 'Seamless Sports Bra',
                'price' => 36.00,
                'stock' => 85,
                'description' => 'Seamless support with a breathable knit.',
                'categories' => ['Activewear', "Women's Tops"],
            ],
            [
                'title' => 'Leather Lace-Up Sneakers',
                'price' => 120.00,
                'stock' => 50,
                'description' => 'Everyday leather sneakers with cushioned insoles.',
                'categories' => ['Footwear'],
            ],
            [
                'title' => 'Suede Chelsea Boots',
                'price' => 145.00,
                'stock' => 30,
                'description' => 'Suede Chelsea boots with elastic side panels.',
                'categories' => ['Footwear'],
            ],
            [
                'title' => 'Canvas Tote Bag',
                'price' => 28.00,
                'stock' => 110,
                'description' => 'Durable canvas tote with an interior pocket.',
                'categories' => ['Accessories'],
            ],
            [
                'title' => 'Wool Beanie',
                'price' => 18.00,
                'stock' => 160,
                'description' => 'Warm wool beanie with a ribbed cuff.',
                'categories' => ['Accessories'],
            ],
        ];

        foreach ($products as $data) {
            $categoryTitles = $data['categories'];
            unset($data['categories']);

            $product = Product::firstOrCreate(['title' => $data['title']], $data);

            $categoryIds = collect($categoryTitles)
                ->map(fn (string $title) => $categories->get($title)?->id)
                ->filter()
                ->all();

            if (!empty($categoryIds)) {
                $product->categories()->syncWithoutDetaching($categoryIds);
            }
        }
    }
}
