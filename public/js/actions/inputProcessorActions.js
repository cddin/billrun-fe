export const SET_NAME = 'SET_NAME';
export const SET_DELIMITER_TYPE = 'SET_DELIMITER_TYPE';
export const SET_DELIMITER = 'SET_DELIMITER';
export const SET_FIELDS = 'SET_HEADERS';
export const SET_FIELD_MAPPING = 'SET_FIELD_MAPPING';
export const ADD_CSV_FIELD = 'ADD_CSV_FIELD';
export const ADD_USAGET_MAPPING = 'ADD_USAGET_MAPPING';
export const SET_CUSTOMER_MAPPING = 'SET_CUSTOMER_MAPPING';
export const SET_RATING_FIELD = 'SET_RATING_FIELD';
export const SET_CUSETOMER_MAPPING = 'SET_CUSETOMER_MAPPING';
export const SET_RECEIVER_FIELD = 'SET_RECEIVER_FIELD';
export const GOT_PROCESSOR_SETTINGS = 'GOT_PROCESSOR_SETTINGS';
export const GOT_INPUT_PROCESSORS = 'GOT_INPUT_PROCESSORS';
export const SET_FIELD_WIDTH = 'SET_FIELD_WIDTH';
export const CLEAR_INPUT_PROCESSOR = 'CLEAR_INPUT_PROCESSOR';
export const MAP_USAGET = 'MAP_USAGET';
export const REMOVE_CSV_FIELD = 'REMOVE_CSV_FIELD';
export const REMOVE_USAGET_MAPPING = 'REMOVE_USAGET_MAPPING';
export const SET_USAGET_TYPE = 'SET_USAGET_TYPE';
export const SET_LINE_KEY = 'SET_LINE_KEY';
export const REMOVE_ALL_CSV_FIELDS = 'REMOVE_ALL_CSV_FIELDS';
export const SET_STATIC_USAGET = 'SET_STATIC_USAGET';
export const SET_INPUT_PROCESSOR_TEMPLATE = 'SET_INPUT_PROCESSOR_TEMPLATE';

import axios from 'axios';
import { showSuccess, showDanger } from './alertsActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator} from './progressIndicatorActions';
import _ from 'lodash';

const convert = (settings) => {
  const { parser, processor,
          customer_identification_fields,
          rate_calculators,
          receiver } = settings;

  const connections = receiver ? (receiver.connections ? receiver.connections[0] : {}) : {};
  const field_widths = parser.type === "fixed" ? parser.structure : {};
  const usaget_type = (!_.result(processor, 'usaget_mapping') || processor.usaget_mapping.length < 1) ?
                      "static" :
                      "dynamic";

  const ret = {
    file_type: settings.file_type,
    delimiter_type: parser.type,
    delimiter: parser.separator,
    usaget_type,
    fields: (parser.type === "fixed" ? Object.keys(parser.structure) : parser.structure),
    field_widths,
    customer_identification_fields,
    rate_calculators,
    receiver: connections
  };
  if (processor) {
    let usaget_mapping;
    if (usaget_type === "dynamic") {
      usaget_mapping = processor.usaget_mapping.map(usaget => {
	return {
	  usaget: usaget.usaget,
	  pattern: usaget.pattern.replace("/^", "").replace("$/", "")
	}
      })
    } else {
      usaget_mapping = [{}];
    }
    ret.processor = Object.assign({}, processor, {
      usaget_mapping,
      src_field: usaget_type === "dynamic" ? processor.usaget_mapping[0].src_field : ""
    });
    if (!rate_calculators) {
      if (usaget_type === "dynamic") {
	ret.rate_calculators = _.reduce(processor.usaget_mapping, (acc, mapping) => {
	  acc[mapping.usaget] = [];
	  return acc;
	}, {});
      } else {
	ret.rate_calculators = {[processor.default_usaget]: []};
      }
    }
    if (!customer_identification_fields) {
      ret.customer_identification_fields = [
	{target_key: "sid"}
      ];
    }
  } else {
    ret.processor = {
      usaget_mapping: []
    };
  }
  return ret;
};

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function gotProcessorSettings(settings) {
  return {
    type: GOT_PROCESSOR_SETTINGS,
    settings
  };
}

