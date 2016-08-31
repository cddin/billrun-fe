webpackHotUpdate(0,{

/***/ 545:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(4);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(176);\n\nvar _reactBootstrap = __webpack_require__(293);\n\nvar _listActions = __webpack_require__(264);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n//import { getInputProcessors, setInputProcessor } from '../../actions/inputProcessorActions';\n\n\nvar InputProcessorsList = function (_Component) {\n  _inherits(InputProcessorsList, _Component);\n\n  function InputProcessorsList(props) {\n    _classCallCheck(this, InputProcessorsList);\n\n    var _this = _possibleConstructorReturn(this, (InputProcessorsList.__proto__ || Object.getPrototypeOf(InputProcessorsList)).call(this, props));\n\n    _this.onClickCell = _this.onClickCell.bind(_this);\n    _this.onClickNew = _this.onClickNew.bind(_this);\n    return _this;\n  }\n\n  _createClass(InputProcessorsList, [{\n    key: 'componentDidMount',\n    value: function componentDidMount() {\n      var params = {\n        api: \"settings\",\n        additional: [{ category: \"file_types\" }],\n        query: {\n          data: {}\n        }\n      };\n      this.props.dispatch((0, _listActions.getList)(\"input_processors\", params));\n    }\n  }, {\n    key: 'onClickCell',\n    value: function onClickCell(cell_idx, col_idx, e) {\n      var selected = this.props.list.valueSeq().get(cell_idx).get('file_type');\n      this.props.onSelectInputProcessor(selected);\n    }\n  }, {\n    key: 'onClickNew',\n    value: function onClickNew() {\n      this.props.onSelectInputProcessor(true);\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var table_headers = _react2.default.createElement(\n        'th',\n        null,\n        'File Type'\n      );\n\n      var table_body = this.props.inputProcessors.map(function (proc, key) {\n        return _react2.default.createElement(\n          'tr',\n          { key: key },\n          _react2.default.createElement(\n            'td',\n            null,\n            proc.get('file_type')\n          )\n        );\n      });\n\n      return _react2.default.createElement(\n        'div',\n        { className: 'InputProcessorsList' },\n        _react2.default.createElement(\n          'div',\n          { className: 'row' },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-lg-12' },\n            _react2.default.createElement(\n              _reactBootstrap.PageHeader,\n              null,\n              'Input Processors'\n            )\n          )\n        ),\n        _react2.default.createElement(\n          'div',\n          { className: 'row' },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-lg-12' },\n            _react2.default.createElement(\n              _reactBootstrap.Table,\n              { responsive: true },\n              _react2.default.createElement(\n                'thead',\n                null,\n                _react2.default.createElement(\n                  'tr',\n                  null,\n                  table_headers\n                )\n              ),\n              _react2.default.createElement(\n                'tbody',\n                null,\n                table_body\n              )\n            )\n          )\n        ),\n        _react2.default.createElement(\n          'div',\n          { className: 'row' },\n          _react2.default.createElement(\n            'div',\n            { className: 'col-xs-3' },\n            _react2.default.createElement(\n              'a',\n              { className: 'btn btn-primary', onClick: this.onClickNew, style: { margin: 15 } },\n              'Create New'\n            )\n          )\n        )\n      );\n    }\n  }]);\n\n  return InputProcessorsList;\n}(_react.Component);\n\nfunction mapStateToProps(state, props) {\n  return {\n    inputProcessors: state.list.get('input_processors') || []\n  };\n}\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps)(InputProcessorsList);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/components/InputProcessorsList/InputProcessorsList.js\n ** module id = 545\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/components/InputProcessorsList/InputProcessorsList.js?");

/***/ }

})