import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPage = () => {
    const [trips, setTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [formData, setFormData] = useState({
        tripName: "",
        time: "",
        days: "",
        price: "",
        avatar: "",
    });

    const apiBaseUrl = "https://flutter-server-7utt.onrender.com/api/trips";

    // Lấy danh sách trips từ API
    useEffect(() => {
        const fetchTrips = async() => {
            try {
                const response = await axios.get(apiBaseUrl);
                setTrips(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu trips:", error);
            }
        };
        fetchTrips();
    }, []);

    // Hiển thị modal để thêm hoặc sửa trip
    const handleShowModal = (trip = null) => {
        setSelectedTrip(trip);
        setFormData(
            trip ? {...trip } : {
                tripName: "",
                time: "",
                days: "",
                price: "",
                avatar: "",
            }
        );
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTrip(null);
    };
    const handleSubmit = async(e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu trước khi gửi
        if (!formData.tripName || !formData.time || !formData.days || !formData.price || !formData.avatar) {
            console.error("Vui lòng điền đầy đủ thông tin cho chuyến đi.");
            return;
        }

        try {
            if (selectedTrip) {
                // Cập nhật trip
                console.log("Cập nhật trip với dữ liệu:", formData);
                const response = await axios.put(`${apiBaseUrl}/${selectedTrip._id}`, formData);

                if (response.status === 200) {
                    console.log("Cập nhật thành công:", response.data);
                    setTrips((prev) =>
                        prev.map((trip) =>
                            trip._id === selectedTrip._id ? {...trip, ...response.data } : trip
                        )
                    );
                    handleCloseModal();
                } else {
                    console.error("Lỗi khi sửa trip:", response.status);
                }
            } else {
                // Thêm trip mới
                console.log("Dữ liệu gửi đi:", formData); // Debug formData
                const response = await axios.post(apiBaseUrl, formData);
                console.log("Dữ liệu trả về từ backend:", response.data); // Debug phản hồi từ backend

                if (response.status === 201) {
                    const newTrip = response.data;
                    console.log("Trip mới được tạo:", newTrip); // Kiểm tra trip mới tạo
                    setTrips((prev) => [...prev, newTrip]);
                    handleCloseModal();
                } else {
                    console.error("Lỗi khi thêm trip:", response.status);
                }
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    };



    // Xử lý xóa trip
    const handleDelete = (tripId) => {
        if (!tripId) {
            console.error("ID trip không hợp lệ:", tripId);
            return;
        }
        console.log("Đang gửi yêu cầu xóa trip với ID:", tripId); // Log ID để kiểm tra
        axios
            .delete(`${apiBaseUrl}/${tripId}`)
            .then((response) => {
                console.log("Xóa trip thành công:", response.data);
                setTrips((prev) => prev.filter((trip) => trip._id !== tripId)); // Cập nhật danh sách trip
            })
            .catch((error) => {
                console.error("Lỗi khi xóa trip:", error);
            });
    };



    return ( <
        div className = "container mt-5" >
        <
        h1 className = "text-center mb-4" > Quản lý Trips < /h1> <
        Button variant = "primary"
        onClick = {
            () => handleShowModal()
        }
        className = "mb-3" >
        Thêm Trip <
        /Button> <
        Table striped bordered hover >
        <
        thead >
        <
        tr >
        <
        th > # < /th> <
        th > Trip Name < /th> <
        th > Time < /th> <
        th > Days < /th> <
        th > Price < /th> <
        th > Avatar < /th> <
        th > Actions < /th> < /
        tr > <
        /thead> <
        tbody > {
            trips.map((trip, index) => ( <
                tr key = { trip._id } >
                <
                td > { index + 1 } < /td> <
                td > { trip.tripName } < /td> <
                td > { new Date(trip.time).toLocaleString() } < /td> <
                td > { trip.days } < /td> <
                td > { trip.price } < /td> <
                td >
                <
                img src = { trip.avatar }
                alt = { trip.tripName }
                style = {
                    { width: "100px" }
                }
                /> < /
                td > <
                td >
                <
                Button variant = "warning"
                className = "me-2"
                onClick = {
                    () => handleShowModal(trip)
                } >
                Sửa <
                /Button> <
                Button variant = "danger"
                onClick = {
                    () => handleDelete(trip._id)
                } >
                Xóa <
                /Button> < /
                td > <
                /tr>
            ))
        } <
        /tbody> < /
        Table >

        <
        Modal show = { showModal }
        onHide = { handleCloseModal } >
        <
        Modal.Header closeButton >
        <
        Modal.Title > { selectedTrip ? "Cập nhật Trip" : "Thêm Trip mới" } < /Modal.Title> < /
        Modal.Header > <
        Modal.Body >
        <
        Form onSubmit = { handleSubmit } >
        <
        Form.Group className = "mb-3" >
        <
        Form.Label > Trip Name < /Form.Label> <
        Form.Control type = "text"
        value = { formData.tripName }
        onChange = {
            (e) => setFormData({...formData, tripName: e.target.value })
        }
        /> < /
        Form.Group > <
        Form.Group className = "mb-3" >
        <
        Form.Label > Time < /Form.Label> <
        Form.Control type = "datetime-local"
        value = { formData.time }
        onChange = {
            (e) => setFormData({...formData, time: e.target.value })
        }
        /> < /
        Form.Group > <
        Form.Group className = "mb-3" >
        <
        Form.Label > Days < /Form.Label> <
        Form.Control type = "number"
        value = { formData.days }
        onChange = {
            (e) => setFormData({...formData, days: e.target.value })
        }
        /> < /
        Form.Group > <
        Form.Group className = "mb-3" >
        <
        Form.Label > Price < /Form.Label> <
        Form.Control type = "number"
        value = { formData.price }
        onChange = {
            (e) => setFormData({...formData, price: e.target.value })
        }
        /> < /
        Form.Group > <
        Form.Group className = "mb-3" >
        <
        Form.Label > Avatar URL < /Form.Label> <
        Form.Control type = "text"
        value = { formData.avatar }
        onChange = {
            (e) => setFormData({...formData, avatar: e.target.value })
        }
        /> < /
        Form.Group > <
        Button variant = "primary"
        type = "submit" > { selectedTrip ? "Cập nhật" : "Thêm" } <
        /Button> < /
        Form > <
        /Modal.Body> < /
        Modal > <
        /div>
    );
};

export default AdminPage;