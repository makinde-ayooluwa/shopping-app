import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";

export default function AppRouter(){
    return <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home/>} />
    </Routes>
    <Footer/>
    </BrowserRouter>
}