import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import MetaData from "../layout/MetaData";
import { getProduct,clearErrors } from "../../actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import {useAlert} from "react-alert";
import ProductCard from "./ProductCard.js";

// const product = {
//     name : "Blue Tshirt",
//     images : [{url : "https://i.ibb.co/DRST11n/1.webp"}],
//     price : "3000",
//     _id : "pessi"
// }

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const {  products,loading,error } = useSelector((state) => state.products );
    // const {products} = useSelector((state) => state.products);
    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch,error,alert]);
    return (
        <>
            {loading ? <Loader /> : (
            <>
                <MetaData title="ECOMMERCE" />
                <div className="banner">
                    <p>Welcome to EComm Store</p>
                    <h1>Find amazing products below</h1>

                    <a href="#container">
                        <button>Scroll <CgMouse /></button>
                    </a>
                </div>


                <h2 className="homeHeading">Featured Products</h2>
                <div className="container" id="container">
                    {products &&
                        products.map((product) => (
                            <ProductCard product={product} />
                        ))}                   
                        {/* <Product product={product} /> */}
                </div>
            </>
         )} 
        </>
    )
}

export default Home;