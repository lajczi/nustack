# `@nustack/nuxt-ui/prefer-u-form-field`

Prefer `<UFormField>` over hand-written label/control pairs. `UFormField` consistently
connects labels, hints, errors, required state, and accessibility metadata to Nuxt UI form
controls such as `<UInput>`.

The rule reports a `<label>` when it wraps a known native or Nuxt UI form control, or when
its static `for` value matches the static `id` of one. It does not report standalone
label-like text or labels targeting non-form elements. Use `data-raw` as a local escape
hatch when a native label is intentional.

## Incorrect

```vue
<template>
  <label for="email">Email</label>
  <UInput id="email" v-model="email" />
</template>
```

## Correct

```vue
<template>
  <UFormField label="Email" name="email">
    <UInput v-model="email" />
  </UFormField>
</template>
```
