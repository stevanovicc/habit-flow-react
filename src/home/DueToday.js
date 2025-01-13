import React from 'react';
import "./HomePage.css"

const DueToday = (props) =>{
    return(
        <div className='due-today-message'>
                <h2> Habits Due Today:</h2>
                <ul className='due-today-list'>
                    {props.habitsDueToday.map((habit,index) => (
                        <li key={index}>{habit.name}</li>
                    ))}
                </ul>
            </div>
    );
}
export default DueToday;