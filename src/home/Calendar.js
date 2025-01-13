import React from 'react';
import HabitList from "./HabitList";
import "./HomePage.css";


const Calendar = (props) => {
    return(
        <div className='week-view'>
        <button onClick={props.handlePreviousWeek} className='arrow-button'>{"<"}</button>
        {props.week.map((weekDay, index) =>  {
            const matchingHabits = props.habits.filter((habit) => {
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
            return(
                <div key={index} className='week-day'>
                    <div className='day'>{weekDay.name}</div>
                    {matchingHabits.length > 0 && (
                        <HabitList handleToggleCompletition={props.handleToggleCompletition} matchingHabits={matchingHabits} weekDay={weekDay}/>
                    )}
                    </div>
            );
        })}
        <button onClick={props.handleNextWeek} className='arrow-button'>{">"}</button>

    </div>
    )
}
export default Calendar;