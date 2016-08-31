webpackHotUpdate(0,{

/***/ 545:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(4);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactRedux = __webpack_require__(176);\n\nvar _inputProcessorActions = __webpack_require__(546);\n\nvar _settingsActions = __webpack_require__(548);\n\nvar _commonActions = __webpack_require__(266);\n\nvar _SampleCSV = __webpack_require__(751);\n\nvar _SampleCSV2 = _interopRequireDefault(_SampleCSV);\n\nvar _FieldsMapping = __webpack_require__(754);\n\nvar _FieldsMapping2 = _interopRequireDefault(_FieldsMapping);\n\nvar _lodash = __webpack_require__(549);\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nvar _Stepper = __webpack_require__(551);\n\nvar _RaisedButton = __webpack_require__(591);\n\nvar _RaisedButton2 = _interopRequireDefault(_RaisedButton);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n// import CalculatorMapping from './CalculatorMapping';\n// import Receiver from './Receiver';\n\n\nvar InputProcessor = function (_Component) {\n  _inherits(InputProcessor, _Component);\n\n  function InputProcessor(props) {\n    _classCallCheck(this, InputProcessor);\n\n    var _this = _possibleConstructorReturn(this, (InputProcessor.__proto__ || Object.getPrototypeOf(InputProcessor)).call(this, props));\n\n    _this.onSetReceiverCheckboxField = _this.onSetReceiverCheckboxField.bind(_this);\n    _this.onSetCalculatorMapping = _this.onSetCalculatorMapping.bind(_this);\n    _this.onRemoveUsagetMapping = _this.onRemoveUsagetMapping.bind(_this);\n    _this.onSetCustomerMapping = _this.onSetCustomerMapping.bind(_this);\n    _this.onSetReceiverField = _this.onSetReceiverField.bind(_this);\n    _this.onSetDelimiterType = _this.onSetDelimiterType.bind(_this);\n    _this.onAddUsagetMapping = _this.onAddUsagetMapping.bind(_this);\n    _this.onChangeDelimiter = _this.onChangeDelimiter.bind(_this);\n    _this.onSelectSampleCSV = _this.onSelectSampleCSV.bind(_this);\n    _this.onSetFieldMapping = _this.onSetFieldMapping.bind(_this);\n    _this.onRemoveAllFields = _this.onRemoveAllFields.bind(_this);\n    _this.onSetStaticUsaget = _this.onSetStaticUsaget.bind(_this);\n    _this.addUsagetMapping = _this.addUsagetMapping.bind(_this);\n    _this.onSetFieldWidth = _this.onSetFieldWidth.bind(_this);\n    _this.onRemoveField = _this.onRemoveField.bind(_this);\n    _this.setUsagetType = _this.setUsagetType.bind(_this);\n    _this.onSetLineKey = _this.onSetLineKey.bind(_this);\n    _this.handleCancel = _this.handleCancel.bind(_this);\n    _this.onChangeName = _this.onChangeName.bind(_this);\n    _this.onSetRating = _this.onSetRating.bind(_this);\n    _this.onAddField = _this.onAddField.bind(_this);\n    _this.handleNext = _this.handleNext.bind(_this);\n    _this.handlePrev = _this.handlePrev.bind(_this);\n    _this.onError = _this.onError.bind(_this);\n\n    _this.state = {\n      stepIndex: 0,\n      finished: 0,\n      steps: [\"parser\", \"processor\", \"customer_identification_fields\", \"receiver\"]\n    };\n    return _this;\n  }\n\n  _createClass(InputProcessor, [{\n    key: 'componentDidMount',\n    value: function componentDidMount() {\n      var dispatch = this.props.dispatch;\n      var file_type = this.props.location.query.file_type;\n\n      if (file_type !== true) dispatch((0, _inputProcessorActions.getProcessorSettings)(file_type));\n      dispatch((0, _settingsActions.getSettings)([\"usage_types\"]));\n    }\n  }, {\n    key: 'onChangeName',\n    value: function onChangeName(e) {\n      this.props.dispatch((0, _inputProcessorActions.setName)(e.target.value));\n    }\n  }, {\n    key: 'onSetDelimiterType',\n    value: function onSetDelimiterType(e) {\n      this.props.dispatch((0, _inputProcessorActions.setDelimiterType)(e.target.value));\n    }\n  }, {\n    key: 'onChangeDelimiter',\n    value: function onChangeDelimiter(e) {\n      this.props.dispatch((0, _inputProcessorActions.setDelimiter)(e.target.value));\n    }\n  }, {\n    key: 'onSelectSampleCSV',\n    value: function onSelectSampleCSV(e) {\n      var _this2 = this;\n\n      var file = e.target.files[0];\n      var reader = new FileReader();\n      if (!this.props.settings.get('delimiter')) return;\n      reader.onloadend = function (evt) {\n        if (evt.target.readyState == FileReader.DONE) {\n          /* Only need first line */\n          var lines = evt.target.result.split('\\n');\n          var header = lines[0];\n          var fields = header.split(_this2.props.settings.get('delimiter')).map(function (field) {\n            return field.replace(/[^a-zA-Z_\\d]/g, \"_\").toLowerCase();\n          });\n          _this2.props.dispatch((0, _inputProcessorActions.setFields)(fields));\n        }\n      };\n      var blob = file.slice(0, file.size - 1);\n      reader.readAsText(blob);\n    }\n  }, {\n    key: 'onAddField',\n    value: function onAddField(val, e) {\n      if (!val || _lodash2.default.isEmpty(val.replace(/ /g, ''))) {\n        this.props.dispatch((0, _commonActions.showStatusMessage)(\"Please input field name\", 'error'));\n        return;\n      };\n      var value = val.replace(/[^a-zA-Z_]/g, \"_\").toLowerCase();\n      var fields = this.props.settings.get('fields');\n      if (fields.includes(value)) {\n        this.props.dispatch((0, _commonActions.showStatusMessage)(\"Field already exists\", \"error\"));\n        return;\n      }\n      this.props.dispatch((0, _inputProcessorActions.addCSVField)(value));\n    }\n  }, {\n    key: 'onRemoveField',\n    value: function onRemoveField(index, e) {\n      this.props.dispatch((0, _inputProcessorActions.removeCSVField)(index));\n    }\n  }, {\n    key: 'onRemoveAllFields',\n    value: function onRemoveAllFields() {\n      this.props.dispatch((0, _inputProcessorActions.removeAllCSVFields)());\n    }\n  }, {\n    key: 'onSetFieldMapping',\n    value: function onSetFieldMapping(e) {\n      var _e$target = e.target;\n      var mapping = _e$target.value;\n      var field = _e$target.id;\n\n      this.props.dispatch((0, _inputProcessorActions.setFieldMapping)(field, mapping));\n    }\n  }, {\n    key: 'onSetFieldWidth',\n    value: function onSetFieldWidth(e) {\n      var _e$target2 = e.target;\n      var value = _e$target2.value;\n      var field = _e$target2.dataset.field;\n\n      this.props.dispatch((0, _inputProcessorActions.setFieldWidth)(field, value));\n    }\n  }, {\n    key: 'onSetCalculatorMapping',\n    value: function onSetCalculatorMapping(e) {\n      var _e$target3 = e.target;\n      var mapping = _e$target3.value;\n      var field = _e$target3.id;\n\n      this.props.dispatch(setCalculatorMapping(field, mapping));\n    }\n  }, {\n    key: 'onAddUsagetMapping',\n    value: function onAddUsagetMapping(val) {\n      this.props.dispatch((0, _inputProcessorActions.mapUsaget)(val));\n    }\n  }, {\n    key: 'onSetStaticUsaget',\n    value: function onSetStaticUsaget(val) {\n      this.props.dispatch((0, _inputProcessorActions.setStaticUsaget)(val));\n    }\n  }, {\n    key: 'onRemoveUsagetMapping',\n    value: function onRemoveUsagetMapping(index, e) {\n      this.props.dispatch((0, _inputProcessorActions.removeUsagetMapping)(index));\n    }\n  }, {\n    key: 'setUsagetType',\n    value: function setUsagetType(val) {\n      this.props.dispatch((0, _inputProcessorActions.setUsagetType)(val));\n    }\n  }, {\n    key: 'onSetCustomerMapping',\n    value: function onSetCustomerMapping(e) {\n      var _e$target4 = e.target;\n      var mapping = _e$target4.value;\n      var field = _e$target4.id;\n\n      this.props.dispatch((0, _inputProcessorActions.setCustomerMapping)(field, mapping));\n    }\n  }, {\n    key: 'onSetRating',\n    value: function onSetRating(e) {\n      var _e$target5 = e.target;\n      var _e$target5$dataset = _e$target5.dataset;\n      var usaget = _e$target5$dataset.usaget;\n      var rate_key = _e$target5$dataset.rate_key;\n      var value = _e$target5.value;\n\n      this.props.dispatch((0, _inputProcessorActions.setRatingField)(usaget, rate_key, value));\n    }\n  }, {\n    key: 'onSetLineKey',\n    value: function onSetLineKey(e) {\n      var _e$target6 = e.target;\n      var usaget = _e$target6.dataset.usaget;\n      var value = _e$target6.value;\n\n      this.props.dispatch((0, _inputProcessorActions.setLineKey)(usaget, value));\n    }\n  }, {\n    key: 'onSetReceiverField',\n    value: function onSetReceiverField(e) {\n      var _e$target7 = e.target;\n      var id = _e$target7.id;\n      var value = _e$target7.value;\n\n      this.props.dispatch((0, _inputProcessorActions.setReceiverField)(id, value));\n    }\n  }, {\n    key: 'onSetReceiverCheckboxField',\n    value: function onSetReceiverCheckboxField(e) {\n      var _e$target8 = e.target;\n      var id = _e$target8.id;\n      var checked = _e$target8.checked;\n\n      this.props.dispatch((0, _inputProcessorActions.setReceiverField)(id, checked));\n    }\n  }, {\n    key: 'addUsagetMapping',\n    value: function addUsagetMapping(val) {\n      this.props.dispatch((0, _inputProcessorActions.addUsagetMapping)(val));\n    }\n  }, {\n    key: 'onError',\n    value: function onError(message) {\n      this.props.dispatch((0, _commonActions.showStatusMessage)(message, 'error'));\n    }\n  }, {\n    key: 'handleNext',\n    value: function handleNext() {\n      var _this3 = this;\n\n      var stepIndex = this.state.stepIndex;\n\n      var cb = function cb(err) {\n        if (err) return;\n        if (_this3.state.finished) {\n          _this3.props.dispatch((0, _commonActions.showStatusMessage)(\"Input processor saved successfully!\", \"success\"));\n          _this3.props.onCancel();\n        } else {\n          var totalSteps = _this3.state.steps.length - 1;\n          var finished = stepIndex + 1 === totalSteps;\n          _this3.setState({\n            stepIndex: stepIndex + 1,\n            finished: finished\n          });\n        }\n      };\n      var part = this.state.finished ? false : this.state.steps[stepIndex];\n      this.props.dispatch((0, _inputProcessorActions.saveInputProcessorSettings)(this.props.settings, cb, part));\n    }\n  }, {\n    key: 'handlePrev',\n    value: function handlePrev() {\n      var stepIndex = this.state.stepIndex;\n\n      if (stepIndex > 0) return this.setState({ stepIndex: stepIndex - 1, finished: 0 });\n      var r = confirm(\"are you sure you want to stop editing input processor?\");\n      if (r) {\n        this.props.dispatch((0, _inputProcessorActions.clearInputProcessor)());\n        this.props.onCancel();\n      }\n    }\n  }, {\n    key: 'handleCancel',\n    value: function handleCancel() {\n      var _this4 = this;\n\n      var r = confirm(\"are you sure you want to stop editing input processor?\");\n      var _props = this.props;\n      var dispatch = _props.dispatch;\n      var fileType = _props.fileType;\n\n      if (r) {\n        if (fileType !== true) {\n          dispatch((0, _inputProcessorActions.clearInputProcessor)());\n          this.props.onCancel();\n        } else {\n          var cb = function cb(err) {\n            if (err) {\n              dispatch((0, _commonActions.showStatusMessage)(\"Please try again\", \"error\"));\n              return;\n            }\n            dispatch((0, _inputProcessorActions.clearInputProcessor)());\n            _this4.props.onCancel();\n          };\n          dispatch((0, _inputProcessorActions.deleteInputProcessor)(this.props.settings.get('file_type'), cb));\n        }\n      }\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _this5 = this;\n\n      var stepIndex = this.state.stepIndex;\n      var _props2 = this.props;\n      var settings = _props2.settings;\n      var usage_types = _props2.usage_types;\n\n\n      var steps = [_react2.default.createElement(_SampleCSV2.default, { onChangeName: this.onChangeName, onSetDelimiterType: this.onSetDelimiterType, onChangeDelimiter: this.onChangeDelimiter, onSelectSampleCSV: this.onSelectSampleCSV, onAddField: this.onAddField, onSetFieldWidth: this.onSetFieldWidth, onRemoveField: this.onRemoveField, onRemoveAllFields: this.onRemoveAllFields, settings: settings }), _react2.default.createElement(_FieldsMapping2.default, { onSetFieldMapping: this.onSetFieldMapping, onAddUsagetMapping: this.onAddUsagetMapping, addUsagetMapping: this.addUsagetMapping, onRemoveUsagetMapping: this.onRemoveUsagetMapping, onError: this.onError, onSetStaticUsaget: this.onSetStaticUsaget, setUsagetType: this.setUsagetType, settings: settings, usageTypes: usage_types })];\n\n      return _react2.default.createElement(\n        'div',\n        { className: 'InputProcessor' },\n        _react2.default.createElement(\n          _Stepper.Stepper,\n          { activeStep: stepIndex },\n          _react2.default.createElement(\n            _Stepper.Step,\n            null,\n            _react2.default.createElement(\n              _Stepper.StepLabel,\n              null,\n              'Select CSV'\n            )\n          ),\n          _react2.default.createElement(\n            _Stepper.Step,\n            null,\n            _react2.default.createElement(\n              _Stepper.StepLabel,\n              null,\n              'Field Mapping'\n            )\n          ),\n          _react2.default.createElement(\n            _Stepper.Step,\n            null,\n            _react2.default.createElement(\n              _Stepper.StepLabel,\n              null,\n              'Calculator Mapping'\n            )\n          ),\n          _react2.default.createElement(\n            _Stepper.Step,\n            null,\n            _react2.default.createElement(\n              _Stepper.StepLabel,\n              null,\n              'Receiver'\n            )\n          )\n        ),\n        _react2.default.createElement(\n          'div',\n          { className: 'contents bordered-container' },\n          steps[stepIndex]\n        ),\n        _react2.default.createElement(\n          'div',\n          { style: { marginTop: 12, float: \"right\" } },\n          _react2.default.createElement(_RaisedButton2.default, {\n            label: 'cancel',\n            onTouchTap: this.handleCancel,\n            style: { marginRight: 12 } }),\n          function () {\n            if (stepIndex > 0) {\n              return _react2.default.createElement(_RaisedButton2.default, {\n                label: 'Back',\n                onTouchTap: _this5.handlePrev,\n                style: { marginRight: 12 } });\n            }\n          }(),\n          _react2.default.createElement(_RaisedButton2.default, {\n            label: stepIndex === steps.length - 1 ? \"Finish\" : \"Next\",\n            primary: true,\n            onTouchTap: this.handleNext })\n        )\n      );\n    }\n  }]);\n\n  return InputProcessor;\n}(_react.Component);\n\nfunction mapStateToProps(state, props) {\n  return { settings: state.inputProcessor,\n    usage_types: state.settings.get('usage_types') };\n}\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps)(InputProcessor);\n\n/*****************\n ** WEBPACK FOOTER\n ** ./public/js/components/InputProcessor/InputProcessor.js\n ** module id = 545\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./public/js/components/InputProcessor/InputProcessor.js?");

/***/ }

})