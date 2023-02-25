# xml-template-literal

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

```bnf
<child> ::= <node> | <dynamic> | [^<>]+
<node> ::= <tag_open> <label> <attribute>* (<tag_selfclose> | (<tag_end> <child>* <tag_close> <label> <tag_end>))
<attribute> ::= <label> "=" (<dynamic> | ("\"" [^"]+ "\""))
```

```ts

```
