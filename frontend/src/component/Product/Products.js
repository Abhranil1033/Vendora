import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { clearErrors, getProduct } from "../../actions/productActions";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { Pagination } from "@material-ui/lab";
import { Typography, Slider } from "@material-ui/core";
// import createTypography from "@material-ui/core/styles/createTypography";

const categories = ["Laptop", "Footwear", "Tops", "Bottom", "Attire", "Camera", "SmartPhones"];

const Products = () => {
    const dispatch = useDispatch();
    const params = useParams();
    // const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 125000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const { products, loading, error, productsCount, productsInAPage } = useSelector(state => state.products);

    const setCurrentPageNumber = (event, value) => {
        setCurrentPage(value);
        console.log(currentPage);
        // navigate(`?page=${currentPage}`);
    }

    const priceHandler = (event, value) => {
        setPrice(value);
    }

    const changeCategory = (event, value) => {
        setCategory(value);
        console.log(category);
    }

    const ratingsHandler = (event, value) => {
        setRatings(value);
        console.log(ratings);
    }

    const keyword = params.keyword;

    useEffect(() => {
        dispatch(getProduct(keyword, currentPage, price, category,ratings));
    }, [dispatch, keyword, currentPage, price, category,ratings]);

    // let count = filteredProductsCount;

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <h2 className="productsHeading">Products</h2>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={25000}
                        />

                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => (
                                <li className="category-link"
                                    key={category}
                                    onClick={changeCategory}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>

                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={ratingsHandler}
                                aria-labelledby="continuous-slider"
                                min={0}
                                max={5}
                                valueLabelDisplay="auto"
                            />
                        </fieldset>

                    </div>

                    <div className="productsContainer">
                        <div className="products">
                            {products && products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <Pagination
                            // count={productsInAPage}
                            count={Math.ceil(productsCount / productsInAPage)}
                            size="large"
                            page={currentPage}
                            variant="outlined"
                            shape="rounded"
                            onChange={setCurrentPageNumber}
                        />

                        {/* {
                            productsInAPage < count && (
                                <div className="paginationBox">
                                    <Pagination
                                        // count={productsInAPage}
                                        count={Math.ceil(productsCount / productsInAPage)}
                                        size="large"
                                        page={currentPage}
                                        variant="outlined"
                                        shape="rounded"
                                        onChange={setCurrentPageNumber}
                                    />
                                </div>
                            )
                        } */}
                    </div>
                </Fragment>}
        </Fragment>
    )
}

export default Products;