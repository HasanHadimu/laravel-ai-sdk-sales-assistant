<?php
// app/Services/OpenAIService.php

namespace App\Services;

use App\Http\Controllers\AgentController;
use OpenAI\Laravel\Facades\OpenAI;

class OpenAIService
{
    public function chat(string $message, array $context = []): string
    {
        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->getSystemPrompt()
                    ],
                    [
                        'role' => 'user',
                        'content' => $message
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 500,
            ]);

            return $response->choices[0]->message->content;

        } catch (\Exception $e) {
            \Log::error('OpenAI Error: ' . $e->getMessage());
            return $this->fallbackResponse($message);
        }
    }

    private function getSystemPrompt(): string
    {
        return "You are a helpful sales assistant for an e-commerce store. " .
               "You help customers find products, check orders, and answer questions. " .
               "Be friendly, natural, and conversational. " .
               "Current store has various products including clothing, accessories, and footwear.";
    }

    private function fallbackResponse(string $message): string
    {
        // Fallback ke rule-based jika OpenAI error
        return app(AgentController::class)->processMessageFallback($message);
    }
}
