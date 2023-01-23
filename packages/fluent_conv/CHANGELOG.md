### 1.0.0

#### Breaking changes

- Update to @fluent/syntax 0.18.
- Add TypeScript types
- The JS intermediate format changed. `val` is now named `value`

## Old Pre-Fork Changelog

### 3.1.0

- handle Group and Resource comments
- add optional `respectComments` parameter to `ftl2js`

### 3.0.1

- transpile also esm

### 3.0.0

- update fluent-syntax dep

### 2.0.2

- fix export for node v14 cjs

### 2.0.1

- fix export for dynamic imports

### 2.0.0

- complete refactoring to make this module universal
- MIGRATION:
  - `require('fluent_conv/ftl2js')` should be replaced with `require('fluent_conv/cjs/ftl2js')`
  - `require('fluent_conv/js2ftl')` should be replaced with `require('fluent_conv/cjs/js2ftl')`

### 1.1.1

- getVariant name fix for NumberLiteral variants [2](https://github.com/locize/fluent_conv/pull/2)

### 1.1.0

- add support for functions
