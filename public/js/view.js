import globalSetting from './globalSetting';
import {red500, blue500} from 'material-ui/styles/colors';
import ImportExport from './components/HtmlPages/ImportExport';
import Dashboard from './components/HtmlPages/Dashboard';
import moment from 'moment';

const dashboard_html = {
  title : "",
  view_type : "",
  sections : [ {
    html : Dashboard
  } ]
}
const import_export_html = {
  title : "",
  view_type : "",
  sections : [ {
    html : ImportExport
  } ]
}
const lines_list_view = {
  title : "",
  view_type : "",
  sections : [ {
    title : "",
    description: "",
    lists : [ {
      title : "Lines",
      url : globalSetting.serverUrl + '/api/find?collection=lines',
      aggregate: {
        groupBy : [
                  {label : "SID" , key : "sid"},
                  {label : "AID" , key : "aid"},
                  ],
         fields : [
                    {label : "Usage" , key : "usagev"},
                    {label : "price" , key : "aprice"},
                    {label : "Market price" , key : "apr"},
                  ],
        methods : [ {label : "Sum" , key : "$sum"}]
      },
      fields : [
        {key : 'aid', label : 'AID', filter : { defaultValue : ''}},
        {key : 'sid', label : 'SID', filter : {}},
        {key : 'service_name', label : 'Service Name'},
        {key : 'service_type', label : 'Service Type'},
        {key : 'plan', label : 'plan',  filter : {}},
        {key : 'type', label : 'Type'},
        {key : 'urt', label : 'URT',  type : 'urt', sortable : true },
        {key : 'urt2', label : 'From',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().subtract(2, 'months')), query:{'urt':{'$gt':1}} ,valuePath:{'urt':{'$gt': null}}  }, hidden : true},
        {key : 'urt3', label : 'To',  type : 'urt', sortable : true ,filter :  { defaultValue : (moment().add(1, 'months')), query:{'urt':{'$lte':1}} ,valuePath:{'urt':{'$lte':null}}  }, hidden : true},
      ],
      pagination : {
        itemsPerPage : 10,
      },
      defaults : {
        tableHeight : '500px',
      }
    } ]
  } ]
};

const lines_edit_view = {
  title: "Edit Line",
  view_type: "sections",
  sections: [
    {
      // title: "Test",
      display: "inline",
      fields: []
    }
  ]
};

const rates_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "VAT",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: 'type', label: 'Type', filter :  {system:'regular'}, hidden : true},
        {key: 'params.destination.prefix', label: 'Prefix', filter :  {}, hidden : true},
        {key: 'params.destination.region', label: 'Region', filter :  {}, hidden : true},
        {key: 'key', label: 'Key', filter : {}, sortable : true},
        {key: 'usaget', label: 'Type', sortable : true},
        {key: 'rate[0].price', label: 'Price'},
        {key: 'rate[0].interval', label: 'Interval', type:'interval'},
        {key: 'access', label: 'Access'},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        {key: 'from', label: 'From', type:"urt", sortable : true, },
        {key: 'to', label: 'To', type:"urt", sortable : true, },
        {key: '_id', label: 'ID', type:"mongoid", sortable : true},
      ],
      project: [ 'key', '_id', 'type', 'rates','from' ,'to'],
      controllers : {
        duplicate : { label: 'Duplicate', callback:'onClickCloneItem'},
        closeAndNew : { label: 'Close and New'},
        delete : { label: 'Delete', color: red500  },
      },
      pagination : {
        itemsPerPage : 10,
      },
      onItemClick : 'edit',
    } ]
  } ]
};
const rates_vat_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "VAT",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: 'key', label: 'Key', filter : {}},
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        {key: 'rate_type', label: 'Rate Type'},
        {key: 'type', label: 'Type', filter :  {system:'vat'}},
        {key: 'zone', label: 'Zone'},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        // {key: 'rates', label: 'rates'}
      ],
      controllers : {
        // duplicate : { label: 'Duplicate', callback:'onClickCloneItem'},
        // new : { label: 'New'},
        // closeAndNew : { label: 'Close and New'},
        // edit : { label: 'Edit'},
        // delete : { label: 'Delete', color: red500  },
        export : { label: 'Export', color: red500  },
        import : { label: 'Import', color: red500  },
      },
      pagination : {
        itemsPerPage : 10,
      },
      onItemClick : 'edit',
    } ]
  } ]
};

