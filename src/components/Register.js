// Import necessary styles
import styles from '../styles/pages.module.css';

// Import hooks for state management and side effects
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// Import actions and selectors from UserReducer
import { UserSelector, registerAsyncThunk, setErrorMessage } from '../redux/reducers/UserReducer';

// Export Register Component
export default function Register({ setIsRegistered }) {
    // Define necessary state for Register component
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    // Clear error message on component mount
    useEffect(() => {
        dispatch(setErrorMessage(""))
    }, [dispatch]);

    // Get error message from Redux store
    const { errorMessage, loading } = useSelector(UserSelector);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(registerAsyncThunk({ name, email, password })).unwrap();
            toggleRegister();
        } catch (err) {
            console.error('Failed to register:', err);
        }
    };

    // Function to toggle back to login view
    const toggleRegister = () => {
        setIsRegistered(true);
    };

    // Return Register form
    return (
        <div id="register-container" className={`w-50 mx-auto px-4 mt-4 ${styles.registerContainer}`}>
            {loading ? <h1 className='text-center position-absolute end-0 bottom-0'>Registering...</h1> : ""}
            <h1>Register to continue...</h1>
            {errorMessage && (
                <div className={`alert alert-danger ${styles.errorBox}`} role="alert">
                    {errorMessage}
                </div>
            )}
            <form id="login-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="InputName" className="form-label">Your Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
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
                Already Registered? <button onClick={toggleRegister} className={`btn btn-primary ms-3 ${styles.btn}`}>Login</button>
            </div>
        </div>
    );
}
