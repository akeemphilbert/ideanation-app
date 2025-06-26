<template>
  <div 
    class="atomic-card" 
    :class="[`atomic-card--${type}`, { 'atomic-card--active': isActive }]"
    @click="$emit('click')"
  >
    <div class="atomic-card__header">
      <div class="atomic-card__icon">
        {{ getTypeIcon(type) }}
      </div>
      <h4 class="atomic-card__title handwritten">{{ title }}</h4>
    </div>
    
    <div class="atomic-card__content">
      <p class="atomic-card__description">{{ description }}</p>
      
      <div v-if="tags && tags.length" class="atomic-card__tags">
        <span 
          v-for="tag in tags" 
          :key="tag" 
          class="atomic-card__tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <div class="atomic-card__actions" v-if="showActions">
      <button class="btn-sketch btn-small" @click.stop="$emit('edit')">
        Edit
      </button>
      <button class="btn-sketch btn-small btn-danger" @click.stop="$emit('delete')">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'problem' | 'customer' | 'job' | 'gain' | 'pain' | 'feature' | 'solution'
  title: string
  description: string
  tags?: string[]
  isActive?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  isActive: false,
  showActions: true
})

const emit = defineEmits(['click', 'edit', 'delete'])

const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    problem: '⚠️',
    customer: '👤',
    job: '⚡',
    gain: '📈',
    pain: '😤',
    feature: '⚙️',
    solution: '💡'
  }
  return icons[type] || '📝'
}
</script>

<style scoped>
.atomic-card {
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  transform: rotate(-0.5deg);
  box-shadow: 2px 2px 0px rgba(0,0,0,0.1);
}

.atomic-card:hover {
  transform: rotate(0deg) scale(1.02);
  box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
}

.atomic-card--active {
  border-color: var(--color-accent);
  background: #f9f9f9;
  transform: rotate(0deg);
}

.atomic-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.atomic-card__icon {
  font-size: 1.2rem;
}

.atomic-card__title {
  margin: 0;
  font-size: 1rem;
  color: var(--color-primary);
  font-weight: 700;
}

.atomic-card__description {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: var(--color-secondary);
  line-height: 1.4;
}

.atomic-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.atomic-card__tag {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  color: var(--color-secondary);
}

.atomic-card__actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-danger {
  border-color: #d32f2f;
  color: #d32f2f;
}

.btn-danger:hover {
  background: #d32f2f;
  color: white;
}

/* Type-specific styling */
.atomic-card--problem {
  border-left: 4px solid #ff5722;
}

.atomic-card--customer {
  border-left: 4px solid #2196f3;
}

.atomic-card--job {
  border-left: 4px solid #ff9800;
}

.atomic-card--gain {
  border-left: 4px solid #4caf50;
}

.atomic-card--pain {
  border-left: 4px solid #f44336;
}

.atomic-card--feature {
  border-left: 4px solid #9c27b0;
}

.atomic-card--solution {
  border-left: 4px solid #00bcd4;
}
</style>