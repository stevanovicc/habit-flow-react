import React from 'react';
import {useEffect,useState} from 'react';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { getFirestore,doc,getDoc } from 'firebase/firestore';

const HomePage = () => {
    const [userName,setUserName] = useState('');
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserData = async (user) =>{
            try{
                const userDoc= await getDoc(doc(db,"users", user.uid));
                if(userDoc.exists()){
                    const data = userDoc.data();
                    setUserName(`${data.firstName} ${data.lastName}`);
                }
            } catch(error){
                console.error("Error fetching user data", error);
            }
        };
        const unsubscribe = onAuthStateChanged(auth, (user) =>{
            if (user){
                fetchUserData(user);
            }
        });
        return unsubscribe;
    }, [auth,db]);
    return <h1>Welcome to HabitFlow, {userName}!</h1>
}
export default HomePage;