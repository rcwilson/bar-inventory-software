import './App.css';
import { FaDoorClosed } from 'react-icons/fa'
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { useEffect } from 'react';
import API from './api/API';
import UserAuth from './auth/UserAuth';


function Logout() {

    const { logout } = UserAuth();
    useEffect(() => {  
        async function userLogout() {
            setTimeout(async function(){
                const logoutResult = await API.Users.logout();
                console.log(logoutResult)
                if(logoutResult) {
                    logout();
                    setTimeout(function(){
                        window.location = "/"
                    }, 500)
                }
            }, 250)
        }
        userLogout();
    }, []);

    return (
        <Modal show backdrop="static" keyboard={false} centered>
            <Modal.Body>
                <Row>
                    <Col md={4}>
                        <FaDoorClosed size={"sm"} />
                    </Col>
                    <Col md={8} className={"text-cenetered"}>
                        <h2 style={{margin: "auto", display: "flex"}}>
                            Logging Out...
                        </h2>
                    </Col>
                </Row>                
            </Modal.Body>
        </Modal>
    )
}
export default Logout;