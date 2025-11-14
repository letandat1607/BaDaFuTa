import { Routes, Route } from "react-router-dom";
import MerchantLogin from "./component/merchantSys/merchantLogin";
import MerchantHome from "./component/merchantSys/merchantHome";
import MerchantInfor from "./component/merchantSys/merchantInfor";
import MerchantMenu from "./component/merchantSys/merchantMenu";
import MerchantOrders from "./component/merchantSys/merchantOrders";
import TestOrder from "./component/merchantSys/testOrder";

import CustomerLogin from "./component/customerSys/loginCustomer";
import MerchantList from "./component/customerSys/merchantList";
import MechantMenu from "./component/customerSys/merchantMenu";
import MerchantCart from "./component/customerSys/merchantCart";
import Checkout from "./component/customerSys/checkOut";
import PaymentResult from "./component/customerSys/paymentResult";
import OrderSuccess from "./component/customerSys/orderSuccess";
import OrderHistory from "./component/customerSys/orderHistory";
import OrderDetail from "./component/customerSys/orderDetail";

import ProtectedRoute from "./component/merchantSys/commonMerchant/protectedRoute";
import ProtectedRouteCustomer from "./component/customerSys/commonCustomer/protectedRouteCustomer";

import Navbar from "./component/merchantSys/commonMerchant/navbar";

import MerchantSys from "./routes/merhantSys";
import CustomerSys from "./routes/customerSys";


import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

function App() {
  return (
    <Routes>
      {/* ====================== MERCHANT SYSTEM ====================== */}
      <Route path="/merchantSystem/login" element={<MerchantLogin />} />

      <Route
        path="/merchantSystem"
        element={
          <ProtectedRoute>
            <MerchantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MerchantHome />} />
        <Route path="dashboard" element={<MerchantHome />} />
        <Route path="info" element={<MerchantInfor />} />
        <Route path="menu" element={<MerchantMenu />} />
        <Route path="orders" element={<MerchantOrders />} />
      </Route>

      {/* ====================== CUSTOMER SYSTEM ====================== */}
      <Route path="/customer/login" element={<CustomerLogin />} />

      <Route
        path="/customer"
        element={
          <ProtectedRouteCustomer>
            <CustomerSys /> {/* CustomerSys sẽ chứa Navbar + Outlet */}
          </ProtectedRouteCustomer>
        }
      >
        <Route index element={<MerchantList />} />
        <Route path="merchants" element={<MerchantList />} />
        <Route path="merchant/:id" element={<MechantMenu />} />
        <Route path="merchant/cart/:merchantId" element={<MerchantCart />} />
        <Route path="checkout/:merchantId" element={<Checkout />} />
        <Route path="payment/:orderId" element={<PaymentResult />} />
        <Route path="order-success/:orderId" element={<OrderSuccess />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="order/:orderId" element={<OrderDetail />} />
        {/* Thêm các trang customer khác ở đây */}
      </Route>

      {/* ====================== TEST ====================== */}
      <Route path="/testOrder" element={<TestOrder />} />
    </Routes>
  );
}

// Layout cho Merchant: có Navbar merchant
function MerchantLayout() {
  return (
    <>
      <Navbar />
      <MerchantSys />
    </>
  );
}

// Layout cho Customer: có Navbar customer

export default App;