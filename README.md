# v-react

This is a small library that lets you use [Vue](https://github.com/vuejs/vue)'s directives in React. Available directives are:

- vIf
- vElse
- vElseIf
- vShow
- vText
- vHtml (careful!)
- vModel (coming soon)

##### Why not the others?

Because either it doesn't make any sense to implement it for React (v-bind, v-on) or it would make things more complicated (v-for) or some other reason that it's not suited with React.

### Usage

To directives to be processed we should either use withVue or Vue.

#### withVue

```js
import { withVue } from "v-react";
const MyComponent = props => <div vIf={false}>1</div>;
export default withVue(MyComponent);
```

or

```js
import { withVue } from "v-react";
const MyComponent = withVue(props => <div vIf={false}>1</div>);
export default MyComponent;
```

#### Vue

```js
import { Vue } from "v-react";
const MyComponent = props => (
  <Vue>
    <div vIf={false}>1</div>
  </Vue>
);
export default MyComponent;
```

#### vIf, vElse, vElseIf

These will render components conditionally, just like vue does.

```js
<>
  <div vIf={false}>1</div>
  <div vIf={true}>
    <div vIf={true}>2a</div>
    <div vIf={false}>2b</div>
    <div vIf={true}>2c</div>
  </div>
  <div vIf={false}>
    <div vIf={true}>3a</div>
  </div>
</> // will render only 2a and 2c
```

```js
<>
  <div vIf={false}>1</div>
  <div vElseIf={false}>2</div>
  <div vElse>3</div>
  <div vIf={true}>4</div>
  <div vElse>5</div>
</> // will render only 3 and 4
```

Conditional directives must be consecutive or they will be ignored

```js
<>
  <div vIf={false}>1</div>
  <div>2</div>
  <div vElseIf={true}>3</div>
  <div vElseIf={false}>4</div>
  <div vElse>5</div>
</> // will render 2, 3, 4 and 5
```

#### vShow

Component won't be displayed if vShow is falsy. Truthy vShow values don't mean anything.

```js
<>
  <div vShow={true}>1</div>
  <div vShow={false}>2</div>
</> // will render both but 2 will not be displayed
```

vShow cannot be overriden inside a parent

```js
<div vShow={false}>
  <div vShow={true}>2a</div>
  <div vShow={false}>2b</div>
</div> // this obviously won't make 2a visible
```

#### vText

This will give the value to the component as children. If component already has children, vText is ignored. vText values are converted to string.

```js
<>
  <div vText="1" /> // will render <div>1</div>
  <div vText={2} /> // will render <div>2</div>
  <div vText={{ key: "value" }} /> // will render <div>[object Object]</div>
  <div vText="anything">4</div> // will render <div>4</div>
</>
```

#### vHtml

This basically implements dangerouslySetInnerHTML of React. Be careful using it! vHtml also ignored if component already has children.

```js
<>
  <div vHtml="<p>1</p>" /> {/* will render <div><p>1</p></div> */}
  <div vHtml="<p>Test</p>">2</div> {/* will render <div>2</div> */}
</>
```

### Other Features

Even tho this is about directives, I still wanted to include one of vue's simpler features. Classname props will be rendered with [clsx](https://github.com/lukeed/clsx) if it's given as an array. Also style props will merge styles if it's given as an array.

```js
<>
  <div
    className={["c1", false && "c2", { c3: true, c4: false }, ["c5", "c6"]]} // className will be "c1 c3 c5 c6"
  />
  <div data-testid="div2" className="c7" /> // it will work just as normal
</>
```

Check for more examples in [clsx](https://github.com/lukeed/clsx) repository!

```js
<>
    <div
    style={[
      { color: "pink", display: "flex" },
      { color: "white" },
    ]} /> // style will be "{color: "white", display: "flex"}"
    <div style={{ display: "inline" }} /> // it will work just as normal
</>
```
