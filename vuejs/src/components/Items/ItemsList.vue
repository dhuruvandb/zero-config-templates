<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/api/api'

interface Item {
  _id: string
  name: string
}

const props = defineProps<{ accessToken: string | null }>()

const items = ref<Item[]>([])
const newItem = ref('')

const fetchItems = async () => {
  if (!props.accessToken) return
  const data = await api.authGet('/api/items', props.accessToken)
  items.value = Array.isArray(data) ? data : []
}

const addItem = async () => {
  if (!props.accessToken) return
  if (!newItem.value.trim()) return

  const created = await api.authPost('/api/items', props.accessToken, {
    name: newItem.value,
  })

  if (created?._id) {
    items.value = [...items.value, created]
  }

  newItem.value = ''
}

const deleteItem = async (id: string) => {
  if (!props.accessToken) return
  await api.authDelete(`/api/items/${id}`, props.accessToken)
  items.value = items.value.filter((item) => item._id !== id)
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
      <li v-for="item in items" :key="item._id" class="item">
        {{ item.name }}
        <button class="delete-btn" @click="deleteItem(item._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>
