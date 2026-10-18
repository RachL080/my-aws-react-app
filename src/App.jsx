import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

const URL_GET_BY_CATEGORY = "https://hgd5phhuaesiuuiemsjjlzk36m0ssmhm.lambda-url.us-east-1.on.aws/";
const URL_GET_SINGLE_PRODUCT = "https://smboufc7ppdcxlp6ksi7t77ahm0adaht.lambda-url.us-east-1.on.aws/";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('1');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${URL_GET_BY_CATEGORY}?categoryCode=${category}`);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("שגיאה בטעינת מוצרים:", err);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div style={{ padding: '20px', direction: 'rtl', textAlign: 'center' }}>
      <h1>קטלוג מוצרים</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setCategory('1')}>קטגוריה 1</button>
        <button onClick={() => setCategory('2')}>קטגוריה 2</button>
        <button onClick={() => setCategory('3')}>קטגוריה 3</button>
      </div>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {products.map(prod => (
          <div key={prod.productId} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', minWidth: '150px' }}>
            <h3>{prod.productName}</h3>
            <p>{prod.price} ₪</p>
<Link to={`/product/${category}/${prod.productId}`}>לפרטים</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { catId, prodId } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`${URL_GET_SINGLE_PRODUCT}?categoryCode=${catId}&productId=${prodId}`);
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [catId, prodId]);

  if (!product) return <div>טוען...</div>;

  return (
    <div style={{ padding: '20px', direction: 'rtl', textAlign: 'center' }}>
      <button onClick={() => navigate(-1)}>חזרה</button>
      <h2>{product.productName}</h2>
      <p>{product.description}</p>
      <p>מחיר: {product.price} ₪</p>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/product/:catId/:prodId" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}