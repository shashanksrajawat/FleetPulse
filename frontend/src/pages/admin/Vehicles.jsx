import React, { useEffect, useState } from 'react';
import { getAllVehicles, deleteVehicle, addVehicle } from '../../services/admin.service';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Initial state matching VehicleDTO
    const initialVehicleState = {
        brand: '',
        model: '',
        year: 2024,
        registrationNumber: '',
        vehicleType: 'SEDAN',
        seatingCapacity: 4,
        imageUrl: ''
    };

    const [newVehicle, setNewVehicle] = useState(initialVehicleState);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await getAllVehicles();
            setVehicles(data);
        } catch (error) {
            console.error("Failed to load vehicles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await deleteVehicle(id);
                setVehicles(vehicles.filter(v => v.id !== id));
            } catch (error) {
                alert('Failed to delete vehicle');
            }
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        // 1. Validate Registration Number Format: MH12RY2602
        const regEx = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
        if (!regEx.test(newVehicle.registrationNumber)) {
            alert("Invalid Registration Number Format. Expected: MH12RY2602 (e.g., MH12RY2602)");
            return;
        }

        try {
            const added = await addVehicle(newVehicle);
            setVehicles([...vehicles, added]);
            setShowAddForm(false);
            setNewVehicle(initialVehicleState);
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert('Failed to add vehicle. Check console for details.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle(prev => ({
            ...prev,
            [name]: name === 'registrationNumber' ? value.toUpperCase() : value
        }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#333' }}>Vehicle Management</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: showAddForm ? '#6c757d' : 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {showAddForm ? 'Cancel' : 'Add New Vehicle'}
                </button>
            </div>

            {showAddForm && (
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Add New Vehicle</h3>
                    <form onSubmit={handleAddSubmit} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Brand</label>
                            <input
                                name="brand"
                                placeholder="Toyota, Honda, etc."
                                required
                                value={newVehicle.brand}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Model</label>
                            <input
                                name="model"
                                placeholder="Camry, Civic, etc."
                                required
                                value={newVehicle.model}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Registration Number</label>
                            <input
                                name="registrationNumber"
                                placeholder="MH12RY2602"
                                required
                                value={newVehicle.registrationNumber}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Vehicle Type</label>
                            <select
                                name="vehicleType"
                                value={newVehicle.vehicleType}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="SEDAN">Sedan</option>
                                <option value="HATCHBACK">Hatchback</option>
                                <option value="SUV">SUV</option>
                                <option value="LUXURY">Luxury</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Seating Capacity</label>
                            <input
                                name="seatingCapacity"
                                type="number"
                                min="1"
                                required
                                value={newVehicle.seatingCapacity}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Image URL</label>
                            <input
                                name="imageUrl"
                                placeholder="https://example.com/car.jpg"
                                value={newVehicle.imageUrl}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                            <button type="submit" style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}>
                                Save Vehicle
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f4f6f8', borderBottom: '2px solid #ddd' }}>
                        <tr>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Vehicle</th>
                            <th style={{ padding: '15px' }}>Year</th>
                            <th style={{ padding: '15px' }}>Reg. Number</th>
                            <th style={{ padding: '15px' }}>Type</th>
                            <th style={{ padding: '15px' }}>Capacity</th>
                            <th style={{ padding: '15px' }}>Status</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                        ) : vehicles.length === 0 ? (
                            <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>No vehicles found.</td></tr>
                        ) : (
                            vehicles.map(vehicle => (
                                <tr key={vehicle.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>{vehicle.id}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{vehicle.brand} {vehicle.model}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>{vehicle.year}</td>
                                    <td style={{ padding: '15px' }}>{vehicle.registrationNumber}</td>
                                    <td style={{ padding: '15px' }}>{vehicle.vehicleType}</td>
                                    <td style={{ padding: '15px' }}>{vehicle.seatingCapacity}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem',
                                            backgroundColor: vehicle.status === 'AVAILABLE' ? '#d4edda' : '#f8d7da',
                                            color: vehicle.status === 'AVAILABLE' ? '#155724' : '#721c24'
                                        }}>
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button onClick={() => handleDelete(vehicle.id)} style={{
                                            backgroundColor: '#dc3545', color: 'white', border: 'none',
                                            padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'
                                        }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Vehicles;
