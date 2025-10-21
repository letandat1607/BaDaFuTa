import { Routes, Route, Link } from "react-router-dom";
import MerchantSys from './routes/merhantSys'
import MerchantLogin from './component/merchantSys/merchantLogin'
import MerchantHome from './component/merchantSys/merchantHome';
import MerchantInfor from './component/merchantSys/merchantInfor';
import MerchantMenu from './component/merchantSys/merchantMenu';
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";


function App() {


  return (
    <>
      <Routes>
        <Route path="/merchantSystem/login" element={<MerchantLogin />} />
        <Route path="/merchantSystem/dashboard" element={<MerchantSys />} />
        <Route path="/merchantSystem/info" element={<MerchantInfor />} />
        <Route path="/merchantSystem/menu" element={<MerchantMenu />} />
      </Routes>
    </>
  )
}

export default App
