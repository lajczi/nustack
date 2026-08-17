# `@nustack/nuxt-icon/prefer-icon-over-iconify-vue`

Prefer the Nuxt-registered `<Icon>` over `import { Icon } from '@iconify/vue'`. The Iconify Vue
component skips the server bundle, local API, aliases, and custom collections that `@nuxt/icon`
sets up.

Type-only imports are not reported.

## Incorrect

```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
```

## Correct

```vue
<template>
  <Icon name="uil:github" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
