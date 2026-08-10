# `@nustack/nuxt-ui/prefer-u-tree`

Prefer Nuxt UI's `<UTree>` over a hand-written tree root.

This first implementation reports only an explicit static `role="tree"` on components
other than `UTree`. It does not infer trees from recursion, list structure, dynamic role
bindings, drag and drop, or expansion controls.

## Incorrect

```vue
<ul role="tree">
  <TreeItem v-for="item in items" :key="item.id" :item="item" />
</ul>
```

## Correct

```vue
<UTree :items="items" />
```

Add `data-raw` to the tree root when a custom implementation is required. A custom tree
remains responsible for arrow-key navigation, Home/End behavior, expansion state, focus
movement, and keyboard-equivalent reordering.
