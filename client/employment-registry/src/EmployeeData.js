import React, { useState } from 'react';
import { ethers } from 'ethers';
const { JsonRpcProvider } = ethers;

const EmployeeData = () => {
    const [transactionHash, setTransactionHash] = useState('');
    const [employeeData, setEmployeeData] = useState(null);
    const [error, setError] = useState(null);

    const getEmployeeData = async (txHash) => {
        try {
            const provider = new JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545"); // URL del proveedor de BNB Testnet
            const tx = await provider.getTransaction(txHash);
            if (!tx) {
                throw new Error('Transacción no encontrada');
            }
            const employeeAddress = tx.from; // La dirección del empleado es el remitente de la transacción
            const contractAddress = "address"; // Reemplaza con la dirección de tu contrato
            const abi = [
                "function getEmployment(address _employeeAddress) view returns (string memory employeeName, uint256 startDate, string memory jobDescription, uint256 salary, uint256 hoursWorked)"
            ];

            const contract = new ethers.Contract(contractAddress, abi, provider);

            const data = await contract.getEmployment(employeeAddress);
            setEmployeeData({
                employeeName: data.employeeName,
                startDate: new Date(Number(data.startDate) * 1000).toLocaleString(),
                jobDescription: data.jobDescription,
                salary: data.salary.toString(),
                hoursWorked: data.hoursWorked.toString()
            });
            setError(null);
        } catch (error) {
            console.error("Error al recuperar los datos del empleado:", error);
            setError("No se pudieron recuperar los datos del empleado.");
            setEmployeeData(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        getEmployeeData(transactionHash);
    };

    return (
        <div>
            <h1>Recuperar Datos del Empleado</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Hash de la transacción"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                />
                <button type="submit">Obtener Datos</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {employeeData && (
                <div>
                    <p><strong>Nombre:</strong> {employeeData.employeeName}</p>
                    <p><strong>Fecha de inicio:</strong> {employeeData.startDate}</p>
                    <p><strong>Descripción del trabajo:</strong> {employeeData.jobDescription}</p>
                    <p><strong>Salario:</strong> {employeeData.salary}</p>
                    <p><strong>Horas trabajadas:</strong> {employeeData.hoursWorked}</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeData;
