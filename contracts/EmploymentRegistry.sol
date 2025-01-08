// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EmploymentRegistry {
    struct Employment {
        string employeeName;
        uint256 startDate;
        string jobDescription;
        uint256 salary;
        uint256 hoursWorked;
    }

    mapping(address => Employment) public employments;

    // Event to log employment updates
    event EmploymentUpdated(
        address indexed employeeAddress,
        string employeeName,
        uint256 startDate,
        string jobDescription,
        uint256 salary,
        uint256 hoursWorked
    );

    // Function to update employment details
    function updateEmployment(
        string memory _employeeName,
        uint256 _startDate,
        string memory _jobDescription,
        uint256 _salary,
        uint256 _hoursWorked
    ) public {
        Employment storage employment = employments[msg.sender];
        employment.employeeName = _employeeName;
        employment.startDate = _startDate;
        employment.jobDescription = _jobDescription;
        employment.salary = _salary;
        employment.hoursWorked = _hoursWorked;
        emit EmploymentUpdated(
            msg.sender,
            _employeeName,
            _startDate,
            _jobDescription,
            _salary,
            _hoursWorked
        );
    }

    // Function to get employment details
    function getEmployment(address _employeeAddress)
        public
        view
        returns (
            string memory employeeName,
            uint256 startDate,
            string memory jobDescription,
            uint256 salary,
            uint256 hoursWorked
        )
    {
        Employment memory employment = employments[_employeeAddress];
        return (
            employment.employeeName,
            employment.startDate,
            employment.jobDescription,
            employment.salary,
            employment.hoursWorked
        );
    }
}
