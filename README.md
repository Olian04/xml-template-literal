[![Latest released version](https://img.shields.io/npm/v/xml-template-literal)](https://www.npmjs.com/package/xml-template-literal)
[![Minified and gzipped bundle size](https://img.shields.io/bundlephobia/minzip/xml-template-literal)](https://bundlephobia.com/package/xml-template-literal)
![Type support](https://img.shields.io/npm/types/xml-template-literal)
[![Downloads from NPM](https://img.shields.io/npm/dm/xml-template-literal?label=downloads%20npm)](https://www.npmjs.com/package/xml-template-literal)
[![Downloads from JSDeliver](https://img.shields.io/jsdelivr/npm/hm/xml-template-literal?label=downloads%20jsDelivr)](https://www.jsdelivr.com/package/npm/xml-template-literal)
[![Build status of main branch](https://img.shields.io/circleci/build/github/Olian04/xml-template-literal/main?label=test%20%26%20build)](https://app.circleci.com/pipelines/github/Olian04/xml-template-literal)
[![Code percentage covered by tests on main branch](https://codecov.io/gh/Olian04/xml-template-literal/branch/main/graph/badge.svg?token=iPCuTDTD3F)](https://codecov.io/gh/Olian04/xml-template-literal)
[![MIT licensed](https://img.shields.io/npm/l/xml-template-literal)](./LICENSE)

# xml-template-literal

This library contains a variant-implementation of an `LL(1)` parser for parsing xml like structures with intertwined dynamic values.

```ts
const ast = xml`
  <div class="widget">
    <h1>Some Title</h1>
    <form>
      <input type="text" name="something" />
      <input type="submit" onclick=${(ev) => submit(ev)} />
    </form>
  </div>
`;
```

## Installation

### NPM - ESM

[`npm i xml-template-literal`](https://www.npmjs.com/package/xml-template-literal)

```ts
import { xml } from 'xml-template-literal';
```

### NPM - UMD

[`npm i xml-template-literal`](https://www.npmjs.com/package/xml-template-literal)

```js
const { xml } = require('xml-template-literal');
```

### CDN - ESM

```html
<script type="module">
  import { xml } from 'https://cdn.jsdelivr.net/npm/xml-template-literal/dist/api.js';
</script>
```

#### CDN - UMD

```html
<script src="https://cdn.jsdelivr.net/npm/xml-template-literal/legacy/umd.js"></script>
<script>
  const { xml } = xmlTemplateLiteral;
</script>
```

## Demos

- Parse and render HTML: <https://jsfiddle.net/bq7m4uhw/30/>

## AST Format & Types

### AstRoot

*`AstRoot` is the type returned by the `xml` template literal tag function & the parseXml function call.*

```ts
type AstRoot<T> = {
  kind: AstKind.Root;
  children: AstChild<T>[];
}
```

### AstChild

```ts
type AstChild<T> = TextChild | DataChild<T> | NodeChild<T>

type TextChild = {
  kind: AstKind.Child;
  type: ChildType.Text;
  value: string;
};

type DataChild<T> = {
  kind: AstKind.Child;
  type: ChildType.Data;
  value: T;
};

type NodeChild<T> = {
  kind: AstKind.Child;
  type: ChildType.Node;
  tag: string;
  children: AstChild<T>[];
  attributes: AstAttribute<T>[];
};

```

### AstAttribute

```ts
type AstAttribute<T> = TextAttribute | DataAttribute<T> | CompositeAttribute<T>;

// key="text_value"
type TextAttribute = {
  kind: AstKind.Attribute;
  type: AttributeType.Text;
  key: string;
  value: string;
};

// key=${data_value}
type DataAttribute<T> = {
  kind: AstKind.Attribute;
  type: AttributeType.Data;
  key: string;
  value: T;
};

// key="text_value ${data_value}"
type CompositeAttribute<T> = {
  kind: AstKind.Attribute;
  type: AttributeType.Composite;
  key: string;
  value: AstAttributeComposite<T>[];
};
```

### AstAttributeComposite

```ts
type AstAttributeComposite<T> = TextComposite | DataComposite<T>;

type TextComposite = {
  kind: AstKind.Composite;
  type: AttributeType.Text;
  value: string;
};

type DataComposite<T> = {
  kind: AstKind.Composite;
  type: AttributeType.Data;
  value: T;
};
```
