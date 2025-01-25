import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase/firebase";
import "./HomePage.css"


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
                    createdBy: props.user.uid,
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

        if(!props.isOpen) return null;


    return(
        <div className="habit-div" onClick={props.handleCancel}>
        <div className="habit-form"
        onClick={(e) =>e.stopPropagation()}>
                <h2 className='habit-form-h2'>Add New Habit</h2>
                <label className='habit-form-label'>
                    Habit Name
                    <input
                    type='text'
                    value={habitName}
                    placeholder="Enter habit name"
                    onChange={(e) => setHabitName(e.target.value)}
                    className='habit-input'
                    />
                </label>
                <br/>
                <label className='habit-form-label'>
                    Habit Description
                    <input
                    type='text'
                    value={habitDescription}
                    placeholder="Enter habit description"
                    onChange={(e) => setHabitDescription(e.target.value)}
                    className='habit-input'
                    />
                </label>
                <br/>
                <label className='habit-form-label'>
                    Habit Frequency
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
                <div className="button-group">
                <button onClick={props.handleCancel} className='habit-button-form'>Cancel</button>
                <button onClick={handleSubmit} className='habit-button-form'>Add</button>
                </div>
            </div>
            </div>
    );
    
} 

export default HabitForm;

