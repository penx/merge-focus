import * as React from "react";

type Props = {
  onFocus?: () => mixed,
  onBlur?: () => mixed,
  children: ({ onFocus: mixed }) => mixed
};

class MergeFocus extends React.Component<Props> {
  state = {
    elements: []
  };

  static defaultProps = {
    onFocus: undefined,
    onBlur: undefined
  };

  // is the given element one of the elements that we're merging
  isMerged(element) {
    const { elements } = this.state;
    // we could traverse up the DOM as per https://stackoverflow.com/a/38019906/1582783
    // or maybe if thisComponentRef.contains(e.relatedTarget)
    // but this wouldn't work e.g with portals
    // and we don't have a DOM node for MergeFocus so 'contains' is not possible unless we add one
    // we could keep a record of all refs we are tracking
    // ...and check tracking.contains(e.relatedTarget)
    // How could this work in react native?
    // What does the react native onBlur event signature look like?
    // Could the context api be used to detect child-of?
    // if we could 'get react component associated with this event' then there may be an option but that feels like an anti pattern
    // ^^ think about this anti pattern and why!
    // console.log(this.state.elements);
    // console.log(e.relatedTarget);
    return elements.indexOf(element) !== -1;
    // e.currentTarget.contains(e.relatedTarget)
  }

  handleFocusChange(e) {
    const { onFocus } = this.props;
    // Don't focus if e.relatedTarget (where the user came from) is included in group
    if (!this.isMerged(e.relatedTarget)) {
      !!onFocus && onFocus(e);
    }
  }

  handleBlurChange(e) {
    const { onBlur } = this.props;
    // Don't blur if e.relatedTarget (where the user is moving to) is included in group
    if (!this.isMerged(e.relatedTarget)) {
      !!onBlur && onBlur(e);
    }
  }

  handleRef(input) {
    // TODO: how to handle refs being removed? Need a unit test
    input &&
      this.setState(prevState =>
        prevState.elements.indexOf(input) === -1
          ? {
              elements: prevState.elements.concat([input])
            }
          : null
      );
  }

  render() {
    const { children } = this.props;

    return children({
      onFocus: e => this.handleFocusChange(e),
      onBlur: e => this.handleBlurChange(e),
      ref: input => this.handleRef(input)
    });
  }
}

export default MergeFocus;
