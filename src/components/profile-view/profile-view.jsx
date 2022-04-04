import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './profile-view.scss';
import { MovieCard } from '../movie-card/movie-card';
import { Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';

export class ProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userDetails: [],
            Username: '',
            Password: '',
            Email: '',
            Birthday: '',
            FavoriteMovies: [],
        };
    }

    componentDidMount() {
        const accessToken = localStorage.getItem('token');
        this.getUser(accessToken);
    }

    onLoggedOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({
            user: null,
        });
        window.open('/', '_self');
    }

    getUser = (token) => {
        const Username = localStorage.getItem('user');
        axios.get(`https://mclaughlinflixdb.herokuapp.com/users/${Username}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            console.log(response);
            this.setState({
                Username: response.data.Username,
                Password: response.data.Password,
                Email: response.data.Email,
                Birthday: response.data.Birthday,
                FavoriteMovies: response.data.FavoriteMovies,
            });
        })
            .catch(function (error) {
                console.log(error);
            });
    };
    // Allow user to edit or update profile
    editUser = (e) => {
        e.preventDefault();
        const Username = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        axios
            .put(
                `https://mclaughlinflixdb.herokuapp.com/users/${Username}`,
                {
                    Username: this.state.Username,
                    Password: this.state.Password,
                    Email: this.state.Email,
                    Birthday: this.state.Birthday,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((response) => {
                this.setState({
                    Username: response.data.Username,
                    Password: response.data.Password,
                    Email: response.data.Email,
                    Birthday: response.data.Birthday,
                });

                localStorage.setItem('user', this.state.Username);
                alert("Profile updated");
                window.open('/profile', '_self');
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Delete a movie from FavoriteMovies
    onRemoveFavorite = (e, movie) => {
        e.preventDefault();
        const Username = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        axios
            .delete(
                `https://mclaughlinflixdb.herokuapp.com/users/${Username}/movies/${movie._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((response) => {
                console.log(response);
                alert("Movie has been removed from favorites");
                this.componentDidMount();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Deregister
    onDeleteUser() {
        const Username = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        axios
            .delete(`https://mclaughlinflixdb.herokuapp.com/users/${Username}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log(response);
                alert("Profile has been deleted");
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.open('/', '_self');
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    setUsername(value) {
        this.setState({
            Username: value,
        });
    }

    setPassword(value) {
        this.setState({
            Password: value,
        });
    }

    setEmail(value) {
        this.setState({
            Email: value,
        });
    }

    setBirthday(value) {
        this.setState({
            Birthday: value,
        });
    }

    render() {
        const { movies, onBackClick } = this.props;
        const { Username, Email, Birthday } = this.state;

        let tempArray = this.state.FavoriteMovies;
        console.log(this.state.FavoriteMovies)
        let FavoriteMoviesArray = [];

        FavoriteMoviesArray = movies.filter(movie => tempArray.includes(movie._id));

        console.log(FavoriteMoviesArray)

        if (!Username) {
            return null;
        }

        return (
            <Container>
                <Row style={{ marginTop: "20px" }}>
                    <Col>
                        <Card className="update-profile">
                            <Card.Body>
                                <Card.Title>User Profile</Card.Title>
                                <Form
                                    className="update-form"
                                    onSubmit={(e) =>
                                        this.editUser(
                                            e,
                                            this.Username,
                                            this.Password,
                                            this.Email,
                                            this.Birthday
                                        )
                                    }
                                >
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Username"
                                            placeholder="New Username"
                                            value={Username}
                                            onChange={(e) => this.setUsername(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="Password"
                                            placeholder="New Password"
                                            value={""}
                                            onChange={(e) => this.setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="Email"
                                            placeholder="Enter Email"
                                            value={Email}
                                            onChange={(e) => this.setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Birthday</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="Birthday"
                                            value={Birthday}
                                            onChange={(e) => this.setBirthday(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div className="mt-3">
                                        <Button variant="primary" type="submit" onClick={this.editUser}>Update Info</Button>
                                        <Button className="ml-3" variant="secondary" onClick={() => this.onDeleteUser()}>Delete Profile</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Card border="light" align="center" style={{ color: "black" }}>
                    <Card.Title>{Username}'s Favorites:</Card.Title>
                    <Row>
                        {FavoriteMoviesArray.map(movie => (
                            <Col md={4} key={movie._id} className="my-2">
                                <MovieCard movie={movie} />
                            </Col>))}
                    </Row>
                </Card>
                <div className="backButton">
                    <Button variant="primary" onClick={() => { onBackClick(null); }}>Back</Button>
                </div>
            </Container>
        );
    }
}

ProfileView.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        ImagePath: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Description: PropTypes.string.isRequired,
        }).isRequired,
        Director: PropTypes.shape({
            Bio: PropTypes.string.isRequired,
            Birth: PropTypes.string.isRequired,
            //Death: PropTypes.string.isRequired,
            Name: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    onBackClick: PropTypes.func.isRequired
};