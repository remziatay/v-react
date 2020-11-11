import { render } from "@testing-library/react";
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
});
