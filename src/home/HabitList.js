import React from "react";
import "./HomePage.css"

const HabitList = (props) => {
    return(
        <ul className='habit-list'>
        {props.matchingHabits.map((habit, idx) => {
            const isCompleted = habit.completedDates?.includes(props.weekDay.rawDate.toISOString().split("T")[0]);

            return(
                <li key={idx}>
                    <div className="habit-list-div">
                    <input className="habit-checkbox" type='checkbox' checked={isCompleted} onChange={() => props.handleToggleCompletition(habit.id, props.weekDay.rawDate)}/>
                    <label className="habit-label">{habit.name}</label>
                    <button
                    onClick={() => props.handleRemoveHabit(habit.id)}
                    className="remove-habit-button"
                    title="Remove Habit"
                    >
                         ❌
                    </button>
                    </div>
                </li>
            );
        })}
    </ul>
    )
}
export default HabitList;