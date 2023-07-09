import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import "./place.css"
import Cookies from "universal-cookie";
const cookies = new Cookies();

const BoxCollectionPage = () => {
  const [box, setBox] = useState([]);
  // const [searchParams, setSearchParams] = useSearchParams();
  // searchParams.get("id")
  const location = useLocation();
  const url = new URL(window.location.href);
  const server=process.env.REACT_APP_URL;
  //get place id
  const id = url.searchParams.get('id');
  const [newPlace, setNewPlace] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const owner = cookies.get("USER");

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${server}box/${id}`);
      const data = await response.json();
      

      //convert unix to date
      const modifiedData = data.map((item) => {
        const date = new Date(item.lastUpdate * 1000); // Multiply by 1000 to convert from seconds to milliseconds
        const formattedDateTime = date.toLocaleString(); // Convert the date to a string in local date and time format
  
        return {
          ...item,
          lastUpdate: formattedDateTime, // Update the timestamp property with the formatted date and time
        };
      });
      setBox(modifiedData);
    } catch (error) {
      console.log('Error fetching places:', error);
    }
  };

  useEffect(() => {
    // Fetch places data from the backend API endpoint
    fetchPlaces();
  }, []);

  const handleDeletePlace = async () => {
    alert("Hapus daerah ini?");
    try {
      const response = await fetch(`${server}place/${id}`, {
        method: 'DELETE',
      });
      console.log(response);
      if (response.ok) {
        // Remove the deleted harvest from the state
        window.location.href = "/place";
      } else {
        console.log('Failed to delete place:', response.statusText);
      }
    } catch (error) {
      console.log('Error deleting place:', error);
    }
  };

  const handleAddPlace = async () => {
    try {
      const response = await fetch(`${server}box/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlace,
          owner: owner,
          placeId: id,
          desc: newDescription,
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
        <h1 className="place-collection-heading">Tempat</h1>
        <Button variant="danger" onClick={() => handleDeletePlace()}>
            Hapus Tempat
        </Button>
      </div>
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="auto">Kotak Baru:</Form.Label>
          <Col sm={8} xs={9}>
            <Form.Control type="string" value={newPlace} onChange={(e) => setNewPlace(e.target.value)} />
          </Col>
          <Col sm={2} xs={3} className="d-grid">
            <Button variant="primary" onClick={handleAddPlace}>
              Tambah
            </Button>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="auto">Deskripsi:</Form.Label>
          <Col sm={8} xs={9}>
            <Form.Control type="string" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
          </Col>
        </Form.Group>
      </Form>
        <br/>
      <Row>
        {box.map((box) => (
          <Col key={box._id} sm={12} md={6} lg={3}>
            <Link to={`/boxdetail?id=${box._id}`} className="place-link">
              <div className="place-container">
                {/* <img src={`https://picsum.photos/200/200?random=${box._id}`} alt={box.name} className="place-image" /> */}
                <div className="place-details">
                  <h3 className="place-name">{box.name}</h3>
                  <h5 className="place-name">Terakhir panen: {box.lastUpdate}</h5>
                  <h5 className="place-name">Total panen: {box.totalHarvestAll} mL</h5>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BoxCollectionPage;