const rates_product_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Products",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        {key: 'type', label: 'Type', filter :  {system : 'product'}, hidden : true},
        {key: 'key', label: 'Key', filter : {}},
        {key: 'brand', label: 'Brand', filter : {}},
        {key: 'model', label: 'Model', filter : {}},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        // {key: 'rates', label: 'rates'}
      ],
      onItemClick : 'edit',
    } ]
  } ]
};

const rates_new_view = {
  title: "New Rate",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { dbkey: "key", label: "Key", size: 10, mandatory: true }
      ]
    }
  ]
};

const plans_list_view = {
  title : "",
  view_type : "list",
  sections : [ {
    title : "",
    lists : [ {
      title : "Plans",
      url : globalSetting.serverUrl + '/api/find?collection=plans',
      fields : [
        {key : '_id', label : 'ID', type : 'mongoid', hidden : true}, // aid=5000000476
        {key : 'technical_name', label : 'Label', filter : {}, sortable : true},
        {key : 'invoice_type', label : 'Type', sortable : true},
        {key : 'grouping', label : 'Grouping', filter : {}},
        {key : 'price', label : 'Price', type : 'price', sortable : true},
        {key : 'forceCommitment', label : 'Force Commitment', type : 'boolean'},
        {key : 'from', label : 'From',  type : 'urt', sortable : true, filter : {}},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
      ],
      onItemClick : 'edit',
      controllers : {
        duplicate : { label: 'Duplicate', callback:'onClickCloneItem'},
        // new : { label: 'New'},
        closeAndNew : { label: 'Close and New'},
        // edit : { label: 'Edit'},
        // delete : { label: 'Delete', color: red500  },
      },
      defaults : {
        tableHeight : '500px',
      }
    } ]
  } ]
};

const plans_new_view = {
  title: "New Plan",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { dbkey: "name", label: "Name", size: 10, mandatory: true },
        /* { dbkey: "test", label: "Test", size: 10, type: "select", options: [
           { label: "Option 1", value: "option_1" },
           { label: "Option 2", value: "option_2" }
           ] } */
      ]
    }
  ]
};

const plans_edit_view = {
  title: "Edit Plan",
  view_type: "sections",
  sections: [
    {
      // title: "Test",
      display: "inline",
      fields:
      [
        { dbkey: "technical_name", label: "Technical label", size: 10 },
        { dbkey: "name", label: "Name", size: 10, mandatory: true },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "price", label: "Price", size: 10 , type: "number" },
        { dbkey: "display_order", label: "Display Order", size: 10 },
        { dbkey: "invoice_type", label: "Invoice Type", size: 10 },
        { dbkey: "options", label: "Options", collapsible: true, collapsed: true, fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "name", label: "Name", type: "text" },
                { dbkey: "price", label: "Price", type: "number" },
              ]
            }
          ]
        },
        { dbkey: "not_billable_options", label: "Options (not billable)", collapsible: true, collapsed: true, size: 10  ,  fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "name", label: "Name", type: "text"},
                { dbkey: "display_order", label: "Display Order", type: "number"},
              ]
            }
          ]
        },
        { dbkey: "forceCommitment", label: "Force Commitment", size: 10 , type: "checkbox"},
      ]
    }
  ]
};

const rates_edit_view = {
  title: "Edit Rate",
  view_type: "sections",
  sections: [
    {
      // title: "Test",
      display: "inline",
      fields:
      [
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "country", label: "Country", type:'array' },
        { dbkey: "alpha3", label: "Alpha3", type:'array' },
        { dbkey: "zone", label: "zone"},
        { dbkey: "zone_grouping", label: "Zone Grouping" },
        { dbkey: "to", label: "To", type:'date'},
        { dbkey: "rates", label: "Types", collapsible: true, collapsed: false ,  fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "access", label: "Access", type: "text"},
                { dbkey: "currency", label: "Currency", type: "text"},
                { dbkey: "unit", label: "Unit", type: "text"},
                { dbkey: "erp_account", label: "ERP Account", type: "text"},
                { dbkey: "rate", label: "Rates", collapsible: true, collapsed: true ,  fields:
                  [
                        { dbkey: "interval", label: "Interval", type: "text"},
                        { dbkey: "to", label: "To", type: "text"},
                        { dbkey: "price", label: "Price ", type: "text"},
                  ]
                },
              ]
            }
          ]
        },
        { dbkey: "params",  label: "Params", size: 10, collapsible: true, collapsed: true ,fields:
          [
            { dbkey: "customer_segment", label : 'Customer Segment', type: 'array'},
            { dbkey: "source_types", label : 'Source Types', type: 'array'},
            { dbkey: "destination", label:" ", collapsible: false, size : 11,
              fields:
              [
                { dbkey: "region", label: "Region", type: "text"},
                { dbkey: "prefix", label: "Prefix", type: "array"},
              ]
            }
          ]
        },
      ]
    }
  ]
};

