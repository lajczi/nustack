# `@nustack/nuxt-icon/no-invalid-icon-name`

Disallow static `name` values that `@nuxt/icon` cannot resolve: a `/` or `.` separator, or
whitespace. Valid forms are `collection:icon`, `i-collection-icon`, an `app.config` alias, or a
PascalCase global component.

Bare names such as `home` are not reported — they may be aliases. Unknown collections are not
reported either. Empty `name` is `require-icon-name`.

## Incorrect

```vue
<template>
  <Icon name="uil/github" />
  <Icon name="uil.github" />
  <Icon name="uil github" />
</template>
```

## Correct

```vue
<template>
  <Icon name="uil:github" />
  <Icon name="i-uil-github" />
  <Icon name="nuxt" />
  <Icon name="MyLogo" />
  <Icon :name="icon" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
