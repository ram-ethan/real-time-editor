
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import EditorPage from './pages/EditorPage';
function App() {
  return (
    <>
      <div>
        <Toaster position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#43ff2b",
              }
            }
          }}
        >

        </Toaster>
      </div>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/editor/:roomId' element={<EditorPage />} />
        </Routes>
      </Router>


    </>
  );
}

export default App;
