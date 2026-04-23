<?php
// app/Models/AgentConversationMessage.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentConversationMessage extends Model
{
    protected $table = 'agent_conversation_messages';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'conversation_id',
        'user_id',
        'agent',
        'role',
        'content',
        'attachments',
        'tool_calls',
        'tool_results',
        'usage',
        'meta',
    ];

    protected $casts = [
        'id' => 'string',
        'conversation_id' => 'string',
        'user_id' => 'integer',
        'content' => 'string',
        'attachments' => 'array',
        'tool_calls' => 'array',
        'tool_results' => 'array',
        'usage' => 'array',
        'meta' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(AgentConversation::class, 'conversation_id', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeUserMessages($query)
    {
        return $query->where('role', 'user');
    }

    public function scopeAssistantMessages($query)
    {
        return $query->where('role', 'assistant');
    }

    public function scopeByAgent($query, string $agent)
    {
        return $query->where('agent', $agent);
    }

    // Helper methods
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function isAssistant(): bool
    {
        return $this->role === 'assistant';
    }

    public function getAttachments(): array
    {
        return json_decode($this->attachments, true) ?? [];
    }

    public function getToolCalls(): array
    {
        return json_decode($this->tool_calls, true) ?? [];
    }

    public function getToolResults(): array
    {
        return json_decode($this->tool_results, true) ?? [];
    }

    public function getUsage(): array
    {
        return json_decode($this->usage, true) ?? [];
    }
}
