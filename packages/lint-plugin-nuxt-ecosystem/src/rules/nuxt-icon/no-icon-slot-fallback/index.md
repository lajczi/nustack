# `@nustack/nuxt-icon/no-icon-slot-fallback`

Disallow default-slot content on `<Icon>` / `<UIcon>`. Slot fallback (loading / error placeholders)
was removed in `@nuxt/icon` v1. The default slot is passed through but is not a supported API.

Empty or whitespace-only slots are ignored.

## Incorrect

```vue
<template>
  <Icon name="uil:github">
    Loading…
  </Icon>
</template>
```

## Correct

```vue
<template>
  <Icon name="uil:github" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
- [v1 rewrite](https://github.com/nuxt/icon/pull/154)
