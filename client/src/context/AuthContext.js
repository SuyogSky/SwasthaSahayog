import { createContext, useState, useEffect } from "react";
// import jwtDecode from "jwt-decode";
import { jwtDecode } from 'jwt-decode';
import { useHistory } from "react-router-dom";
import ip from "../ip";
import Loading from "../views/Loading/Loading";
const swal = require('sweetalert2')

const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );


    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
            : null
    );

    const [loading, setLoading] = useState(true);

    const history = useHistory();

    const loginUser = async (email, password) => {
        const response = await fetch(`${ip}/api/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })
        const data = await response.json()
        console.log(data);

        if (response.status === 200) {
            console.log("Logged In");
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            localStorage.setItem("token", data.access)
            localStorage.setItem("currentUser", email)
            history.push("/")
            swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            })

        } else {
            console.log(response.status);
            console.log("there was a server issue");
            swal.fire({
                title: "Username or passowrd does not exists",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            })
        }
    }

    const registerUser = async (email, username, phone, address, password, password2) => {
        try {
            const response = await fetch(`${ip}/api/register/client`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    phone,
                    address,
                    password,
                    password2,
                }),
            });

            if (response.status === 201) {
                history.push("/login");
                swal.fire({
                    title: "Registration Successful, Login Now",
                    icon: "success",
                    toast: true,
                    timer: 6000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            } else {
                const errorData = await response.json(); // Parse error response
                console.log(response.status);
                console.log("Server error:", errorData);
                swal.fire({
                    title: "Registration Failed",
                    text: errorData.detail || "An error occurred during registration",
                    icon: "error",
                    toast: true,
                    timer: 6000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        } catch (error) {
            console.error("Error during registration:", error);
            swal.fire({
                title: "An unexpected error occurred",
                icon: "error",
                toast: true,
                timer: 6000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            });
        }
    };

    const registerDoctor = async (email, username, phone, address, medical_license, password, password2) => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('medical_license', medical_license);
        formData.append('password', password);
        formData.append('password2', password2);
    
        try {
            const response = await fetch(`${ip}/api/register/doctor`, {
                method: "POST",
                body: formData,  // No need to set Content-Type
            });
    
            if (response.status === 201) {
                history.push("/login");
                swal.fire({
                    title: "Registration Successful, Login Now",
                    icon: "success",
                    toast: true,
                    timer: 6000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            } else {
                const errorData = await response.json(); // Parse error response
                console.log(response.status);
                console.log("Server error:", errorData);
                swal.fire({
                    title: "Registration Failed",
                    text: errorData.detail || "An error occurred during registration",
                    icon: "error",
                    toast: true,
                    timer: 6000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        } catch (error) {
            console.error("Error during registration:", error);
            swal.fire({
                title: "An unexpected error occurred",
                icon: "error",
                toast: true,
                timer: 6000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            });
        }
    };
    


    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.clear()
        sessionStorage.clear()
        history.push("/login")
        swal.fire({
            title: "You have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true,
        })
    }

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        registerDoctor,
        loginUser,
        logoutUser,
    }

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
            sessionStorage.setItem('currentUser', JSON.stringify(jwtDecode(authTokens.access)))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <Loading /> : children}
        </AuthContext.Provider>
    )
}