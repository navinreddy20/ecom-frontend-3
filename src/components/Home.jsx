import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Something went wrong...
      </h2>
    );
  }
  return (
    <>
      <div className="grid">
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } =
              product;
            const cardStyle = {
              width: "18rem",
              height: "12rem",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
              backgroundColor: productAvailable ? "#fff" : "#ccc",
            };
            return (
              <div
                className="card mb-3"
                style={{
                  width: "18rem",
                  height: "24rem",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
                  backgroundColor: productAvailable ? "#fff" : "#ccc",
                  margin: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      padding: "5px",
                      margin: "0",
                    }}
                  />
                  <div
                    className="buttons"
                    style={{
                      position: "absolute",
                      top: "25px",
                      left: "220px",
                      zIndex: "1",
                      
                    }}
                  >
                    <div className="buttons-liked">
                      <i className="bi bi-heart"></i>
                    </div>
                  </div>
                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h5
                        className="card-title"
                        style={{ margin: "0 0 10px 0" }}
                      >
                        {name.toUpperCase()}
                      </h5>
                      <i className="card-brand" style={{ fontStyle: "italic" }}>
                        {"~ " + brand}
                      </i>
                    </div>
                    <div>
                      <h5
                        className="card-text"
                        style={{ fontWeight: "600", margin: "5px 0" }}
                      >
                        {"$" + price}
                      </h5>
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        disabled={!productAvailable}
                      >
                        {productAvailable ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
