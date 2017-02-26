var globalSetting = {
  //serverUrl : "http://10.162.20.191:1337", // Roman
  //serverUrl : "http://10.162.20.86", // Eran
  // serverUrl : "http://10.162.20.247", // Shani
  serverUrl: "http://billrun",
  //serverUrl: "",
  serverApiDebug: false,
  serverApiDebugQueryString: 'XDEBUG_SESSION_START=netbeans-xdebug',
  datetimeFormat: "DD/MM/YYYY HH:mm",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  apiDateTimeFormat: "YYYY/MM/DD HH:mm:ss",
  currency: '$',
  list: {
    maxItems: 100
  },
  statusMessageDisplayTimeout: 5000,
  planCycleUnlimitedValue: 'UNLIMITED',
  serviceCycleUnlimitedValue: 'UNLIMITED',
  productUnlimitedValue: 'UNLIMITED',
  keyUppercaseRegex: /^[A-Z0-9_]*$/,
  defaultLogo: 'billRun-cloud-logo.png',
  billrunCloudLogo: 'billRun-cloud-logo.png',
  billrunLogo: 'billRun-logo.png',
  queue_calculators: ['customer', 'rate', 'pricing'],
  mail_support: 'cloud_support@billrun.com',
  logoMaxSize: 2,
  systemItems: {
    service: {
      collection: 'services',
      uniqueField: 'name',
      itemType: 'service',
      itemsType: 'services',
    },
    plan: {
      collection: 'plans',
      uniqueField: 'name',
      itemType: 'plan',
      itemsType: 'plans',
    },
  },
};
