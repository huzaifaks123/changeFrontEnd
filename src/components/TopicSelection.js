// Import necessary styles
import styles from '../styles/pages.module.css';

// Import hooks for state management and side effects
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// Import actions and selectors from HomePageReducer
import { QuestionsAsyncThunk, TopicSelector, TopicsAsyncThunk } from '../redux/reducers/HomePageReducer';

// Import MCQ component
import MCQ from './MCQ';

// Export TopicSelection Component
export default function TopicSelection() {
    // Define necessary state for TopicSelection component
    const [showQuestion, setShowQuestions] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);

    const dispatch = useDispatch();

    // Fetch topics when component mounts
    useEffect(() => {
        dispatch(TopicsAsyncThunk());
    }, [dispatch]);

    // Get topics from Redux store
    const { topics } = useSelector(TopicSelector);

    // Function to handle checkbox change
    const handleChange = (event) => {
        const { value, checked } = event.target;
        setSelectedTopics((prevState) => 
            checked ? [...prevState, value] : prevState.filter((topic) => topic !== value)
        );
    };

    // Function to handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(QuestionsAsyncThunk(selectedTopics)).unwrap();
            setShowQuestions(true);
            console.log('Fetched questions successfully');
        } catch (err) {
            console.error('Failed to fetch questions from API:', err);
        }
    };

    // Return Topic Selection form or MCQ component based on showQuestion state
    return (
        !showQuestion ? (
            <>
                <h1 className='text-center mb-5'>Select topics to Start</h1>
                <form id="topic-form" className='d-flex flex-wrap justify-content-center container-fluid' onSubmit={handleFormSubmit}>
                    {Array.isArray(topics) && topics.map((item, index) => (
                        <div key={index} className={`mb-3 col-6 d-flex align-items-center justify-content-between ${styles.inputElem}`}>
                            <input type="checkbox" value={item} className="ms-5" name="email" id="email" onChange={handleChange} />
                            <span className="">{item}</span>
                        </div>
                    ))}
                    <div className="text-end">
                        <button type='submit' className={`btn btn-primary mt-4 ${styles.btn}`}>Submit</button>
                    </div>
                </form>
            </>
        ) : (
            <MCQ setShowQuestions={setShowQuestions} setSelectedTopics={setSelectedTopics} />
        )
    );
}
