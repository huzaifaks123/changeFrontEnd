// import styles from style modules
import styles from '../styles/sidemenu.module.css';

// import outlet to change DOM without reloading tab
import { Link, Outlet } from "react-router-dom";
import { UserSelector } from '../redux/reducers/UserReducer';

// import hooks for state
import { useDispatch, useSelector } from 'react-redux';
import { SideMenuSelector, setActive } from '../redux/reducers/SideMenuReducer';

const SideMenu = ({ files }) => {
  
  // get session state from UserReducer
  const { session } = useSelector(UserSelector);
  
  // get active state from SideMenuReducer
  const { active } = useSelector(SideMenuSelector);
  
  // initialize dispatch
  const dispatch = useDispatch();

  // function to highlight active menu tab
  const handleActive = (link) => {
    dispatch(setActive(link));
  };

  return (
    // render part
    <>
      <div className="d-flex h-100">
        <div className={`col-md-3 d-none rounded p-2 d-lg-block ${styles.sideMenuContainer}`}>
          {
            // render menu items based on session state
            session ?
              files.map((node, i) => (
                <Link to={node.link} key={`${i}`} className={styles.navlink}>
                  <div
                    onClick={() => handleActive(node.link)}
                    className={active === node.link ? styles.ActiveTreeNodeVisible : styles.treeNodeVisible}
                  >
                    {node.name}
                  </div>
                </Link>
              )) 
              : 
              <Link to={"user"} className={styles.navlink}>
                <div className={styles.ActiveTreeNodeVisible}>
                  Login
                </div>
              </Link>
          }
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default SideMenu;
