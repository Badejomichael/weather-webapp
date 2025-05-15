import './App.css';
import { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { NavBar } from './pages/navbar/navbar';
import { Home } from './pages/home';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


function App() {
  const client =  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  // const [selectedCity, setSelectedCity] = useState({ name: "London" });
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = localStorage.getItem("lastCity");
    return saved ? { name: saved } : { name: "London" }; // fallback
  });
  

  return (
    <div className="App container app-container">
      <QueryClientProvider client={client}>
        <Router>
          <NavBar setSelectedCity={setSelectedCity}/>
          <Routes>
            <Route path="/" element={<Home selectedCity={selectedCity}/>}/>
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;
