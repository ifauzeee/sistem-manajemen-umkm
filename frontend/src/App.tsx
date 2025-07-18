import React from 'react';
import ProductPage from './components/ProductPage';

function App() {
  return (
    // Tidak ada lagi ThemeProvider atau CssBaseline.
    // Langsung render ProductPage.
    <ProductPage />
  );
}

export default App;