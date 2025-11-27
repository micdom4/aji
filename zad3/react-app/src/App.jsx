import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import './App.css'

export default function App() {
   return (
      <Router>
         <Navigation />
         <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
               path="/products"
               element={
                  <ProtectedRoute>
                     <ProductsPage />
                  </ProtectedRoute>
               }
            />
            <Route
               path="/orders"
               element={
                  <ProtectedRoute>
                     <OrdersPage />
                  </ProtectedRoute>
               }
            />
            <Route path="/" element={<Navigate to="/products" replace />} />
         </Routes>
      </Router>
   )
}