const rates_vat_edit_view = {
  title: "Edit Rate",
  view_type: "sections",
  sections: [
    {
      // title: "Test",
      display: "inline",
      fields:
      [
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "rates", label: "Types", collapsible: true, collapsed: false ,  fields:
          [
            { dbkey: "*", collapsible: true, collapsed: true,
              fields:
              [
                { dbkey: "base_account", label: "Base Account", type: "text"},
                { dbkey: "fae_vat_account", label: "Fae VAT Account", type: "text"},
                { dbkey: "vat_account", label: "VAT Account", type: "text"},
                { dbkey: "rate", label: "Rates", collapsible: true, collapsed: true ,  fields:
                  [
                        { dbkey: "interval", label: "Interval", type: "text"},
                        { dbkey: "percent", label: "Percent", type: "text"},
                        { dbkey: "to", label: "To", type: "text"},
                  ]
                },
              ]
            }
          ]
        },
      ]
    }
  ]
};

const rates_product_edit_view = {
  title: "Edit Product",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields:
      [
        { dbkey: "brand", label: "Brand", size: 10 },
        { dbkey: "model", label: "Model", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "ax_code", label: "AX Code", size: 10 },
        { dbkey: "inventory_id", label: "Inventory ID", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "rates",  label: "Rates", size: 10, collapsible: false, fields:
          [
            { dbkey: "general", label : 'General' ,collapsible: true, collapsed: true, size : 12,
              fields:
              [
                  { dbkey: "price", label: "Price", type: "text"},
                  { dbkey: "price_level", label: "Price Level", type: "text"},
              ]
            },
            { dbkey: "subscription", collapsible: true, collapsed: true, size : 12,
              fields:
              [
                { dbkey: "*", size : 12, collapsible: false,
                  fields:
                  [
                    { dbkey: "price", label: "Price", type: "text"},
                    { dbkey: "price_level", label: "Price Level", type: "text"},
                  ]
                }
              ]
            }
          ]
        },
      ]
    }
  ]
};

const rates_discount_edit_view = {
  title: "Edit Discount",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields:
      [
        { dbkey: "vti_name", label: "VTI Name", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },
        { dbkey: "rates",  label: "Rates", size: 10, collapsible: true, collapsed: true  , fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                  { dbkey: "units", label: "Unit", type: "text", size: 3},
                  { dbkey: "value", label: "Value", type: "text", size: 3},
                  { dbkey: "ceil", label: "Ceil", type: "toggle", size: 3},
              ]
            },
          ]
        }
      ]
    }
  ]
};

const rates_discount_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Discounts",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: 'key', label: 'Key', filter : {}},
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        {key: 'rate_type', label: 'Rate Type'},
        {key: 'type', label: 'Type', filter :  {system : 'discount'}},
        {key: 'zone', label: 'Zone'},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
        // {key: 'rates', label: 'rates'}
      ],
      onItemClick : 'edit',
    } ]
  } ]
};

const rates_charge_edit_view = {
  title: "Edit Charge",
  view_type: "sections",
  sections: [
    {
      display: "inline",
      fields: [
        { dbkey: "name", label: "Name", size: 10 },
        { dbkey: "tech_name", label: "Tech Name", size: 10 },
        { dbkey: "vti_name", label: "VTI Name", size: 10 },
        { dbkey: "reason", label: "Reason", size: 10 },
        { dbkey: "key", label: "Key", size: 10 },
        { dbkey: "type", label: "Type", size: 10 },

        { dbkey: "domains",  label: "Domains", size: 10, collapsible: true, collapsed: true  ,
          fields: [
            { dbkey: "optional", label: "Optional", type: "array", size: 10},
          ]
        },

        { dbkey: "params",  label: "Params", size: 10, collapsible: true, collapsed: true  , fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                  { dbkey: "service_name", label: "Service Name", type: "text", size: 10},
              ]
            },
          ]
        },


        { dbkey: "rates",  label: "Rates", size: 10, collapsible: true, collapsed: true  , fields:
          [
            { dbkey: "*", size : 12, collapsible: false,
              fields:
              [
                { dbkey: "rate", label: 'Rate', size : 12, collapsible: true,
                  fields:
                  [
                    { dbkey: "price", label: "Price", type: "text", size: 3},
                    { dbkey: "interval", label: "Interval", type: "text", size: 3},
                    { dbkey: "to", label: "To", type: "text", size: 3},
                    { dbkey: "ceil", label: "Ceil", type: "toggle", size: 3},
                  ]
                },
                { dbkey: "unit", label: "Unit", size: 10 },
              ]
            }
          ]
        }
      ]
    }
  ]
};

