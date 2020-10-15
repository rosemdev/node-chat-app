const users = [];

//addUser
//removeUser
//getUser
//getUsersInRoom


const removeUser = (id) => {
    const index =  users.findIndex((user, index)=> {
        return user.id === id;
    });

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const addUser = ({id, username, room}) => {
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //Check for existing user
    const existingUser = users.find((user, index)=> {
        return user.room === room && user.username === username;
    });

    //Validate username
    if(existingUser) {
        return {
            error: 'User is in use'
        }
    }

    //Store user
    const user = {id, username, room};
    users.push(user);

    return {
        user
    }
} 


const getUser = (id) => {
    const user = users.find((user, index)=> {
        return user.id === id;
    });

    if(!user) {
        return {
            error: 'There is no such user. Please re-connect.'
        }
    }

    return {
        user
    };
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();

    const usersInRoom = users.filter((user, index)=> {
        return user.room === room;
    });

    return usersInRoom;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}



