import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp.jsx";
import Header from "./components/Header";
import CreateListing from "./pages/CreateListing.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";
import Listing from "./pages/Listing.jsx";
import Search from "./pages/Search.jsx";
import Footer from "./pages/Footer.jsx";
import ReactGA from 'react-ga4'

ReactGA.initialize("G-73S0VG1ZYR");
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname,
})
export default function App() {
  return (
    <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />} >
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-listing/:id" element={<UpdateListing />} />
          </Route>
        </Routes>
      <Footer />
    </BrowserRouter>
  );
}
