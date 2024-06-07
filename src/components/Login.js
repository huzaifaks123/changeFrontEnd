// import required styles modules to style elements
import styles from '../styles/pages.module.css';

// import necessary hooks for state management and navigation
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import actions and selectors from UserReducer
import { UserSelector, loginAsyncThunk, logoutAsyncThunk, setErrorMessage } from '../redux/reducers/UserReducer';

// import action from SideMenuReducer
import { setActive } from '../redux/reducers/SideMenuReducer';

// export Login Component
export default function Login({ setIsRegistered }) {
    // define necessary state for Login form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // create dispatch
    const dispatch = useDispatch();

    // create navigate
    const navigate = useNavigate();

    // get errorMessage from Redux store
    const { errorMessage ,loading} = useSelector(UserSelector);

    // dispatch logoutAsyncThunk and clear errorMessage on component mount
    useEffect(() => {
        dispatch(logoutAsyncThunk());
        dispatch(setErrorMessage(""));
    }, [dispatch]);

    // handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log("SUBMITTING");
            const apiResult = await dispatch(loginAsyncThunk({ email, password })).unwrap();
            console.log("apiResult in login component", apiResult);
            dispatch(setActive('/'));
            navigate("/");
        } catch (err) {
            console.error('Failed to fetch questions from API:', err);
        }
    };

    // toggle to registration form
    const toggleLogin = () => {
        setIsRegistered(false);
    };

    // return Login form
    return (
        <div id="login-container" className={`w-50 mx-auto px-4 mt-4 ${styles.loginContainer}`}>
            {loading?<h1 className='text-center position-absolute end-0 bottom-0'>Signing In...</h1>:""}
            <h1>Login to continue...</h1>
            {errorMessage && (
                <div className={`alert alert-danger ${styles.errorBox}`} role="alert">
                    {errorMessage}
                </div>
            )}
            <form id="login-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="InputEmail" className="form-label">Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="InputPassword" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        name="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="text-end">
                    <button type='submit' className={`btn btn-primary ${styles.btn}`}>Submit</button>
                </div>
            </form>
            <div id="register" className='d-flex align-items-center justify-content-end mt-5'>
                New User? Register here <button onClick={toggleLogin} className={`btn btn-primary ms-3 ${styles.btn}`}>Register</button>
            </div>
        </div>
    );
}
