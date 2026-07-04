import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";

export default function App() {

return(

<BrowserRouter>

<Layout>

<Routes>

<Route path="/" element={<Dashboard/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/employees" element={<Employees/>}/>

<Route path="/attendance" element={<Attendance/>}/>

<Route path="/leave" element={<Leave/>}/>

<Route path="/payroll" element={<Payroll/>}/>

<Route path="/profile" element={<Profile/>}/>

</Routes>

</Layout>

</BrowserRouter>

)

}