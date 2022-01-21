import '../../App.css';
import { useState, useEffect } from 'react';
import { Form, Modal, Container, Row, Col, Button, Spinner, FormText } from 'react-bootstrap'
import API from '../../api/API';

export default function NewUser() {
    const [show, setShow]                   = useState(false);
    const [isLoading, setIsLoading]         = useState(false);
    const [formValidated, setFormValidated] = useState(false);
    const [errorMessage, setErrorMessage]   = useState(null);

    const [newUsername, setNewUsername]             = useState('');
    const [newFirstName, setNewFirstName]           = useState('');
    const [newLastName, setNewLastName]             = useState('');
    const [newPassword, setNewPassword]             = useState('');
    const [newVerifyPassword, setNewVerifyPassword] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSave = (e) => {
        const form = document.getElementById('new-user-form');
        if (form.checkValidity()) {
            setIsLoading(true)
            setErrorMessage("");

            const data = {
                username: newUsername,
                first_name: newFirstName,
                last_name: newLastName,
                password: newPassword,
                verify_password: newVerifyPassword
            }

            API.Users.addUser(data)
            .then(result => {
                console.log(typeof result, result);
                if(result) {
                    setIsLoading(false)
                    if(result.success && result.success === true) {
                        handleClose();
                        //@TODO USER:LOGIN
                        //@TODO redirect
                    } 
                    else if(result.success === false) {
                        setErrorMessage(result.error ?? "Error Creating user")
                    }
                }
            })
            .catch(error => {
                setIsLoading(false)
                const errMsg = typeof error === 'string' ? error : "Server Error"
                setErrorMessage(errMsg)
                console.error(error);

            })
        } else {
            setIsLoading(false)
            e.preventDefault();
            e.stopPropagation();
        }

        setFormValidated(true);
    }

    return (
        <>
        <Button variant="dark" onClick={handleShow}>
          New User
        </Button>
  
        <Modal backdrop="static" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Row className="text-danger">
                <Col>
                { errorMessage ?? ""}
                </Col>
            </Row> 

                <Form id="new-user-form" noValidate validated={formValidated} >
                    <Form.Group as={Col} className="mb-3" controlId="newUsername">
                        <Form.Label column sm="2">Email</Form.Label>
                        <Form.Control onChange={e => setNewUsername(e.target.value)} required autoComplete="off" type="email" placeholder="user@unioncafe.com" />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid email
                        </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group as={Col} className="mb-3" controlId="newFirstName">
                        <Form.Label column sm="2">First Name</Form.Label>
                        <Form.Control onChange={e => setNewFirstName(e.target.value)} required autoComplete="off" type="text" />
                        <Form.Control.Feedback type="invalid">
                            Please provide a First name
                        </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group as={Col} className="mb-3" controlId="newLastName">
                        <Form.Label column sm="2">Last Name</Form.Label>
                        <Form.Control onChange={e => setNewLastName(e.target.value)} required autoComplete="off" type="text" />
                        <Form.Control.Feedback type="invalid">
                            Please provide a Last Name
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3" controlId="newPassword">
                        <Form.Label column sm="2">Password</Form.Label>
                        <Form.Control autoComplete="new-password" onChange={e => setNewPassword(e.target.value)} required type="password" placeholder="Password" />
                        <Form.Control.Feedback type="invalid">
                            Password Required
                        </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group as={Col} className="mb-3" controlId="newVerifyPassword">
                        <Form.Label column sm="2">VerifyPassword</Form.Label>
                        <Form.Control autoComplete="new-password" onChange={e => setNewVerifyPassword(e.target.value)} required type="password" placeholder="Password" />
                        <Form.Control.Feedback type="invalid">
                            Password Required
                        </Form.Control.Feedback>
                    </Form.Group>

                </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} hidden={isLoading ? true : false}>
              Close
            </Button>
            <Button disabled={isLoading ? true : false} variant="primary" onClick={handleSave}>
              {isLoading ? <><Spinner as="span" animation="border" size="sm" /> Loading... </> : 'Save'}
            </Button>
          </Modal.Footer>
        </Modal>
        </>
    );
}
