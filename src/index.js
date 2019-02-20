import * as React from "react";

type Props = {
  onFocus?: () => mixed,
  onBlur?: () => mixed,
  keys?: [],
  children: ({ onFocus: mixed }) => mixed
};

class MergeFocus extends React.Component<Props> {
  static defaultProps = {
    keys: [],
    onFocus: undefined,
    onBlur: undefined
  };

  constructor(props) {
    super();
    this.elementRefs = props.keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: React.createRef()
      }),
      {}
    );
  }

  // is the given element one of the elements that we're merging
  isMerged(element) {
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
    // if it was the component in question we could pass down onBlur/onChange, however it's the target of a blur event that we need to check against to prevent it from firing, so we don't know what this is until the user causes a blur - and even then we only have a DOM reference to it
    // if we passed refs using createRef rather than a function then we could use ref.current
    return Object.keys(this.elementRefs).some(
      key => this.elementRefs[key].current === element
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

    const inputs = keys.reduce(
      (acc, key) => ({
        [key]: {
          onFocus: e => this.handleFocusChange(key, e),
          onBlur: e => this.handleBlurChange(key, e),
          ref: this.elementRefs[key]
        },
        ...acc
      }),
      {}
    );
    return children(inputs);
  }
}

export default MergeFocus;
