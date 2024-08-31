import { Col, Row } from 'react-bootstrap';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle } from '../../components/ui/card';
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


import { Calendar, Edit2, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FaTooth, FaVirus } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import { DeleteData } from '../../api/Axios/useDeleteData';
import { EditData } from '../../api/Axios/useEditData';
import { PostData } from '../../api/Axios/usePostData';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { Separator } from '../../components/ui/separator';
import { DateFormate } from '../../utils/Dates/DateFormate';
import DateTimePicker from '../../utils/Dates/DateTimePicker';
import notify from '../../utils/useToastify';

const TreatmentsHistoryTab = ({ user, GetUser }) => {
    const { id } = useParams()
    const [isOpen, setIsOpen] = useState()

    const [historyType, setHistoryType] = useState()
    const [material, setMaterial] = useState()
    const [toothNumber, setToothNumber] = useState()
    const [date, setDate] = useState()

    const handleShowEdit = (history) => {
        setHistoryType(history.historyType)
        setMaterial(history.material)
        setToothNumber(history.toothNumber)
        setDate(history.date)
    }

    const handleAddHistory = (e) => {
        e.preventDefault()

        PostData(`/api/v1/treatments/history/${id}`, {
            historyType,
            material,
            toothNumber,
            date
        }).then(res => {
            notify('تمت الاضافة بنجاح', 'success')
            GetUser()
            setHistoryType()
            setMaterial()
            setToothNumber()
            setDate()
            setIsOpen(false)
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleEditHistory = (e, historyId) => {
        e.preventDefault()

        EditData(`/api/v1/treatments/history/${id}`, {
            docId: historyId,
            historyType,
            material,
            toothNumber,
            date
        }).then(res => {
            notify('تم التعديل بنجاح', 'success')
            GetUser()
            setHistoryType()
            setMaterial()
            setToothNumber()
            setDate()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleDeleteHistory = (e, historyId) => {
        e.preventDefault()

        DeleteData(`/api/v1/treatments/history/${id}`, {
            docId: historyId
        }).then(res => {
            notify('تم الحذف', 'warn')
            GetUser()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    return (
        <Card className="w-100 flex-shrink-0 bg-gray-100 shadow-none d-flex flex-column gap-2 p-4" style={{ direction: 'rtl' }}>
            <CardHeader className='p-0'>
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle>التاريخ المرضي</CardTitle>
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerTrigger>
                            <Button>
                                <span>اضافة التاريخ المرضي</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className='fs-2'>اضافة تاريخ مرضي جديد</DrawerTitle>
                                <DrawerDescription>إجراءات اضافة التاريخ المرضي للمريض</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter className=''>
                                <Row>
                                    <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                        <Input type="text" placeholder="نوع المرض"
                                            value={historyType} onChange={(e) => setHistoryType(e.target.value)}
                                        />
                                        <Input type="text" placeholder="المادة المستخدمة"
                                            value={material} onChange={(e) => setMaterial(e.target.value)}
                                        />
                                        <Row>
                                            <Col md='6'><Input type="number" placeholder="رقم السنة"
                                                value={toothNumber} onChange={(e) => setToothNumber(e.target.value)}
                                            /></Col>
                                            <Col md='6'><DateTimePicker setNewDate={setDate} newDate={date} /></Col>
                                        </Row>
                                        <div className="d-flex flex-wrap gap-2 justify-content-between">
                                            <DrawerClose>
                                                <Button variant="outline">الغاء</Button>
                                            </DrawerClose>
                                            <Button variant="default" onClick={(e) => handleAddHistory(e)}>اضافة</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
                <Separator className="my-3" />
            </CardHeader>
            {
                user.length > 0 ?
                    user.map((history) => (
                        <Card className="x-ray grid gap-3 p-3 shadow-sm">
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <FaVirus className="h-6 w-6 text-blue-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">نوع المرض</p>
                                    <p className="font-medium">{history.historyType || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Package className="h-6 w-6 text-gray-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">المادة المستخدمة</p>
                                    <p className="font-medium text-end">{history.material || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <FaTooth className="h-6 w-6 text-green-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">رقم الضرس</p>
                                    <p className="font-medium text-end">{history.toothNumber || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Calendar className="h-6 w-6 text-blue-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">التاريخ</p>
                                    <p className="font-medium">{DateFormate(history.date)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                {/* Edit */}
                                <Drawer>
                                    <DrawerTrigger>
                                        <Button variant="outline" className="flex items-center"
                                            onClick={(e) => handleShowEdit(history)}
                                        >
                                            <Edit2 className="h-4 w-4 ml-2" />
                                            تعديل
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle className='fs-2'>{history.historyType}</DrawerTitle>
                                            <DrawerDescription>إجراءات تعديل التاريخ المرضي للمريض</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter>
                                            <Row>
                                                <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                                    <Input type="text" placeholder="نوع المرض"
                                                        value={historyType} onChange={(e) => setHistoryType(e.target.value)}
                                                    />
                                                    <Input type="text" placeholder="المادة المستخدمة"
                                                        value={material} onChange={(e) => setMaterial(e.target.value)}
                                                    />
                                                    <Row>
                                                        <Col md='6'><Input type="number" placeholder="رقم السنة"
                                                            value={toothNumber} onChange={(e) => setToothNumber(e.target.value)}
                                                        /></Col>
                                                        <Col md='6'><DateTimePicker setNewDate={setDate} newDate={date} /></Col>
                                                    </Row>
                                                    <div className="d-flex flex-wrap gap-2 justify-content-between">
                                                        <DrawerClose>
                                                            <Button variant="outline">الغاء</Button>
                                                        </DrawerClose>
                                                        <Button variant="default" onClick={(e) => handleEditHistory(e, history._id)}>تعديل</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                                {/* Delete */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="flex items-center">
                                            <Trash2 className="h-4 w-4 ml-2" />
                                            حذف
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle> هل انت متأكد من الحذف ؟</AlertDialogTitle>
                                            <AlertDialogDescription>{history.historyType}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <div className="d-flex align-items-center m-auto gap-2">
                                                <AlertDialogCancel className='m-0'>الغاء</AlertDialogCancel>
                                                <AlertDialogAction className='bg-danger' onClick={(e) => handleDeleteHistory(e, history._id)}>
                                                    حذف
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    ))
                    : <div className='fs-4 text-center'>لا يوجد تاريخ مرضي 😪</div>
            }

        </Card>
    )
}

export default TreatmentsHistoryTab
