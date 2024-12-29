import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/admin"
        );
        setProducts(response.data); // Update the products state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (selectedTab === "products") {
      fetchProducts();
    }
  }, [selectedTab]); // Fetch when the products tab is selected

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/admin"
        );
        setProducts(response.data); // Update the products state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [products]); // Fetch when the products tab is selected

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Use authentication if necessary
        if (!token) {
          console.log("No token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const [queries, setQueries] = useState([]);

  const acceptUser = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${id}/status`,
        { status: "Accepted" }
      );
      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, status: "Accepted" } : user
          )
        );
      }
      setContent("User Accepted");
    } catch (error) {
      console.error("Error accepting user:", error);
    }
  };

  const rejectUser = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${id}/status`,
        { status: "Rejected" }
      );
      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, status: "Rejected" } : user
          )
        );
      }
      setContent("User Rejected");
      setProducts(products);
    } catch (error) {
      console.error("Error accepting user:", error);
    }
  };

  const acceptProduct = async (id) => {
    try {
      if (id != null) {
        const response = await axios.put(
          `http://localhost:5000/api/products/${id}/status`,
          { status: "Accepted" }
        );
        if (response.status === 200) {
          setProducts(
            products.map((product) =>
              product._id === id ? { ...product, status: "Accepted" } : product
            )
          );
          setContent("Product Accepted");
          setProducts(products);
        }
      }
    } catch (error) {
      console.error("Error accepting product:", error);
    }
  };

  const rejectProduct = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${id}/status`,
        { status: "Rejected" }
      );
      if (response.status === 200) {
        setProducts(
          products.map((product) =>
            product._id === id ? { ...product, status: "Rejected" } : product
          )
        );
      }
      setContent("Product Rejected");
    } catch (error) {
      console.error("Error rejecting product:", error);
    }
  };

  const resolveQuery = (id) => {
    setQueries(
      queries.map((query) =>
        query.id === id ? { ...query, status: "resolved" } : query
      )
    );
  };

  const dismissQuery = (id) => {
    setQueries(queries.filter((query) => query.id !== id));
  };

  const renderUsers = () => (
    <div className=" space-y-4 text-black">
      <h3 className="text-lg font-semibold">User Requests</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4">{user.fullName}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.status}</td>
                <td className="py-2 px-4">
                  {user.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => acceptUser(user.id)}
                        className="bg-pink-500 text-white px-4 py-1 rounded mr-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectUser(user.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{user.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4 text-black">
      <h3 className="text-lg font-semibold">Product Listings</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Seller</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.seller.fullName}</td>
                <td className="py-2 px-4">{product.status}</td>
                <td className="py-2 px-4">
                  {product.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => acceptProduct(product._id)}
                        className="bg-pink-500 text-white px-4 py-1 rounded mr-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectProduct(product._id)}
                        className="bg-pink-500 text-white px-4 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{product.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-green-500 text-3xl"> {content} </p>
      </div>
    </div>
  );

  const renderQueries = () => (
    <div className="space-y-4 text-black">
      <h3 className="text-lg font-semibold">Submitted Queries</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Query</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query.id}>
                <td className="py-2 px-4">{query.query}</td>
                <td className="py-2 px-4">{query.user}</td>
                <td className="py-2 px-4">{query.status}</td>
                <td className="py-2 px-4">
                  {query.status === "pending" ? (
                    <>
                      <button
                        onClick={() => resolveQuery(query.id)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => dismissQuery(query.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <span>Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "users":
        return renderUsers();
      case "products":
        return renderProducts();
      case "queries":
        return renderQueries();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen    p-6 ">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="mt-4">
          <div className="flex space-x-4 mb-4">
            {["users", "products", "queries"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedTab === tab
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Management
              </button>
            ))}
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
