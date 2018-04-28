import { Component } from '../react';

function _render(vnode) {

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'number') vnode = String(vnode);


  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return textNode;
  }

  if (typeof vnode.tag === 'function') {
    const component =  createComponent(vnode.tag, vnode.attrs);
    setComponentProps(component, vnode.attrs);
    return component.base;
  }

  const dom = document.createElement(vnode.tag);

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const val = vnode.attrs[key];
      setAttribute(dom, name, val);
    })
  }

  vnode.children.forEach(child => render(child, dom)); // 递归渲染子节点
  return dom;
}

function setAttribute(dom, name, value) {
  if (name === 'className') name = 'class';

  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && typeof value === 'object') {
      for (let name in value) {
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
      }
    }
  } else {
    if (name in dom) {
      dom[name] = value || '';
    }

    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  }
}

function render(vnode, container) {
  return container.appendChild(_render(vnode));
}

function createComponent(component, props) {
  let inst;

  // 如果是类定义组件，则直接返回实例
  if (component.prototype && component.prototype.render) {
    inst = new component( props );
    // 如果是函数定义组件，则将其拓展为类定义主键
  } else {
    inst = new Component( props);
    inst.constructor = component;
    inst.render = function() {
      return this.constructor(props);
    }
  }
  return inst;
}

function setComponentProps(component, props) {
  if (! component.base) {
    if (component.componentWillMount) {
      component.componentWillMount();
    } 
  }
  else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  component.props = props;
  renderComponent(component);
}

function renderComponent(component) {
  let base;

  const renderer = component.render();
  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  base =  _render(renderer);

  if (component.base) {
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }

  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }

  component.base = base;
  base._component = component;
}

const ReactDOM = {
  render: (vnode, container) => {
    container.innerHTML = '';
    return render(vnode, container);
  },
}

export default ReactDOM;
