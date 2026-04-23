<?php
// app/Http/Controllers/AgentController.php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\AgentConversation;
use App\Models\AgentConversationMessage;
use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AgentController extends Controller
{
    protected $openAI;

    public function __construct(OpenAIService $openAI)
    {
        $this->openAI = $openAI;
    }

    public function callAgent(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => ['required', 'string', 'max:1000']
            ]);

            $message = $validated['message'];

            // Coba gunakan OpenAI dulu
            if ($this->isOpenAIEnabled()) {
                $response = $this->openAI->chat($message);
            } else {
                // Fallback ke rule-based
                $response = $this->processMessageFallback(strtolower($message));
            }

            return response()->json([
                'success' => true,
                'response' => $response,
                'ai_used' => $this->isOpenAIEnabled()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'response' => 'Maaf, terjadi kesalahan.'
            ], 500);
        }
    }

    private function isOpenAIEnabled(): bool
    {
        return env('OPENAI_API_KEY') && env('OPENAI_API_KEY') !== 'your-api-key';
    }

    // Fallback method (rule-based yang sudah ada)
    public function processMessageFallback(string $message): string
    {
        if ($this->containsAny($message, ['product', 'produk'])) {
            return $this->handleProductQuery($message);
        }

        if ($this->containsAny($message, ['category', 'kategori'])) {
            return $this->handleCategoryQuery($message);
        }

        if ($this->containsAny($message, ['order', 'pesanan'])) {
            return $this->handleOrderQuery($message);
        }

        return $this->getDefaultResponse();
    }

    private function processMessage(string $message): string
    {
        if ($this->containsAny($message, ['product', 'produk', 'barang', 'item', 'cari', 'lihat', 'tampilkan', 'show', 'all product', 'semua produk'])) {
            return $this->handleProductQuery($message);
        }

        if ($this->containsAny($message, ['category', 'kategori', 'jenis', 'tipe', 'list category', 'daftar kategori', 'lihat kategori', 'tampilkan kategori'])) {
            return $this->handleCategoryQuery($message);
        }

        if ($this->containsAny($message, ['order', 'pesanan', 'beli', 'pembelian', 'my order', 'status order', 'cek pesanan', 'lihat pesanan', 'daftar pesanan'])) {
            return $this->handleOrderQuery($message);
        }

        return $this->getDefaultResponse();
    }

    private function handleProductQuery(string $message): string
    {
        $keyword = $this->extractKeyword($message);

        $query = Product::query();

        if ($keyword) {
            $query->where('title', 'like', "%{$keyword}%");
        }

        $products = $query->limit(10)->get();

        if ($products->isEmpty()) {
            if ($keyword) {
                return "[INFO] Product Not Found\n\n" .
                       "No products found matching '{$keyword}'.\n\n" .
                       "Suggestions: Try different keywords like 'shirt', 'shoes', 'laptop'";
            }
            return "[INFO] No Products Available\n\n" .
                   "No products are currently available in the store.";
        }

        $response = "[PRODUCTS] " . ($keyword ? "Search Results for '{$keyword}'" : "All Products") . "\n\n";
        $response .= str_repeat("-", 50) . "\n\n";

        foreach ($products as $product) {
            $stockStatus = ($product->stock ?? 0) > 0
                ? "Stock: " . number_format($product->stock) . " units"
                : "Stock: Out of Stock";
            $price = "Rp " . number_format($product->price ?? 0, 0, ',', '.');

            $response .= "Product: {$product->title}\n";
            $response .= "Price: {$price}\n";
            $response .= "Status: {$stockStatus}\n";

            if ($product->description) {
                $desc = strlen($product->description) > 80
                    ? substr($product->description, 0, 80) . '...'
                    : $product->description;
                $response .= "Description: {$desc}\n";
            }

            $response .= "\n" . str_repeat("-", 50) . "\n\n";
        }

        $response .= "Hint: Type 'view categories' to see all product categories.";

        return $response;
    }

    private function handleCategoryQuery(string $message): string
    {
        $categories = Category::withCount('products')->get();

        if ($categories->isEmpty()) {
            return "[INFO] No Categories Available\n\n" .
                   "No categories have been created yet.\n\n" .
                   "Please add categories to organize your products.";
        }

        $response = "[CATEGORIES] Product Categories\n\n";
        $response .= str_repeat("=", 50) . "\n\n";

        foreach ($categories as $category) {
            $categoryName = $category->title ?? $category->name ?? 'Unnamed Category';
            $productCount = $category->products_count ?? 0;
            $status = $productCount > 0 ? "Active" : "Empty";

            $response .= "Category: {$categoryName}\n";
            $response .= "Products: {$productCount} item(s)\n";
            $response .= "Status: {$status}\n\n";
        }

        $response .= str_repeat("=", 50) . "\n\n";
        $response .= "Usage: Type 'show products from [category name]' to view products in a specific category.\n\n";
        $response .= "Example: 'show products from Electronics'";

        return $response;
    }

    private function handleOrderQuery(string $message): string
    {
        if (!auth()->check()) {
            return "[ACCESS DENIED] Authentication Required\n\n" .
                   "You need to be logged in to view your orders.\n\n" .
                   "Please login to continue.";
        }

        $orders = Order::where('user_id', auth()->id())
            ->with('product')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($orders->isEmpty()) {
            return "[ORDERS] No Orders Found\n\n" .
                   "You haven't placed any orders yet.\n\n" .
                   "Start shopping by typing 'show all products' to see available items.";
        }

        $response = "[ORDERS] Order History\n\n";
        $response .= str_repeat("=", 50) . "\n";
        $response .= "Total Orders: " . $orders->count() . "\n";
        $response .= str_repeat("=", 50) . "\n\n";

        foreach ($orders as $order) {
            $productName = $order->product->title ?? 'Product Unavailable';
            $qty = $order->qty ?? 1;
            $price = $order->product->price ?? 0;
            $total = $price * $qty;

            $statusMap = [
                'pending' => 'Awaiting Payment',
                'processing' => 'Processing',
                'shipped' => 'Shipped',
                'delivered' => 'Delivered',
                'cancelled' => 'Cancelled',
            ];

            $status = $statusMap[$order->status ?? 'pending'] ?? 'Processing';

            $response .= "Order ID: #{$order->id}\n";
            $response .= "Date: " . $order->created_at->format('d/m/Y H:i') . "\n";
            $response .= "Product: {$productName}\n";
            $response .= "Quantity: {$qty} x " . number_format($price, 0, ',', '.') . "\n";
            $response .= "Total: Rp " . number_format($total, 0, ',', '.') . "\n";
            $response .= "Status: {$status}\n";
            $response .= "\n" . str_repeat("-", 50) . "\n\n";
        }

        $response .= "Need assistance? Type 'help' for more information.";

        return $response;
    }

    private function getDefaultResponse(): string
    {
        $productCount = Product::count();
        $categoryCount = Category::count();
        $orderCount = auth()->check() ? Order::where('user_id', auth()->id())->count() : 0;

        $response = "[SYSTEM] Sales Assistant Online\n\n";
        $response .= str_repeat("=", 50) . "\n";
        $response .= "Hello! I'm your sales assistant. How can I help you today?\n";
        $response .= str_repeat("=", 50) . "\n\n";

        $response .= "AVAILABLE COMMANDS:\n";
        $response .= str_repeat("-", 50) . "\n";
        $response .= "1. View Products\n";
        $response .= "   - Show all products: {$productCount} items available\n";
        $response .= "   - Search product: 'find [product name]'\n\n";

        $response .= "2. Browse Categories\n";
        $response .= "   - List all categories: {$categoryCount} categories available\n";
        $response .= "   - Filter by category: 'show products from [category]'\n\n";

        if (auth()->check()) {
            $response .= "3. Order Management\n";
            $response .= "   - View your orders: {$orderCount} order(s) found\n";
            $response .= "   - Check order status: 'my orders'\n\n";
        } else {
            $response .= "3. Order Management (Login Required)\n";
            $response .= "   - Please login to view your orders\n\n";
        }

        $response .= str_repeat("=", 50) . "\n\n";
        $response .= "EXAMPLES:\n";
        $response .= "- show all products\n";
        $response .= "- find laptop\n";
        $response .= "- view categories\n";
        $response .= "- my orders\n\n";
        $response .= "How may I assist you today?";

        return $response;
    }

    private function containsAny(string $haystack, array $needles): bool
    {
        foreach ($needles as $needle) {
            if (str_contains($haystack, $needle)) {
                return true;
            }
        }
        return false;
    }

    private function extractKeyword(string $message): ?string
    {
        $removeWords = ['tampilkan', 'lihat', 'cari', 'show', 'search', 'produk', 'product', 'semua', 'all', 'saya', 'my', 'find'];
        $query = str_replace($removeWords, '', $message);
        $query = preg_replace('/[^a-zA-Z0-9\s]/', '', $query);
        $query = trim($query);

        if (!empty($query) && strlen($query) > 1) {
            return $query;
        }

        return null;
    }

    private function saveConversation(Request $request, string $response)
    {
        try {
            $conversation = AgentConversation::where('user_id', auth()->id())
                ->orderBy('updated_at', 'desc')
                ->first();

            if (!$conversation) {
                $conversation = AgentConversation::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => auth()->id(),
                    'title' => 'Chat ' . now()->format('Y-m-d H:i'),
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            AgentConversationMessage::create([
                'id' => (string) Str::uuid(),
                'conversation_id' => $conversation->id,
                'user_id' => auth()->id(),
                'agent' => 'SalesAssistant',
                'role' => 'user',
                'content' => $request->message,
                'attachments' => '[]',
                'tool_calls' => '[]',
                'tool_results' => '[]',
                'usage' => '[]',
                'meta' => json_encode(['ip' => $request->ip()]),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            AgentConversationMessage::create([
                'id' => (string) Str::uuid(),
                'conversation_id' => $conversation->id,
                'user_id' => auth()->id(),
                'agent' => 'SalesAssistant',
                'role' => 'assistant',
                'content' => $response,
                'attachments' => '[]',
                'tool_calls' => '[]',
                'tool_results' => '[]',
                'usage' => '[]',
                'meta' => '[]',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $conversation->touch();

            return $conversation;

        } catch (\Exception $e) {
            Log::warning('Failed to save conversation: ' . $e->getMessage());
            return null;
        }
    }

    public function getConversations(Request $request)
    {
        $conversations = AgentConversation::where('user_id', auth()->id())
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function($conv) {
                $conv->message_count = AgentConversationMessage::where('conversation_id', $conv->id)->count();
                return $conv;
            });

        return response()->json([
            'success' => true,
            'conversations' => $conversations
        ]);
    }

    public function getConversationMessages($conversationId)
    {
        $messages = AgentConversationMessage::where('conversation_id', $conversationId)
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'messages' => $messages
        ]);
    }

    public function startNewConversation(Request $request)
    {
        $conversation = AgentConversation::create([
            'id' => (string) Str::uuid(),
            'user_id' => auth()->id(),
            'title' => 'Chat ' . now()->format('Y-m-d H:i'),
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'conversation_id' => $conversation->id
        ]);
    }

    public function clearConversation($conversationId)
    {
        AgentConversationMessage::where('conversation_id', $conversationId)
            ->where('user_id', auth()->id())
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Conversation cleared'
        ]);
    }
}
