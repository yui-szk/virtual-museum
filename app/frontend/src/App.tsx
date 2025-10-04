import React from 'react';
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import TopPage from './TopPage'; 
import MuseumScreen from "./components/MuseumScreen";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/view" element={<MuseumScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
