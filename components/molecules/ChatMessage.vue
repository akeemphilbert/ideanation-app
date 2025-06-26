<template>
  <div class="chat-message" :class="`chat-message--${message.type}`">
    <div class="chat-message__avatar">
      {{ message.type === 'user' ? '👤' : '🤖' }}
    </div>
    
    <div class="chat-message__content">
      <div class="chat-message__text handwritten">
        {{ message.content }}
      </div>
      
      <div v-if="message.suggestions && message.suggestions.length" class="chat-message__suggestions">
        <h5>Suggestions:</h5>
        <div class="suggestions-list">
          <button
            v-for="suggestion in message.suggestions"
            :key="suggestion.id"
            class="suggestion-item btn-sketch"
            @click="$emit('apply-suggestion', suggestion)"
          >
            {{ suggestion.title }}
          </button>
        </div>
      </div>
      
      <div class="chat-message__timestamp">
        {{ formatTime(message.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: Array<{
    id: string
    title: string
    type: string
    data: any
  }>
}

interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()
const emit = defineEmits(['apply-suggestion'])

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-message__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid var(--color-primary);
  font-size: 0.9rem;
  flex-shrink: 0;
}

.chat-message__content {
  flex: 1;
  max-width: 70%;
}

.chat-message--user .chat-message__content {
  text-align: right;
}

.chat-message__text {
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: 12px;
  font-size: 0.9rem;
  line-height: 1.4;
  position: relative;
  transform: rotate(0.2deg);
}

.chat-message--user .chat-message__text {
  transform: rotate(-0.2deg);
  background: #f8f8f8;
}

.chat-message__text::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
}

.chat-message--ai .chat-message__text::before {
  left: -16px;
  top: 12px;
  border-right-color: var(--color-primary);
}

.chat-message--user .chat-message__text::before {
  right: -16px;
  top: 12px;
  border-left-color: var(--color-primary);
}

.chat-message__suggestions {
  margin-top: 12px;
}

.chat-message__suggestions h5 {
  margin: 0 0 8px 0;
  font-size: 0.8rem;
  color: var(--color-secondary);
  font-family: var(--font-handwritten);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.suggestion-item {
  padding: 6px 12px;
  font-size: 0.8rem;
  text-align: left;
  background: #f0f0f0;
  border: 1px solid #ddd;
}

.suggestion-item:hover {
  background: white;
  border-color: var(--color-primary);
}

.chat-message__timestamp {
  font-size: 0.7rem;
  color: var(--color-secondary);
  margin-top: 4px;
  font-family: var(--font-handwritten);
}

.chat-message--user .chat-message__timestamp {
  text-align: right;
}
</style>