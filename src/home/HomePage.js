import React from 'react';
import {useEffect,useState} from 'react';
import { getAuth,onAuthStateChanged,signOut } from 'firebase/auth';
import { getFirestore,doc,getDoc,collection,addDoc } from 'firebase/firestore';
import { useNavigate} from 'react-router-dom';
import "./HomePage.css"

const HomePage = () => {
    const [userName,setUserName] = useState('');
    const auth = getAuth();
    const db = getFirestore();
    const [showHabitform, setShowHabitForm] = useState(false);
    const [habitName,setHabitName] = useState("");
    const [habitDescription, setHabitDescription] = useState("");
    const [habitFrequency, setHabitFrequency] = useState("everyday");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
        .then(() => {
            alert("You have been logged out successfully!");
            navigate("/");
        })
        .catch((error) => {
            console.error("Logout failed.", error);
        });
    };

    const handleAddHabitClick = () => {
        setShowHabitForm(true);
    }

    const handleSubmit = async () => {
        try{
            const habitData = {
                name: habitName,
                description: habitDescription,
                frequency: habitFrequency,
            };

            await addDoc(collection(db,"habits"), habitData);
            setHabitName("");
            setHabitDescription("");
            setHabitFrequency("everyday");
            setShowHabitForm(false);

            setSuccessMessage("Habit added successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        }catch(error){
            setErrorMessage("Failed to add habit. Please try again.");
            setTimeout(() => setErrorMessage(""), 3000);
            console.error("Error adding habit: ", error);
        }

    };

    const handleCancel = () => {
        setShowHabitForm(false);
    }

    useEffect(() => {
        const fetchUserData = async (user) =>{
            try{
                const userDoc= await getDoc(doc(db,"users", user.uid));
                if(userDoc.exists()){
                    const data = userDoc.data();
                    setUserName(`${data.firstName} ${data.lastName}`);
                }
            } catch(error){
                console.error("Error fetching user data", error);
            }
        };
        const unsubscribe = onAuthStateChanged(auth, (user) =>{
            if (user){
                fetchUserData(user);
            }
        });
        return unsubscribe;
    }, [auth,db]);
    return (
    <div className='home-container'>
        <button className='logout-button' onClick={handleLogout}>Logout</button>
        <h1>Welcome to HabitFlow, {userName}!</h1>
        {!showHabitform &&(
        <button onClick={handleAddHabitClick} className='habit-button'>Add Habit</button>
        )}
        {successMessage && <div className='success-message'>{successMessage}</div>}
        {errorMessage && <div className='error-message'>{errorMessage}</div>}

        {showHabitform &&(
            <div className="habit-form">
                <h2 className='habit-h2'>Add a New Habit</h2>
                <label className='habit-label'>
                    Habit Name:
                    <input
                    type='text'
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    className='habit-input'
                    />
                </label>
                <br/>
                <label className='habit-label'>
                    Description:
                    <input
                    type='text'
                    value={habitDescription}
                    onChange={(e) => setHabitDescription(e.target.value)}
                    className='habit-input'
                    />
                </label>
                <br/>
                <label className='habit-label'>
                    Frequency
                    <select
                    value={habitFrequency}
                    onChange={(e) => setHabitFrequency(e.target.value)}
                    className='habit-select'
                    >
                    <option value="everyday">Everyday</option> {/*TODO try with enum */}
                    <option value="once-a-week">Once a week</option>
                    <option value="once-a-month">Once a month</option>
                    </select>
                </label>
                <br/>
                <button onClick={handleSubmit} className='habit-button-form'>Save</button>
                <button onClick={handleCancel} className='habit-button-form'>Cancel</button>
            </div>
        )}
    </div>
    );
};
export default HomePage;