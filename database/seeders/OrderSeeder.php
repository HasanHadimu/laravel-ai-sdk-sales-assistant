<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::query()->take(3)->get();
        $products = Product::all()->keyBy('title');

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        $orders = [
            [
                'invoice_id' => 'INV-1001',
                'user' => $users->get(0),
                'product' => 'Classic Cotton Crew Tee',
                'qty' => 2,
            ],
            [
                'invoice_id' => 'INV-1002',
                'user' => $users->get(1),
                'product' => 'High-Rise Skinny Jeans',
                'qty' => 1,
            ],
            [
                'invoice_id' => 'INV-1003',
                'user' => $users->get(2),
                'product' => 'Lightweight Puffer Jacket',
                'qty' => 1,
            ],
            [
                'invoice_id' => 'INV-1004',
                'user' => $users->get(0),
                'product' => 'Canvas Tote Bag',
                'qty' => 1,
            ],
            [
                'invoice_id' => 'INV-1005',
                'user' => $users->get(1),
                'product' => 'Leather Lace-Up Sneakers',
                'qty' => 1,
            ],
        ];

        foreach ($orders as $data) {
            $user = $data['user'];
            $product = $products->get($data['product']);

            if (!$user || !$product) {
                continue;
            }

            Order::create([
                'invoice_id' => $data['invoice_id'],
                'user_id' => $user->id,
                'product_id' => $product->id,
                'qty' => $data['qty'],
            ]);
        }
    }
}
