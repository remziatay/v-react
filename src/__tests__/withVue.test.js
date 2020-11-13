import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import withVue from "../withVue";

describe("withVue rules", () => {
  test("renders normally when no directives", () => {
    const Component = withVue(() => <div>1</div>);
    render(<Component />);

    expect(document.body).toHaveTextContent(/^1$/);
  });

  test("renders deep components normally when no directives", () => {
    const Component = withVue(() => (
      <>
        <p>1</p>
        <div>
          <p>2a</p>
          <p>2b</p>
          <p>2c</p>
        </div>
        <p>3</p>
      </>
    ));
    render(<Component />);

    expect(document.body).toHaveTextContent(/^12a2b2c3$/);
  });

  test("respects vIf directive", () => {
    const Component = withVue(() => (
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
      </>
    ));
    render(<Component />);

    expect(document.body).toHaveTextContent(/^2a2c$/);
  });

  test("respects falsy and truthy values for vIf directives", () => {
    const Component = withVue(() => (
      <>
        <div vIf={0}>1</div>
        <div vIf={1}>
          <div vIf={"true"}>2a</div>
          <div vIf={""}>2b</div>
          <div vIf={{}}>2c</div>
        </div>
        <div vIf={null}>
          <div vIf={true}>3a</div>
        </div>
      </>
    ));
    render(<Component />);

    expect(document.body).toHaveTextContent(/^2a2c$/);
  });

  test("respects vElseIf directive", () => {
    const Component = withVue(() => (
      <>
        <div vIf={false}>1</div>
        <div vElseIf={false}>2</div>
        <div vElseIf={true}>3</div>
        <div vElseIf={true}>4</div>
        <div vIf={true}>5</div>
      </>
    ));
    render(<Component />);

    expect(document.body).toHaveTextContent(/^35$/);
  });

  test("respects vElse directive", () => {
    const Component = withVue(() => (
      <>
        <div vIf={false}>1</div>
        <div vElseIf={false}>2</div>
        <div vElse>3</div>
        <div vIf={true}>4</div>
        <div vElse>5</div>
      </>
    ));
    render(<Component />);

    expect(document.body).toHaveTextContent(/^34$/);
  });

  test("respects vShow directive", () => {
    const Component = withVue(() => (
      <>
        <div vShow={true}>1</div>
        <div vShow={false}>2</div>
      </>
    ));
    render(<Component />);

    expect(document.body).toHaveTextContent(/^12$/);
    expect(screen.getByText("1")).toBeVisible();
    expect(screen.getByText("2")).not.toBeVisible();
  });

  test("respects vShow directive for deep components", () => {
    const Component = withVue(() => (
      <>
        <div>1</div>
        <div vShow={false}>
          <div vShow={true}>2a</div>
          <div vShow={false}>2b</div>
        </div>
      </>
    ));
    render(<Component />);

    expect(document.body).toHaveTextContent(/^12a2b$/);
    expect(screen.getByText("1")).toBeVisible();
    expect(screen.getByText("2a")).not.toBeVisible();
    expect(screen.getByText("2b")).not.toBeVisible();
  });

  test("respects vText directive", () => {
    const Component = withVue(() => (
      <>
        <div vText="1" />
        <div vText={2} />
        <div vText={{ key: "value" }} />
      </>
    ));
    render(<Component />);

    expect(document.body).toHaveTextContent(/^12\[object Object\]$/);
  });

  test("doesn't respect vText directive if there is already children", () => {
    const Component = withVue(() => <div vText="123">Content</div>);
    render(<Component />);

    expect(document.body).toHaveTextContent(/^Content$/);
  });

  test("applies clsx to className", () => {
    const Component = withVue(() => (
      <div
        data-testid="div1"
        className={["c1", false && "c2", { c3: true, c4: false }, ["c5", "c6"]]}
      >
        <div data-testid="div2" className="c7" />
      </div>
    ));
    render(<Component />);

    expect(screen.getByTestId("div1")).toHaveClass("c1 c3 c5 c6");
    expect(screen.getByTestId("div2")).toHaveClass("c7");
  });

  test("overrides styles given as array", () => {
    const Component = withVue(() => (
      <div
        data-testid="div1"
        style={[
          { color: "pink", display: "flex" },
          { width: "50%", border: "2px dotted red" },
          { border: "1px solid black" },
          { color: "white" },
        ]}
      >
        <div data-testid="div2" style={{ display: "inline" }} />
      </div>
    ));
    render(<Component />);

    expect(screen.getByTestId("div1")).toHaveStyle({
      color: "white",
      display: "flex",
      width: "50%",
      border: "1px solid black",
    });
    expect(screen.getByTestId("div2")).toHaveStyle({ display: "inline" });
  });

  test("passes key down", () => {
    const users = [
      { id: "key1", name: "a" },
      { id: "key2", name: "b" },
      { id: "key3", name: "c" },
    ];
    const Component = withVue(() =>
      users.map(user => (
        <div data-testid={user.id} key={user.id}>
          {user.name}
        </div>
      ))
    );
    render(<Component />);

    users.forEach(user => {
      expect(Object.values(screen.getByTestId(user.id))[0].key).toMatch(
        user.id
      );
    });
  });

  test("passes ref down", () => {
    const Component = withVue(() => {
      const divRef = useRef(null);
      return <div data-testid="div" ref={divRef} />;
    });
    render(<Component />);

    const div = screen.getByTestId("div");
    expect(Object.values(div)[0].ref.current).toBe(div);
  });
});
