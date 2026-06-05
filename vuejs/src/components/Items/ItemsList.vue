<script setup lang="ts">
import { onMounted, ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

interface Item {
  id: string
  name: string
}

const items = ref<Item[]>([])
const newItem = ref('')

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers as any) },
    ...options,
  })
  const contentType = res.headers.get('content-type') || ''
  if (contentType.indexOf('application/json') >= 0) {
    return res.json()
  }
  return null
}

const fetchItems = async () => {
  const data = await apiFetch('/api/items')
  items.value = Array.isArray(data) ? data : []
}

const addItem = async () => {
  if (!newItem.value.trim()) return

  const created = await apiFetch('/api/items', {
    method: 'POST',
    body: JSON.stringify({ name: newItem.value }),
  })

  if (created?.id) {
    items.value = [...items.value, created]
  }

  newItem.value = ''
}

const deleteItem = async (id: string) => {
  await apiFetch(`/api/items/${id}`, { method: 'DELETE' })
  items.value = items.value.filter((item) => item.id !== id)
}

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div>
    <div class="add-item-box">
      <input v-model="newItem" placeholder="New item name" />
      <button class="add-item-btn" @click="addItem">Add</button>
    </div>

    <ul class="item-list">
      <li v-for="item in items" :key="item.id" class="item">
        {{ item.name }}
        <button class="delete-btn" @click="deleteItem(item.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>
