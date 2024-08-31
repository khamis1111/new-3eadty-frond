import { Calendar, Clipboard, Edit2, Image, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { DeleteData } from '../../api/Axios/useDeleteData';
import { EditData } from '../../api/Axios/useEditData';
import { PostData, PostDataImage } from '../../api/Axios/usePostData';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle } from '../../components/ui/card';
import {
    Dialog,
    DialogContent, DialogTrigger
} from "../../components/ui/dialog";
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
import { Separator } from '../../components/ui/separator';
import { DateFormate } from '../../utils/Dates/DateFormate';
import DateTimePicker from '../../utils/Dates/DateTimePicker';
import ImgGallary from '../../utils/UploadImg/ImgGallary';
import OneImg from '../../utils/UploadImg/OneImg';
import notify from '../../utils/useToastify';

const TreatmentsPlanTab = ({ user, GetUser }) => {
    const { id } = useParams()
    const [isOpen, setIsOpen] = useState()
    const [loadingData, setLoadingData] = useState(false)

    const [treatments, setTreatments] = useState()
    const [dentist, setDentist] = useState()
    const [imgSelector, setImgSelector] = useState(null)
    const [date, setDate] = useState()

    const handleAddPlan = (e) => {
        e.preventDefault()
        setLoadingData(true)

        const formDataImg = new FormData();
        formDataImg.append('image', imgSelector.file);
        imgSelector ?
            PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
                PostData(`/api/v1/treatments/plan/${id}`, {
                    treatments,
                    dentist,
                    image: res.data.data.display_url,
                    date
                }).then(res => {
                    notify('تمت الاضافة بنجاح', 'success')
                    GetUser()
                    setTreatments()
                    setDentist()
                    setImgSelector(null)
                    setDate()
                    setLoadingData(false)
                }).catch(err => {
                    console.log(err)
                    notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
                })
            }).catch(err => {
                notify(err, 'error')
                setLoadingData(false)
            })
            : PostData(`/api/v1/treatments/plan/${id}`, {
                treatments,
                dentist,
                date
            }).then(res => {
                notify('تمت الاضافة بنجاح', 'success')
                GetUser()
                setTreatments()
                setDentist()
                setImgSelector(null)
                setDate()
                setLoadingData(false)
            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            })
    }

    const handleShowEdit = (plan) => {
        setTreatments(plan.treatments)
        setDentist(plan.dentist)
        setImgSelector(plan.image)
        setDate(plan.date)
    }

    const handleEditPlan = (e, PlanId) => {
        e.preventDefault()
        setLoadingData(true)
        const formDataImg = new FormData();
        formDataImg.append('image', imgSelector.file);
        imgSelector ?
            PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
                EditData(`/api/v1/treatments/plan/${id}`, {
                    docId: PlanId,
                    treatments,
                    dentist,
                    image: res.data.data.display_url,
                    date
                }).then(res => {
                    notify('تم التعديل بنجاح', 'success')
                    GetUser()
                    setTreatments()
                    setDentist()
                    setImgSelector(null)
                    setDate()
                    setLoadingData(false)
                }).catch(err => {
                    console.log(err)
                    notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
                    setLoadingData(false)
                })
            }).catch(err => {
                notify(err, 'error')
                setLoadingData(false)
            })
            :
            EditData(`/api/v1/treatments/plan/${id}`, {
                docId: PlanId,
                treatments,
                dentist,
                date
            }).then(res => {
                notify('تم التعديل بنجاح', 'success')
                GetUser()
                setTreatments()
                setDentist()
                setImgSelector(null)
                setDate()
                setLoadingData(false)
            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
                setLoadingData(false)
            })
    }

    const handleDeletePlan = (e, PlanId) => {
        e.preventDefault()

        DeleteData(`/api/v1/treatments/plan/${id}`, {
            docId: PlanId
        }).then(res => {
            notify('تم الحذف', 'warn')
            GetUser()
            setLoadingData(false)
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            setLoadingData(false)
        })
    }

    return (
        <Card className="w-100 flex-shrink-0 bg-gray-100 shadow-none d-flex flex-column gap-2 p-4" style={{ direction: 'rtl' }}>
            <CardHeader className='p-0'>
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle>خطط العلاج</CardTitle>
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerTrigger>
                            <Button>
                                <span>اضافة خطة علاج</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className='fs-2'>اضافة خطة علاج جديدة</DrawerTitle>
                                <DrawerDescription>إجراءات اضافة خطة علاج للمريض</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Row>
                                    <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                        <OneImg image={imgSelector} setImage={setImgSelector} />
                                        <Input type="text" placeholder="اسم العلاج"
                                            value={treatments} onChange={(e) => setTreatments(e.target.value)}
                                        />
                                        <Input type="text" placeholder="طبيب الاسنان"
                                            value={dentist} onChange={(e) => setDentist(e.target.value)}
                                        />
                                        <DateTimePicker setNewDate={setDate} newDate={date} />
                                        <div className="d-flex flex-wrap gap-2 justify-content-between">
                                            <DrawerClose>
                                                <Button variant="outline">الغاء</Button>
                                            </DrawerClose>
                                            <Button variant="default" disabled={loadingData} onClick={(e) => handleAddPlan(e)}>
                                                {
                                                    loadingData ? 'جاري الاضافة....' : 'اضافة'
                                                }
                                            </Button>
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
                    user.map((plan) => (
                        <Card className="x-ray grid gap-3 p-3 shadow-sm">
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Clipboard className="h-6 w-6 text-blue-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">اسم العلاج</p>
                                    <p className="font-medium">{plan.treatments || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger>
                                    <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                        <Calendar className="h-6 w-6 text-green-500 ml-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">صورة العلاج</p>
                                            <p className="font-medium text-end">اضغط للعرض</p>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    {
                                        plan.image && plan.image.length > 0 ?
                                            <ImgGallary images={plan.image} />
                                            : <div className='fs-4 text-center fw-bold'>لا يوجد صورة لخطة العلاج !</div>
                                    }
                                </DialogContent>
                            </Dialog>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <UserCheck className="h-6 w-6 text-blue-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">التاريخ</p>
                                    <p className="font-medium">{DateFormate(plan.date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Image className="h-6 w-6 text-red-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">طبيب الاسنان</p>
                                    <p className="font-medium text-end">{plan.dentist || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                {/* Edit */}
                                <Drawer>
                                    <DrawerTrigger>
                                        <Button variant="outline" className="flex items-center"
                                            onClick={(e) => handleShowEdit(plan)}
                                        >
                                            <Edit2 className="h-4 w-4 ml-2" />
                                            تعديل
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle className='fs-2'>تعديل خطة العلاج</DrawerTitle>
                                            <DrawerDescription>إجراءات تعديل خطة العلاج للمريض</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter className=''>
                                            <Row>
                                                <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                                    <OneImg image={imgSelector} setImage={setImgSelector} />
                                                    <Input type="text" placeholder="اسم العلاج"
                                                        value={treatments} onChange={(e) => setTreatments(e.target.value)}
                                                    />
                                                    <Input type="text" placeholder="طبيب الاسنان"
                                                        value={dentist} onChange={(e) => setDentist(e.target.value)}
                                                    />
                                                    <DateTimePicker setNewDate={setDate} newDate={date} />
                                                    <div className="d-flex flex-wrap gap-2 justify-content-between">
                                                        <DrawerClose>
                                                            <Button variant="outline">الغاء</Button>
                                                        </DrawerClose>
                                                        <Button variant="default" disabled={loadingData} onClick={(e) => handleEditPlan(e, plan._id)}>
                                                            {
                                                                loadingData ? 'جاري التعديل....' : 'تعديل'
                                                            }
                                                        </Button>
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
                                            <AlertDialogDescription>{plan.treatments}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <div className="d-flex align-items-center m-auto gap-2">
                                                <AlertDialogCancel className='m-0'>الغاء</AlertDialogCancel>
                                                <AlertDialogAction className='bg-danger' onClick={(e) => handleDeletePlan(e, plan._id)}>
                                                    حذف
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    ))
                    : <div className='fs-4 text-center'>لا توجد خطط علاج 😪</div>
            }

        </Card>
    )
}

export default TreatmentsPlanTab
