import './App.css';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequireAuth from './components/RequireAuth';

function App() {

  return (
    <>

      <BrowserRouter>
        <nav>
          <Link to="/products">Produkty</Link>
          <Link to="/categories">Kategorie</Link>
          <Link to="/login">Zaloguj się</Link>
          <Link to="/register">Zarejestruj się</Link>
        </nav>

        <Routes>
          <Route path='/' element={<CategoryPage />} />
          <Route path='/categories' element={<CategoryPage />} />
          <Route element={<RequireAuth />}>
            <Route path='/products' element={<ProductsPage />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default App;
