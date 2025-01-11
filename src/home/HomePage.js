import React from 'react';
import {useEffect,useState} from 'react';
import { getAuth,onAuthStateChanged,signOut } from 'firebase/auth';
import { getFirestore,doc,getDoc,collection,addDoc, getDocs,serverTimestamp, updateDoc } from 'firebase/firestore';
import { useNavigate} from 'react-router-dom';
import "./HomePage.css"



const getCurrentWeek = ( offset = 0) => {
    const today = new Date();
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - today.getDay() + 1 + offset * 7);

    const week = [];

    const getOrdinalSuffix = (day) =>{
        if (day > 3 && day < 21) return 'th';
        switch (day % 10){
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    for (let i = 0; i < 7; i++) {
        const day = new Date(currentMonday);
        day.setDate(currentMonday.getDate() + i);

        const dayName = day.toLocaleDateString('en-US', {weekday: "long"});
        const monthName = day.toLocaleDateString('en-US',{month:"long"});
        const date = day.getDate();
        const ordinialSuffix = getOrdinalSuffix(date);

        week.push({
            name: `${dayName}, ${date}${ordinialSuffix} ${monthName}`,
            rawDate: day,
        });
    }
    return week;
};

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
    const [weekOffset, setWeekOffset] = useState(0);
    const [week, setWeek] = useState(getCurrentWeek(weekOffset));
    const [habits, setHabits] = useState([]);
    const [congratsMessage, setCongratsMessage] = useState("");

    const navigate = useNavigate();



    const handleToggleCompletition = async (habitId, date) => {
        try{
            const habitRef = doc(db,"habits", habitId);
            const habitDoc = await getDoc(habitRef);

            if (habitDoc.exists()) {
                const habitData = habitDoc.data();
                const completedDates = habitData.completedDates || [];

                const dateString = date.toISOString().split("T")[0];

                const isCurrentlyCompleted = completedDates.includes(dateString);

                let updatedDates;
                if (completedDates.includes(dateString)) {
                    updatedDates = completedDates.filter(d => d !== dateString);
                } else {
                    updatedDates = [...completedDates, dateString];
                }
                await updateDoc(habitRef, {completedDates: updatedDates});
                setHabits(prevHabits =>
                    prevHabits.map(habit =>
                        habit.id === habitId
                        ?{...habit, completedDates:updatedDates}
                        : habit
                    )
                );

                if (!isCurrentlyCompleted) {
                    setCongratsMessage("🎉 Congratulations on completing a habit! 🎉");
                    setTimeout(() => setCongratsMessage(""), 3000);
                }
            }else {
                console.error("Habit document doesn't exist");
            }
        } catch (error){
            console.error("Error toggling completiton", error);
        }
    };



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
                createdAt: serverTimestamp(),
                completedDates: [],
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

    const handleNextWeek = () => {
        setWeekOffset(prevOffset => {
            const newOffset = prevOffset + 1;
            console.log("Navigating to next week, new offset:", newOffset);
            setWeek(getCurrentWeek(newOffset));
            return newOffset;
        });
    };
    const handlePreviousWeek = () => {
        setWeekOffset(prevOffset => {
            const newOffset = prevOffset - 1;
            console.log("Navigating to previous week, new offset:" , newOffset);
            setWeek(getCurrentWeek(prevOffset - 1));
            return prevOffset - 1;
        });
    };

    useEffect(() => {

        const fetchHabits = async() => {
            const habitCollection = await getDocs(collection(db, "habits"));
            const habitList = habitCollection.docs.map(doc => ({
              id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                completedDates:doc.data().completedDates || []
        }));
        console.log("Fetched habits:", habitList);
        setHabits(habitList);
     };


        const fetchData = async () => {
            await fetchHabits();
        };
        fetchData();

        const newWeek = getCurrentWeek(weekOffset);
        setWeek(newWeek);

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
    }, [auth,db, weekOffset]);
    return (
    <div className='home-container'>
        <button className='logout-button' onClick={handleLogout}>Logout</button>
        <h1>Welcome to HabitFlow, {userName}!</h1>
        {!showHabitform &&(
        <button onClick={handleAddHabitClick} className='habit-button'>Add Habit</button>
        )}
        {congratsMessage &&( <div className='congrats-message'>{congratsMessage}</div>)}
        {successMessage && <div className='success-message'>{successMessage}</div>}
        {errorMessage && <div className='error-message'>{errorMessage}</div>}

        <div className='week-view'>
            <button onClick={handlePreviousWeek} className='arrow-button'>{"<"}</button>
            {week.map((weekDay, index) =>  {
                const matchingHabits = habits.filter((habit) => {
                    const habitDate = new Date(habit.createdAt);
                    const today = new Date(new Date().getFullYear(), new Date().getMonth(), weekDay.rawDate.getDate());

                    if (today.getTime() < habitDate.getTime() - 1000 * 60 * 60 * 24) {
                        return false;
                    }

                    if (habit.frequency === "everyday"){
                        return true;
                    }else if (habit.frequency === "once-a-week"){
                        return habitDate.getDay() === today.getDay();
                    }else if (habit.frequency === "once-a-month"){
                        return habitDate.getDate() === today.getDate() &&
                               habitDate.getMonth() === today.getMonth();
                    }
                    return false;
                });
                return(
                    <div key={index} className='week-day'>
                        <div className='day'>{weekDay.name}</div>
                        {matchingHabits.length > 0 && (
                            <ul className='habit-list'>
                                {matchingHabits.map((habit, idx) => {
                                    const isCompleted = habit.completedDates?.includes(weekDay.rawDate.toISOString().split("T")[0]);

                                    return(
                                        <li key={idx}>
                                            <label>
                                                <input
                                                    type='checkbox'
                                                    checked={isCompleted}
                                                    onChange={() => handleToggleCompletition(habit.id, weekDay.rawDate)}
                                                />
                                                {habit.name}
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        </div>
                );
            })}
            <button onClick={handleNextWeek} className='arrow-button'>{">"}</button>

        </div>

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