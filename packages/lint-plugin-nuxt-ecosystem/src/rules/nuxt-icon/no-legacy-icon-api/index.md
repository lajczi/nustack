# `@nustack/nuxt-icon/no-legacy-icon-api`

Disallow `@nuxt/icon` APIs removed in v1. `<IconCSS>` and `<IconSVG>` no longer exist — use
`<Icon>` (or the configured `icon.componentName`) and set `mode` when you need CSS vs SVG.
Emoji-as-`name` was also removed.

The tag rename is autofixed. Emoji names are reported only.

## Incorrect

```vue
<template>
  <IconCSS name="uil:github" />
  <IconSVG name="uil:github" />
  <Icon name="😀" />
</template>
```

## Correct

```vue
<template>
  <Icon name="uil:github" />
  <Icon name="uil:github" mode="svg" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
- [v1 rewrite](https://github.com/nuxt/icon/pull/154)
