import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css"

const Footer = () =>{
    return(
        <footer id="footer">
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <img src={playStore} alt="playstore"></img>
                <img src={appStore} alt="playstore"></img>
            </div>

            <div className="midFooter">
                <h1>ECOMMERCE</h1>
                <p>High Quality is our first priority</p>

                <p>Copyright 2023 &copy; Store</p>
            </div>

            <div className="rightFooter">
                <h4>FOLLOW US</h4>
                <a href="https://twitter.com/AbhranilDey7">Instagram</a>
                <a href="https://twitter.com/AbhranilDey7">Twitter</a>
                <a href="https://twitter.com/AbhranilDey7">Facebook</a>
            </div>
        </footer>
    );
};

export default Footer;