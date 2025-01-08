/*global web3*/

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Restricted from './botonConectar';
import axios from 'axios';
import EmployeeData from './EmployeeData';
//import ImageContainer from './ImageContainer';
import './App.css';

function App() {
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function init() {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                } catch (error) {
                    console.error('User denied account access:', error);
                }
            } else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
            } else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
          
            const contractAddress = 'direccion'; // Replace with your contract address
            const contractABI = [
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_employeeName",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_startDate",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "_jobDescription",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_salary",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_hoursWorked",
                            "type": "uint256"
                        }
                    ],
                    "name": "updateEmployment",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];
            const contract = new window.web3.eth.Contract(contractABI, contractAddress);

            async function updateEmployment() {
                const employeeName = document.getElementById('employeeName').value;
                const startDate = new Date(document.getElementById('startDate').value).getTime() / 1000; // Convert date to Unix timestamp
                const jobDescription = document.getElementById('jobDescription').value;
                const salary = document.getElementById('salary').value;
                const hoursWorked = document.getElementById('hoursWorked').value;

                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const result = await contract.methods.updateEmployment(employeeName, startDate, jobDescription, salary, hoursWorked).send({ from: accounts[0] });
                    console.log('Transaction successful:', result);
                    setError(null); // Clear any previous errors

                    // Fetch transaction details from BscScan
                    getTransactionDetails(result.transactionHash);
                } catch (error) {
                    console.error('Transaction failed:', error);
                    setError(error.message); // Display error message
                }
            }

            document.getElementById('updateButton').addEventListener('click', updateEmployment);
        }

        init();
    }, []);

    async function getTransactionDetails(txHash) {
        try {
            const response = await axios.get('https://api.bscscan.com/api', {
                params: {
                    module: 'transaction',
                    action: 'gettxreceiptstatus',
                    txhash: txHash,
                    apikey: 'Your_BscScan_API_Key' // Replace with your actual BscScan API key
                }
            });

            const transactionStatus = response.data.result.status;

            const txReceiptResponse = await axios.get('https://api.bscscan.com/api', {
                params: {
                    module: 'proxy',
                    action: 'eth_getTransactionReceipt',
                    txhash: txHash,
                    apikey: 'Your_BscScan_API_Key' // Replace with your actual BscScan API key
                }
            });

            setTransactions([...transactions, {
                transactionHash: txHash,
                status: transactionStatus,
                ...txReceiptResponse.data.result
            }]);
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            setError(error.message);
        }
    }
    return (
        <div>
            <div className='image-container'>
            <div className='register'>
                <div className='register-background'>
            <h1>Registro de Empleo</h1>
            <Restricted></Restricted>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label htmlFor="employeeName">Nombre del Empleado:</label>
            <input type="text" id="employeeName" name="employeeName"/><br/><br/>
            <label htmlFor="startDate">Fecha de Inicio:</label>
            <input type="date" id="startDate" name="startDate"/><br/><br/>
            <label htmlFor="jobDescription">Descripción del Trabajo:</label>
            <input type="text" id="jobDescription" name="jobDescription"/><br/><br/>
            <label htmlFor="salary">Salario:</label>
            <input type="text" id="salary" name="salary"/><br/><br/>
            <label htmlFor="hoursWorked">Horas Trabajadas:</label>
            <input type="text" id="hoursWorked" name="hoursWorked"/><br/><br/>
            <button id="updateButton">Actualizar Empleo</button>
            </div>
            </div>
           <div className='transaction'>
            <EmployeeData></EmployeeData>
            <h2>Transacciones</h2>
            <div>
                {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                        <div key={index}>
                            <p><strong>Hash de Transacción:</strong> {tx.transactionHash}</p>
                            {tx.status !== undefined && <p><strong>Estado:</strong> {tx.status === 1 ? "Éxito" : "Fallido"}</p>}
                            {tx.blockNumber !== undefined && <p><strong>Número de Bloque:</strong> {tx.blockNumber.toString()}</p>}
                            {tx.gasUsed !== undefined && <p><strong>Gas Utilizado:</strong> {tx.gasUsed.toString()}</p>}
                            {tx.cumulativeGasUsed !== undefined && <p><strong>Gas Acumulado Utilizado:</strong> {tx.cumulativeGasUsed.toString()}</p>}
                            {/* Puedes agregar más campos aquí según lo necesites */}
                        </div>
                    ))
                ) : (
                    <p>No se encontraron transacciones.</p>
                )}
            </div>
            </div>
            </div>
        </div>
    );
}    
export default App;

