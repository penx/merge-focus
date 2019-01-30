import * as React from "react";

type Props = {
  onFocus?: () => mixed,
  onBlur?: () => mixed,
  keys?: [],
  children: ({ onFocus: mixed }) => mixed
};

class MergeFocus extends React.Component<Props> {
  state = {};

  static defaultProps = {
    keys: [],
    onFocus: undefined,
    onBlur: undefined
  };

  static getDerivedStateFromProps(props) {
    return props.keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: React.createRef()
      }),
      {}
    );
  }

  // is the given element one of the elements that we're merging
  isMerged(element) {
    const elementRefs = this.state;
    return Object.keys(elementRefs).some(
      key => elementRefs[key].current === element
    );
  }

  handleFocusChange(key, e) {
    const { onFocus } = this.props;
    // Don't focus if e.relatedTarget (where the user came from) is included in group
    if (!this.isMerged(e.relatedTarget)) {
      !!onFocus && onFocus(e);
    }
  }

  handleBlurChange(key, e) {
    const { onBlur } = this.props;
    // Don't blur if e.relatedTarget (where the user is moving to) is included in group
    if (!this.isMerged(e.relatedTarget)) {
      !!onBlur && onBlur(e);
    }
  }

  render() {
    const { children, keys } = this.props;

    const elementRefs = this.state;

    const inputs = keys.reduce(
      (acc, key) => ({
        [key]: {
          onFocus: e => this.handleFocusChange(key, e),
          onBlur: e => this.handleBlurChange(key, e),
          ref: elementRefs[key]
        },
        ...acc
      }),
      {}
    );
    return children(inputs);
  }
}

export default MergeFocus;
