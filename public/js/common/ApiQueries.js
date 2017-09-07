import moment from 'moment';

// TODO: fix to uniqueget (for now billAoi can't search by 'rates')
export const searchProductsByKeyAndUsagetQuery = (usaget, notKeys) => {
  const query = {
    key: {
      $nin: [...notKeys, ''], // don't get broken products with empty key
    },
    to: { $gt: moment().toISOString() }, // only active and future
  };
  if (usaget !== 'cost') {
    query[`rates.${usaget}`] = { $exists: true };
  }
  return {
    api: 'find',
    params: [
      { collection: 'rates' },
      { size: 99999 },
      { page: 0 },
      { project: JSON.stringify({ key: 1 }) },
      { query: JSON.stringify(query) },
    ],
  };
};

export const saveQuery = body => ({
  api: 'save',
  options: {
    method: 'POST',
    body,
  },
});

export const getCurrenciesQuery = () => ({
  api: 'currencies',
  params: [
    { simpleArray: true },
  ],
});

export const getPaymentGatewaysQuery = () => ({
  api: 'paymentgateways',
  action: 'list',
});

export const getUserLoginQuery = (username, password) => ({
  api: 'auth',
  params: [
    { username },
    { password },
  ],
});

export const getUserLogoutQuery = () => ({
  api: 'auth',
  params: [
    { action: 'logout' },
  ],
});

export const getUserCheckLoginQuery = () => ({
  api: 'auth',
});

export const saveFileQuery = (file, metadata) => {
  const formData = new FormData();
  formData.append('action', 'save');
  formData.append('metadata', JSON.stringify(metadata));
  formData.append('query', JSON.stringify({ filename: 'file' }));
  formData.append('file', file);
  return ({
    api: 'files',
    name: 'saveFile',
    options: {
      method: 'POST',
      body: formData,
    },
  });
};

export const getFileQuery = query => ({
  api: 'files',
  params: [
    { action: 'read' },
    { query: JSON.stringify(query) },
  ],
});

export const saveSettingsQuery = (data, category) => {
  const formData = new FormData();
  formData.append('category', category);
  formData.append('action', 'set');
  formData.append('data', JSON.stringify(data));
  return ({
    api: 'settings',
    name: category,
    options: {
      method: 'POST',
      body: formData,
    },
  });
};

export const getSettingsQuery = category => ({
  api: 'settings',
  name: category,
  params: [
    { category },
    { data: JSON.stringify({}) },
  ],
});

export const getInputProcessorActionQuery = (fileType, action) => ({
  api: 'settings',
  params: [
    { category: 'file_types' },
    { action },
    { data: JSON.stringify({ file_type: fileType }) },
  ],
});

export const getCreditChargeQuery = params => ({
  api: 'credit',
  params,
});

