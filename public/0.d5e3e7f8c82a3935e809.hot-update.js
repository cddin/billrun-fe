webpackHotUpdate(0,{

/***/ 247:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(77);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(248);\n\nvar _reactRouter = __webpack_require__(271);\n\nvar _Router = __webpack_require__(332);\n\nvar _Router2 = _interopRequireDefault(_Router);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n//import configureStore from '../configureStore.js';\n\n\nconsole.log(_Router2.default.routes());\n\nvar routes = _Router2.default.routes();\nvar initialState = {};\n//const store = configureStore(initialState);\nfunction initialReducer() {\n  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];\n  var action = arguments[1];\n\n  switch (action.type) {\n    default:\n      return state;\n  }\n}\nvar store = (0, _reactRedux.createStore)(initialReducer);\n\nvar Root = function (_Component) {\n  _inherits(Root, _Component);\n\n  function Root(props) {\n    _classCallCheck(this, Root);\n\n    return _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, props));\n  }\n\n  _createClass(Root, [{\n    key: 'render',\n    value: function render() {\n      return _react2.default.createElement(\n        _reactRedux.Provider,\n        { store: store },\n        _react2.default.createElement(\n          _reactRouter.Router,\n          { history: _reactRouter.hashHistory },\n          routes\n        )\n      );\n    }\n  }]);\n\n  return Root;\n}(_react.Component);\n\nexports.default = Root;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/containers/Root.js\n ** module id = 247\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/containers/Root.js?");

/***/ }

})