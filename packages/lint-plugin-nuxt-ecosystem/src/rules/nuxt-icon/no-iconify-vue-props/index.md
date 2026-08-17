# `@nustack/nuxt-icon/no-iconify-vue-props`

Disallow Iconify Vue props on `<Icon>` / `<UIcon>`. `@nuxt/icon` exposes `name` (not `icon`) and
`customize` (American spelling, not `customise`). The Iconify Vue names are silent no-ops here.

Autofix rewrites the attribute when the Nuxt name is not already present. A `v-bind` object
spread is reported without a fix.

## Incorrect

```vue
<template>
  <Icon icon="uil:github" />
  <Icon name="uil:github" :customise="fn" />
</template>
```

## Correct

```vue
<template>
  <Icon name="uil:github" />
  <Icon name="uil:github" :customize="fn" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
