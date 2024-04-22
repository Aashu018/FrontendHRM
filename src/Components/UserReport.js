import React, { useState, useEffect, forwardRef } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const UserReport = () => {


  const [getEmployeeRecord, setEmployeeRecord] = useState({
    employeeName: null,
    leaveTypename: null,
    status: null,
    fromDate: new Date('2024-04-01'),
    toDate: new Date()
  })


  const [emplyee, setEmplyee] = useState([]);
  const [leaveTypes, setleaveTypes] = useState([]);
  const [status, setStatus] = useState([]);
  useEffect(() => {
    // Fetch employees
    axios.get('http://localhost:8085/api/employees')
      .then((res) => {
        setEmplyee(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch leave types
    axios.get('http://localhost:8085/api/leavetypes')
      .then((res) => {
        setleaveTypes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //   const handleDateChange = (e) => {
  //     const selectedDate = new Date(e.target.value);
  //     if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
  //       alert('Weekends are disabled. Please select a weekday.');
  //       const dateOnly = selectedDate.toISOString().slice(0, 10); // Get only the date part
  //       setEmployeeRecord({ ...getEmployeeRecord, fromDate: dateOnly });
  //     } else {
  //       const dateOnly = selectedDate.toISOString().slice(0, 10); // Get only the date part
  //       setEmployeeRecord({ ...getEmployeeRecord, fromDate: dateOnly });
  //     }
  // };

  //   const handleEndDateChange = (e) => {
  //     debugger;
  //     const newDate = new Date(e.target.value);
  //     console.log(newDate)
  //     if (newDate.getDay() === 0 || newDate.getDay() === 6) {
  //       alert('Weekends are disabled. Please select a weekday.');
  //       setEmployeeRecord({ ...getEmployeeRecord, toDate: newDate.toISOString().slice(0, 10) });
  //     } else {

  //       setEmployeeRecord({ ...getEmployeeRecord, toDate: newDate.toISOString().slice(0, 10) });
  //     }

  // alert(startDate + 1)
  // alert((newDate.getDate() - startDate + 1))
  // if ((newDate.getDate() - getEmployeeRecord.from.getDate()) < 0) {
  //   alert('End date should not be less than or equal to start date');
  //   setEmployeeRecord({ ...getEmployeeRecord, from: newDate });
  // }
  //  };

  // Function to filter out weekends
  const filterWeekends = (date) => {
    // Sunday: 0, Saturday: 6
    const day = date.getDay();
    return day !== 0 && day !== 6; // Disable weekends (Sunday and Saturday)
  };
  const handleDateChange = (date) => {
    console.log(date)
    setEmployeeRecord({ ...getEmployeeRecord, fromDate: date });

  };

  const handleEndDateChange = (date) => {
    setEmployeeRecord({ ...getEmployeeRecord, toDate: date });
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <input type='text' className="form-control" style={{ 'width': '410px', height: "35px" }} value={value} onClick={onClick} ref={ref} />
  ))

  const ExampleCustomInput2 = forwardRef(({ value, onClick }, ref) => (
    <input type='text' className="form-control" style={{ 'width': '410px', height: "35px" }} value={value} onClick={onClick} ref={ref} />
  ))

  const [filteredRecord, setFilteredRecord] = useState([])
  const onSubmit = (e) => {
    e.preventDefault();
    if (getEmployeeRecord.employeeName == "") {
      toast.error('Please select Employee')
    } else if (getEmployeeRecord.leaveTypename == "") {
      toast.error('Please select leave type')
    } else if (getEmployeeRecord.status == "") {
      toast.error('Please select status')
    } else {
      axios.post('http://localhost:8085/api/generateUserReport', getEmployeeRecord).then((res) => {
        console.log(res.data)
        setFilteredRecord(res.data)
      })
    }

  }
  return (

    <div className='p-4'>
      <Toaster />
      <div className=''>
        <div className='card p-4' style={{ width: '100%' }}>
          <div className='row'>
            <div className='col-4'>
              <label className='mb-2 fontBo'>Employee Name <span className='text-danger'>*</span></label>
              <select className="form-select form-select-sm" onChange={(e) => setEmployeeRecord({ ...getEmployeeRecord, employeeName: e.target.value })} aria-label="Default select example">
                <option selected>ALL</option>
                {
                  emplyee.map((ele, i) => (
                    <option key={i} value={ele.name}>{ele.name}</option>
                  ))
                }
              </select>
            </div>
            <div className='col-4'>
              <label className='mb-2 fontBo'>Leave Type<span className='text-danger'>*</span></label>
              <select className="form-select form-select-sm" onChange={(e) => setEmployeeRecord({ ...getEmployeeRecord, leaveTypename: e.target.value })} aria-label="Default select example">
                <option selected >ALL</option>
                {
                  leaveTypes.map((ele, i) => (
                    <option key={i} value={ele.leaveType}>{ele.leaveType}</option>
                  ))
                }
              </select>
            </div>

            <div className='col-4'>
              <label className='mb-2 fontBo'>Status <span className='text-danger'>*</span></label>
              <select class="form-select form-select-sm" onChange={(e) => setEmployeeRecord({ ...getEmployeeRecord, status: e.target.value })} aria-label="Default select example">
                <option value="null">ALL</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

          </div>

          <div className='row mt-3'>
            <div className='col-4' > 
              <label className='mb-2 fontBo'>From<span className='text-danger'>*</span></label>
            

              <DatePicker
                selected={getEmployeeRecord.fromDate}
                customInput={<ExampleCustomInput />}
                onChange={handleDateChange}
                startDate={getEmployeeRecord.fromDate}
                endDate={getEmployeeRecord.toDate}
                selectsStart
                dateFormat="dd-MM-yyyy"
                filterDate={filterWeekends} // Apply filter function
              />

            
            </div>

            <div className='col-4' style={{'display':'flex', "flexDirection":"column"}}>
              <label className='mb-2 fontBo'>To<span className='text-danger'>*</span></label>
            
              <DatePicker
                selected={getEmployeeRecord.toDate}
                onChange={handleEndDateChange}
                customInput={<ExampleCustomInput2 />}
                startDate={getEmployeeRecord.fromDate}
                endDate={getEmployeeRecord.toDate}
                selectsEnd
                dateFormat="dd-MM-yyyy"
                filterDate={filterWeekends} // Apply filter function
                minDate={getEmployeeRecord.fromDate}

              />
            </div>

            <div className='col-4'>
              <div className='mt-4'>

                <button onClick={onSubmit} className='btn btn-primary'>Submit</button>&nbsp;&nbsp;
                <button onClick={() => window.location.reload()} type="submit" class="btn btn-primary">Refersh</button>

              </div>

            </div>

          </div>

        </div>


      </div>


      <div className='mt-3'>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Employee Name</th>
              <th scope="col">Leave Type</th>
              <th scope="col">Days</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Applied On</th>
              <th scope="col">Responded On</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>

            {
              filteredRecord.map((ele, i) => {
                const myStartDate = ele.startDate;
                const updatedStartDate = new Date(myStartDate);

                const myEndDate = ele.endDate
                const updatedEndDate = new Date(myEndDate)

                const myAppliedDate = ele.appliedOn
                const updatedAppliedDate = new Date(myAppliedDate)

                const myApproved = ele.approvedOn
                const updatedApprovedDate = new Date(myApproved)



                const formatDate = (date) => {
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  return `${day}-${month}-${year}`;
                };

                const arrangeFormat = formatDate(updatedStartDate);
                const arrangeFormatEndDate = formatDate(updatedEndDate)
                const arrangeFormatApplied = formatDate(updatedAppliedDate)
                const arrangeFormatApproved = formatDate(updatedApprovedDate)
                return (
                  <tr>
                    <td >{ele.employee.name}</td>
                    <td>{ele.leaveType.leaveType}</td>
                    <td>{ele.days}</td>
                    <td>{arrangeFormat}</td>
                    <td>{arrangeFormatEndDate}</td>
                    <td>{ele.appliedOn == null ? '-' : arrangeFormatApplied}</td>
                    <td>{ele.approvedOn == null ? '-' : arrangeFormatApproved}</td>
                    <td className="text-uppercase">{ele.status}</td>

                  </tr>
                )
              })
            }


          </tbody>
        </table>
      </div>



    </div>
  )
}
