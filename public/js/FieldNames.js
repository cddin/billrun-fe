const FieldNames = {
  customerIdentification: {
    sid: 'Subscriber id (BillRun system field)',
  },
  lines: {
    arate: 'Product reference',
    arate_key: 'Product name',
    arategroup: "Campaign name",
    lastname: "Subscriber's surname",
    firstname: "Subscriber's first name",
    start: 'Start time',
    channel: 'Calling channel',
    stamp: 'Record unique ID',
    billrun: 'Billing cycle key',
    src: 'Calling ID',
    in_group: 'Campaign inclusive units',
    clid: 'Full Calling ID',
    dst: 'Destination extension',
    charging_type: 'Subscriber type',
    aprice: 'Record charge',
    log_stamp: 'File unique ID',
    file: 'File name',
    plan: "Subscriber's plan name",
    plan_ref: "Plan reference",
    billsec: 'Billing duration',
    dcontext: 'Destination context',
    lastapp: 'Last dial plan',
    uniqueid: 'Unique ID',
    sid: 'Subscriber ID',
    userfield: 'User field',
    amaflags: 'Call indicator',
    usaget: 'Activity type',
    duration: 'Call duration',
    over_group: 'Deviation units',
    usagev: 'Activity volume',
    urt: 'Unified record time',
    disposition: 'Disposition',
    accountcode: 'CDR account ID',
    type: 'Input processor name',
    source: 'Record source',
    connection_type: 'Postpaid / Prepaid',
    end: 'End time',
    aid: 'Customer ID',
    process_time: 'Process time',
    usagesb: 'Accumulative usage',
    row_number: 'Record number',
    realtime: 'Realtime?',
    dstchannel: 'Destination channel',
    answer: 'Answer time',
    session_id: 'Session ID',
    request_type: 'Request type',
    record_type: 'Record type',
    billrun_pretend: 'Pretend?',
    request_num: 'Request number',
    granted_return_code: 'Return code',
  },

  queue: {
    calc_name: 'Calculator stage',
    calc_time: 'Last Calculation Time',
    realtime: 'Realtime?',
    session_id: 'Session ID',
    request_type: 'Request type',
    record_type: 'Record type',
    billrun_pretend: 'Pretend?',
    request_num: 'Request number',
    granted_return_code: 'Return code',
  },
  subscription: {
    firstname: 'First Name',
    lastname: 'Last Name',
  },
};

export default FieldNames;
