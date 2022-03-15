import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './movie-view.scss';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

export class MovieView extends React.Component {

    keypressCallback(event) {
        console.log(event.key);
    }

    componentDidMount() {
        document.addEventListener('keypress', event => {
            console.log(event.key);
        });
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.keypressCallback);
    }

    render() {
        const { movie, onBackClick } = this.props;

        return (
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Img variant="bottom" src={"img/" + movie.imgPath} />
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
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}