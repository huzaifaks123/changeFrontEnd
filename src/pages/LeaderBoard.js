// Import necessary modules
import { useEffect, useState } from "react";
import styles from '../styles/pages.module.css';
import { useDispatch, useSelector } from "react-redux";
import { BoardAsyncThunk, BoardSelector } from "../redux/reducers/LeaderBoardReducer";
import { setActive } from "../redux/reducers/SideMenuReducer";
import { Link } from "react-router-dom";

// Define LeaderBoard component
export default function LeaderBoard() {
    // Define state variables
    const [sortedLeaderBoard, setSortedLeaderBoard] = useState([]);

    // Initialize dispatch function
    const dispatch = useDispatch();

    // Fetch leaderboard data on component mount
    useEffect(() => {
        dispatch(BoardAsyncThunk());
    }, [dispatch]);

    // Function to highlight active menu tab
    const handleActive = () => {
        dispatch(setActive('/'));
    };

    // Function to format timestamp to date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0]; // This will give you the date part only
    };

    // Retrieve leaderboard data from Redux store
    const { leaderBoard, loading } = useSelector(BoardSelector);

    // Sort leaderboard data by score
    useEffect(() => {
        const sorted = [...leaderBoard].sort((a, b) => b.score - a.score);
        setSortedLeaderBoard(sorted);
    }, [leaderBoard]);

    // render loading status
    if (loading) {
        return (
            <h1 className='text-center'>loading...</h1>
        )
    }

    // Render the leaderboard component
    return (
        <div id="leaderboard-score-container" className={`w-50 mx-auto px-4 mt-4 ${styles.leaderboardScoreContainer}`}>
            <h1 className="text-center py-3">LeaderBoard</h1>
            {sortedLeaderBoard.length > 0 ? (
                // Render leaderboard if data is available
                sortedLeaderBoard.map((user, index) => (
                    <div key={index} className={`border d-flex flex-column justify-content-around rounded mx-auto mb-4 p-3 ${styles.card}`}>
                        <div className={`d-flex text-center justify-content-between ${styles.leaderCard}`}>
                            <h5>Rank - {index + 1}</h5>
                            <p>attempted on : {formatDate(user.timeStamp)}</p>
                        </div>
                        <div className={`d-flex text-center justify-content-between ${styles.leaderCard}`}>
                            <h5>{user.name}</h5>
                            <h5 >Score : {user.score} / 5</h5>
                        </div>
                    </div>
                ))
            ) : (
                // Render message if no leaderboard data is available
                <div className="d-flex justify-content-center mt-5 align-items-between flex-column p-5">
                    <h2 className="text-center  mt-5">No LeaderBoard Available</h2>
                    <Link to="/" className={`mx-auto ${styles.startBtn}`}>
                        <button onClick={handleActive} className="btn btn-primary">Start Assesment to create</button>
                    </Link>
                </div>
            )}
        </div>
    );
}
