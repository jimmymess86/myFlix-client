import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './movie-view.scss';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

export class MovieView extends React.Component {

    baseURL = 'http://localhost:1234/img/';

    constructor(props) {
        super(props);
        const movieId = window.location.href.split("movies/")[1];

        this.state = {
            favoriteMovies: [],
            userDetails: [],
            movieId: movieId
        }

        this.addFavorite = this.addFavorite.bind(this);
        this.removeFavorite = this.removeFavorite.bind(this);


    }

    componentDidMount() {
        let accessToken = localStorage.getItem('token');
        this.getUserDetails(accessToken);
    }

    getUserDetails(token) {
        axios.get(`https://mclaughlinflixdb.herokuapp.com/users/${localStorage.getItem('user')}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            console.log(response)
            this.setState({
                userDetails: response.data,
                favoriteMovies: response.data.FavoriteMovies
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    addFavorite() {
        let token = localStorage.getItem('token');
        axios.post(`https://mclaughlinflixdb.herokuapp.com/users/${localStorage.getItem('user')}/movies/${this.state.movieId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            response ? alert('movie added') : alert('Somethihg went wrong!')


        }).catch(function (error) {
            console.log(error);
        });
    }

    removeFavorite() {
        let token = localStorage.getItem('token');
        axios.delete(`https://mclaughlinflixdb.herokuapp.com/users/${this.props.user}/movies/${this.props.movie._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            window.open(`/movies/${this.props.movie._id}`, '_self');
        }).catch(function (error) {
            console.log(error);
        });
    }


    render() {
        const { movie, onBackClick } = this.props;

        let tempArray = this.state.favoriteMovies;
        let isFavoriteNew = false
        if (tempArray.includes(this.props.movie._id)) {
            isFavoriteNew = true;
        } else {
            isFavoriteNew = false;
        };

        return (
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={this.baseURL + movie.ImagePath} />
                            <Card.Body>
                                <Card.Text>
                                    <span className="label">Title: </span>
                                    <span className="value">{movie.Title}</span>
                                </Card.Text>
                                <Card.Text>
                                    <span className="label">Description: </span>
                                    <span className="value">{movie.Description}</span>
                                </Card.Text>
                                <Card.Text>
                                    <span className="label">Director: </span>
                                    <Link to={`/directors/${movie.Director.Name}`}>
                                        <Button variant="link">{movie.Director.Name}</Button>
                                    </Link>
                                </Card.Text>
                                <div className="movie-genre">
                                    <span className="label">Genre: </span>
                                    <Link to={`/genres/${movie.Genre.Name}`}>
                                        <Button variant="link">{movie.Genre.Name}</Button>
                                    </Link>
                                </div>
                                <Button variant="primary" onClick={() => onBackClick(null)}>Back</Button>
                                {isFavoriteNew ? (
                                    <Button className="float-right" variant="primary" style={{ color: "white" }} onClick={this.removeFavorite}>
                                        Remove from Favorites
                                    </Button>
                                ) : (
                                    <Button className="float-right" variant="primary" style={{ color: "white" }} onClick={this.addFavorite}>
                                        Add to Favorites
                                    </Button>
                                )}

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

MovieView.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Description: PropTypes.string.isRequired
        }),
        Director: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Bio: PropTypes.string.isRequired,
            Birthyear: PropTypes.string,
            Deathyear: PropTypes.string
        }),
        Featured: PropTypes.bool,
        ImagePath: PropTypes.string.isRequired
    }).isRequired,
    onBackClick: PropTypes.func.isRequired
};