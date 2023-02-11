import { useEffect, useState } from 'react'

const Friends = ({ user }) => {
    let allFriends = [...user.friends, ...user.inverse_friends]
    let friendIds = allFriends.map((friend) => { return friend.id })


    const onSubmitHandler = (e) => {
        e.preventDefault()

        if (parseInt(e.target[0].value) === user.id) {
            alert("Can't be friends with yourself!")
        } else if (friendIds.includes(parseInt(e.target[0].value)) === true) {
            alert("Already friends with that user!")
        } else if (isNaN(e.target[0].value)) {
            alert("Friend Ids can only be numbers.")
        } else {
            fetch("/friendships", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user.id, friend_id: e.target[0].value }),
            }).then((r) => {
                if (r.ok) {
                    r.json().then((success) => alert("You are now friends with that user!"));
                } else {
                    r.json().then((err) => alert(err.errors));
                }
            });
        }
    }


    function renderFriends() {

        if (allFriends.length !== 0) {
            return allFriends.map(friend => {
                return <div>{friend.username}</div>
            })
        } else {
            return <div>No friends yet.</div>
        }

    }


    return (
        <div>
            Your Friend ID: {user.id}
            <div className="friends">

                Friends
                {renderFriends()}

            </div>
            <div>
                <form onSubmit={onSubmitHandler}>
                    <h1>Add Friend</h1>
                    <input type="text" placeholder="Enter Your Friend's ID" required></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Friends;
