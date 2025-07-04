# Plugin Development Guide

## Overview

TopLocs uses a plugin-based architecture that allows developers to extend the platform's functionality without modifying the core codebase. Plugins are loaded dynamically using Module Federation and integrate seamlessly with the Gun.js data layer.

## Plugin Architecture

### Module Federation System
Plugins use **Webpack Module Federation** to enable runtime loading:

```typescript
// vite.config.ts
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'your-plugin-name',
      filename: 'plugin.js',
      exposes: {
        './Main': './src/components/Main.vue',
        './Settings': './src/components/Settings.vue',
        './Sidebar': './src/components/Sidebar.vue'
      },
      shared: {
        vue: { singleton: true },
        'tailwindcss': { singleton: true }
      }
    })
  ]
})
```

### Plugin Integration Points

1. **Main Content Area**: Full-page plugin components
2. **Sidebar**: Navigation and quick access components  
3. **Settings**: Configuration interfaces
4. **Modal/Dialog**: Overlay interactions

## Getting Started

### 1. Use the Demo Plugin Template

The `demo-plugin` repository serves as a template for new plugins:

```bash
cd /path/to/toplocs
cp -r demo-plugin my-new-plugin
cd my-new-plugin
```

### 2. Plugin Structure

```
my-plugin/
├── src/
│   ├── components/
│   │   ├── Main.vue          # Main plugin component
│   │   ├── Settings.vue      # Plugin settings
│   │   └── Sidebar.vue       # Sidebar component
│   ├── composables/
│   │   └── pluginProvider.ts # Plugin data management
│   ├── App.vue
│   └── main.ts
├── server/                   # Optional backend
│   ├── index.js
│   └── api/
├── package.json
├── vite.config.ts
└── README.md
```

### 3. Core Components

#### Main.vue - Primary Plugin Interface
```vue
<template>
  <div class="plugin-main">
    <h1>{{ pluginName }}</h1>
    <!-- Your plugin content -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGun } from '@/composables/gun'

const pluginName = ref('My Plugin')
const gun = useGun()

onMounted(() => {
  // Initialize plugin data
  gun.get('plugins').get('my-plugin').on((data) => {
    console.log('Plugin data:', data)
  })
})
</script>
```

#### Settings.vue - Plugin Configuration
```vue
<template>
  <div class="plugin-settings">
    <h2>Plugin Settings</h2>
    <!-- Configuration UI -->
  </div>
</template>

<script setup lang="ts">
// Plugin settings implementation
</script>
```

## Data Integration

### Gun.js Integration
All plugins share the same Gun.js instance and can access the distributed database:

```typescript
// composables/pluginProvider.ts
import { gun } from '@/services/gun'

export function usePluginData() {
  const savePluginData = (data: any) => {
    gun.get('plugins').get('my-plugin').put(data)
  }

  const loadPluginData = (callback: (data: any) => void) => {
    gun.get('plugins').get('my-plugin').on(callback)
  }

  return {
    savePluginData,
    loadPluginData
  }
}
```

### Plugin Data Namespaces
Recommended data organization:
```javascript
gun.get('plugins').get('plugin-name')           // Plugin registry
gun.get('plugin-data').get('plugin-name')       // Plugin-specific data
gun.get('user-plugin').get(userId).get('plugin-name')  // User-specific plugin data
```

## Plugin Registration

### 1. Register with Core Platform
```typescript
// main.ts
import { gun } from '@/services/gun'

// Register plugin metadata
gun.get('plugins').get('my-plugin').put({
  name: 'My Plugin',
  version: '1.0.0',
  description: 'Plugin description',
  author: 'Your Name',
  components: {
    main: './Main',
    settings: './Settings',
    sidebar: './Sidebar'
  }
})
```

### 2. Plugin Discovery
The core platform automatically discovers plugins registered in Gun.js:

```typescript
// Core platform plugin loader
gun.get('plugins').on((plugins) => {
  Object.keys(plugins).forEach(async (pluginName) => {
    const plugin = plugins[pluginName]
    if (plugin.components?.main) {
      await loadPluginComponent(pluginName, plugin.components.main)
    }
  })
})
```

## Backend Integration (Optional)

### Server Setup
If your plugin needs a backend, create a simple Express server:

```javascript
// server/index.js
const express = require('express')
const app = express()

app.use('/api/my-plugin', require('./api/routes'))

app.listen(3001, () => {
  console.log('Plugin server running on port 3001')
})
```

