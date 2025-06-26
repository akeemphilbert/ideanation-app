<template>
  <div class="chat-interface">
    <div class="chat-header">
      <h3 class="handwritten">AI Assistant</h3>
      <div class="chat-status">
        <span class="status-dot" :class="{ 'status-dot--online': isOnline }"></span>
        {{ isOnline ? 'Online' : 'Offline' }}
      </div>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="chat-welcome">
        <div class="welcome-message">
          <p class="handwritten">👋 Hi! I'm here to help you structure your startup idea.</p>
          <p>Try asking me about:</p>
          <ul>
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
        <span class="typing-text handwritten">AI is thinking...</span>
      </div>
    </div>
    
    <div class="chat-input">
      <form @submit.prevent="sendMessage" class="input-form">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="Ask me about your idea..."
          class="message-input handwritten"
          :disabled="isTyping"
        />
        <button
          type="submit"
          class="btn-sketch send-button"
          :disabled="!inputMessage.trim() || isTyping"
        >
          Send
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
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 2px solid var(--color-primary);
  background: #f9f9f9;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-primary);
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-secondary);
  font-family: var(--font-handwritten);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
}

.status-dot--online {
  background: #4caf50;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  min-height: 0;
}

.chat-welcome {
  text-align: center;
  padding: 20px;
  color: var(--color-secondary);
}

.welcome-message {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  transform: rotate(-0.3deg);
}

.welcome-message p {
  margin: 0 0 8px 0;
}

.welcome-message ul {
  text-align: left;
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.welcome-message li {
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: var(--color-secondary);
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-secondary);
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
.typing-dots span:nth-child(3) { animation-delay: 0; }

.typing-text {
  font-size: 0.8rem;
}

.chat-input {
  border-top: 2px solid var(--color-primary);
  padding: 16px;
  background: #f9f9f9;
}

.input-form {
  display: flex;
  gap: 8px;
}

.message-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  font-family: var(--font-handwritten);
  font-size: 0.9rem;
  background: white;
  color: var(--color-primary);
}

.message-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
}

.message-input:disabled {
  background: #f5f5f5;
  color: #ccc;
}

.send-button {
  padding: 10px 16px;
  white-space: nowrap;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>