const rates_charge_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Charge",
      url: globalSetting.serverUrl + '/api/find?collection=rates',
      fields: [
        {key: 'tech_name', label: 'Name'},
        {key: 'key', label: 'Key', filter : {}},
        {key: '_id', label: 'ID', type:"mongoid", hidden : true},
        // {key: 'rate_type', label: 'Rate Type'},
        // {key: 'end_publication', label: 'End Publication'},
        {key: 'type', label: 'Type', filter :  {system : 'charge'}},
        {key: 'date', label: 'Date', type:'urt' ,filter :  { defaultValue : (moment()), query:{'from' : {'$lte':1}, 'to' : {'$gt': 1} }  ,valuePath:{ 'from': {'$lte':null}, 'to' : {'$gt' : null} } } , hidden : true},
      ],
      onItemClick : 'edit',
    } ]
  } ]
};


const plan_setup_tabs = [
  {
    title: "Plan Settings",
    sections: [
      {
        title: "Basic Settings",
        description: "Basic settings of the plan",
        fields: [
          { dbkey: "name",
            label: "Plan Name",
            mandatory: true,
            type: "text" },
          { dbkey: "description",
            label: "Plan Description",
            mandatory: false,
            type: "textarea" }
        ]
      },
      {
        title: "Trial",
        display: "inline",
        fields: [
          { label: "Transation",
            mandatory: true,
            type: "select",
            size: 3,
            options: [
              { label: "Every Month", value: "every_month"}
            ]},
          { label: "Cycle",
            type: "number",
            size: 2,
            dbkey: "trial-cycle" },
          { label: "Plan Fee",
            type: "number",
            size: 3 }
        ]
      },
      {
        title: "Plan Recurring",
        description: "Recurring charges of the plan",
        fields: [
          { label: "Priodical Rate",
            type: "number",
            size: 2 },
          { label: "Each",
            type: "number",
            size: 1 },
          { type: "select",
            options: [
              { label: "Every Month", value: "every_month"}
            ],
            size: 2,
            dbkey: "each_select" },
          { label: "Cycle",
            dbkey: "recurring-cycle",
            type: "number",
            size: 1 },
          { label: "Validity",
            type: "date",
            dbkey: "from",
            size: 3 },
          { type: "date",
            dbkey: "to",
            size: 3 }
        ]
      }
    ]
  },
  {
    title: "Add Item"
  },
  {
    title: "Whaddup!"
  }
];

const View = {
  pages: {
    dashboard: {
      menu_title: "Dashboard",
      view_type: "html",
      html : dashboard_html
    },
    rates: {
      menu_title: "Rate",
      route: "rates/rates/list",
      views: {
        list: rates_list_view,
        new: rates_new_view,
        edit: rates_edit_view
      }
    },
    rates_vat: {
      menu_title: "VAT",
      route: "rates_vat/rates/list",
      views: {
        list: rates_vat_list_view,
        new: rates_new_view,
        edit: rates_vat_edit_view
      }
    },
    rates_product: {
      menu_title: "Products",
      route: "rates_product/rates/list",
      views: {
        list: rates_product_list_view,
        edit: rates_product_edit_view
      }
    },
    rates_discount: {
      menu_title: "Discounts",
      route: "rates_discount/rates/list",
      views: {
        list: rates_discount_list_view,
        edit: rates_discount_edit_view
      }
    },
    rates_charge: {
      menu_title: "Charges",
      route: "rates_charge/rates/list",
      views: {
        list: rates_charge_list_view,
        edit: rates_charge_edit_view
      }
    },

    plans: {
      menu_title: "Plans",
      route: "plans/plans/list",
      views: {
        list: plans_list_view,
        new: plans_new_view,
        edit: plans_edit_view
      }
    },
    lines: {
      menu_title: "Lines",
      route: "lines/lines/list",
      views: {
        list: lines_list_view,
        edit: lines_edit_view
      }
    },
    import_export_html: {
      menu_title: "Import/Export",
      view_type: "html",
      html : import_export_html
    },
    // plan_setup: {
    //   title: "Plan Setup",
    //   menu_title: "Plan Setup",
    //   view_type: "tabs",
    //   tabs: plan_setup_tabs
    // }
  }
};

export default View;
