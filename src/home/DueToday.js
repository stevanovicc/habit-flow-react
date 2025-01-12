import React from 'react';

const DueToday = (props) =>{
    return(
        <div className='due-today-message'>
                <h2> Habits Due Today:</h2>
                <ul className='due-today-list'>
                    {props.habitsDueToday.map((habit,index) => (
                        <li key={index}>{habit.name}</li>
                    ))}
                </ul>
                <button
                    onClick={() => props.setShowDueTodayMessage(false)}
                    className='close-messsage-button'
                >
                    Close
                </button>
            </div>
    );
}
export default DueToday;