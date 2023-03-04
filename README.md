[![Latest released version](https://img.shields.io/npm/v/xml-template-literal)](https://www.npmjs.com/package/xml-template-literal)
[![Minified and gziped bundle size](https://img.shields.io/bundlephobia/minzip/xml-template-literal)](https://bundlephobia.com/package/xml-template-literal)
![Type support](https://img.shields.io/npm/types/xml-template-literal)
[![Downloads from NPM](https://img.shields.io/npm/dm/xml-template-literal?label=downloads%20npm)](https://www.npmjs.com/package/xml-template-literal)
[![Downloads from JSDeliver](https://img.shields.io/jsdelivr/npm/hm/xml-template-literal?label=downloads%20jsDelivr)](https://www.jsdelivr.com/package/npm/xml-template-literal)
[![Build status of main branch](https://img.shields.io/circleci/build/github/Olian04/xml-template-literal/main?label=test%20%26%20build)](https://app.circleci.com/pipelines/github/Olian04/xml-template-literal)
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

### NPM

[`npm i xml-template-literal`](https://www.npmjs.com/package/xml-template-literal)

```ts
import { xml } from 'xml-template-literal';
```

### CDN

#### ESM

```html
<script type="module">
  import { xml } from 'https://cdn.jsdelivr.net/npm/xml-template-literal';
</script>
```

#### UMD

```html
<script src="https://cdn.jsdelivr.net/npm/xml-template-literal/cdn/xml-template-literal.js"></script>
<script>
  const { xml } = xmlTemplateLiteral;
</script>
```

## Demos

- Parse and render HTML: <https://jsfiddle.net/tqa24c1h/12>
