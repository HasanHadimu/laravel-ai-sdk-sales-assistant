<?php

namespace App\Ai\Agents;

use App\Models\Product;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\SimilaritySearch;
use Stringable;
use App\Models\User;
use Laravel\Ai\Promptable;
use Laravel\Ai\Contracts\Agent;
use App\Ai\Tools\ListProductTool;
use App\Ai\Tools\ListCategoryTool;
use Laravel\Ai\Contracts\HasTools;
use App\Ai\Tools\ListOrderToolForUser;
use Laravel\Ai\Contracts\Conversational;

class SalesAssistant implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;

    public User $user;

     public function __construct(User $user) {
            $this->user = $user;
     }

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return 'You are a helpful sales assistant. Your job is to provide product, category, and order information to customers.';
    }

    /**
     * Get the list of messages comprising the conversation so far.
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            new ListProductTool,
            new ListCategoryTool,
            new ListOrderToolForUser($this->user),
    ];
    }
}
