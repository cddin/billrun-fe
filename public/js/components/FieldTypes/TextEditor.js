import React from 'react';
import debounce from 'lodash.debounce';

class TextEditor extends React.Component {

  static defaultProps = {
    fields: [],
    value: '',
    configName: '',
    editorHeight: 250,
  };

  static propTypes = {
    fields: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    editorName: React.PropTypes.string.isRequired,
    configName: React.PropTypes.string,
    editorHeight: React.PropTypes.number,
  };

  state = {
    showWYSIWYG: false,
  }

  componentDidMount() {
    this.initEditor();
  }

  shouldComponentUpdate(nextProps, nextState) {  // eslint-disable-line no-unused-vars
    const { value } = this.props;
    return value !== nextProps.value;
  }

  componentDidUpdate(prevProps, prevState) { // eslint-disable-line no-unused-vars
    this.initEditor();
  }

  componentWillUnmount() {
    const { editorName } = this.props;
    const editor = CKEDITOR && CKEDITOR.instances[editorName];
    if (editor) {
      editor.destroy(true);
    }
  }

  initEditor = () => {
    const { configName, editorName } = this.props;
    const editor = CKEDITOR && CKEDITOR.instances[editorName];

    const configPath = (configName.length) ? `br/config/${configName}.js` : '';
    if (!this.state.showWYSIWYG) {
      window.setTimeout(() => this.toggleEditor(editor, configPath), 100);
    } else if (editor) {
      const editorData = window.CKEDITOR.instances[editorName].getData();
      if (editorData !== unescape(this.props.value)) {
        window.setTimeout(() => this.toggleEditor(editor, configPath), 100);
      }
    }
  }

  toggleEditor = (editor, configPath) => {
    const { editorName } = this.props;
    const { fields, editorHeight } = this.props;
    if (editor) {
      editor.destroy(true);
    }
    const ckeditorConfig = {
      customConfig: configPath,
      toolbar: 'Basic',
      height: editorHeight,
      placeholder_select: {
        placeholders: fields,
      },
    };

    window.CKEDITOR.replace(editorName, ckeditorConfig);
    window.CKEDITOR.dtd.$removeEmpty.i = 0;
    window.CKEDITOR.dtd.$removeEmpty.span = false;

    // window.CKEDITOR.instances[editorName].on('blur', this.onChange);
    window.CKEDITOR.instances[editorName].on('change', this.onChange);
    this.setState({ showWYSIWYG: true });
  }

  onChange = debounce(() => {
    const { editorName } = this.props;
    const data = window.CKEDITOR.instances[editorName].getData();
    this.props.onChange(data);
  }, 250)

  render() {
    const { value, editorName, editorHeight } = this.props;
    const editorContent = unescape(value || '');
    return (
      <div className="TextEditor">
        <textarea
          name={editorName}
          value={editorContent}
          style={{ width: '100%', height: editorHeight }}
          onChange={() => { /* CKEDITOR will handle onChange event */ }}
        />
      </div>
    );
  }
}

export default TextEditor;
