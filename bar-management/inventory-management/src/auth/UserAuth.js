import { useState } from 'react';

function UserAuth() {
    const getUser = () => {
        const session = sessionStorage.getItem('user');
        if ( session !== undefined || session !== 'undefined' ) {
            const userInfo = JSON.parse(session);
            console.log("Session GET User: ", userInfo)
            return userInfo;
        } else {
            return null;
        }
    }
    
    const [user, setUser] = useState(getUser());
    
    const saveUser = userInfo => {
        if ( userInfo ) {
            sessionStorage.setItem('user', JSON.stringify(userInfo));
            console.log("Session SET User: ", userInfo)
            setUser(userInfo)
        } else {
            console.error("Error setting up user. Userinfo: ", userInfo)
        }
    }

    const removeUser = () => {
        sessionStorage.removeItem('user');
        console.log("Session REMOVE User");
        setUser(null);
    }

    return {
        setUser: saveUser,
        logout: removeUser,
        user
    }
}

export default UserAuth;