function fetchProcessorSettings(file_type) {
  let fetchUrl = `/api/settings?category=file_types&data={"file_type":"${file_type}"}`;
  return (dispatch) => {
    dispatch(startProgressIndicator());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(finishProgressIndicator());
        dispatch(gotProcessorSettings(convert(resp.data.details)));
      }
    ).catch(error => {
      console.log(error);
      dispatch(finishProgressIndicator());
      dispatch(showDanger("Error loading input processor"));
    });
  };
}

export function getProcessorSettings(file_type) {
  return (dispatch) => {
    return dispatch(fetchProcessorSettings(file_type));
  };
}

export function setName(file_type) {
  return {
    type: SET_NAME,
    file_type
  };
}

export function setDelimiterType(delimiter_type) {
  return {
    type: SET_DELIMITER_TYPE,
    delimiter_type
  };
}

export function setDelimiter(delimiter) {
  return {
    type: SET_DELIMITER,
    delimiter
  };
}

export function setFields(fields) {
  return {
    type: SET_FIELDS,
    fields
  };
}

export function setFieldWidth(field, width) {
  return {
    type: SET_FIELD_WIDTH,
    field,
    width
  };
}

export function setFieldMapping(field, mapping) {
  return {
    type: SET_FIELD_MAPPING,
    field,
    mapping
  };
}

export function addCSVField(field) {
  return {
    type: ADD_CSV_FIELD,
    field
  };
}

export function removeCSVField(index) {
  return {
    type: REMOVE_CSV_FIELD,
    index
  };
}

export function removeAllCSVFields() {
  return {
    type: REMOVE_ALL_CSV_FIELDS
  };
}

function addedUsagetMapping(usaget) {
  return {
    type: ADD_USAGET_MAPPING,
    usaget
  };
}

export function addUsagetMapping(usaget) {
  let setUrl = `/api/settings?category=usage_types&action=set&data=[${JSON.stringify(usaget)}]`;
  return (dispatch) => {
    dispatch(startProgressIndicator());
    let request = axiosInstance.post(setUrl).then(
      resp => {
        dispatch(finishProgressIndicator());
        if (!resp.data.status) {
          dispatch(showDanger(resp.data.desc));
        } else {
	  dispatch(addedUsagetMapping(usaget));
        }
      }
    ).catch(error => {
      dispatch(finishProgressIndicator());
      dispatch(showDanger(error.data.message));
    });
  };
}

export function removeUsagetMapping(index) {
  return {
    type: REMOVE_USAGET_MAPPING,
    index
  };
}

export function setStaticUsaget(usaget) {
  return {
    type: SET_STATIC_USAGET,
    usaget
  };
}

export function mapUsaget(mapping) {
  return {
    type: MAP_USAGET,
    mapping
  };
}

export function setCustomerMapping(field, mapping) {
  return {
    type: SET_CUSETOMER_MAPPING,
    field,
    mapping
  };
}

export function setRatingField(usaget, rate_key, value) {
  return {
    type: SET_RATING_FIELD,
    usaget,
    rate_key,
    value
  };
}

export function setLineKey(usaget, value) {
  return {
    type: SET_LINE_KEY,
    usaget,
    value
  };
}

export function setReceiverField(field, mapping) {
  return {
    type: SET_RECEIVER_FIELD,
    field,
    mapping
  };
}

