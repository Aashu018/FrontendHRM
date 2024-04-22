import React, { useState, useEffect } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const columns = [
    { field: "Requestid", headerName: "RequestId", width: 90 },
    { field: "EmployeeName", headerName: "EmployeeName", width: 150 },
    { field: "EmployeeCode", headerName: "EmployeeCode", width: 150 },
    {
        field: "Request Type",
        headerName: "Request Type",
        type: "number",
        width: 100,
    },
    {
        field: "Description",
        headerName: "Description",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 200,
    },
    {
        field: "Start Date",
        headerName: "Start Date",
        type: "Date",
        width: 90,
    },
    {
        field: "End Date",
        headerName: "End Date",
        type: "Date",
        width: 90,
    },
    {
        field: "Days",
        headerName: "Days",
        type: "number",
        width: 60,
    },

];

function LeaveApproval() {
    const [employeeData, setEmployeeData] = useState([]);
    const [remark, setRemark] = useState('');

    const getEmplyeeDate = () => {
        axios.get("http://localhost:8085/api/pending")
            .then((response) => {
                setEmployeeData(response.data);
                console.log(response.data)

            })
            .catch((error) => {
                console.error("Error fetching employee data:", error);
            });
    }
    useEffect(() => {
        getEmplyeeDate()
    }, []);


    const approveLeave = (e, id, name) => {
        e.preventDefault();
        const approveRemark= "";
        axios.post(`http://localhost:8085/api/approveAndRejectLeave?leaveReqId=${id}&status=approved&remark=${approveRemark}`).then((res) => {
            console.log('selected Leave Request is approved', res)
            if (res.data == "Leave Request approved Successfully") {
                toast.success(`${name} : Leave Request Approved`)
                setTimeout(() => {
                    getEmplyeeDate()
                }, 1500);

            }

        })
    }

    const rejectLeave = (e, id, name) => {
        e.preventDefault();
        const rejectionRemark = window.prompt('Enter remark for rejection:');
        if (rejectionRemark !== null) {
            axios.post(`http://localhost:8085/api/approveAndRejectLeave?leaveReqId=${id}&status=rejected&remark=${rejectionRemark}`).then((res) => {
                console.log('selected Leave Request is rejected', res)
                if (res.data == "Leave Request rejected Successfully") {
                    toast.error(`${name} : Leave Request Rejected`)
                    setTimeout(() => {
                        getEmplyeeDate()
                    }, 1500);

                }
            })
        }
    }
    return (
        <>
            <Toaster />
            <div className="p-3">
                <h4>Request Pending For Approval</h4>

                <div className="">
                    <div className="card" style={{ 'width': '100%' }}>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">

                                    </th>
                                    {
                                        columns.map((ele, i) => {
                                            return (

                                                <th className='text-nowrap' key={i} scope="col">
                                                    {ele.field}
                                                </th>
                                            )
                                        })
                                    }

                                </tr>
                            </thead>
                            <tbody>

                                {
                                    employeeData.map((ele, i) => {
                                        return (
                                            <tr key={ele.id}>
                                                <th></th>
                                                <td className='text-nowrap'>{ele.id}</td>
                                                <td className='text-nowrap'>{ele.employee.name}</td>
                                                <td className='text-nowrap'>{ele.employee.employeeCode}</td>
                                                <td className='text-nowrap'>Leave</td>
                                                <td className='text-nowrap'>{ele.leaveType.leaveType}</td>
                                                <td className='text-nowrap'>{ele.startDate}</td>
                                                <td className='text-nowrap'>{ele.endDate}</td>
                                                <td className='text-nowrap'>{ele.days}</td>
                                                <td className='text-nowrap'>
                                                    <div class="btn-group">
                                                        <button onClick={(e) => approveLeave(e, ele.id, ele.employee.name)} class="btn btn-primary btn-sm " type="button">
                                                            Approve
                                                        </button>
                                                        <button type="button" class="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <span class="visually-hidden">Toggle Dropdown</span>
                                                        </button>
                                                        <ul class="dropdown-menu">
                                                            <li>
                                                                <a class="dropdown-item" onClick={(e) => rejectLeave(e, ele.id, ele.employee.name)} >Reject</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}


export default LeaveApproval;
