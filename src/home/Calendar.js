import React, { useEffect, useState } from 'react';
import HabitList from "./HabitList";
import "./HomePage.css";
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Calendar = (props) => {
    const [isMobile,setIsMobile] = useState(false);
    const [currentDayIndex,setCurrentDayIndex] = useState(0);

    const formattedStartDate = new Intl.DateTimeFormat('en-US', {
        month:'long',
        day: 'numeric'
    }).format(new Date(props.week[0]?.rawDate));

const getMatchingHabits = (weekDay) => {
    return props.habits.filter((habit) => {
        const habitCreationDate = new Date(habit.createdAt);
        const currentDate = new Date(weekDay.rawDate);

        if (currentDate < habitCreationDate) {
            return false;
        }   

        if (habit.frequency === "everyday"){
            return true;
        }else if (habit.frequency === "once-a-week"){
            return habitCreationDate.getDay() === currentDate.getDay();
        }else if (habit.frequency === "once-a-month"){
            return (
                habitCreationDate.getDate() === currentDate.getDate() &&
                habitCreationDate.getMonth() === currentDate.getMonth()
            );
        }
        return false;
    });
}

const handleRemoveHabit = async(habitId,props) => {
    try{
        const habitRef = doc(db,"habits",habitId);
        await deleteDoc(habitRef);

        props.setHabits((prevHabits) => prevHabits.filter(habit => habit.id !== habitId));

        props.setSuccessMessage("Habit Removed succesfully");
        setTimeout(() => props.setSuccessMessage(""), 3000);
    }catch(error){
        console.error("Error removing habit:", error);
        props.setErrorMessage("Failed to remove habit.");
    }
};

const handleNextMobileDay = () => {
    const newIndex = currentDayIndex + 1;
    if(newIndex > 6){
        props.handleNextWeek();
        setCurrentDayIndex(0);
    } else{
        setCurrentDayIndex(newIndex);
    }
}
const handlePreviousMobileDay = () =>{
    const newIndex = currentDayIndex - 1;
    if(newIndex < 0){
        props.handlePreviousWeek();
        setCurrentDayIndex(6);
    } else{
        setCurrentDayIndex(newIndex);
    }
}

const calendarDay = (weekDay, index,matchingHabits) => {
    return (
        <div key={index} className='calendar-day'>
        <div className="day-name">
            <div className='day-header'>
                <div className="day-dot"></div>
                <div className='day-title'>{weekDay.name}</div>
            </div>
            <div className='day-date'>{weekDay.date}</div>
        </div>
{matchingHabits.length > 0 && (
    <div className='habit-list-calendar'>
    <HabitList handleToggleCompletition={props.handleToggleCompletition} matchingHabits={matchingHabits} weekDay={weekDay} handleRemoveHabit={handleRemoveHabit}/>
    </div>
)}
</div>
    )
}

useEffect(
    () => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return() =>{
            window.removeEventListener("resize", handleResize);
        }
    },
    []
)
    return(
        <div className='calendar-container'>
        <div className='header-calendar'>
        <button onClick={isMobile?handlePreviousMobileDay:props.handlePreviousWeek} className='arrow-button'>{"<"}</button>
        <div className='title'>{
            isMobile ?`Day of ${props.week[currentDayIndex]?.name}`:
            `Week of ${formattedStartDate}`}
            </div>
        <button onClick={isMobile?handleNextMobileDay:props.handleNextWeek} className='arrow-button'>{">"}</button>
        </div>
        <div className='calendar-week'>
        {
        isMobile ?(
            () => {
                const weekDay = props.week[currentDayIndex];
                const matchingHabits = getMatchingHabits(weekDay);
                return calendarDay(weekDay,currentDayIndex, matchingHabits); 
            }
        ) ()    
        :props.week.map((weekDay, index) =>  {
            const matchingHabits = getMatchingHabits(weekDay);
            return calendarDay(weekDay,index,matchingHabits);
        })
        }
        </div>

    </div>
    )
}
export default Calendar;