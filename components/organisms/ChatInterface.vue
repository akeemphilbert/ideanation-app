<template>
  <div class="chat-interface">
    <div class="chat-header">
      <h3 class="chat-title">AI Assistant</h3>
      <div class="chat-status">
        <span class="status-dot" :class="{ 'status-dot--online': isOnline }"></span>
        {{ isOnline ? 'Online' : 'Offline' }}
      </div>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="chat-welcome">
        <div class="welcome-message">
          <p class="welcome-text">👋 Hi! I'm here to help you structure your startup idea.</p>
          <p class="welcome-subtitle">Try asking me about:</p>
          <ul class="welcome-list">
            <li>What problems does your idea solve?</li>
            <li>Who are your target customers?</li>
            <li>What features should you prioritize?</li>
          </ul>
        </div>
      </div>
      
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
        @apply-suggestion="handleSuggestion"
      />
      
      <div v-if="isTyping" class="typing-indicator">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="typing-text">AI is thinking...</span>
      </div>
    </div>
    
    <div class="chat-input">
      <form @submit.prevent="sendMessage" class="input-form">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="Ask me about your idea..."
          class="message-input"
          :disabled="isTyping"
        />
        <button
          type="submit"
          class="send-button"
          :disabled="!inputMessage.trim() || isTyping"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9"></polygon>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  messages: Array<{
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
    suggestions?: any[]
  }>
}

const props = defineProps<Props>()
const emit = defineEmits(['send-message', 'apply-suggestion'])

const messagesContainer = ref<HTMLElement>()
const inputMessage = ref('')
const isTyping = ref(false)
const isOnline = ref(true)

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  isTyping.value = true
  
  try {
    emit('send-message', message)
    await nextTick()
    scrollToBottom()
  } finally {
    // Simulate AI response delay
    setTimeout(() => {
      isTyping.value = false
      nextTick(() => scrollToBottom())
    }, 1500)
  }
}

const handleSuggestion = (suggestion: any) => {
  emit('apply-suggestion', suggestion)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => props.messages.length, () => {
  nextTick(() => scrollToBottom())
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-interface {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #000000;
}

.chat-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}

.status-dot--online {
  background: #10b981;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
}

.chat-welcome {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

.welcome-message {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  max-width: 280px;
  margin: 0 auto;
}

.welcome-text {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
}

.welcome-subtitle {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6b7280;
}

.welcome-list {
  text-align: left;
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.welcome-list li {
  margin-bottom: 8px;
  color: #6b7280;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: #6b7280;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
.typing-dots span:nth-child(3) { animation-delay: 0; }

.typing-text {
  font-size: 14px;
  font-weight: 500;
}

.chat-input {
  border-top: 1px solid #e5e7eb;
  padding: 16px 20px;
  background: white;
}

.input-form {
  display: flex;
  gap: 12px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #111827;
  transition: all 0.2s ease;
  font-family: inherit;
}

.message-input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.message-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.message-input::placeholder {
  color: #9ca3af;
}

.send-button {
  padding: 12px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
}

.send-button:hover:not(:disabled) {
  background: #1f2937;
  transform: translateY(-1px);
}

.send-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

@keyframes typing-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>