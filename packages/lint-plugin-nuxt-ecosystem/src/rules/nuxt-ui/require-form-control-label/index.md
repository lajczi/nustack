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

Dynamic bindings are accepted because their runtime value cannot be proven statically.
`data-raw` does not disable accessibility checks; use a standard ESLint disable comment for
an intentional exception.

## Further reading

- [Nuxt UI FormField](https://ui.nuxt.com/docs/components/form-field)
- [Nuxt UI CheckboxGroup](https://ui.nuxt.com/docs/components/checkbox-group)
