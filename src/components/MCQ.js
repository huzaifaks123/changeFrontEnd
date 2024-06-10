// import required styles modules to style elements
import styles from '../styles/pages.module.css';

// import necessary hooks for state management and side effects
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import actions and selectors from HomePageReducer
import { ScoreAsyncThunk, TopicSelector } from '../redux/reducers/HomePageReducer';

// export MCQ Component
export default function MCQ({ setShowQuestions, setSelectedTopics }) {
    // define necessary state for MCQ component
    const [serial, setSerial] = useState(0);
    const [question, setQuestion] = useState();
    const [index, setIndex] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState([]);

    // get questions from Redux store
    const { questions } = useSelector(TopicSelector);

    const dispatch = useDispatch();

    // load initial question on component mount
    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * (questions.length - 0)) + 0;
        setQuestion(questions[randomNumber]);
        setIndex([randomNumber]);
        setSerial(1);
    }, [dispatch, questions]);

    // function to post score to API
    const postScore = useCallback(async () => {
        try {
            await dispatch(ScoreAsyncThunk(score)).unwrap();
            console.log('post Score successfully');
        } catch (err) {
            console.error('Failed to post data to API:', err);
        }
    }, [dispatch, score]);

    useEffect(() => {
        if (serial >= 5) {
            postScore();
        }
    }, [serial, score, postScore])


    // load next question
    const loadQuestion = () => {
        const randomIndex = getRandomNumber(0, questions.length - 1);
        if (randomIndex !== -1) {
            setQuestion(questions[randomIndex]);
            setSerial(serial + 1);
            setSelectedOption(null);
        }
    };

    // function to handle option change
    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // function to generate a random number and ensure it's unique
    const getRandomNumber = (min, max) => {
        if (serial >= 5) {
            setShowResult(true);
            return -1;
        }
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!index.includes(randomNumber)) {
            setIndex([...index, randomNumber]);
            return randomNumber;
        }
        return getRandomNumber(min, max);
    };

    // function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const currentQuestion = questions[index[index.length - 1]];
        const selectedOptionIndex = parseInt(selectedOption);
        const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.answer);
        const isCorrect = selectedOptionIndex === correctOptionIndex;

        // prepare data for current question
        const questionResult = {
            question: currentQuestion.question,
            options: currentQuestion.options,
            selectedOption: currentQuestion.options[selectedOptionIndex],
            correctOption: currentQuestion.answer,
            isCorrect: isCorrect
        };

        // update result with current question's data
        setResult(prevResult => [...prevResult, questionResult]);

        // update score if the answer is correct
        if (isCorrect) {
            setScore((prev) => prev + 1)
        }
        loadQuestion();
    };

    // function to navigate back to assessment
    const handleHomeView = () => {
        setShowQuestions(false);
        setSelectedTopics([])
    };

    // return MCQ form or result based on showResult state
    return (
        <div id="result-container">
            {!showResult ?
                question && (
                    <div className={`mx-auto mt-5 p-5 rounded ${styles.card}`}>
                        <h4 className=""><span>{serial} . </span>{question.question}</h4>
                        <p>Choose the correct answer from below</p>
                        <form id="mcq-form" onSubmit={handleSubmit}>
                            {question.options.map((option, i) => (
                                <div key={i} className={`mb-3 d-flex align-items-center ${styles.inputElem}`}>
                                    <input type="radio" className="" name="option" id={`option${i}`} value={i} onChange={handleChange} checked={parseInt(selectedOption) === i} required />
                                    <label htmlFor={`option-${i}`} className="ms-3">{option}</label>
                                </div>
                            ))}
                            <div className="text-center">
                                <button type='submit' className={`btn btn-primary mt-4 w-50 ${styles.btn}`}>{serial === questions.length ? "Submit Final" : "Submit & Next"}</button>
                            </div>
                        </form>
                    </div>
                ) :
                <>
                    <h1 className='text-center mb-5'>Your Score : {score}/{serial}</h1>

                    {result.map((res, index) => (
                        <div key={index} className={`mx-auto mt-5 p-5 rounded ${styles.card}`}>
                            <h4 className=""><span>{index + 1} . </span>{res.question}</h4>
                            <form id="mcq-form">
                                {res.options.map((option, i) => (
                                    <div key={i * 5 - index} className={`mb-3 p-1 rounded d-flex ${option === res.selectedOption ? option === res.correctOption ? styles.success : styles.failed : option === res.correctOption ? styles.success : ""} align-items-center ${styles.inputElem}`}>
                                        <input type="radio" className="" name="option" id={`option${i}`} value={i} onChange={handleChange} />
                                        <label htmlFor={`option-${i}`} className="ms-3">{option}</label>
                                    </div>
                                ))}
                            </form>
                            <p className={res.isCorrect ? styles.correct : styles.wrong}>{res.isCorrect ? "Correct" : "Wrong"}</p>
                        </div>

                    ))}
                    <div className="text-center">
                        <button type='submit' onClick={handleHomeView} className={`btn btn-primary my-5 w-50 ${styles.btn}`}>Back to Assessment</button>
                    </div>

                </>
            }
        </div>
    );
}


