import React, { useState, useEffect, forwardRef } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';





const Leaverequest = () => {



    const [getUpdatedDate, setUpdatedDate] = useState({
        employee: '',
        leaveType: '',
        startDate: '',
        endDate: '',
        remarks: ''
    })

    const [showErrorMessg, setShowErrorMssg] = useState({
        employee: "",
        leaveType: ""
    })

    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false)
    const [canMakeRequest, setCanMakeRequest] = useState(true);

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dateDifference, setDateDifference] = useState(0);

    const [consumedAvailableRecords, setConsumedAvailableRecords] = useState('')

    const getDifferenceDate = endDate.getDate() - startDate.getDate() + 1;
    const getDifferenceMonth = endDate.getMonth() - startDate.getMonth();

    // const handleDateChange = (e) => {
    //     const selectedDate = new Date(e.target.value);

    //     // Check if the selected date is a weekend (Saturday or Sunday)
    //     if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
    //         alert('Weekends are disabled. Please select a weekday.');
    //         // You can also set the date back to the previous valid date here
    //         // For example, reset it to the current date:
    //         // setStartDate(new Date());
    //     } else {
    //         setStartDate(selectedDate);
    //         setDisableSubmitBtn(false);


    //     }
    //     if (endDate.getDate() - selectedDate + 1) {
    //         // alert('End date should not be less than or equal to start date');
    //         setEndDate(selectedDate)
    //     }
    // };

    // const handleEndDateChange = (e) => {
    //     const newDate = new Date(e.target.value);

    //     if (newDate.getDay() === 0 || newDate.getDay() === 6) {
    //         alert('Weekends are disabled. Please select a weekday.');
    //         // You can also set the date back to the previous valid date here
    //         // For example, reset it to the current date:
    //         // setStartDate(new Date());
    //     } else {
    //         setEndDate(newDate);
    //         setDisableSubmitBtn(false);

    //         // Compare the new end date with the start date
    //         if (newDate.getTime() < startDate.getTime()) {
    //             alert('End date should not be less than start date');
    //             setEndDate(startDate);
    //         }
    //     }
    // };

    // Function to filter out weekends
    const filterWeekends = (date) => {
        // Sunday: 0, Saturday: 6
        const day = date.getDay();
        return day !== 0 && day !== 6; // Disable weekends (Sunday and Saturday)
    };
    const handleDateChange = (date) => {
        setStartDate(date);

    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        
    };


    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <input type='text' className="form-control" style={{ 'width': '345px', height:"32px" }} value={value} onClick={onClick} ref={ref} />
    ))

    const ExampleCustomInput2 = forwardRef(({ value, onClick }, ref) => (
        <input type='text' className="form-control" style={{ 'width': '345px', height:"32px" }} value={value} onClick={onClick} ref={ref} />
    ))


    console.log(consumedAvailableRecords)

    const [getweekDayData, setgetweekDayData] = useState(true)

    function getWeekdayCount() {
        const myWeekDays = []
        const weekDays = new Date(startDate);
        while (weekDays < endDate) {
            const dayofweek = weekDays.getDay();
            // console.log(dayofweek)
            if ((dayofweek != 0) && (dayofweek != 6)) {
                myWeekDays.push(new Date(weekDays))
            }
            weekDays.setDate(weekDays.getDate() + 1)
        }

        console.log(myWeekDays)
        return myWeekDays;
    }

    useEffect(() => {
        getWeekdayCount()

    }, [startDate])

    useEffect(() => {
        getWeekdayCount()
    }, [endDate])

    console.log(getWeekdayCount().length)





    const [emplyee, setEmplyee] = useState([])

    // Get All Employee start here
    useEffect(() => {
        axios.get('http://localhost:8085/api/employees').then((res) => {
            setEmplyee(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    //set All Emplyee ends Here

    // get All leave type Start here

    const [getEmplyeId, setEmployeId] = useState('')
    const [leaveTypes, setleaveTypes] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8085/api/leavetypes').then((res) => {
            setleaveTypes(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    // get all leave type ends here

    // get cousmned and avalable leaves starts here

    const [getLeavetypeId, setLeaveTypeId] = useState('')
    const [cosumedAvaLeave, setConsumedAvailLeaved] = useState()
    useEffect(() => {
        axios.get(`http://localhost:8085/api/leaverecords/${getEmplyeId}/${getLeavetypeId}`).then((res) => {
            console.log(res.data)
            setConsumedAvailLeaved(res.data)
        }).catch((error) => {
            console.log(error)
            setConsumedAvailLeaved('')
        })
    }, [getEmplyeId])

    useEffect(() => {
        axios.get(`http://localhost:8085/api/leaverecords/${getEmplyeId}/${getLeavetypeId}`).then((res) => {
            console.log(res.data)
            setConsumedAvailLeaved(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [getLeavetypeId])

    console.log(cosumedAvaLeave)
    // get cousmned and avalable leaves ends here


    // apply leave request starts here
    const applyLeave = (e) => {
        e.preventDefault();
        setDisableSubmitBtn(true)

        // const weekDaysCount = getWeekdayCount(startDate, endDate)
        const mypayload = {
            employee: {
                id: getEmplyeId,

            },
            leaveType: {
                id: getLeavetypeId
            },

            startDate: startDate,
            endDate: endDate,
            days: getWeekdayCount().length + 1,
            consumed: cosumedAvaLeave.consumedDays,
            available: cosumedAvaLeave.availableDays,
            remark: getUpdatedDate.remarks,
            status: 'pending',
            appliedOn: new Date()
        }
 
       
        if (cosumedAvaLeave.availableDays <= 0) {
            setCanMakeRequest(false);
            toast.error('Leave request cannot be made as no available leaves.');
        }
        else if (cosumedAvaLeave.availableDays < getWeekdayCount().length + 1) {
            setCanMakeRequest(false);
            toast.error(`Only ${cosumedAvaLeave.availableDays} Leave Available`);
        }
        else if (mypayload.employee.id == '') {
            // toast.error('Please select employee')
            setShowErrorMssg({ ...showErrorMessg, employee: "Please select employee" })
        } else if (mypayload.leaveType.id == '') {
            //toast.error('Please select Leave Type')
            setShowErrorMssg({ ...showErrorMessg, leaveType: "Please select Leave Type" })
        }
        else  if(getWeekdayCount()<0){
            toast.error('End date should not be less than start date')
        } else {
            axios.post('http://localhost:8085/api/applyLeave', mypayload).then((res) => {
                console.log(res.data)
                if (res.data == 'Leave Request Successfully') {
                    toast.success('Leave applied successfully')
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 1500);
                } else if (res.data == 'Leave Request comes between previous applied leaves!') {
                    toast.error('Leave already applied for the selected date')
                }
                else {
                    toast.error('Something went wrong')

                }
            }).catch((error) => {
                console.log(error)
            })
        }

    }

    // apply leave request ends here


    return (
        <div>

            <Toaster />
            <div className='container'>
                <div className='card mt-4' style={{ 'width': '100%', backgroundColor: 'white' }}>
                    <p className='pt-2 px-3' style={{ 'fontSize': '30px', fontWeight: '600' }}>Leave Request</p>
                    <div className='p-3'>
                        <div className='row'>
                            <form>
                                <div class="mb-3">
                                    <label className='mb-2 fontBo'>Employee <span className='text-danger'>*</span></label>
                                    <select class="form-select form-select-sm" onChange={(e) => {
                                        setDisableSubmitBtn(false)
                                        setEmployeId(e.target.value)
                                        setShowErrorMssg({ ...showErrorMessg, employee: '' })
                                    }} aria-label="Default select example">
                                        <option selected disabled>-Select-</option>
                                        {
                                            emplyee.map((ele, i) => {
                                                return (
                                                    <option key={i} value={ele.id}>{ele.name}</option>
                                                )
                                            })
                                        }


                                    </select>
                                    <p className='mt-1 text-danger'>{showErrorMessg.employee != '' ? showErrorMessg.employee : null}</p>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div class="mb-3">
                                            <label className='mb-2 fontBo'>Leave Type <span className='text-danger'>*</span></label>
                                            <select class="form-select form-select-sm" onChange={(e) => {
                                                setLeaveTypeId(e.target.value)
                                                setDisableSubmitBtn(false)
                                                setShowErrorMssg({ ...showErrorMessg, leaveType: '' })
                                            }} aria-label="Default select example">
                                                <option selected disabled>-Select-</option>
                                                {
                                                    leaveTypes.map((ele, i) => {
                                                        return (
                                                            <option key={i} value={ele.id}>{ele.leaveType}</option>
                                                        )
                                                    })
                                                }


                                            </select>
                                            <p className='mt-1 text-danger'>{showErrorMessg.leaveType != '' ? showErrorMessg.leaveType : null}</p>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div class="mb-3">
                                            <label className='mb-2 fontBo'>Consumed</label>
                                            <input disabled value={cosumedAvaLeave ? cosumedAvaLeave.consumedDays : ''} type="text" class="form-control form-control-sm" />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div class="mb-3">
                                            <label className='mb-2 fontBo'>Available</label>
                                            <input disabled type="text" value={cosumedAvaLeave ? cosumedAvaLeave.availableDays : ''} class="form-control form-control-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div class="mb-3">
                                            <label className='mb-2 fontBo'>Start Date <span className='text-danger'>*</span></label>
            

                                            <DatePicker
                                                selected={startDate}
                                                customInput={<ExampleCustomInput/>}
                                                onChange={handleDateChange}
                                                startDate={startDate}
                                                endDate={endDate}
                                                selectsStart
                                                dateFormat="dd-MM-yyyy"
                                                filterDate={filterWeekends} // Apply filter function
                                            />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div class="mb-3">
                                            <label className='mb-2 fontBo'>End Date <span className='text-danger'>*</span></label>
                                           
                                            <DatePicker
                                                selected={endDate}
                                                onChange={handleEndDateChange}
                                                customInput={<ExampleCustomInput2/>}
                                                startDate={startDate}
                                                endDate={endDate}
                                                selectsEnd
                                                dateFormat="dd-MM-yyyy"
                                                filterDate={filterWeekends} // Apply filter function
                                                minDate={startDate}

                                            />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div class="mb-3">
                                            <label className='mb-2 fontBo'>Days</label>
                                            <input value={getWeekdayCount().length + 1} disabled type="text" class="form-control form-control-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-check-label fontBo" for="exampleCheck1">Remarks</label>
                                    <textarea maxLength={50} value={getUpdatedDate.remarks} onChange={(e) => setUpdatedDate({ ...getUpdatedDate, remarks: e.target.value })} class="form-control" />

                                </div>
                                <div className='d-flex' style={{ 'justifyContent': 'end' }}>
                                    <button onClick={() => window.location.reload()} type="submit" class="btn btn-primary">Refersh</button>
                                    &nbsp;&nbsp;

                                    <button disabled={disableSubmitBtn} onClick={(e) => applyLeave(e)} type="submit" class="btn btn-primary">Submit</button>

                                </div>


                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leaverequest