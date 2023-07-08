import { useState, useEffect } from 'react';
import SignUpForm from "./SignUpForm"
function Login({ onLogin }) {
    const [showLogin, setShowLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);



    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }).then((r) => {
            setIsLoading(false);
            if (r.ok) {
                r.json().then((user) => onLogin(user));
            } else {
                r.json().then((err) => {
                    let allErrors = [];
                    if ("errors" in err) {
                        allErrors = [...err.errors]
                    }
                    if ("error" in err) {
                        allErrors.push(err.error)
                    }
                    setErrors(allErrors)
                });
            }
        });
    }

    return (
        <div className="body">
            <div style={{ fontWeight: "bold", fontSize: "xx-large" }}>Match 3 Game</div>
            <div className={`container ${showLogin ? "" : "right-panel-active"}`} id="container">
                <div className={`form-container ${showLogin ? 'sign-in-container' : 'sign-up-container'}`}>
                    {showLogin ? (
                        <>
                            <form onSubmit={handleSubmit}>
                                <h1>Sign In</h1>
                                <div>
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        autoComplete="off"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <button variant="fill" color="primary" type="submit">
                                        {isLoading ? "Loading..." : "Sign In"}
                                    </button>
                                </div>
                                <div>
                                    {errors.map((err) => (
                                        <div>{err}</div>
                                    ))}
                                </div>
                            </form>
                            <hr />

                        </>
                    ) : (
                        <>
                            <SignUpForm onLogin={onLogin} />
                            <hr />

                        </>
                    )}
                </div>
                <div className="overlay-container">
                    <div className={`overlay ${showLogin ? 'overlay-right' : 'overlay-left'}`}>
                        <div className="overlay-panel">
                            {showLogin ? (
                                <>
                                    <h1>Hello, Friend!</h1>
                                    <p>Sign up now!</p>
                                    <button className={`ghost `} id="signIn" onClick={() => setShowLogin(false)}>Sign Up</button>
                                </>
                            ) : (
                                <>
                                    <h1>Welcome Back!</h1>
                                    <p>Please login!</p>
                                    <button className={`ghost `} id="signUp" onClick={() => setShowLogin(true)}>Sign In</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
