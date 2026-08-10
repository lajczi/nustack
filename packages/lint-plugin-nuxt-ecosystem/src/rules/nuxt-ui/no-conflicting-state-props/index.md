# `@nustack/nuxt-ui/no-conflicting-state-props`

Do not combine controlled state (`open`, `v-model:open`, `model-value`, or `v-model`) with
the corresponding uncontrolled initializer (`default-open` or `default-value`). Nuxt UI's
APIs document `default-*` for cases where the caller does not control state.

The pairing is a component-authoring convention rather than a Nuxt UI detail, so the rule
applies to any component element. Native HTML tags are skipped.

```vue
<!-- Incorrect -->
<UModal v-model:open="open" default-open />

<!-- Correct: controlled -->
<UModal v-model:open="open" />

<!-- Correct: uncontrolled -->
<UModal default-open />
```

## Further reading

- [Nuxt UI Modal](https://ui.nuxt.com/docs/components/modal)
- [Nuxt UI Checkbox](https://ui.nuxt.com/docs/components/checkbox)
