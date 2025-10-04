import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopPage from './TopPage'; 
import MuseumScreen from "./components/MuseumScreen";
import MuseumMyListScreen from "./components/MuseumMyListScreen";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-b overflow-y-hidden from-gray-50 to-gray-100 flex flex-col items-center justify-center">
            <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/view/:museumId" element={<MuseumScreen />} />
            <Route path="/show" element={<MuseumMyListScreen />} />
            </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
