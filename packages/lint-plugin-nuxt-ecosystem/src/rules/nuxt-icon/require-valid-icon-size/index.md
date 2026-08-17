# `@nustack/nuxt-icon/require-valid-icon-size`

Require static `size` on `<Icon>` / `<UIcon>` to be a number or CSS length. The runtime applies
`font-size`: numeric values become `${n}px`, and strings such as `1em` / `24px` are used as-is.
Tokens like `xl` or `large` are not sizes.

Unknown dynamic bindings are not reported.

## Incorrect

```vue
<template>
  <Icon name="uil:github" size="xl" />
  <Icon name="uil:github" size="large" />
</template>
```

## Correct

```vue
<template>
  <Icon name="uil:github" size="24" />
  <Icon name="uil:github" :size="24" />
  <Icon name="uil:github" size="1em" />
  <Icon name="uil:github" :size="iconSize" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
