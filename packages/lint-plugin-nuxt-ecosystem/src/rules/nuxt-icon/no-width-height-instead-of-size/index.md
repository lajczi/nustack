# `@nustack/nuxt-icon/no-width-height-instead-of-size`

Prefer `size` on `<Icon>` / `<UIcon>`. `width` and `height` are native fallthrough attributes, not
the documented sizing API. `size` becomes `font-size` (`24` → `24px`).

The rule is silent when `size` is already present.

## Incorrect

```vue
<template>
  <Icon name="uil:github" width="24" height="24" />
</template>
```

## Correct

```vue
<template>
  <Icon name="uil:github" size="24" />
  <Icon name="uil:github" size="24" width="24" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
