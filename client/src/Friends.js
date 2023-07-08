import { useState } from 'react'

const Friends = ({ user }) => {
    // let allFriends = [...user.friends, ...user.inverse_friends]
    // let friendIds = allFriends.map((friend) => { return friend.id })
    const [friends, setFriends] = useState([...user.friends, ...user.inverse_friends]);
    const [friendIds, setFriendIds] = useState(friends.map(friend => friend.id));
    const [friendInput, setFriendInput] = useState("");

    const onSubmitHandler = (e) => {
        e.preventDefault()
        const friendId = parseInt(friendInput);
        if (friendId === user.id) {
            alert("Can't be friends with yourself!")
        } else if (friendIds.includes(friendId)) {
            alert("Already friends with that user!")
        } else if (isNaN(friendId)) {
            alert("Friend Ids can only be numbers.")
        } else {
            fetch("/friendships", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user.id, friend_id: friendId }),
            }).then((r) => {
                if (r.ok) {
                    r.json().then((success) => {
                        console.log(success);
                        alert("You are now friends with that user!");
                        setFriends(prevFriends => [...prevFriends, success.friend]);
                        setFriendIds(prevIds => [...prevIds, success.friend.id]);
                        setFriendInput("");
                    });
                } else {
                    r.json().then((err) => alert(err.errors));
                }
            });
        }
    }


    function renderFriends() {
        console.log(friends)
        if (friends.length !== 0) {
            return friends.map(friend => {
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
                <div style={{ fontWeight: "bold", fontSize: "x-large" }}>
                    Friends
                </div>
                {renderFriends()}

            </div>
            <div>
                <form onSubmit={onSubmitHandler}>
                    <h1>Add Friend</h1>
                    <input type="text" placeholder="Enter Your Friend's ID" value={friendInput} onChange={(e) => setFriendInput(e.target.value)} required></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Friends;
