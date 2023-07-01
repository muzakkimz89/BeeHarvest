import './App.css';
import {Route, BrowserRouter, Routes } from "react-router-dom";
import Account from './pages/Account';
import BoxCollectionPage from './pages/Box';
import PlaceCollectionPage from './pages/Place';
import BoxHarvestDetailPage from './pages/BoxDetail';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Account />}/>
          <Route path="/place" element={<PlaceCollectionPage />}/>
          <Route path="/box" element={<BoxCollectionPage />}/>
          <Route path="/boxdetail" element={<BoxHarvestDetailPage />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
