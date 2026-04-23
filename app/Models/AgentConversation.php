<?php
// app/Models/AgentConversation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AgentConversation extends Model
{
    protected $table = 'agent_conversations';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'title',
    ];

    protected $casts = [
        'id' => 'string',
        'user_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(AgentConversationMessage::class, 'conversation_id', 'id');
    }

    // Helper methods
    public function addMessage(array $data): AgentConversationMessage
    {
        return $this->messages()->create($data);
    }

    public function getMessagesCount(): int
    {
        return $this->messages()->count();
    }
}
