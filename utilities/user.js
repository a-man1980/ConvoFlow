const users =[];

// Joining new user into chat
function userJoin(id,username,room){
    const user={id,username,room};
    users.push(user);
    return user;
}

// Getting current user
function getCurrUser(id){
    return users.find(user=>user.id===id);
}

// users leave a chat
function userLeave(id){
    const index=users.findIndex(user=>user.id===id);

    if(index!==-1){
        return users.splice(index,1)[0];
    }
}

// Getting room users
function getRoomUsers(room){
    return users.filter(user=>user.room===room);
}

module.exports ={
    userJoin,
    getCurrUser,
    userLeave,
    getRoomUsers
};

