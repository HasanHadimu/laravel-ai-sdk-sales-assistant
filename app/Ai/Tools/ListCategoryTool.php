<?php
// app/Ai/Tools/ListCategoryTool.php

namespace App\Ai\Tools;

use App\Models\Category;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class ListCategoryTool implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'Tool to list all the categories available in the store. You can also filter the categories by providing a specific category name.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $categoryName = $request['category'] ?? null;

        $query = Category::query();

        if ($categoryName) {
            $query->where('name', 'like', "%{$categoryName}%");
        }

        $categories = $query->withCount('products')->get();

        if ($categories->isEmpty()) {
            return "No categories found";
        }

        $result = "Available Categories:\n";
        foreach ($categories as $category) {
            $result .= sprintf(
                "• %s (%d products)\n",
                $category->name,
                $category->products_count
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
            'category' => $schema->string()->nullable()->description('Specific category name to filter'),
        ];
    }
}
