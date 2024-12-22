import React, { Fragment, useState } from "react";
import "./Header.css";
import SpeedDial from '@mui/material/SpeedDial';
// import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch,useSelector } from "react-redux";
import { logout } from "../../../actions/userActions";
import Backdrop from '@mui/material/Backdrop';
import "../../../images/Profile.png";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const UserOptions = ({ user }) => {
    const {cartItems} = useSelector((state) => state.cart);

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

    const actions = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: profile },
        { icon: <ShoppingCartIcon style={{color : cartItems.length > 0 ? "tomato" : "unset"}} />, name: `Cart (${cartItems.length})`, func: goToCart },
        { icon: <LogoutIcon />, name: "logout", func: logoutUser },
    ]

    if (user.role === "admin") {
        //unshift puts the element in the top of the array
        actions.unshift({ icon: <DashboardIcon />, name: "Dashboard", func: dashboard });
    }

    function dashboard() {
        navigate("/dashboard");
    }

    function orders() {
        navigate("/orders");
    }

    function profile() {
        navigate("/account");
    }

    function goToCart() {
        navigate("/cart");
    }

    function logoutUser() {
        dispatch(logout());
        alert.success("Logout Success");
    }

    return (
        <Fragment>
            <Backdrop open={open} style={{zindex:"10"}} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                direction="down"
                style={{ zIndex: "11" }}
                className="speedDial"
                icon={
                    <img
                        className="speedDialIcon"
                        src={user.avatar.url ? user.avatar.url : "./Profile.png"}
                        alt="Profile"
                    />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.func}
                        tooltipOpen={window.innerWidth<=600?true : false}
                    />
                ))}
            </SpeedDial>
        </Fragment>
    )
};

export default UserOptions;