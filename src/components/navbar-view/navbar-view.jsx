import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './navbar-view.scss';

export function NavbarView({ user }) {

    const onLoggedOut = () => {
        localStorage.clear();
        window.open('/', '_self');
    };

    const isAuth = () => {
        if (typeof window == "undefined") {
            return false;
        }
        if (localStorage.getItem("token")) {
            return localStorage.getItem("token");
        } else {
            return false;
        }
    };

    return (
        <Navbar className="main-nav" sticky="top" expand="lg" bg="light" variant="light">
            <Navbar.Brand className="navbar-logo" href="/">myFlix</Navbar.Brand>
            <Navbar.Toggle aria-controls="rewsponsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    {isAuth() && (
                        <Nav.Link href={`/users/${user}`}>{user}</Nav.Link>
                    )}
                    {isAuth() && (
                        <Button variant="link" onClick={() => { onLoggedOut() }}>Logout</Button>
                    )}
                    {!isAuth() && (
                        <Nav.Link href="/">Login</Nav.Link>
                    )}
                    {!isAuth() && (
                        <Nav.Link href="/register">Register</Nav.Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
