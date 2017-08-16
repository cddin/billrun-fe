export default {
  entities: ['usage', 'subscription', 'customer', 'logFile'],
  fields: {
    usage: [
      // Default settings \ Example
      // { id: [REQUIRED], type: 'string', searchable: true, aggregatable: true, inputConfig: {
      //    inputType: 'select',
      //    options: ['option1', 'option2'] | [{value: 'val', label: 'Label'}, ...] /* array of values or objects */
      //    callback: 'getExampleOptions', /* callback function + should be implementation */
      // } },
      { id: 'urt', type: 'date' },
      { id: 'lastname' },
      { id: 'firstname' },
      { id: 'stamp' },
      { id: 'in_group', type: 'number' },
      { id: 'aprice', type: 'number' },
      { id: 'final_charge', type: 'number' },
      { id: 'file' },
      { id: 'billsec', type: 'number' },
      { id: 'sid', type: 'number' },
      { id: 'over_group', type: 'number' },
      { id: 'usagev', type: 'number' },
      { id: 'aid', type: 'number' },
      { id: 'process_time', type: 'string' },
      { id: 'usagesb', type: 'number' },
      { id: 'session_id', type: 'string' },
      { id: 'billrun_pretend', type: 'boolean' },
      { id: 'billrun_status',
        title: 'Billing cycle status',
        aggregatable: false,
        inputConfig: {
          inputType: 'select',
          options: [
            { value: 'current', label: 'Current' },
            { value: 'first_unconfirmed', label: 'First Unconfirmed' },
            { value: 'last_confirmed', label: 'Last Confirmed' },
            { value: 'confirmed', label: 'Confirmed' },
          ],
        },
      },
      { id: 'arate_key', inputConfig: { inputType: 'select', callback: 'getProductsOptions' } },
      { id: 'arategroup', inputConfig: { inputType: 'select', callback: 'getGroupsOptions' } },
      { id: 'billrun', inputConfig: { inputType: 'select', callback: 'getCyclesOptions' } },
      { id: 'plan', inputConfig: { inputType: 'select', callback: 'getPlansOptions' } },
      { id: 'usaget', inputConfig: { inputType: 'select', callback: 'getUsageTypesOptions' } },
    ],
    subscribers: [
      { id: 'aid', type: 'number' },
      { id: 'sid', type: 'number' },
      { id: 'plan_activation', type: 'date' },
      { id: 'deactivation_date', type: 'date' },
    ],
    account: [
      { id: 'aid', type: 'number' },
    ],
    logFile: [
      { id: 'file_name', title: 'File name' },
      { id: 'stamp', title: 'Record unique ID' },
      { id: 'fetching_time', type: 'date' },
      { id: 'start_process_time', type: 'date' },
      { id: 'received_time', type: 'date' },
      { id: 'process_time', type: 'date' },
      { id: 'logfile_status',
        columnable: false,
        title: 'Status',
        inputConfig: {
          inputType: 'select',
          options: [
            { value: 'received', label: 'Received' },
            { value: 'not_received', label: 'Not received' },
          ],
        },
      },
    ],
  },
  conditionsOperators: [
    { id: 'last_days', title: 'Last (days)', include: ['fieldid:urt'], type: 'number', suffix: 'Days' },
    { id: 'last_days_include_today', title: 'Last (days including today)', include: ['fieldid:urt'], type: 'number', suffix: 'Days' },
    { id: 'last_hours', title: 'Last (hours)', include: ['fieldid:urt'], type: 'number', suffix: 'Hours' },
    { id: 'eq', title: 'Equals', include: ['date', 'boolean', 'fieldid:billrun_status', 'fieldid:logfile_status'] }, // 'Equals'
    { id: 'in', title: 'Equals', include: ['string', 'number'], exclude: ['fieldid:billrun_status', 'fieldid:logfile_status'] },
    { id: 'ne', title: 'Does Not equal', include: ['boolean'], exclude: [] }, // 'Not equals'
    { id: 'nin', title: 'Does Not equal', include: ['string', 'number'], exclude: ['fieldid:billrun_status', 'fieldid:logfile_status'] },
    { id: 'lt', title: '<', include: ['number', 'date', 'fieldid:billrun'], exclude: [] }, // 'Less than'
    { id: 'lte', title: '<=', include: ['number', 'date', 'fieldid:billrun'], exclude: [] }, // 'Less than or equals'
    { id: 'gt', title: '>', include: ['number', 'date', 'fieldid:billrun'], exclude: [] }, // 'Greater than'
    { id: 'gte', title: '>=', include: ['number', 'date', 'fieldid:billrun'], exclude: [] }, // 'Greater than or equals'
    { id: 'like',
      title: 'Contains',
      include: ['string', 'number'],
      exclude: [
        'fieldid:billrun_status',
        'fieldid:billrun',
        'fieldid:arate_key',
        'fieldid:arategroup',
        'fieldid:plan',
        'fieldid:usaget',
        'fieldid:logfile_status',
      ],
    },
    { id: 'starts_with',
      title: 'Starts with',
      include: ['string'],
      exclude: [
        'fieldid:billrun_status',
        'fieldid:billrun',
        'fieldid:arate_key',
        'fieldid:arategroup',
        'fieldid:plan',
        'fieldid:usaget',
        'fieldid:logfile_status',
      ],
    },
    { id: 'ends_with',
      title: 'Ends with',
      include: ['string'],
      exclude: [
        'fieldid:billrun_status',
        'fieldid:billrun',
        'fieldid:arate_key',
        'fieldid:arategroup',
        'fieldid:plan',
        'fieldid:usaget',
        'fieldid:logfile_status',
      ],
    },
    { id: 'exists',
      title: 'Exists',
      include: ['string', 'number', 'boolean', 'date'],
      type: 'boolean',
      exclude: [
        'fieldid:billrun_status',
        'fieldid:logfile_status',
      ],
      options: ['yes', 'no'],
    },
  ],
  aggregateOperators: [
    { id: 'group', title: 'Group', include: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
    { id: 'sum', title: 'Sum', include: ['number'], exclude: ['fieldid:count_group'] },
    { id: 'avg', title: 'Average', include: ['number'], exclude: ['fieldid:count_group'] },
    { id: 'first', title: 'First', include: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
    { id: 'last', title: 'Last', include: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
    { id: 'max', title: 'Max', include: ['number', 'date'], exclude: ['fieldid:count_group'] },
    { id: 'min', title: 'Min', include: ['number', 'date'], exclude: ['fieldid:count_group'] },
    { id: 'push', title: 'List', include: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
    { id: 'addToSet', title: 'Unique List', include: ['string', 'number', 'boolean', 'date'], exclude: ['fieldid:count_group'] },
    { id: 'count', title: 'Count', include: ['fieldid:count_group'] },
  ],
  outputFormats: [
    { id: 'date_format', title: 'Date', options: [
      { value: 'c', label: 'ISO 8601' },
      { value: 'd/m/Y', label: '31/12/2017' },
      { value: 'm/d/Y', label: '12/31/2017' },
    ]},
    { id: 'datetime_format', title: 'Date time', options: [
      { value: 'd/m/Y H:i', label: '31/12/2017 22:05' },
      { value: 'd/m/Y H:i:s', label: '31/12/2017 22:05:59' },
      { value: 'm/d/Y h:i A', label: '12/31/2017 10:05 PM' },
      { value: 'm/d/Y h:i:s A', label: '12/31/2017 10:05:59 PM' },
    ]},
    { id: 'time_format', title: 'Time', options: [
      { value: 'H:i', label: '22:05' },
      { value: 'H:i:s', label: '22:05:59' },
      { value: 'h:i A', label: '10:05 PM' },
      { value: 'h:i:s A', label: '10:05:59 PM' },
    ]},
    { id: 'multiplication', title: 'Multiply by a number'},
    { id: 'default_empty', title: 'Default empty value'},
    { id: 'vat_format', title: 'Vat', options: [
      { value: 'add_tax', label: 'Add Vat' },
      { value: 'remove_tax', label: 'Remove Vat' },
    ] },
    { id: 'corrency_format', title: 'Corrency', options: [
      { value: 'suffix', label: '1234$' },
      { value: 'prefix', label: '$1234' },
    ] },
  ],
};
