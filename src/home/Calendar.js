import React from 'react';
import HabitList from "./HabitList";
import "./HomePage.css";

const calculateCurrentStreak = (habits, date) => {
    
    const formattedDate = date.toISOString().split("T")[0];

    const completedHabits = habits.filter((habit) =>
        habit.completedDates?.includes(formattedDate)
    );

    return completedHabits.length === habits.length ? 1 : 0;
};

const calculateLongestStreak = (habits) => {
    return Math.max(...habits.map((habit) => habit.longestStreak || 0), 0);
};

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

            const currentStreak = calculateCurrentStreak(matchingHabits, weekDay.rawDate);
            const longestStreak = calculateLongestStreak(matchingHabits);

            return(
                <div key={index} className='week-day'>
                    <div className='day'>{weekDay.name}</div>
                    {matchingHabits.length > 0 && (
                        <>
                        <div>
                            <div>🔥 Current Streak: {currentStreak} days</div>
                            <div>🏆 Longest Streak: {longestStreak} days</div>
                        </div>
                        <HabitList handleToggleCompletition={props.handleToggleCompletition} matchingHabits={matchingHabits} weekDay={weekDay}/>
                        </>
                    )}
                    </div>
            );
        })}
        <button onClick={props.handleNextWeek} className='arrow-button'>{">"}</button>

    </div>
    )
}
export default Calendar;