# `@nustack/nuxt-ui/no-conflicting-state-props`

Do not combine controlled state (`open`, `v-model:open`, `model-value`, or `v-model`) with
the corresponding uncontrolled initializer (`default-open` or `default-value`). Nuxt UI's
APIs document `default-*` for cases where the caller does not control state.

The rule is limited to Nuxt UI components that document the corresponding controlled and
uncontrolled props. It does not infer this convention for application components.

## Incorrect

```vue
<template>
  <UModal v-model:open="open" default-open />
</template>
```

## Correct

```vue
<template>
  <!-- controlled -->
  <UModal v-model:open="open" />

  <!-- uncontrolled -->
  <UModal default-open />
</template>
```

## Further reading

- [Nuxt UI Modal](https://ui.nuxt.com/docs/components/modal)
- [Nuxt UI Checkbox](https://ui.nuxt.com/docs/components/checkbox)
