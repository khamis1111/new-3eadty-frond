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
import { Activity, Calendar, Check, DollarSign, Edit2, Percent, Trash2 } from 'lucide-react';
import { FaHeartbeat } from 'react-icons/fa';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { Separator } from '../../components/ui/separator';
import DateTimePicker from '../../utils/Dates/DateTimePicker';
import notify from '../../utils/useToastify';
import { DeleteData } from '../../api/Axios/useDeleteData';
import { EditData } from '../../api/Axios/useEditData';
import { PostData } from '../../api/Axios/usePostData';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateFormate } from '../../utils/Dates/DateFormate';

const TreatmentsDetailsTab = ({ user, GetUser }) => {
    const { id } = useParams()
    const [isOpen, setIsOpen] = useState()

    const [process, setProcess] = useState()
    const [processDetails, setProcessDetails] = useState()
    const [price, setPrice] = useState()
    const [paid, setPaid] = useState()
    const [priceChanged, setPriceChanged] = useState(false)
    const [paidChanged, setPaidChanged] = useState(false)
    const [date, setDate] = useState()

    const handleShowEdit = (details) => {
        setProcess(details.process)
        setProcessDetails(details.processDetails)
        setPrice(!priceChanged && details.price)
        setPaid(!paidChanged && details.paid)
        setDate(details.date)
    }

    const handleAddDetails = (e) => {
        e.preventDefault()

        PostData(`/api/v1/treatments/details/${id}`, {
            process,
            processDetails,
            price,
            paid,
            date
        }).then(res => {
            notify('تمت الاضافة بنجاح', 'success')
            GetUser()
            setProcess()
            setProcessDetails()
            setPrice()
            setPaid()
            setDate()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleEditDetails = (e, DetailsId) => {
        e.preventDefault()
        // const detailsData = user.data.treatmentsDetails.filter((user) => user._id === detailsId)

        EditData(`/api/v1/treatments/details/${id}`, {
            docId: DetailsId,
            process,
            processDetails,
            price,
            paid,
            date
        }).then(res => {
            notify('تم التعديل بنجاح', 'success')
            GetUser()
            setProcess()
            setProcessDetails()
            setPrice(0)
            setPaid(0)
            setDate()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleDeleteDetails = (e, DetailsId) => {
        e.preventDefault()

        DeleteData(`/api/v1/treatments/details/${id}`, {
            docId: DetailsId
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
                    <CardTitle>تفاصيل العلاج</CardTitle>
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerTrigger>
                            <Button>
                                <span>اضافة تفاصيل العلاج</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className='fs-2'>اضافة تفاصيل علاج جديدة</DrawerTitle>
                                <DrawerDescription>إجراءات اضافة تفاصيل العلاج للمريض</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter className=''>
                                <Row>
                                    <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                        <Input type="text" placeholder="نوع العملية"
                                            value={process} onChange={(e) => setProcess(e.target.value)}
                                        />
                                        <Input type="text" placeholder="تفاصيل العملية"
                                            value={processDetails} onChange={(e) => setProcessDetails(e.target.value)}
                                        />
                                        <Row>
                                            <Col md='6'>
                                                <Input type="text" placeholder="السعر"
                                                    value={price} onChange={(e) => setPrice(e.target.value)}
                                                />
                                            </Col>
                                            <Col md='6'>
                                                <Input type="text" placeholder="المدفوع حاليا"
                                                    value={paid} onChange={(e) => setPaid(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                        <DateTimePicker setNewDate={setDate} newDate={date} />
                                        <div className="d-flex flex-wrap gap-2 justify-content-between">
                                            <DrawerClose>
                                                <Button variant="outline">الغاء</Button>
                                            </DrawerClose>
                                            <Button variant="default" onClick={(e) => handleAddDetails(e)}>اضافة</Button>
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
                    user.map((details) => (
                        <Card className="x-ray grid gap-3 p-3 shadow-sm">
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <FaHeartbeat className="h-6 w-6 text-red-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">نوع العملية</p>
                                    <p className="font-medium">{details.process || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Activity className="h-6 w-6 text-blue-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">تفاصيل العملية	</p>
                                    <p className="font-medium text-end">{details.processDetails || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <DollarSign className="h-6 w-6 text-green-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">سعر العملية</p>
                                    <p className="font-medium text-end">{details.price || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Check className="h-6 w-6 text-teal-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">المدفوع حاليا</p>
                                    <p className="font-medium text-end">{details.paid || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Percent className="h-6 w-6 text-orange-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">المتبقي</p>
                                    <p className="font-medium text-end">{details.restOfPrice || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Calendar className="h-6 w-6 text-purple-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">التاريخ</p>
                                    <p className="font-medium">{DateFormate(details.date)}</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap justify-content-center gap-2">
                                {/* Edit */}
                                <Drawer>
                                    <DrawerTrigger>
                                        <Button size='sm' variant="outline" className="flex items-center"
                                            onClick={(e) => handleShowEdit(details)}
                                        >
                                            <Edit2 className="h-4 w-4 ml-2" />
                                            تعديل
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle className='fs-2'>{details.process}</DrawerTitle>
                                            <DrawerDescription>إجراءات تعديل تفاصيل العلاج للمريض</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter>
                                            <Row>
                                                <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                                    <Input type="text" placeholder="نوع العملية"
                                                        value={process} onChange={(e) => setProcess(e.target.value)}
                                                    />
                                                    <Input type="text" placeholder="تفاصيل العملية"
                                                        value={processDetails} onChange={(e) => setProcessDetails(e.target.value)}
                                                    />
                                                    <Row>
                                                        <Col md='6'>
                                                            <Input type="text" placeholder="السعر"
                                                                value={price} onChange={(e) => {
                                                                    setPrice(e.target.value)
                                                                    setPriceChanged(true)
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col md='6'>
                                                            <Input type="text" placeholder="المدفوع حاليا"
                                                                value={paid} onChange={(e) => {
                                                                    setPaid(e.target.value)
                                                                    setPaidChanged(true)
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <DateTimePicker setNewDate={setDate} newDate={date} />
                                                    <div className="d-flex flex-wrap gap-2 justify-content-between">
                                                        <DrawerClose>
                                                            <Button variant="outline">الغاء</Button>
                                                        </DrawerClose>
                                                        <Button variant="default" onClick={(e) => handleEditDetails(e, details._id)}>تعديل</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                                {/* Delete */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size='sm' variant="destructive" className="flex items-center">
                                            <Trash2 className="h-4 w-4 ml-2" />
                                            حذف
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle> هل انت متأكد من الحذف ؟</AlertDialogTitle>
                                            <AlertDialogDescription>{details.process}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <div className="d-flex align-items-center m-auto gap-2">
                                                <AlertDialogCancel className='m-0'>الغاء</AlertDialogCancel>
                                                <AlertDialogAction className='bg-danger' onClick={(e) => handleDeleteDetails(e, details._id)}>
                                                    حذف
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    ))
                    : <div className='fs-4 text-center'>لا توجد تفاصيل علاج 😪</div>
            }
        </Card>
    )
}

export default TreatmentsDetailsTab
