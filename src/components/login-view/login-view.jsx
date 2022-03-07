import React, { useState } from 'react';
import PropTypes from 'prop-types';

import "./login-view.scss";

import { Container, Form, Button, Card, CardGroup, Row, Col } from 'react-bootstrap';

export default function LoginView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password);
        /* send a request tothe server for authentication */
        /* then call props.onLoggedIn(username) */
        props.onLoggedIn(username);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <CardGroup>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleSubmit} method="POST">
                                    <Form.Label>
                                        Username:
                                        <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} />
                                    </Form.Label>
                                    <Form.Label>
                                        Password:
                                        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                    </Form.Label>
                                    <Button type="primary" onClick={handleSubmit}>Submit</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </CardGroup>
                </Col>
            </Row>
        </Container>
    );
}

LoginView.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
    }),
    onLoggedIn: PropTypes.func.isRequired
};