import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaUserInjured } from "react-icons/fa6";
import { PostData } from '../../api/Axios/usePostData';
import { AllPatientsTable } from '../../components/Tables/AllPatientsTable';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import notify from '../../utils/useToastify';

const Patients = ({ getAllUsers, allUser, loading }) => {
    const [isOpen, setIsOpen] = useState()

    const [name, setName] = useState()
    const [gender, setGender] = useState()
    const [age, setAge] = useState()
    const [phone, setPhone] = useState()
    const [price, setPrice] = useState()
    const [paid, setPaid] = useState()
    const [medicalConditions, setMedicalConditions] = useState()
    const [allergies, setAllergies] = useState()
    const [currentComplaints, setCurrentComplaints] = useState()
    const [recommendations, setRecommendations] = useState()

    const handleAddUser = (e) => {
        e.preventDefault()

        PostData(`/api/v1/userInfo`, {
            name,
            gender,
            age,
            phone,
            price,
            paid,
            medicalConditions,
            allergies,
            currentComplaints,
            recommendations
        }).then((res) => {
            console.log(res)
            notify('تمت الاضافة بنجاح', 'success')
            getAllUsers()
            setIsOpen(false)
        }).catch((err) => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    return (
        <Row>
            <Col md={9} className='patient'>
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                    <div className='d-flex gap-1 align-items-center'>
                        <FaUserInjured size={40} className='main-color' />
                        <div className='fs-2 p-0'>
                            المرضي
                        </div>
                    </div>
                    {/* Add Patients */}
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerTrigger>
                            <span className="btn bg-color text-light fw-bold py-2 px-4 shadow">اضافة مريض</span>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className='fs-2'>اضافة مريض جديد</DrawerTitle>
                                <DrawerDescription>إجراءات اضافة معلومات للمريض</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter className=''>
                                <Row>
                                    <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                        <Row className='gap-2 px-2'>
                                            <Col className='p-0'>
                                                <Input type="text" placeholder="اسم المريض"
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </Col>
                                            <Col className='p-0'>
                                                <Select value={gender} onValueChange={setGender}>
                                                    <SelectTrigger className="w-100">
                                                        <SelectValue placeholder="النوع" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="male">ذكر</SelectItem>
                                                            <SelectItem value="female">انثي</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row className='gap-2 px-2'>
                                            <Col className='p-0'>
                                                <Input type="number" placeholder="العمر"
                                                    onChange={(e) => setAge(e.target.value)}
                                                />
                                            </Col>
                                            <Col className='p-0'>
                                                <Input type="number" placeholder="رقم الهاتف"
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className='gap-2 px-2'>
                                            <Col className='p-0'>
                                                <Input type="number" placeholder="السعر"
                                                    onChange={(e) => setPrice(e.target.value)}
                                                />
                                            </Col>
                                            <Col className='p-0'>
                                                <Input type="number" placeholder="المدفوع حاليا"
                                                    onChange={(e) => setPaid(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className='gap-2 px-2'>
                                            <Col className='p-0'>
                                                <Input type="text" placeholder="الحالة الطبية"
                                                    onChange={(e) => setMedicalConditions(e.target.value)}
                                                />
                                            </Col>
                                            <Col className='p-0'>
                                                <Input type="text" placeholder="الحساسية"
                                                    onChange={(e) => setAllergies(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className='gap-2 px-2'>
                                            <Input type="text" placeholder="الشكاوي الحالية"
                                                onChange={(e) => setCurrentComplaints(e.target.value)}
                                            />
                                            <Input type="text" placeholder="توصيات الدكتور للمريض"
                                                onChange={(e) => setRecommendations(e.target.value)}
                                            />
                                        </Row>
                                        <div className="d-flex flex-wrap gap-2 justify-content-between">
                                            <DrawerClose>
                                                <Button variant="outline">الغاء</Button>
                                            </DrawerClose>
                                            <Button variant="default" onClick={(e) => handleAddUser(e)}>اضافة</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
                <Col >
                    <Card className='rounded-5 p-3'>
                        <AllPatientsTable getAllUsers={getAllUsers} allUser={allUser} loading={loading} />
                    </Card>
                </Col>
            </Col>
            <Col md={3}>

            </Col>
        </Row>
    )
}

export default Patients
