import clsx from "clsx";
import React from "react";

const parser = comp => {
  if (Array.isArray(comp)) {
    comp = ifElse(comp);
    return React.Children.map(comp, c => parser(c));
  }

  if (!React.isValidElement(comp)) return comp;

  let {
    vIf,
    vElse,
    vElseIf,
    vShow,
    vText,
    vHtml,
    children,
    ...props
  } = comp.props;

  if ("key" in props) delete props.key;
  if ("ref" in props) delete props.ref;

  if (comp.key) props.key = comp.key;
  if (comp.ref) props.ref = comp.ref;

  if (vIf !== undefined && !vIf) return false;

  if (vShow !== undefined && !vShow)
    props.style = { ...props.style, display: "none" };

  if (children) children = parser(children);
  else if (vText !== undefined && vText !== false) children = vText.toString();
  else if (vHtml !== undefined && vHtml !== false)
    props.dangerouslySetInnerHTML = { __html: vHtml.toString() };

  if (props.className && typeof props.className !== "string")
    props.className = clsx(props.className);

  if (Array.isArray(props.style))
    props.style = Object.assign({}, ...props.style);

  return <comp.type {...props}>{children}</comp.type>;
};

const ifElse = arr => {
  let lastIf;
  return arr.filter(child => {
    if (!child.props) {
      lastIf = undefined;
      return true;
    }

    if (child.props.vIf !== undefined) {
      lastIf = child.props.vIf;
      return child.props.vIf;
    }

    if (lastIf) {
      if (child.props.vElse !== undefined) return false;
      if (child.props.vElseIf !== undefined) return false;
      lastIf = undefined;
      return true;
    }

    lastIf = undefined;
    if (child.props.vElse !== undefined) return true;

    if (child.props.vElseIf !== undefined) {
      lastIf = child.props.vElseIf;
      return child.props.vElseIf;
    }

    return true;
  });
};

export const withVue = Component => props => parser(Component(props));
export const Vue = ({ children }) => parser(children);
