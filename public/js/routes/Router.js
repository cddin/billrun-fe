import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect, IndexRedirect } from 'react-router';

import RequireAuth from '../containers/Authentication';
import App from '../containers/App';
import CustomersList from '../components/CustomersList';
import ProductsList from '../components/ProductsList';
import CustomerSetup from '../components/CustomerSetup';
import PlansList from '../components/PlansList';
import InputProcessor from '../components/InputProcessor';
import InputProcessorsList from '../components/InputProcessorsList';
import ExportGenerator from '../components/ExportGenerator';
import ExportGeneratorsList from '../components/ExportGeneratorsList';
import UsageList from '../components/UsageList';
import InvoicesList from '../components/InvoicesList';
import Settings from '../components/Settings';
import Dashboard from '../components/Dashboard';
import PageNotFound from '../components/PageNotFound';
import LoginPage from '../components/LoginPage';
import ProductSetup from '../components/ProductSetup';
import PaymentGateways from '../components/PaymentGateways';
import Plan from '../components/Plan';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" component={RequireAuth(Dashboard)} />
      <Route path="/dashboard" component={RequireAuth(Dashboard)} title="Dashboard" />
      <Route path="/plans" component={RequireAuth(PlansList)} title="Plans"/>
      <Route path="/plan" component={RequireAuth(Plan)} title="Create / Edit Plan"/>
      <Route path="/customers" component={RequireAuth(CustomersList)} title="Customers"/>
      <Route path="/products" component={RequireAuth(ProductsList)} title="Products"/>
      <Route path="/product_setup" component={RequireAuth(ProductSetup)} title="Product" />
      <Route path="/customer" component={RequireAuth(CustomerSetup)} title="Customer"/>
      <Route path="/input_processor" component={RequireAuth(InputProcessor)} title="Input Processor"/>
      <Route path="/input_processors" component={RequireAuth(InputProcessorsList)} title="Input Processors"/>
      <Route path="/export_generator" component={RequireAuth(ExportGenerator)} title="Export Generator"/>
      <Route path="/export_generators" component={RequireAuth(ExportGeneratorsList)} title="Export Generators"/>
      <Route path="/usage" component={RequireAuth(UsageList)} title="Usage" />
      <Route path="/invoices" component={RequireAuth(InvoicesList)} title="Invoices" />
      <Route path="/settings" component={RequireAuth(Settings)} title="Settings"/>
      <Route path="/payment_gateways" component={RequireAuth(PaymentGateways)} title="Payment Gateways" />
      <Route path="/login" component={LoginPage} title="Login"/>
      <Route path="*" component={PageNotFound} />
    </Route>
  );
}
