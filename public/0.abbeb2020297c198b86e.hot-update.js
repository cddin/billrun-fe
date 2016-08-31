webpackHotUpdate(0,{

/***/ 751:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(4);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _FontIcon = __webpack_require__(752);\n\nvar _FontIcon2 = _interopRequireDefault(_FontIcon);\n\nvar _colors = __webpack_require__(710);\n\nvar Colors = _interopRequireWildcard(_colors);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar SampleCSV = function (_Component) {\n  _inherits(SampleCSV, _Component);\n\n  function SampleCSV(props) {\n    _classCallCheck(this, SampleCSV);\n\n    var _this = _possibleConstructorReturn(this, (SampleCSV.__proto__ || Object.getPrototypeOf(SampleCSV)).call(this, props));\n\n    _this.addField = _this.addField.bind(_this);\n    _this.removeAllFields = _this.removeAllFields.bind(_this);\n\n    _this.state = {\n      newField: ''\n    };\n    return _this;\n  }\n\n  _createClass(SampleCSV, [{\n    key: 'addField',\n    value: function addField(val, e) {\n      this.props.onAddField.call(this, this.state.newField);\n      this.setState({ newField: '' });\n    }\n  }, {\n    key: 'removeField',\n    value: function removeField(index, e) {\n      this.props.onRemoveField.call(this, index);\n    }\n  }, {\n    key: 'removeAllFields',\n    value: function removeAllFields() {\n      var r = confirm(\"Are you sure you want to remove all fields?\");\n      if (r) {\n        this.props.onRemoveAllFields.call(this);\n      }\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _this2 = this;\n\n      var _props = this.props;\n      var settings = _props.settings;\n      var onChangeName = _props.onChangeName;\n      var onSetDelimiterType = _props.onSetDelimiterType;\n      var onChangeDelimiter = _props.onChangeDelimiter;\n      var onSelectSampleCSV = _props.onSelectSampleCSV;\n      var onSetFieldWidth = _props.onSetFieldWidth;\n      var onAddField = _props.onAddField;\n\n\n      var selectDelimiterHTML = settings.get('file_type') ? _react2.default.createElement(\n        'div',\n        { className: 'form-group' },\n        _react2.default.createElement(\n          'div',\n          { className: 'col-xs-2' },\n          _react2.default.createElement(\n            'label',\n            { htmlFor: 'delimiter' },\n            'Delimiter'\n          )\n        ),\n        _react2.default.createElement(\n          'div',\n          { className: 'col-xs-6' },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-3', style: { paddingLeft: 0 } },\n            _react2.default.createElement(\n              'div',\n              { className: 'input-group' },\n              _react2.default.createElement(\n                'div',\n                { className: 'input-group-addon' },\n                _react2.default.createElement('input', { type: 'radio', name: 'delimiter-type',\n                  value: 'separator',\n                  onChange: onSetDelimiterType,\n                  checked: settings.get('delimiter_type') === \"separator\" }),\n                'By delimiter'\n              ),\n              _react2.default.createElement('input', { id: 'separator',\n                className: 'form-control',\n                type: 'text',\n                maxLength: '1',\n                disabled: settings.get('delimiter_type') !== \"separator\",\n                style: { width: 30 },\n                onChange: onChangeDelimiter,\n                value: settings.get('delimiter') })\n            )\n          ),\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-3', style: { marginTop: 10 } },\n            _react2.default.createElement('input', { type: 'radio', name: 'delimiter-type',\n              value: 'fixed',\n              onChange: onSetDelimiterType,\n              checked: settings.get('delimiter_type') === \"fixed\" }),\n            'Fixed width',\n            _react2.default.createElement(\n              'p',\n              { className: 'help-block' },\n              ' '\n            )\n          )\n        )\n      ) : null;\n\n      var fieldsHTML = settings.get('delimiter_type') === \"fixed\" ? settings.get('fields').map(function (field, key) {\n        return _react2.default.createElement(\n          'div',\n          { className: 'form-group', key: key },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement(\n              _FontIcon2.default,\n              { onClick: _this2.removeField.bind(_this2, key), className: 'material-icons', style: { cursor: \"pointer\", color: Colors.red300, fontSize: '13px', marginRight: '5px' } },\n              'remove_circle_outline'\n            ),\n            field\n          ),\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement('input', { type: 'number',\n              className: 'form-control',\n              'data-field': field,\n              style: { width: 70 },\n              onChange: onSetFieldWidth,\n              value: settings.getIn(['field_widths', field]) })\n          )\n        );\n      }) : settings.get('fields').map(function (field, key) {\n        return _react2.default.createElement(\n          'div',\n          { className: 'form-group', key: key },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement(\n              _FontIcon2.default,\n              { onClick: _this2.removeField.bind(_this2, key), className: 'material-icons', style: { cursor: \"pointer\", color: Colors.red300, fontSize: '13px', marginRight: '5px' } },\n              'remove_circle_outline'\n            ),\n            field\n          )\n        );\n      });\n\n      var setFieldsHTML = _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(\n          'div',\n          { className: 'form-group' },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement(\n              'label',\n              null,\n              'Field ',\n              _react2.default.createElement(\n                'small',\n                null,\n                _react2.default.createElement(\n                  'a',\n                  { onClick: this.removeAllFields },\n                  '(remove all)'\n                )\n              )\n            )\n          ),\n          function () {\n            if (settings.get('delimiter_type') === \"fixed\") {\n              return _react2.default.createElement(\n                'div',\n                { className: 'col-xs-2' },\n                _react2.default.createElement(\n                  'label',\n                  null,\n                  'Width'\n                )\n              );\n            }\n          }()\n        ),\n        fieldsHTML,\n        _react2.default.createElement(\n          'div',\n          { className: 'form-group' },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement('input', { className: 'form-control', value: this.state.newField, onChange: function onChange(e) {\n                _this2.setState({ newField: e.target.value });\n              }, placeholder: 'Field Name' })\n          ),\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement(\n              _FontIcon2.default,\n              { onClick: this.addField, className: 'material-icons', style: { cursor: \"pointer\", color: Colors.green300, fontSize: '24px', paddingRight: '3px', marginTop: '10px' } },\n              'add_circle_outline'\n            )\n          )\n        )\n      );\n\n      var selectCSVHTML = (settings.get('delimiter_type') === 'fixed' || settings.get('delimiter')) && settings.get('file_type') ? _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(\n          'div',\n          { className: 'form-group' },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement(\n              'label',\n              { htmlFor: 'sample_csv' },\n              'Select Sample CSV'\n            ),\n            _react2.default.createElement(\n              'p',\n              { className: 'help-block' },\n              'Notice: Spaces will be convereted to underscores'\n            )\n          ),\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement('input', { type: 'file', id: 'sample_csv', onChange: onSelectSampleCSV, disabled: !settings.get('delimiter_type') })\n          )\n        ),\n        setFieldsHTML\n      ) : null;\n\n      return _react2.default.createElement(\n        'form',\n        { className: 'InputProcessor form-horizontal' },\n        _react2.default.createElement(\n          'div',\n          { className: 'form-group' },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement(\n              'label',\n              { htmlFor: 'file_type' },\n              'Name'\n            )\n          ),\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-2' },\n            _react2.default.createElement('input', { id: 'file_type', className: 'form-control', onChange: onChangeName, value: settings.get('file_type') }),\n            _react2.default.createElement(\n              'p',\n              { className: 'help-block' },\n              ' '\n            )\n          )\n        ),\n        selectDelimiterHTML,\n        selectCSVHTML\n      );\n    }\n  }]);\n\n  return SampleCSV;\n}(_react.Component);\n\nexports.default = SampleCSV;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/components/InputProcessor/SampleCSV.js\n ** module id = 751\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/components/InputProcessor/SampleCSV.js?");

/***/ }

})