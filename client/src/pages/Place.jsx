import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import "./place.css";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const PlaceCollectionPage = () => {
  //console.log(process.env.REACT_APP_URL)
  const url=process.env.REACT_APP_URL;
  const [places, setPlaces] = useState([]);
  const owner = cookies.get("USER");
  const [newPlace, setNewPlace] = useState('');
  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${url}place/${owner}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("TOKEN")}`, // Include the auth token in the headers
        },
      });
      const data = await response.json();
      console.log(data);
      setPlaces(data);
    } catch (error) {
      console.log('Error fetching places:', error);
    }
  };  

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleAddPlace = async () => {
    try {
      const response = await fetch(`${url}place/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cookies.get("TOKEN")}`, // Include the auth token in the headers
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlace,
          owner: owner
        }),
      });
      console.log(response);
      if (response.ok) {
        // Refresh the place data
        fetchPlaces();
        // Reset the input field
        setNewPlace('');
      } else {
        console.log('Failed to add place:', response.statusText);
      }
    } catch (error) {
      console.log('Error adding place:', error);
    }
  };

  return (
    <Container>
      <div className="header">
        <h1 className="place-collection-heading">Place Collection Page</h1>
      </div>
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="auto">Tempat Baru:</Form.Label>
          <Col sm={8} xs={9}>
            <Form.Control type="string" value={newPlace} onChange={(e) => setNewPlace(e.target.value)} />
          </Col>
          <Col sm={2} xs={3} className="d-grid">
            <Button variant="primary" onClick={handleAddPlace}>
              Tambah
            </Button>
          </Col>
        </Form.Group>
      </Form>
        <br/>
      <Row>
        {places.map((place) => (
          <Col key={place._id} sm={12} md={6} lg={3}>
            <Link to={`/box?id=${place._id}`} className="place-link">
              <div className="place-container">
                {/* <img src={`https://picsum.photos/200/200?random=${place._id}`} alt={place.name} className="place-image" /> */}
                <div className="place-details">
                  <h3 className="place-name">{place.name}</h3>
                  <h4 className="place-total-box">Total Kotak: {place.totalBox}</h4>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PlaceCollectionPage;
