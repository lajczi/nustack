# `@nustack/nuxt-ui/require-form-control-label`

Require an accessible name for Nuxt UI form controls. The rule understands each component's
supported `label` or `legend` API, ARIA naming, native `<label>` associations, and enclosing
`UFormField` labels.

## Incorrect

```vue
<template>
  <UInput placeholder="Search" />
</template>
```

## Correct

```vue
<template>
  <UFormField label="Search">
    <UInput placeholder="Search" />
  </UFormField>
  <UCheckboxGroup legend="Options" :items="items" />
  <USwitch aria-label="Enable notifications" />
</template>
```

A `UFormField` label only names a field that renders a single control. Controls in one
`v-if` / `v-else-if` / `v-else` chain are alternatives, so the chain counts as one control.

Dynamic bindings are accepted because their runtime value cannot be proven statically.
An intentional exception uses a standard ESLint disable comment.

## Further reading

- [Nuxt UI FormField](https://ui.nuxt.com/docs/components/form-field)
- [Nuxt UI CheckboxGroup](https://ui.nuxt.com/docs/components/checkbox-group)