### API Routes
```javascript
// server/api/routes.js
const express = require('express')
const router = express.Router()

router.get('/data', (req, res) => {
  // Return plugin data
  res.json({ data: 'Plugin data' })
})

router.post('/save', (req, res) => {
  // Save plugin data
  res.json({ success: true })
})

module.exports = router
```

## Styling and UI

### Tailwind CSS
Plugins inherit the core platform's Tailwind CSS configuration:

```vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold mb-4">Plugin Title</h2>
    <button class="btn btn-primary">Action Button</button>
  </div>
</template>
```

### Component Library
Use the core platform's component library:

```vue
<script setup lang="ts">
import { Button, Card, Input } from '@/components/common'
</script>

<template>
  <Card>
    <Input v-model="inputValue" placeholder="Enter text" />
    <Button @click="handleClick">Submit</Button>
  </Card>
</template>
```

## Real-time Features

### Gun.js Real-time Updates
```typescript
// Real-time data synchronization
export function useRealTimeData() {
  const data = ref({})
  
  gun.get('plugin-data').get('my-plugin').on((newData) => {
    data.value = newData
  })
  
  const updateData = (newData: any) => {
    gun.get('plugin-data').get('my-plugin').put(newData)
  }
  
  return { data, updateData }
}
```

### WebSocket Integration (Optional)
```typescript
// For real-time features requiring WebSocket
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

socket.on('plugin-update', (data) => {
  // Handle real-time updates
})
```

## Testing

### Unit Testing
```typescript
// tests/plugin.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Main from '@/components/Main.vue'

describe('Plugin Main Component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Main)
    expect(wrapper.text()).toContain('My Plugin')
  })
})
```

### Integration Testing
Use the demo-plugin framework for integration testing:

```bash
cd demo-plugin
pnpm dev  # Start demo environment
# Test plugin loading and functionality
```

## Deployment

### Build Plugin
```bash
pnpm build  # Creates dist/ with plugin.js
```

### Deploy to Gun.js
```typescript
// Deploy plugin to Gun.js network
gun.get('plugins').get('my-plugin').put({
  // Plugin metadata
  url: 'https://your-cdn.com/plugin.js'
})
```

## Best Practices

### 1. Data Management
- Use Gun.js for all persistent data
- Implement proper error handling
- Handle offline scenarios gracefully

### 2. Component Design
- Keep components focused and reusable
- Use TypeScript for type safety
- Follow Vue 3 composition API patterns

### 3. Performance
- Lazy load heavy components
- Implement proper cleanup in `onUnmounted`
- Use Gun.js `.off()` to prevent memory leaks

### 4. Security
- Validate all user inputs
- Use Gun.js SEA for sensitive data
- Implement proper authentication checks

## Example Plugins

### Chat Plugin
```vue
<template>
  <div class="chat-plugin">
    <div class="messages">
      <div v-for="message in messages" :key="message.id">
        {{ message.text }}
      </div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gun } from '@/services/gun'

const messages = ref([])
const newMessage = ref('')

onMounted(() => {
  gun.get('chat').on((data) => {
    messages.value.push(data)
  })
})

const sendMessage = () => {
  gun.get('chat').set({
    text: newMessage.value,
    timestamp: Date.now()
  })
  newMessage.value = ''
}
</script>
```

### Wiki Plugin
```vue
<template>
  <div class="wiki-plugin">
    <div v-if="editing">
      <textarea v-model="content" class="w-full h-64"></textarea>
      <button @click="saveContent">Save</button>
    </div>
    <div v-else>
      <div v-html="renderedContent"></div>
      <button @click="editing = true">Edit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gun } from '@/services/gun'

const content = ref('')
const editing = ref(false)
const renderedContent = computed(() => {
  // Render markdown or HTML
  return content.value
})

const saveContent = () => {
  gun.get('wiki').get('page-id').put({
    content: content.value,
    updated: Date.now()
  })
  editing.value = false
}
</script>
```

## Plugin Registry

Maintain a registry of available plugins:

```typescript
// Plugin registry structure
interface PluginMetadata {
  name: string
  version: string
  description: string
  author: string
  repository?: string
  components: {
    main?: string
    settings?: string
    sidebar?: string
  }
  permissions?: string[]
  dependencies?: string[]
}
```

## Support and Community

- Use the `demo-plugin` repository for examples
- Check existing plugins for patterns and best practices
- Contribute to the plugin ecosystem by sharing your plugins
- Follow the established coding standards and conventions

This guide provides the foundation for developing plugins for the TopLocs platform. Remember that plugins are powerful tools that extend the platform's capabilities while maintaining the decentralized, user-owned data principles of the system.