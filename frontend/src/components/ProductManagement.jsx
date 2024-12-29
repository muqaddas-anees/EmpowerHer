import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const ProductManagement = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [products]);
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found!");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("description", data.description);

      // Check if there's an image to append
      if (data.image) {
        formData.append("image", data.image[0]); // Assuming `data.image` is the file object
      }

      if (editingProduct) {
        // Editing an existing product
        const response = await axios.put(
          `http://localhost:5000/api/products/edit/${editingProduct._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Ensure the correct content type is set
            },
          }
        );

        reset({
          name: "",
          image: "",
          category: "",
          price: "",
          description: "",
        });
      } else {
        // Adding a new product
        const response = await axios.post(
          "http://localhost:5000/api/products",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Ensure the correct content type is set
            },
          }
        );

        // Add the new product to the state
        setProducts((prevProducts) => [...prevProducts, response.data]);
      }

      reset();
      setEditingProduct(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      image: product.image,
      category: product.category,
      price: product.price,
      description: product.description,
    });
  };

  //working
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found!");
        return;
      }

      console.log(`the product id is ${productId}`);

      await axios.delete(
        `http://localhost:5000/api/products/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-black mb-4">Product Management</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 shadow-md rounded-lg"
      >
        <div>
          <label className="block text-black font-semibold">Product Name</label>
          <input
            type="text"
            {...register("name", { required: "Product Name is required" })}
            className="w-full p-2 border rounded text-black"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-900 font-semibold">Image</label>
          <input
            type="file"
            accept="image/*" // Accepts only image file types
            {...register("image", { required: "Image file is required" })}
            className="w-full p-2 border rounded text-gray-900"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        <div>
          <label className="block text-black font-semibold">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full p-2 border rounded text-black"
          >
            <option className="text-black" value="handmade-jewelry">
              Handmade Jewelry
            </option>
            <option className="text-black" value="apparel-fashion">
              Apparel & Fashion
            </option>
            <option className="text-black" value="home-decor">
              Home Decor
            </option>
            <option className="text-black" value="beauty-personal-care">
              Beauty & Personal Care
            </option>
            <option className="text-black" value="handcrafted-furniture">
              Handcrafted Furniture
            </option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-black font-semibold">Price</label>
          <input
            type="number"
            {...register("price", { required: "Price is required" })}
            className="w-full p-2 border rounded text-black"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-black font-semibold">Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full p-2 border rounded text-black"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-black mb-4">Products</h3>
        <ul>
          {products.map((product, index) => (
            <li
              key={product._id || index}
              className="flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-lg mb-4"
            >
              <div>
                <span className="block text-lg font-semibold text-black">
                  {product.name} - ${product.price}
                </span>
                <p className="text-sm text-black">{product.description}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
