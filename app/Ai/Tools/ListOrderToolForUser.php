<?php
// app/Ai/Tools/ListOrderToolForUser.php

namespace App\Ai\Tools;

use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class ListOrderToolForUser implements Tool
{
    public function __construct(public User $user) {}

    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'List all orders for the authenticated user. Returns order details including status, total amount, and items.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $orders = Order::where('user_id', $this->user->id)
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($orders->isEmpty()) {
            return "You don't have any orders yet.";
        }

        $result = "Your Orders (" . $orders->count() . " total):\n\n";
        foreach ($orders as $order) {
            $result .= sprintf(
                "Order #%s\nStatus: %s\nTotal: $%s\nDate: %s\nItems: %d\n\n",
                $order->id,
                $order->status,
                number_format($order->total, 2),
                $order->created_at->format('Y-m-d'),
                $order->items->count()
            );
        }

        return $result;
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            // No parameters needed for this tool
        ];
    }
}
