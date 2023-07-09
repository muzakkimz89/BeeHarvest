import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const BoxHarvestDetailPage = () => {
  const [harvest, setHarvest] = useState([]);
  const [box, setBox] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [total, setTotal] = useState('');
  const location = useLocation();
  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');
  const owner = cookies.get("USER");
  const currentTime = Math.floor(Date.now() / 1000);
  //console.log(currentTime);
  console.log(startDate);
  const server=process.env.REACT_APP_URL;
  

  // Fetch harvest data, date and volume
  const fetchHarvestData = async () => {
    try {
      const response = await fetch(`${server}harvest/${id}`);
      const data = await response.json();
  
      const sortedData = data.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp in descending order
  
      const modifiedData = sortedData.map((item) => {
        const date = new Date(item.timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
        const formattedDateTime = date.toLocaleString(); // Convert the date to a string in local date and time format
  
        return {
          ...item,
          timestamp: formattedDateTime, // Update the timestamp property with the formatted date and time
        };
      });
  
      setHarvest(modifiedData);
    } catch (error) {
      console.log('Error fetching harvest data:', error);
    }
  };
  
  useEffect(() => {
    fetchHarvestData();
  }, []);

  // Fetch box information, name and description
  useEffect(() => {
    const fetchBox = async () => {
      try {
        const response = await fetch(`${server}box/abox/${id}`);
        const data = await response.json();
        setBox(data);
      } catch (error) {
        console.log('Error fetching box data:', error);
      }
    };

    fetchBox();
  }, []);

  const handleDelete = async (harvestId) => {
    try {
      const response = await fetch(`${server}harvest/${harvestId}`, {
        method: 'DELETE',
      });
      console.log(response);
      if (response.ok) {
        // Remove the deleted harvest from the state
        setHarvest((prevHarvest) => prevHarvest.filter((harvest) => harvest._id !== harvestId));
      } else {
        console.log('Failed to delete harvest:', response.statusText);
      }
    } catch (error) {
      console.log('Error deleting harvest:', error);
    }
  };

  const handleDeleteBox = async () => {
    alert("Hapus Kotak ini?");
    try {
      const response = await fetch(`${server}box/${id}`, {
        method: 'DELETE',
      });
      console.log(response);
      if (response.ok) {
        // Remove the deleted harvest from the state
        window.location.href = "/place";
      } else {
        console.log('Failed to delete harvest:', response.statusText);
      }
    } catch (error) {
      console.log('Error deleting harvest:', error);
    }
  };

  const handleAddHarvest = async () => {
    //const currentTime = Math.floor(Date.now() / 1000);
    const date = new Date(startDate);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    //console.log(unixTimestamp)
    try {
      const response = await fetch(`${server}harvest/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total: parseInt(total),
          owner:owner,
          boxId: id,
          timestamp: unixTimestamp
        }),
      });
      console.log(response);
      if (response.ok) {
        // Refresh the harvest data
        fetchHarvestData();
        // Reset the total input field
        setTotal('');
      } else {
        console.log('Failed to add harvest:', response.statusText);
      }
    } catch (error) {
      console.log('Error adding harvest:', error);
    }
  };

  return (
    <Container>
      <h1>Box Harvest Detail</h1>
      <Row>
        <Col sm={8} xs={9}>
          <h3>Box Name: {box.name}</h3>
        </Col>
        <Col sm={2} xs={3} className="d-grid">
          <Button variant="danger" onClick={() => handleDeleteBox()}>
            Hapus Kotak
          </Button>
        </Col>
        <p>Description: {box.desc}</p>
      </Row>
      <Form>
        <Form.Group>
          <Form.Label>Total:</Form.Label>
          <Form.Control type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
        </Form.Group>
        <br/>
        <Row>
          <Col>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          </Col>
          <Col>
            <Button variant="primary" onClick={handleAddHarvest}>
              Tambah Panen
            </Button>
          </Col>
        </Row>
      </Form>
      <br/>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Date</th>
            <th>Volume(mL)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {harvest.map((harvest) => (
            <tr key={harvest._id}>
              <td>{harvest.timestamp}</td>
              <td>{harvest.total}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(harvest._id)}>
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
    </Container>
  );
};

export default BoxHarvestDetailPage;