/* List Components queries*/
export const usageListQuery = (query, page, sort, size) => ({
  entity: 'lines',
  action: 'get',
  params: [
    { size },
    { page },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

export const queueListQuery = (query, page, sort, size) => ({
  entity: 'queue',
  action: 'get',
  params: [
    { size },
    { page },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

export const prepaidBalancesListQuery = (query, page, sort, size) => ({
  entity: 'balances',
  action: 'get',
  params: [
    { size },
    { page },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

export const postpaidBalancesListQuery = (query, page, sort, size) => ({
  entity: 'balances',
  action: 'get',
  params: [
    { size },
    { page },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

/* Aggregate API */
export const auditTrailEntityTypesQuery = () => {
  const revenueQuery = [{
    $match: { source: 'audit' },
  }, {
    $group: { _id: '$collection' },
  }, {
    $project: { name: '$_id', _id: 0 },
  }, {
    $sort: { name: 1 },
  }];
  return {
    api: 'aggregate',
    params: [
      { collection: 'log' },
      { pipelines: JSON.stringify(revenueQuery) },
    ],
  };
};


/* Settings API */
export const savePaymentGatewayQuery = gateway => ({
  api: 'settings',
  params: [
    { category: 'payment_gateways' },
    { action: 'set' },
    { data: JSON.stringify(gateway) },
  ],
});

/* Settings API */
export const saveSharedSecretQuery = secret => ({
  api: 'settings',
  params: [
    { category: 'shared_secret' },
    { action: 'set' },
    { data: JSON.stringify(secret) },
  ],
});

export const disableSharedSecretQuery = key => ({
  api: 'settings',
  params: [
    { category: 'shared_secret' },
    { action: 'unset' },
    { data: JSON.stringify({ key }) },
  ],
});

export const disablePaymentGatewayQuery = name => ({
  api: 'settings',
  params: [
    { category: 'payment_gateways' },
    { action: 'unset' },
    { data: JSON.stringify({ name }) },
  ],
});


/* BillAPI */
export const apiEntityQuery = (collection, action, body) => ({
  entity: collection,
  action,
  options: {
    method: 'POST',
    body,
  },
});


export const getGroupsQuery = collection => ({
  action: 'uniqueget',
  entity: collection,
  params: [
    { query: JSON.stringify({
      'include.groups': { $exists: true },
    }) },
    { project: JSON.stringify({
      name: 1,
      include: 1,
    }) },
    { page: 0 },
    { size: 9999 },
  ],
});

export const getEntityByIdQuery = (collection, id) => ({
  action: 'get',
  entity: collection,
  params: [
    { query: JSON.stringify({ _id: id }) },
    { page: 0 },
    { size: 1 },
  ],
});

export const getEntitesQuery = (collection, project = {}, query = {}) => {
  let action;
  switch (collection) {
    case 'users':
      action = 'get';
      break;
    default:
      action = 'uniqueget';
  }
  return ({
    action,
    entity: collection,
    params: [
      { page: 0 },
      { size: 9999 },
      { query: JSON.stringify(query) },
      { project: JSON.stringify(project) },
      { sort: JSON.stringify(project) },
    ],
  });
};

export const getPlansByTypeQuery = (type, project = { name: 1, description: 1 }) => {
  const query = {
    connection_type: {
      $exists: true,
    },
  };
  if (type !== '') {
    query.connection_type.$eq = type;
  }
  return getEntitesQuery('plans', project, query);
};

export const getDeleteLineQuery = id => ({
  action: 'delete',
  entity: 'lines',
  params: [
    { query: JSON.stringify({ _id: id }) },
  ],
});


// List
export const getPlansQuery = (project = { name: 1 }) => getEntitesQuery('plans', project);
export const getServicesQuery = (project = { name: 1 }) => getEntitesQuery('services', project);
export const getServicesKeysWithInfoQuery = () => getEntitesQuery('services', { name: 1, description: 1, quantitative: 1, balance_period: 1 });
export const getPrepaidIncludesQuery = () => getEntitesQuery('prepaidincludes');
export const getProductsKeysQuery = (project = { key: 1, description: 1 }) => getEntitesQuery('rates', project);
export const getProductsWithRatesQuery = () =>
  getProductsKeysQuery({ key: 1, description: 1, rates: 1 });
export const getServicesKeysQuery = () => getEntitesQuery('services', { name: 1 });
export const getPlansKeysQuery = (project = { name: 1, description: 1 }) => getEntitesQuery('plans', project);
export const getUserKeysQuery = () => getEntitesQuery('users', { username: 1 });
export const getAllGroupsQuery = () => ([
  getGroupsQuery('plans'),
  getGroupsQuery('services'),
]);
export const getBucketGroupsQuery = () => getEntitesQuery('prepaidgroups');
// By ID
export const fetchServiceByIdQuery = id => getEntityByIdQuery('services', id);
export const fetchProductByIdQuery = id => getEntityByIdQuery('rates', id);
export const fetchPrepaidIncludeByIdQuery = id => getEntityByIdQuery('prepaidincludes', id);
export const fetchDiscountByIdQuery = id => getEntityByIdQuery('discounts', id);
export const fetchReportByIdQuery = id => getEntityByIdQuery('reports', id);
export const fetchPlanByIdQuery = id => getEntityByIdQuery('plans', id);
export const fetchPrepaidGroupByIdQuery = id => getEntityByIdQuery('prepaidgroups', id);
export const fetchUserByIdQuery = id => getEntityByIdQuery('users', id);
export const fetchAutoRenewByIdQuery = id => getEntityByIdQuery('autorenew', id);

export const getProductByKeyQuery = key => ({
  action: 'uniqueget',
  entity: 'rates',
  params: [
    { query: JSON.stringify({ key: { $regex: `^${key}$` } }) },
    { page: 0 },
    { size: 1 },
  ],
});

export const searchProductsByKeyQuery = (key, project = {}) => ({
  action: 'uniqueget',
  entity: 'rates',
  params: [
    { page: 0 },
    { size: 9999 },
    { project: JSON.stringify(project) },
    { sort: JSON.stringify(project) },
    { query: JSON.stringify({
      key: { $regex: key, $options: 'i' },
    }) },
    { states: JSON.stringify([0, 1]) },
  ],
});

export const searchPlansByKeyQuery = (name, project = {}) => ({
  action: 'uniqueget',
  entity: 'plans',
  params: [
    { page: 0 },
    { size: 9999 },
    { project: JSON.stringify(project) },
    { sort: JSON.stringify(project) },
    { query: JSON.stringify({
      name: { $regex: name, $options: 'i' },
    }) },
    { states: JSON.stringify([0]) },
  ],
});

export const auditTrailListQuery = (query, page, fields, sort, size) => ({
  action: 'get',
  entity: 'log',
  params: [
    { size },
    { page },
    { project: JSON.stringify(fields) },
    { sort: JSON.stringify(sort) },
    { query: JSON.stringify(query) },
  ],
});

export const getEntitesByKeysQuery = (entity, keyField, keys, project = {}) => {
  const formData = new FormData();
  formData.append('page', 0);
  formData.append('size', 9999);
  formData.append('project', JSON.stringify(project));
  formData.append('sort', JSON.stringify(project));
  formData.append('query', JSON.stringify({
    [keyField]: { $in: keys },
  }));
  return ({
    action: 'uniqueget',
    entity,
    options: {
      method: 'POST',
      body: formData,
    },
  });
}
export const getServicesByKeysQuery = (keys, project = {}) => getEntitesByKeysQuery('services', 'name', keys, project);
export const getProductsByKeysQuery = (keys, project = {}) => getEntitesByKeysQuery('rates', 'key', keys, project);

export const getEntityRevisionsQuery = (collection, revisionBy, value, size = 9999) => {
  let query = {};
  switch (collection) {
    case 'subscribers':
      query = { [revisionBy]: value };
      break;
    default: query = { [revisionBy]: { $regex: `^${value}$` } };
  }
  return ({
    action: 'get',
    entity: collection,
    params: [
      { sort: JSON.stringify({ from: -1 }) },
      { query: JSON.stringify(query) },
      { project: JSON.stringify({
        from: 1,
        to: 1,
        description: 1,
        [revisionBy]: 1,
        revision_info: 1,
      }) },
      { page: 0 },
      { size },
      { state: JSON.stringify([0, 1, 2]) },
    ],
  });
};

export const getRebalanceAccountQuery = (aid, billrunKey = '') => {
  const params = [{ aid }];
  if (billrunKey !== '') {
    params.push({ billrun_key: billrunKey });
  }
  return {
    api: 'resetlines',
    params,
  };
};

export const getCyclesQuery = (from, to, newestFirst = true) => {
  const params = {
    api: 'billrun',
    action: 'cycles',
    params:[]
  }
  if(from) {
      params['params'].push({from});
  }
  if(to) {
      params['params'].push({to});
  }
  params['params'].push({newestFirst: newestFirst? 1 : 0});
  return params;
};

export const getCycleQuery = billrunKey => ({
  api: 'billrun',
  action: 'cycle',
  params: [
    { stamp: billrunKey },
  ],
});

export const getRunCycleQuery = (billrunKey, rerun) => ({
  api: 'billrun',
  action: 'completecycle',
  params: [
    { stamp: billrunKey },
    { rerun },
  ],
});

export const getConfirmCycleInvoiceQuery = (billrunKey, invoiceId) => ({
  api: 'billrun',
  action: 'confirmCycle',
  params: [
    { stamp: billrunKey },
    { invoices: invoiceId },
  ],
});

export const getConfirmCycleAllQuery = billrunKey => ({
  api: 'billrun',
  action: 'confirmCycle',
  params: [
    { stamp: billrunKey },
  ],
});

export const getChargeAllCycleQuery = () => ({
  api: 'billrun',
  action: 'chargeaccount',
});

export const getAllInvoicesQuery = billrunKey => ({
  action: 'get',
  entity: 'billrun',
  params: [
    { query: JSON.stringify({ billrun_key: billrunKey }) },
    { project: JSON.stringify({ _id: 1 }) },
  ],
});

export const getChargeStatusQuery = () => ({
  api: 'billrun',
  action: 'chargestatus',
});

export const getOperationsQuery = () => ({
  api: 'operations',
  params: [
    { action: 'charge_account' },
    { filtration: 'all' },
  ],
});

export const getCollectionDebtQuery = aid => ({
  api: 'bill',
  params: [
    { aid },
  ],
});

export const getOfflinePaymentQuery = (method, aid, amount, payerName, chequeNo) => ({
  api: 'pay',
  params: [
    { method },
    { payments: JSON.stringify([{
      amount,
      aid,
      payer_name: payerName,
      dir: 'fc',
      deposit_slip: '',
      deposit_slip_bank: '',
      cheque_no: chequeNo,
      source: 'web',
    }]) },
  ],
});

export const getConfirmationOperationAllQuery = () => ({
  api: 'operations',
  params: [
    { action: 'confirm_cycle' },
    { filtration: 'all' },
  ],
});

export const getConfirmationOperationInvoiceQuery = invoiceId => ({
  api: 'operations',
  params: [
    { action: 'confirm_cycle' },
    { filtration: invoiceId },
  ],
});

export const sendResetMailQuery = email => ({
  api: 'passwordretrieval',
  params: [
    { action: 'sendForm' },
    { email },
  ],
});

export const changePasswordQuery = (itemId, signature, timestamp, password) => ({
  action: 'changepassword',
  entity: 'users',
  params: [
    { query: JSON.stringify({ _id: itemId }) },
    { update: JSON.stringify({ password }) },
    { _sig_: signature },
    { _t_: timestamp },
  ],
});

export const getReportQuery = ({ report, page = 0, size = 10 }) => ({
  api: 'report',
  params: [
    { action: 'generateReport' },
    { report: JSON.stringify(report) },
    { page },
    { size },
  ],
});

export const getReportCSVQuery = name => ({
  api: 'report',
  params: [
    { action: 'exportCSV' },
    { report: name },
  ],
});

export const getExpectedInvoiceQuery = ( aid, billrunKey ) => ({
  api: 'accountinvoices',
  params: [
    { action: 'expected_invoice' },
    { aid },
    { billrun_key: billrunKey },
  ],
});


// Dashboard reports queries
export const getDashboardQuery = action => ({
  api: 'reports',
  params: [
    { action },
  ],
});
// Dashboard reports queries - end
