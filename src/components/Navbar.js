// import required styles modules to style elements
import styles from '../styles/navbar.module.css';
import style from '../styles/sidemenu.module.css';

// import routing elements to render without reloading tab
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

// import necessary hooks for state management
import { useDispatch, useSelector } from 'react-redux';

// import files to render side menu on collapsing
import { files } from '../assets/js/files';

// import necessary react hooks
import { useEffect, useRef, useState } from "react";
import { SideMenuSelector, setActive } from '../redux/reducers/SideMenuReducer';
import { UserSelector, checkAuthAsyncThunk } from '../redux/reducers/UserReducer';

// export Navbar Component
const Navbar = () => {

    // define necessary state for Navbar
    const [show, setShow] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    // create ref using ref hook
    const btnRef = useRef();

    // create dispatch
    const dispatch = useDispatch();

    // get current location
    const location = useLocation();

    // get session and active state from Redux store
    const { session } = useSelector(UserSelector);
    const { active } = useSelector(SideMenuSelector);

    // dispatch checkAuthAsyncThunk on every dispatch
    useEffect(() => {
        dispatch(checkAuthAsyncThunk());
        const path = location.pathname.slice(1);
        dispatch(setActive(path));
    }, [dispatch]);

    // function to toggle SideMenu visibility
    function toggleMenu() {
        setShow(!show);
    }

    // function to toggle tree
    const toggleTree = () => {
        setIsCollapsed(!isCollapsed);
    };

    // function to toggle menu off on clicking any other page
    const toggleMenuOff = () => {
        const button = btnRef.current;
        button.click();
    };

    // default function to render tree nodes
    const renderTreeNodes = (nodes) => {
        return (
            session ?
                files.map((node, i) => (
                    <Link to={node.link} key={`${i}`} className={style.navlink} onClick={() => toggleMenuOff()}>
                        <div
                            onClick={() => toggleTree()}
                            className={`${active === node.link ? style.ActiveTreeNodeVisible : style.treeNodeVisible}`}
                        >
                            <span className={isCollapsed ? "" : style.open}>
                                {node.name}
                            </span>
                        </div>
                    </Link>
                ))
                : <Link to={"user"} className={style.navlink}>
                    <div className={style.treeNodeVisible}>
                        Login
                    </div>
                </Link>
        );
    };

    // return Navbar
    return (
        <div className={styles.body}>
            <nav className={`navbar navbar-expand-lg d-flex align-items-center rounded ${styles.navContainer}`}>
                <div className="container-fluid d-flex flex-nowrap justify-content-start w-50 me-auto m-0">
                    <button
                        className={`navbar-toggler btn-selector border ${styles.customToggler}`}
                        ref={btnRef}
                        type="button"
                        onClick={toggleMenu}
                        aria-controls="navbarSupportedContent"
                        aria-expanded={show}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`navbar-nav w-0 z-3 rounded ${style.navMenuCollapsed} ${show ? "show" : ""}`} id="navbarSupportedContent">
                        <div className={`nav-options ps-2 rounded ${style.navMenuContainer} ${show ? "d-block" : "d-none d-lg-block d-lg-none"}`}>
                            {renderTreeNodes([files])}
                        </div>
                    </div>
                    <div className={`d-flex align-items-center fs-3 ${styles.brand}`}>
                        <div className={`navbar-brand me-auto ${styles.brandLogo}`} />
                        <span className={styles.brandName}>BRAND</span>
                    </div>
                </div>
                <div className={`d-flex justify-content-around me-4 ${styles.navMenu} ${show ? "show" : ""}`} id="navbarSupportedContent">
                    <div className="mb-2 mb-lg-0">
                        <div className="nav-options mx-auto">
                            <img className={styles.menu} src="https://cdn-icons-png.flaticon.com/128/2948/2948037.png" alt="menu-icon" />
                            <img className={styles.notificationIcon} src="https://cdn-icons-png.flaticon.com/128/1827/1827347.png" alt="notification-icon" />
                            <img className={styles.profilePic} src="https://cdn-icons-png.flaticon.com/128/1177/1177568.png" alt="profile-pic" />
                        </div>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default Navbar;
