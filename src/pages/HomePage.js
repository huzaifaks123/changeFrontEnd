// Import styles from pages module
import styles from '../styles/pages.module.css';

// Import required components
import TopicSelection from '../components/TopicSelection';
import { useSelector } from 'react-redux';
import { UserSelector } from '../redux/reducers/UserReducer';
import { Link } from 'react-router-dom';

// Define HomePage component
export default function HomePage() {
    // Retrieve session information from Redux store
    const { session } = useSelector(UserSelector);

    // Return the rendered content based on session status
    return (
        <div id="home-container" className={`w-50 mx-auto mt-4 ${styles.homeContainer}`}>
            {session ? (
                <TopicSelection />
            ) : (
                <>
                    <h1 className='text-center mb-5'>Login to continue...</h1>
                    <div className="text-center">
                        <Link to={'user'}>
                            <button type='submit' className={`btn btn-primary w-25 mt-4 ${styles.btn}`}>
                                Login Here
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
