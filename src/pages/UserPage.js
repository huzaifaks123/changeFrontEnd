// Import necessary modules
import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

// Define UserPage component
export default function UserPage() {
    // Define state variable to track registration status
    const [isRegistered, setIsRegistered] = useState(true);

    // Render either login or register component based on registration status
    return (
        <>
            {isRegistered ? (
                // Render login component if user is registered
                <Login setIsRegistered={setIsRegistered} />
            ) : (
                // Render register component if user is not registered
                <Register setIsRegistered={setIsRegistered} />
            )}
        </>
    );
}
