import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import Modal from 'react-modal';
import MdContentCopy from 'react-icons/lib/md/content-copy';
import MdSave from 'react-icons/lib/md/save';
import MdClose from 'react-icons/lib/md/close';

const style = {
  overlay: {
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100
  },
  content: {
    overflow: 'hidden',
    left: '25%',
    width: '50%'
  }
};

const inputStyle = {
  marginTop: 10,
  padding: '5px 10px',
  height: 'calc(100% - 75px)',
  border: '1px solid #ddd',
  fontFamily: 'Monaco, Consolas, monospace',
  fontSize: 12,
  overflow: 'scroll'
};

const toolbarStyle = {
  marginTop: -5
};

const headingStyle = {
  marginBottom: 10,
  fontSize: 20,
  fontFamily: 'Monaco, Consolas, monospace'
};

const buttonStyle = {
  marginRight: 5,
  padding: '5px 10px',
  fontFamily: 'Monaco, Consolas, monospace',
  fontSize: 12,
  background: '#eee',
  border: '1px solid #ddd'
};

const closeButtonStyle = {
  ...buttonStyle,
  marginRight: 0,
  float: 'right'
};

const buttonStyleDisabled = {
  ...buttonStyle,
  opacity: 0.5
};

const iconStyle = {
  margin: '-2px 5px 0 0'
};

export default class InputModal extends Component {
  static defaultProps = {
    contentLabel: 'Modal'
  };

  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    appState: PropTypes.string,
    contentLabel: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      appState: props.appState,
      input: props.appState
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.selectInputContents = this.selectInputContents.bind(this);
    this.deselectInputContents = this.deselectInputContents.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      appState: nextProps.appState,
      input: nextProps.appState
    });
  }

  onInputChange(e) {
    this.setState({ input: e.target.textContent });
  }

  selectInputContents() {
    const range = document.createRange();
    range.selectNodeContents(this.modalInput);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  deselectInputContents() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  onRequestClose() {
    this.props.closeModal();
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onRequestClose();
    }
  }

  renderInputAsJson() {
    try {
      return JSON.stringify(JSON.parse(this.state.input), null, 2);
    } catch (e) {
      return null;
    }
  }

  render() {
    return (
      <Modal style={style} isOpen={this.props.isOpen} onRequestClose={this.onRequestClose} contentLabel={this.props.contentLabel}>
        <div style={toolbarStyle}>
          <div style={headingStyle}>Redux App State</div>
          <button
            style={buttonStyle}
            onClick={() => {
              this.selectInputContents();
              document.execCommand('copy');
              this.deselectInputContents();
              this.modalInput.blur();
            }}
          >
            <MdContentCopy style={iconStyle} />
            Copy to clipboard
          </button>

          <button
            style={this.state.input === this.state.appState ?
              buttonStyleDisabled : buttonStyle}
            onClick={() => {
              this.setState({ appState: this.state.input });
              this.props.onSubmit(this.state.input);
              this.props.closeModal();
            }}
            disabled={this.state.input === this.state.appState}
          >
            <MdSave style={iconStyle} />
            Save and Close
          </button>
          <button
            style={closeButtonStyle}
            onClick={this.props.closeModal}
          >
            <MdClose style={iconStyle} />
            Close
          </button>
        </div>

        <div style={{ height: '100%' }}>
          <pre
            contentEditable
            suppressContentEditableWarning
            ref={(ref) => this.modalInput = ref}
            style={inputStyle}
            onInput={this.onInputChange}
            onKeyDown={this.onKeyDown}
            onFocus={this.selectInputContents}
          >
            {this.renderInputAsJson()}
          </pre>
        </div>
      </Modal>
    );
  }
}
