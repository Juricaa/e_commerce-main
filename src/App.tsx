import "@shopify/polaris/build/esm/styles.css";
import { AppProvider, Frame } from "@shopify/polaris";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/Auth/LoginPage";
import { DeliveryScanner } from "./components/Delivery/DeliveryScanner";
import { Storefront } from "./components/Storefront/Storefront";
import { ProductManagement } from "./components/Dashboard/ProductManagement";
import { UserManagement } from "./components/Dashboard/UserManagement";
import { OrderManagement } from "./components/Dashboard/OrderManagement";
import { InvoiceManagement } from "./components/Dashboard/InvoiceManagement";

function App() {
  return (
    <AppProvider i18n={{}}>
      <BrowserRouter>
        <Frame>
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/delivery" element={<DeliveryScanner />} />
            <Route
              path="/admin"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/admin/products"
              element={
                <Layout>
                  <ProductManagement />
                </Layout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Layout>
                  <UserManagement />
                </Layout>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <Layout>
                  <OrderManagement />
                </Layout>
              }
            />
            <Route
              path="/admin/invoices"
              element={
                <Layout>
                  <InvoiceManagement />
                </Layout>
              }
            />
          </Routes>
        </Frame>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
