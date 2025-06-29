<template>
  <div class="chat-message" :class="`chat-message--${message.type}`">
    <div class="chat-message__avatar">
      {{ message.type === 'user' ? '👤' : '🤖' }}
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
        <h5>Suggestions:</h5>
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
/* Clean message styling without borders */
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
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
  background: #f1f3f4;
  font-size: 14px;
  flex-shrink: 0;
}

.chat-message__content {
  flex: 1;
  max-width: 80%;
}

.chat-message--user .chat-message__content {
  text-align: right;
}

.chat-message__text {
  background: #f8f9fa;
  border-radius: 18px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #495057;
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.chat-message--user .chat-message__text {
  background: #000000;
  color: white;
}

.chat-message--ai .chat-message__text {
  background: #f8f9fa;
  color: #495057;
}

.entity-created {
  margin-top: 8px;
}

.entity-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #10b981;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 12px;
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.entity-icon {
  font-size: 14px;
}

.entity-title {
  font-weight: 600;
}

.entity-type {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.chat-message__suggestions {
  margin-top: 12px;
}

.chat-message__suggestions h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #6c757d;
  font-weight: 600;
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
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.suggestion-item:hover {
  background: #f8f9fa;
  border-color: #4f46e5;
  color: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
}

.chat-message__timestamp {
  font-size: 11px;
  color: #adb5bd;
  margin-top: 6px;
  font-weight: 500;
}

.chat-message--user .chat-message__timestamp {
  text-align: right;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chat-message__content {
    max-width: 85%;
  }
  
  .chat-message__text {
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 16px;
  }
  
  .entity-badge {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 10px;
  }
}
</style>