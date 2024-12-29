import { useEffect, useState, React} from 'react';

import axios from 'axios';
const Consumer = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/consumer/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handlePayment = (method) => {
    setPaymentMethod(method);
    // Here you would store the form details in the database.

  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full text-black"
        />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {products
          .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-green-600">${product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 
                             transform transition duration-200 hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Shopping Cart */}
      <div className="mt-8 h-72">
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="flex justify-between mt-2">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </li>
          ))}
        </ul>

        {cart.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => alert('Proceeding to checkout')}
              className="bg-green-500 text-white py-2 px-4 rounded-md"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Form */}
      {cart.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Checkout</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium ">Payment Method</label>
              <select
                onChange={(e) => handlePayment(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border rounded-md text-gray-700"
              >
                <option value="">Select Payment Method</option>
                <option value="COD">COD</option>
                <option value="EASYPAISA">EASYPAISA</option>
                <option value="JazzCash">JazzCash</option>
                <option value="MasterCard">MasterCard</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
              </select>
            </div>

            {paymentMethod && (
              <div className="mt-4">
                {/* You can add the specific form fields here based on the payment method */}
                <input
                  type="text "
                  placeholder="Enter your details"
                  className="px-4 py-2 border rounded-md w-full text-black"
                />
                <button
                  type="submit"
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Consumer;
