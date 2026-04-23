<?php

use App\Http\Controllers\AgentController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/invoke-agent', [AgentController::class, 'callAgent'])->name('invoke-agent');
    Route::get('/agent/conversations', [AgentController::class, 'getConversations'])->name('agent.conversations');
    Route::get('/agent/conversations/{conversationId}/messages', [AgentController::class, 'getConversationMessages']);
    Route::post('/agent/conversations/new', [AgentController::class, 'startNewConversation']);
    Route::delete('/agent/conversations/{conversationId}/clear', [AgentController::class, 'clearConversation']);
});

require __DIR__ . '/settings.php';
