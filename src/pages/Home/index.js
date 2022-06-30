import { message } from "antd";
import React, { useState, useEffect } from "react";
import * as S from "./styles";

const Home = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (localStorage.getItem("varillaadmin") === "loggedin") {
            props.history.push("/dashboard");
        }
    }, [props.history]);

    const login = () => {
        if (username === "admin" && password === "admin") {
            localStorage.setItem("varillaadmin", "loggedin");
            props.history.push("/dashboard");
        } else if (username === "agent" && password === "agent") {
            localStorage.setItem("varillaadmin", "loggedin");
            props.history.push("/agentdashboard");
        } else {
            message.error("Username or Password wrong !");
        }
    };

    return (
        <>
            <S.Container>
                <h1>Welcome to Varilla Admin Panel</h1>

                <br />

                <S.LoginInput
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />

                <br />
                <br />

                <S.LoginInput
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <br />
                <br />

                <S.LoginButton onClick={login}>Login</S.LoginButton>
            </S.Container>
        </>
    );
};

export default Home;
