import { Outlet } from "react-router-dom";
import NavbarCustomer from "../component/customerSys/commonCustomer/navbar";

export default function CustomerSys() {
  return (
    <>
    <div style={{padding: "10px", marginTop: "5%"}}>
        <NavbarCustomer />
        <Outlet />
    </div>
    </>
  );
}