const MenuItems = [
    {
      id:'dashboard',
      title:'Dashboard',
      icon:'fa-dashboard',
      route:'dashboard',
      show:true,
    },
    {
        id:'plans',
        title:'Plans',
        icon:'fa-cubes',
        route:'plans',
        show:true,
    },
    {
      id: 'prepaid_plans',
      title: 'Prepaid Plans',
      icon: 'fa-cubes',
      route: 'prepaid_plans',
      show: true
    },
    {
        id:'services',
        title:'Services',
        icon:'fa-puzzle-piece',
        route:'services',
        show:true,
    },
    {
        id:'products',
        title:'Products',
        icon:'fa-book',
        route:'products',
        show:true,
    },
    {
        id:'customers',
        title:'Customers',
        icon:'fa-users',
        route:'customers',
        show:true,
    },
    {
        id:'usage',
        title:'Usage',
        icon:'fa-list',
        route:'usage',
        show:true,
    },
    {
        id:'invoices',
        title:'Invoices',
        icon:'fa-file-text-o',
        route:'invoices',
        show:true,
    },
    {
        id:'users',
        title:'User Management',
        icon:'fa-user',
        route:'users',
        show:true,
    },
    {
        id:'audit-trail',
        title:'Audit Trail',
        icon:'fa-history',
        route:'audit-trail',
        show:true,
    },
    {
        id:'settings',
        title:'Settings',
        icon:'fa-cog',
        route:'',
        show:true,
        subMenus:[
            {
                id:'generalSettings',
                title:'General Settings',
                icon:'',
                route:'settings',
                show:true,
            },
            {
                id:'input_processors',
                title:'Input Processors',
                icon:'',
                route:'input_processors',
                show:true,
            },
            {
                id:'export_generators',
                title:'Export Generator',
                icon:'',
                route:'export_generators',
                show:true,
            },
            {
                id:'payment_gateways',
                title:'Payment Gateways',
                icon:'',
                route:'payment_gateways',
                show:true,
            },
            {
                id:'collections',
                title:'Collections',
                icon:'',
                route:'collections',
                show:true,
            },
            {
                id:'invoice-template',
                title:'Invoice Template',
                icon:'',
                route:'invoice-template',
                show:true,
            },
        ]
    },

];

export default MenuItems;
