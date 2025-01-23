import React from 'react';
import {useEffect,useState} from 'react';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { getFirestore,doc,getDoc,collection, getDocs, updateDoc } from 'firebase/firestore';
import "./HomePage.css";
import "./HabitForm";
import HabitForm from './HabitForm';
import DueToday from "./DueToday";
import Calendar from "./Calendar";
import Header from "../components/Header";
import { ReactComponent as Plus} from "../components/assets/plus.svg";



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
    const [showHabitform] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [week, setWeek] = useState(getCurrentWeek(weekOffset));
    const [habits, setHabits] = useState([]);
    const [congratsMessage, setCongratsMessage] = useState("");
    const [habitsDueToday, setHabitsDueToday] = useState([]);
    const [showDueTodayMessage, setShowDueTodayMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

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

                if (isCurrentlyCompleted) {
                    updatedDates = completedDates.filter((d) => d !== dateString);
                } else {
                    updatedDates = [...completedDates, dateString];
                }
                
                const sortedDates = [...updatedDates].sort();

                const calculateStreak = (dates) => {
                    let currentStreak = 0;
                    let longestStreak = habitData.longestStreak || 0;

                    const sortedDates = dates.sort((a,b) => new Date(a) - new Date(b));

                    const todayString = new Date().toISOString().split("T")[0];

                    let streakIncludesToday = false;
                    for (let i = sortedDates.length - 1; i >= 0; i--){
                        const currentDate = new Date(sortedDates[i]);
                        const previousDate = new Date(sortedDates[i - 1]);

                        if (sortedDates[i] === todayString){
                            streakIncludesToday = true;
                        }

                        if (i === 0 || currentDate - previousDate > 24 * 60 * 60 * 1000){
                            currentStreak++
                            break;
                        }

                        currentStreak++;
                    }

                    if(!streakIncludesToday){
                        currentStreak = 0;
                    }

                    longestStreak = Math.max(longestStreak, currentStreak);
                    return {currentStreak, longestStreak};
                };

                const { currentStreak,longestStreak } = calculateStreak(sortedDates);

                await updateDoc(habitRef, {
                    completedDates: updatedDates,
                    currentStreak: currentStreak,
                    longestStreak: longestStreak,
                });

                setHabits((prevHabits) =>
                        prevHabits.map((habit) => 
                            habit.id === habitId
                                    ? { ...habit, completedDates: updatedDates, currentStreak, longestStreak }
                                      :habit
                            )
                        );

                if (currentStreak === 3){
                    setCongratsMessage("You've hit a 3 day-streak! Keep going!");
                } else if (currentStreak > 3 ){
                    setCongratsMessage(`You are on a ${currentStreak}-day streak!`);
                } else if(!isCurrentlyCompleted){
                    setCongratsMessage("Congratulations on completing a habit!");
                }
                setTimeout(() => setCongratsMessage(""), 3000);
            } else {
                console.error("Habit document doesn't exist.");
            }
        } catch(error){
            console.error("Error toggling completion", error);
        }
    };

    const [userStreak, setUserStreak] = useState({
        currentStreak: 0,
        longestStreak: 0,
    });

    useEffect(() => {
        const calculateUserStreak = () => {
            let totalCurrentStreak = 0;
            let totalLongestStreak = 0;

            habits.forEach((habit) => {
                if(habit.currentStreak) {
                    totalCurrentStreak = Math.max(totalCurrentStreak, habit.currentStreak);
                }
                if (habit.longestStreak) {
                    totalLongestStreak = Math.max(totalLongestStreak, habit.longestStreak);
                }
            });

            setUserStreak({
                currentStreak: totalCurrentStreak,
                longestStreak: totalLongestStreak,
            });
        };
        if (habits.length > 0) {
            calculateUserStreak();
        }
    }, [habits]);

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

        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        const dueToday = habits.filter((habit) => {
            const habitDate = new Date(habit.createdAt);

            if (habit.frequency === "everyday"){
                return true;
            } else if (habit.frequency === "once-a-week"){
                return habitDate.getDay() === today.getDay();
            } else if (habit.frequency === "once-a-month"){
                return habitDate.getDate() === today.getDate();
            }
            return false;
        });

        const incompleteHabits = dueToday.filter(
            (habit) => !habit.completedDates.includes(todayString)
        );

        setHabitsDueToday(incompleteHabits);

        if (incompleteHabits.length > 0){
            setShowDueTodayMessage(true);
        }

        const fetchHabits = async() => {
            const habitCollection = await getDocs(collection(db, "habits"));
            const habitList = habitCollection.docs.map((doc) => ({
              id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
                completedDates:doc.data().completedDates || [],
                currentStreak: doc.data().currentStreak || 0,
                longestStreak: doc.data().longestStreak || 0,
        }));
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
                    setUserName(`${data.firstName}`);
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
    }, [auth,db, weekOffset, habits]);
    return (
    <div className='home-page'>
    <Header/>
    <div className='home-container'>
        <h1 className='home-h1'>Hello, {userName}</h1>
        {!showHabitform &&(
        <button onClick={() =>{console.log("Button Clicked!");
            setIsOpen(true);
        }} className='habit-button'><Plus className='plus'/>Add a new habit</button>
        )}
        {congratsMessage &&( <div className='congrats-message'>{congratsMessage}</div>)}
        {successMessage && <div className='success-message'>{successMessage}</div>}
        {errorMessage && <div className='error-message'>{errorMessage}</div>}

        <div className='streak-container'>
            <p className='streak-message'>
                🔥 Current Streak: {userStreak.currentStreak} days
            </p>
            <p className='streak-message'>
                🏆 Longest Streak: {userStreak.longestStreak} days
            </p>
        </div>

        <Calendar handlePreviousWeek={handlePreviousWeek} handleNextWeek={handleNextWeek} week={week} habits={habits} handleToggleCompletition={handleToggleCompletition}></Calendar>
        {showDueTodayMessage && (
            <DueToday setShowDueTodayMessage={setShowDueTodayMessage} habitsDueToday={habitsDueToday}/>
        )}

        {isOpen &&(
            <>
            <div className='overlay' onClick={() => setIsOpen(false)}></div>
            <HabitForm isOpen={isOpen} handleCancel={() => setIsOpen(false)} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
            </>
        )}
    </div>
    </div>
    );
};
export default HomePage;