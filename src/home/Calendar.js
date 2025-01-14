import React from 'react';
import HabitList from "./HabitList";
import "./HomePage.css";

const calculateOverallCurrentStreak = (habits, week) => {
    if (habits.length === 0) return 0;

    let streak = 0;

 
    for (let i = week.length - 1; i >= 0; i--) {
        const formattedDate = week[i].rawDate.toISOString().split("T")[0];
        const allHabitsCompleted = habits.every(habit => 
            habit.completedDates?.includes(formattedDate)
        );

        if (allHabitsCompleted) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

const calculateOverallLongestStreak = (habits) => {
    return Math.max(...habits.map((habit) => habit.longestStreak || 0), 0);
};


const Calendar = (props) => {

    const overallCurrentStreak = calculateOverallCurrentStreak(props.habits, props.week);
    const overallLongestStreak = calculateOverallLongestStreak(props.habits);

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
        <div className="streak-message">
            <div>🔥 Current Streak: {overallCurrentStreak} days</div>
             <div>🏆 Longest Streak: {overallLongestStreak} days</div>
        </div>

    </div>
    )
}
export default Calendar;