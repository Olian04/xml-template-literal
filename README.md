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

```
N --> < L {A} (/ >) | (> {C} < / L >)
A --> L = (" V " | D)
C --> N | D | T

N: Node
A: Attribute
C: Child
D: Dynamic
T: Text
L: Label
```
