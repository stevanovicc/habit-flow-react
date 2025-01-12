import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase/firebase";


const HabitForm = (props) => {
    const [habitName,setHabitName] = useState("");
    const [habitDescription, setHabitDescription] = useState("");
    const [habitFrequency, setHabitFrequency] = useState("everyday");



    const handleSubmit = async () => {
            try{
                const habitData = {
                    name: habitName,
                    description: habitDescription,
                    frequency: habitFrequency,
                    createdAt: serverTimestamp(),
                    completedDates: [],
                };
    
                await addDoc(collection(db,"habits"), habitData);
                setHabitName("");
                setHabitDescription("");
                setHabitFrequency("everyday");
                props.handleCancel();
    
                props.setSuccessMessage("Habit added successfully!");
                setTimeout(() => props.setSuccessMessage(""), 3000);
            }catch(error){
                props.setErrorMessage("Failed to add habit. Please try again.");
                setTimeout(() => props.setErrorMessage(""), 3000);
                console.error("Error adding habit: ", error);
            }
    
        };


    return(
        <div className="habit-form">
                <h2 className='habit-h2'>Add a New Habit</h2>
                <label className='habit-label'>
                    Habit Name:
                    <input
                    type='text'
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    className='habit-input'
                    />
                </label>
                <br/>
                <label className='habit-label'>
                    Description:
                    <input
                    type='text'
                    value={habitDescription}
                    onChange={(e) => setHabitDescription(e.target.value)}
                    className='habit-input'
                    />
                </label>
                <br/>
                <label className='habit-label'>
                    Frequency
                    <select
                    value={habitFrequency}
                    onChange={(e) => setHabitFrequency(e.target.value)}
                    className='habit-select'
                    >
                    <option value="everyday">Everyday</option> {/*TODO try with enum */}
                    <option value="once-a-week">Once a week</option>
                    <option value="once-a-month">Once a month</option>
                    </select>
                </label>
                <br/>
                <button onClick={handleSubmit} className='habit-button-form'>Save</button>
                <button onClick={props.handleCancel} className='habit-button-form'>Cancel</button>
            </div>
    );
    
} 

export default HabitForm;

