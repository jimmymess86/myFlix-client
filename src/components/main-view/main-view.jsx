import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

// #0
import { setMovies } from '../../actions/actions';

// we haven't written this one yet
import MoviesList from '../movies-list/movies-list';

/* #1 the rest of components import statements but ithout the MovieCard's because it will be importbe 
imported and used in the MoviesList component rather than here */

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './main-view.scss';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
//import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { ProfileView } from '../profile-view/profile-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import { NavbarView } from '../navbar-view/navbar-view';

// #2 export keyword removed from here
export class MainView extends React.Component {

    constructor() {
        super();
        // Initial state is set to null

        //#3 movies state removed from here
        this.state = {
            //movies: [],
            selectedMovie: null,
            user: null
        };
    }

    componentDidMount() {
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
                user: localStorage.getItem('user')
            });
            this.getMovies(accessToken);
        }
    }

    /* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/
    onLoggedIn(authData) {
        console.log(authData);
        this.setState({
            user: authData.user.Username
        });

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getMovies(authData.token);
    }

    onLoggedOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({
            user: null
        });
    }

    getMovies(token) {
        axios.get(`https://mclaughlinflixdb.herokuapp.com/movies`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                // Assign the result to the state
                // #4
                this.props.setMovies(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        // #5 movies is extracted from this.props rather than from this.state
        let { movies } = this.props;
        let { user } = this.state;

        return (
            <Router>
                <NavbarView user={user} />
                <Container>
                    <Row className="main-view justify-content-md-center">
                        <Route exact path="/" render={() => {
                            if (!user) return <Col>
                                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                            </Col>
                            if (movies.length === 0) return <div className="main-view" />;
                            // #6
                            return <MoviesList movies={movies} />;
                        }} />
                        <Route path="/login" render={() => {
                            if (user) {
                                return <Redirect to="/" />;
                            }

                            return <LoginView onLoggedIn={(data) => this.onLoggedIn(data)} />
                        }} />
                        <Route path="/register" render={() => {
                            if (user) {
                                return <Redirect to="/" />;
                            }

                            return (
                                <Col>
                                    <RegistrationView />
                                </Col>
                            );
                        }} />
                        <Route path="/movies/:movieId" render={({ match, history }) => {
                            if (!user) {
                                return (
                                    <Col>
                                        <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                                    </Col>
                                );
                            }

                            if (movies.length === 0) {
                                return <div className="main-view" />;
                            }

                            return (
                                <Col md={8}>
                                    <MovieView
                                        movie={movies.find(m => m._id === match.params.movieId)}
                                        onBackClick={() => history.goBack()} />
                                </Col>
                            );
                        }} />
                        <Route path="/users/:username" render={({ history }) => {
                            if (!user) {
                                return (
                                    <Col>
                                        <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                                    </Col>
                                );
                            }

                            return (
                                <Col md={8}>
                                    <ProfileView movies={movies} onBackClick={() => history.goBack()} />
                                </Col>
                            );
                        }} />
                        <Route path="/genres/:name" render={({ match, history }) => {
                            if (!user) {
                                return (
                                    <Col>
                                        <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                                    </Col>
                                );
                            }


                            if (movies.length === 0) {
                                return <div className="main-view" />;
                            }

                            return (
                                <Col md={8}>
                                    <GenreView
                                        genre={movies.find(m => m.Genre.Name === match.params.name).Genre}
                                        onBackClick={() => history.goBack()}
                                        movies={movies.filter(movie => movie.Genre.Name === match.params.name)} />
                                </Col>
                            )
                        }} />
                        <Route path="/directors/:name" render={({ match, history }) => {
                            if (!user) {
                                return (
                                    <Col>
                                        <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                                    </Col>
                                );
                            }

                            if (movies.length === 0) return <div className="main-view" />;

                            return (
                                <Col md={8}>
                                    <DirectorView
                                        director={movies.find(m => m.Director.Name === match.params.name).Director}
                                        onBackClick={() => history.goBack()}
                                        movies={movies.filter(movie => movie.Director.Name === match.params.name)} />
                                </Col>
                            );
                        }} />
                    </Row>
                </Container>
            </Router>
        );
    }
}

// #7
let mapStateToProps = state => {
    return { movies: state.movies }
}

// # 8
export default connect(mapStateToProps, { setMovies })(MainView);