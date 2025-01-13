import React from "react";
import "./HomePage.css"

const HabitList = (props) => {
    return(
        <ul className='habit-list'>
        {props.matchingHabits.map((habit, idx) => {
            const isCompleted = habit.completedDates?.includes(props.weekDay.rawDate.toISOString().split("T")[0]);

            return(
                <li key={idx}>
                    <label>
                        <input
                            type='checkbox'
                            checked={isCompleted}
                            onChange={() => props.handleToggleCompletition(habit.id, props.weekDay.rawDate)}
                        />
                        {habit.name}
                    </label>
                </li>
            );
        })}
    </ul>
    )
}
export default HabitList;