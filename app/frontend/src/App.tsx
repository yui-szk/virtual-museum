import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopPage from './TopPage'; 
import MuseumScreen from "./components/MuseumScreen";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div className="h-screen bg-gradient-to-b overflow-y-hidden from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/view" element={<MuseumScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
