import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { IoCalendarSharp } from "react-icons/io5";
import { AllAppointmentTable } from '../../components/Tables/AllAppointmentTable';
import { Card } from '../../components/ui/card';
import { PostData } from '../../api/Axios/usePostData';
import { ComboboxSearch } from '../../components/CheckBoxs/ComboboxSearch';
import { Button } from '../../components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../../components/ui/drawer";
import { Input } from '../../components/ui/input';
import DateTimePicker from '../../utils/Dates/DateTimePicker';
import notify from '../../utils/useToastify';

const Appointments = ({ getAllAppointment, allUser, allAppointment, loading }) => {
    const [isOpen, setIsOpen] = useState(false)

    const [patientName, setPatientName] = useState()
    const [description, setDescription] = useState()
    const [newDate, setNewDate] = useState()

    const handleAddAppointment = (e) => {
        e.preventDefault()

        PostData(`/api/v1/appointment`, {
            patientName,
            description,
            date: newDate
        }).then(res => {
            notify('تمت الاضافة بنجاح', 'success')
            getAllAppointment()
            setPatientName()
            setDescription()
            setNewDate()
            setIsOpen(false)
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    return (
        <Row>
            <Col md={9} className='dashboard'>
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                    <div className='d-flex gap-1 align-items-center'>
                        <IoCalendarSharp size={40} className='main-color' />
                        <div className='fs-2 p-0'>
                            المواعيد
                        </div>
                    </div>
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerTrigger>
                            <span className="btn bg-color text-light fw-bold py-2 px-4 shadow">اضافة موعد</span>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className='fs-2'>اضافة موعد جديد</DrawerTitle>
                                <DrawerDescription>إجراءات حجز موعد طبي للمريض</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter className=''>
                                <Row>
                                    <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                        <ComboboxSearch holderMsg={'اختر اسم المريض'}
                                            frameworks={allUser.data} setPatientName={setPatientName} patientName={patientName}
                                        />
                                        <DateTimePicker setNewDate={setNewDate} newDate={newDate} />
                                        <Input type="text" placeholder="تفاصيل الموعد"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <div className="d-flex justify-content-between">
                                            <DrawerClose>
                                                <Button variant="outline">الغاء</Button>
                                            </DrawerClose>
                                            <Button variant="default" onClick={(e) => handleAddAppointment(e)}>اضافة</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
                <Col >
                    <Card className='rounded-5 p-3'>
                        <AllAppointmentTable getAllAppointment={getAllAppointment} allUser={allUser} allAppointment={allAppointment} loading={loading} />
                    </Card>
                </Col>
            </Col>
            <Col md={3}>

            </Col>
        </Row>
    )
}

export default Appointments
