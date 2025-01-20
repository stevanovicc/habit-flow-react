import React from 'react';
import HabitList from "./HabitList";
import "./HomePage.css";

const Calendar = (props) => {

    const formattedStartDate = new Intl.DateTimeFormat('en-US', {
        month:'long',
        day: 'numeric'
    }).format(new Date(props.week[0]?.rawDate));

    return(
        <div className='calendar-container'>
        <div className='header'>
        <button onClick={props.handlePreviousWeek} className='arrow-button'>{"<"}</button>
        <div className='title'>Week of {formattedStartDate}</div>
        <button onClick={props.handleNextWeek} className='arrow-button'>{">"}</button>
        </div>
        <div className='calendar-week'>
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
                <div key={index} className='calendar-day'>
                    <div className='day-name'>
                       <div>{weekDay.name}</div>
                        <div>{weekDay.date}</div>
                    </div>
                    {matchingHabits.length > 0 && (
                        <HabitList handleToggleCompletition={props.handleToggleCompletition} matchingHabits={matchingHabits} weekDay={weekDay}/>
                    )}
                    </div>
            );
        })}
        </div>

    </div>
    )
}
export default Calendar;