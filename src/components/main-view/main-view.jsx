import React from 'react';
import axios from 'axios';

import { RegistrationView } from '../registration-view/registration-view';
import LoginView from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { Container, Row, Col } from 'react-bootstrap';

export class MainView extends React.Component {

    constructor() {
        super();
        // initial state is set to null
        this.state = {
            movies: [],
            selectedMovie: null,
            user: null
        }
    }

    componentDidMount() {
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjFkMmRhZjQ3ZWNkZTU1NmFhMmIyYWEiLCJVc2VybmFtZSI6ImpvbmRvZTEiLCJQYXNzd29yZCI6IiQyYiQxMCQ5ZkVOc1lzTmg4b0FFcVZSN2xXMDBldm9vLnplUjVEUjk1aDF5MUpuVkhpbHdHamJSNzZ4UyIsIkVtYWlsIjoibmV3am9uZG9lQGVtYWlsLmNvbSIsIkJpcnRoZGF5IjoiMjAxMi0xMS0xMVQwMDowMDowMC4wMDBaIiwiRmF2b3JpdGVNb3ZpZXMiOltdLCJfX3YiOjAsImlhdCI6MTY0NjA3OTQxMywiZXhwIjoxNjQ2Njg0MjEzLCJzdWIiOiJqb25kb2UxIn0.Eoig4YUc4VpSh-N7HDabzVgHnMccvmgtZ2yIsIRC4yc";
        axios.get('https://mclaughlinflixdb.herokuapp.com/movies', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(response => {
                this.setState({
                    movies: response.data
                });
            })
            /*headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(response => {
                this.setState({
                    movies: response.data
                });
            })*/
            .catch(error => {
                console.log(error);
            });
    }

    /* when a movie is clicked, this fucntion is invoked and updates thes tate of the 'selectedMovie' *property to that movie
    */

    setSelectedMovie(newSelectedMovie) {
        this.setState({
            selectedMovie: newSelectedMovie
        });
    }

    onRegistration(register) {
        this.setState({
            register
        });
    }

    /* When a user successfully logs in, this function updates the 'user' property in state to that *particular username*
    */

    onLoggedIn(user) {
        this.setState({
            user
        });
    }

    render() {

        const { movies, selectedMovie, user, register } = this.state;

        if (!register) return (<RegistrationView onRegistration={(register) => this.onRegistration(register)} />)

        /* if there is no user, the LoginView is rednered. If there is a user logged in, the user details are *passed as a prop to the LoginView
        */
        if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

        // Before the movies have been loaded

        if (movies.length === 0) return <div className="main-view" />;

        return (
            <Container>
                <div className="main-view">
                    {selectedMovie
                        ? (
                            <Row className="justify-content-md-center">
                                <Col md={8}>
                                    <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }} />
                                </Col>
                            </Row>
                        )
                        : (
                            <Row className="justify-content-md-center">
                                {movies.map(movie => (
                                    <Col md={3}>
                                        <MovieCard key={movie._id} movie={movie} onMovieClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }} />
                                    </Col>
                                ))}
                            </Row>
                        )
                    }
                </div>
            </Container>
        );
    }
}

export default MainView;