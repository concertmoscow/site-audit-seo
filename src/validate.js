const {at} = require('lodash');

const colsValidate = {
  mixed_content: {
    error: (v) => !!v,
  },
  is_canonical: {
    error: (v) => v === 0 || v === '0',
  },
  request_time: {
    warning: (v) => v > 500,
    error: (v) => v > 1000,
  },
  status: {
    error: (v) => v != 200,
  },
  description: {
    warning: (v) => v.length > 256,
    warningMsg: (v) => v.length
  },
  h1_count: {
    warning: (v) => v == 0,
    error: (v) => v > 1,
  },
  canonical_count: {
    warning: (v) => v > 1,
  },
  dom_size: {
    warning: (v) => v > 1500,
    error: (v) => v > 3000,
  },
  text_ratio: {
    warning: (v) => v < 10,
  },
  html_size: {
    warning: (v) => v > 1000000,
  },
};

exports.colsValidate = colsValidate;

exports.validateResults = (results, fields) => {
  const validate = {};
  for(let fName of fields) {
    // get value
    const colVal = at(results, fName)[0];
    const colName = fName.replace('result.', '').replace('response.', '');
    let msg;

    // validate
    if(!colsValidate[colName]) continue;

    for(let type of ['warning', 'error']) {
      const test = colsValidate[colName][type];
      if(!test) continue;

      const invalid = test(colVal);
      if(!invalid) continue;

      const msgRender = colsValidate[colName][`${type}Msg`]; // warningMsg
      msg = msgRender ? msgRender(colVal) : colVal;

      validate[colName] = { type, msg };
    }
  }
  return validate;
};
