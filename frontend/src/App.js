import CustomerPage from "./components/customer/customer";
import ProductPage from "./components/product/product";
import PurchaseOrders from "./components/purchaseOrder/purchaseOrders";
import VendorPage from "./components/vendor/vendor";
import AvailableStock from "./components/stock/availableStock";
import { Route,Routes  } from "react-router-dom";
import Navigate from "./components/navigate/navigate";
import Bill from "./components/bill/bill";
function App() {
  
  return (
    <>
   
  <Navigate />
      
      <Routes>
        <Route exact path="/" element={<AvailableStock />} />
          <Route exact path="/purchaseorder" element={<PurchaseOrders />} />
          <Route exact path="/productpage" element={<ProductPage />} />
          <Route exact path="/vendor" element={<VendorPage />} />
          <Route exact path="/customer" element={<CustomerPage />} />
          <Route exact path="/selling" element={<Bill />} />
      </Routes>
     
    </>
  );
}

export default App;
