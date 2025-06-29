<template>
  <div class="chat-message" :class="`chat-message--${message.type}`">
    <div class="chat-message__avatar">
      <div class="avatar-icon">
        {{ message.type === 'user' ? '👤' : '🤖' }}
      </div>
    </div>
    
    <div class="chat-message__content">
      <div class="chat-message__text">
        {{ message.content }}
      </div>
      
      <!-- Entity Creation Indicator -->
      <div v-if="message.entityCreated" class="entity-created">
        <div class="entity-badge">
          <span class="entity-icon">{{ getEntityIcon(message.entityCreated.type) }}</span>
          <span class="entity-title">{{ message.entityCreated.title }}</span>
          <span class="entity-type">{{ formatEntityType(message.entityCreated.type) }}</span>
        </div>
      </div>
      
      <div v-if="message.suggestions && message.suggestions.length" class="chat-message__suggestions">
        <h5 class="suggestions-title">Suggestions:</h5>
        <div class="suggestions-list">
          <button
            v-for="suggestion in message.suggestions"
            :key="suggestion.id"
            class="suggestion-item"
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
  entityCreated?: {
    type: string
    title: string
    id: string
  }
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

const getEntityIcon = (entityType: string): string => {
  const icons: Record<string, string> = {
    problem: '⚠️',
    customer: '👤',
    idea: '💡',
    workspace: '🏢',
    product: '📦',
    feature: '⚙️',
    job: '⚡',
    pain: '😤',
    gain: '📈',
    customerJourney: '🗺️',
    customerJourneyStep: '👣'
  }
  return icons[entityType] || '📝'
}

const formatEntityType = (entityType: string): string => {
  const typeNames: Record<string, string> = {
    problem: 'Problem',
    customer: 'Customer',
    idea: 'Idea',
    workspace: 'Workspace',
    product: 'Product',
    feature: 'Feature',
    job: 'Job',
    pain: 'Pain',
    gain: 'Gain',
    customerJourney: 'Customer Journey',
    customerJourneyStep: 'Journey Step'
  }
  return typeNames[entityType] || entityType
}
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: flex-start;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-message__avatar {
  flex-shrink: 0;
}

.avatar-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  font-size: 14px;
}

.chat-message--user .avatar-icon {
  background: #000000;
  color: white;
  border-color: #000000;
}

.chat-message--ai .avatar-icon {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.chat-message__content {
  flex: 1;
  max-width: 75%;
}

.chat-message--user .chat-message__content {
  text-align: right;
}

.chat-message__text {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #111827;
  position: relative;
  word-wrap: break-word;
}

.chat-message--user .chat-message__text {
  background: #000000;
  color: white;
  border-color: #000000;
}

.chat-message--ai .chat-message__text {
  background: white;
  border-color: #d1d5db;
}

.entity-created {
  margin-top: 8px;
}

.entity-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
}

.chat-message--user .entity-badge {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.entity-icon {
  font-size: 14px;
}

.entity-title {
  font-weight: 600;
  color: #065f46;
}

.chat-message--user .entity-title {
  color: white;
}

.entity-type {
  color: #6b7280;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.chat-message--user .entity-type {
  color: rgba(255, 255, 255, 0.8);
}

.chat-message__suggestions {
  margin-top: 12px;
}

.suggestions-title {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.suggestion-item {
  padding: 8px 12px;
  font-size: 13px;
  text-align: left;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
  font-weight: 500;
}

.suggestion-item:hover {
  background: #f3f4f6;
  border-color: #000000;
  color: #000000;
}

.chat-message__timestamp {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 6px;
  font-weight: 500;
}

.chat-message--user .chat-message__timestamp {
  text-align: right;
}
</style>