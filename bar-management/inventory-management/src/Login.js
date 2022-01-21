import './App.css';
import { FaCheckCircle, FaExclamation } from 'react-icons/fa'
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import NewUser from './components/modals/NewUser';
import API from './api/API';

function Login(props) {
    const [connectionStatus, setConnectionStatus] = useState(<FaExclamation />);
    useEffect(() => {
        API.Conn.test()
            .then(res => setConnectionStatus(<FaCheckCircle className="text-success" />))
            .catch(err => console.log(err));
    }, []);

    const setUser  = props.setUser;
        
    const [loginUsername, setLoginUsername] = useState("admin@admin");
    const [loginPassword, setLoginPassword] = useState("admin");
    const [formValidated, setFormValidated] = useState(false);

    function handleLogin(e) {
        const form = document.getElementById('login-form');

        if ( form.checkValidity() ) {
            API.Users.login({username: loginUsername, password: loginPassword})
            .then( res => {
                console.log(res)
                if(res?.success) { 
                    setUser(res.data.user)
                }
            })
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
        setFormValidated(true);
    }

    return (
        <Container className="bg-white shadow p-4" >
            <Row className=" text-center pad-all">
                <Col>
                    Connection to Database:&nbsp; {connectionStatus}
                </Col>
            </Row>
            <Row lg={8} className="justify-content-md-center p-4">
                <Form id="login-form" noValidate validated={formValidated} >
                    <Form.Group as={Col} className="mb-3" controlId="formUserName">
                        <Form.Label column sm="2">Email</Form.Label>
                        <Form.Control defaultValue={loginUsername} onChange={e => setLoginUsername(e.target.value)} required autoComplete="off" type="email" placeholder="user@unioncafe.com" />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid email
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3" controlId="formUserPassword">
                        <Form.Label column sm="2">Password</Form.Label>
                        <Form.Control defaultValue={loginPassword} onChange={e => setLoginPassword(e.target.value)} required type="password" placeholder="Password" />
                        <Form.Control.Feedback type="invalid">
                            Password Required
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Row className="d-grid gap-2">
                        <Button size="lg" type="button" onClick={handleLogin}> Login </Button>
                        <NewUser />
                    </Row>

                </Form>
            </Row>
        </Container>
    )
}
export default Login;