export function saveInputProcessorSettings(state, callback, part=false) {
  const processor = state.get('processor'),
        customer_identification_fields = state.get('customer_identification_fields'),
        rate_calculators = state.get('rate_calculators'),
        receiver = state.get('receiver');
  
  const settings = {
    "file_type": state.get('file_type'),
    "parser": {
      "type": state.get('delimiter_type'),
      "separator": state.get('delimiter'),
      "structure": state.get('delimiter_type') === "fixed" ? state.get('field_widths') : state.get('fields')
    }
  };
  if (processor) {
    const processor_settings = state.get('usaget_type') === "static" ?
			       { default_usaget: processor.get('default_usaget') } :
			       { usaget_mapping:
						processor.get('usaget_mapping').map(usaget => {
						  return {
						    "src_field": processor.get('src_field'),
						    "pattern": `/^${usaget.get('pattern')}$/`,
						    "usaget": usaget.get('usaget')
						  }
						}).toJS() };
    settings.processor = {
      "type": "Usage",
      "date_field": processor.get('date_field'),
      "volume_field": processor.get('volume_field'),
      ...processor_settings
    };
  }
  if (customer_identification_fields) {
    settings.customer_identification_fields = customer_identification_fields.toJS();
  }
  if (rate_calculators) {
    settings.rate_calculators = rate_calculators.toJS();
  }
  if (receiver) {
    settings.receiver = {
      "type": "ftp",
      "connections": [
	receiver.toJS()
      ]
    };
  }

  let settingsToSave;
  if (part === "customer_identification_fields") {
    settingsToSave = {file_type: state.get('file_type'), [part]: {...settings[part]}, rate_calculators: settings.rate_calculators};
  } else {
    settingsToSave = part ? {file_type: state.get('file_type'), [part]: {...settings[part]}} : settings;
  }
  const query = {
    api: "settings",
    params: [
      { category: "file_types" },
      { action: "set" },
      { data: JSON.stringify(settingsToSave) }
    ]
  };
  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      success => {
        dispatch(finishProgressIndicator());        
        callback(false);
      },
      failure => {
        dispatch(finishProgressIndicator());
        const msg = _.result(failure, 'error[0].error.data.message') ?
                    failure.error[0].error.data.message :
                    failure.error[0].error.desc;
        dispatch(showDanger(`Error - ${msg}`));
        callback(true);
      }
    ).catch(
      error => {
        dispatch(finishProgressIndicator());
        dispatch(showDanger("Error saving input processor"));
        dispatch(apiBillRunErrorHandler(error));
      }
    );
  };
}

function gotInputProcessors(input_processors) {
  return {
    type: GOT_INPUT_PROCESSORS,
    input_processors
  };
}

function fetchInputProcessors() {
  let setUrl = '/api/settings?category=file_types&data={}';
  return (dispatch) => {
    dispatch(startProgressIndicator());
    let request = axiosInstance.post(setUrl).then(
      resp => {
        dispatch(finishProgressIndicator());        
        dispatch(gotInputProcessors(resp.data.details));
      }
    ).catch(error => {
      dispatch(showDanger(error.data.message));
      dispatch(finishProgressIndicator());              
    });
  };
}

export function getInputProcessors() {
  return (dispatch) => {
    return dispatch(fetchInputProcessors());
  };
}

export function newInputProcessor() {
  return {
    type: 'NEW_PROCESSOR'    
  };
}

export function clearInputProcessor() {
  return {
    type: CLEAR_INPUT_PROCESSOR
  };
}

export function deleteInputProcessor(file_type, callback) {
  const query = {
    api: "settings",
    params: [
      { category: "file_types" },
      { action: "unset" },
      { data: JSON.stringify({"file_type": file_type}) }
    ]
  };

  return (dispatch) => {
    apiBillRun(query).then(
      success => {
        callback(false);
      }, failure => {
        callback(true);
      }
    ).catch(error => {
      console.log(error);
    })
  };
}

export function setUsagetType(usaget_type) {
  return {
    type: SET_USAGET_TYPE,
    usaget_type
  };
}

export function setInputProcessorTemplate(template) {
  const converted = convert(template);
  return {
    type: SET_INPUT_PROCESSOR_TEMPLATE,
    template: converted
  };
}
