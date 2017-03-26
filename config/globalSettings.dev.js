var globalSetting = {
  storageVersion: 'v0.1',
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
  apiDateTimeFormat: "YYYY-MM-DD",
  currency: '$',
  list: {
    maxItems: 100,
    defaultItems: 10,
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
  chargingBufferDays: 5,
  systemItems: {
    service: {
      collection: 'services',
      uniqueField: 'name',
      itemName: 'service',
      itemType: 'service',
      itemsType: 'services',
    },
    plan: {
      collection: 'plans',
      uniqueField: 'name',
      itemName: 'plan',
      itemType: 'plan',
      itemsType: 'plans',
    },
    charging_plan: {
      collection: 'plans',
      uniqueField: 'name',
      itemName: 'buckets group',
      itemType: 'charging_plan',
      itemsType: 'charging_plans',
    },
    prepaid_plan: {
      collection: 'plans',
      uniqueField: 'name',
      itemName: 'prepaid plan',
      itemType: 'prepaid_plan',
      itemsType: 'prepaid_plans',
    },
    prepaid_include: {
      collection: 'prepaidincludes',
      uniqueField: 'name',
      itemName: 'prepaid bucket',
      itemType: 'prepaid_include',
      itemsType: 'prepaid_includes',
    },
    product: {
      collection: 'rates',
      uniqueField: 'key',
      itemName: 'product',
      itemType: 'product',
      itemsType: 'products',
    },
    discount: {
      collection: 'discounts',
      uniqueField: 'key',
      itemName: 'discount',
      itemType: 'discount',
      itemsType: 'discounts',
    },
    subscription: {
      collection: 'subscribers',
      uniqueField: 'sid',
      itemName: 'subscription',
      itemType: 'subscription',
      itemsType: 'subscriptions',
    },
    customer: {
      collection: 'subscribers',
      uniqueField: 'aid',
      itemName: 'customer',
      itemType: 'customer',
      itemsType: 'customers',
    },
  },
};
