import { Calendar, Edit2, FileImage, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaTooth } from 'react-icons/fa6';
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
import MultipleImg from '../../utils/UploadImg/MultipleImg';
import notify from '../../utils/useToastify';

const RadiographsTab = ({ user, GetUser }) => {
    const { id } = useParams()
    const [isOpen, setIsOpen] = useState()
    // For Disable Buttons
    const [loadingData, setLoadingData] = useState(false)
    // Radio Data
    const [radioType, setRadioType] = useState()
    const [scannerImg, setScannerImg] = useState([])
    const [toothNumber, setToothNumber] = useState()
    const [findings, setFindings] = useState()
    const [date, setDate] = useState()
    // Add Radio
    const handleAddRadio = (e) => {
        e.preventDefault()
        setLoadingData(true)
        // Upload Multi Imges
        const uploadedUrls = [];
        Promise.all(
            scannerImg.map((imgs) => {
                const formDataImg = new FormData();
                formDataImg.append('image', imgs.file)
                return PostDataImage('https://api.imgbb.com/1/upload?key=12328b42bcfa59315a190ec209b7407e', formDataImg).then(res => {
                    console.log(res)
                    uploadedUrls.push(res.data.data.display_url);
                    setLoadingData(false)
                    setIsOpen(false)
                }).catch(err => {
                    notify(err, 'error')
                });
            })
        ).then(() => {
            // Add Radio
            PostData(`/api/v1/radio/${id}`, {
                radioType,
                scannerImg: uploadedUrls,
                toothNumber,
                findings,
                date
            }).then(() => {
                notify('تمت الاضافة بنجاح', 'success')
                GetUser()
                setRadioType()
                setToothNumber()
                setScannerImg(null)
                setDate()
                setLoadingData(false)
            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            })
        })
    }
    // Edit Radio
    const handleShowEdit = (radio) => {
        setRadioType(radio.radioType)
        setScannerImg(radio.scannerImg)
        setToothNumber(radio.toothNumber)
        setFindings(radio.findings)
        setDate(radio.date)
    }
    const handleEditRadio = (e, RadioId) => {
        e.preventDefault()

        const uploadedUrls = [];
        setLoadingData(true)

        scannerImg && scannerImg.length > 0 ?
            // Upload Multi Imges
            Promise.all(
                scannerImg.map((imgs) => {
                    const formDataImg = new FormData();
                    formDataImg.append('image', imgs.file ? imgs.file : imgs)
                    return PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
                        console.log(res)
                        uploadedUrls.push(res.data.data.display_url);
                        setLoadingData(false)
                    }).catch(err => {
                        notify(err, 'error')
                        setLoadingData(false)
                    });
                })
            ).then(() => {
                // Edit Radio
                EditData(`/api/v1/radio/${id}`, {
                    docId: RadioId,
                    radioType,
                    scannerImg: uploadedUrls,
                    toothNumber,
                    findings,
                    date
                }).then(() => {
                    notify('تم التعديل بنجاح', 'success')
                    GetUser()
                    setRadioType()
                    setToothNumber()
                    setScannerImg(null)
                    setDate()
                    setLoadingData(false)
                    setIsOpen(false)
                }).catch(err => {
                    console.log(err)
                    notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
                    setLoadingData(false)
                })
            }) :
            // Edit Radio
            EditData(`/api/v1/radio/${id}`, {
                docId: RadioId,
                radioType,
                scannerImg,
                toothNumber,
                findings,
                date
            }).then(() => {
                notify('تم التعديل بنجاح', 'success')
                GetUser()
                setRadioType()
                setToothNumber()
                setScannerImg(null)
                setDate()
                setLoadingData(false)
                setIsOpen(false)
            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
                setLoadingData(false)
            })
    }
    // DeleteRadio
    const handleDeleteRadio = (e, RadioId) => {
        e.preventDefault()

        DeleteData(`/api/v1/radio/${id}`, {
            docId: RadioId
        }).then(() => {
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
                    <CardTitle>الأشعة السينية</CardTitle>
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerTrigger>
                            <Button>
                                <span>اضافة اشعة</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className='fs-2'>اضافة أشعة جديد</DrawerTitle>
                                <DrawerDescription>إجراءات اضافة أشعة للمريض</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Row>
                                    <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                        <MultipleImg images={scannerImg} setImages={setScannerImg} />
                                        <Input type="text" placeholder="نوع الاشعة"
                                            value={radioType} onChange={(e) => setRadioType(e.target.value)}
                                        />
                                        <Input type="text" placeholder="النتائج"
                                            value={findings} onChange={(e) => setFindings(e.target.value)}
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
                                            <Button variant="default" disabled={loadingData} onClick={(e) => handleAddRadio(e)}>
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
                    user.map((radio) => (
                        <Card className="x-ray grid gap-3 p-3 shadow-sm">
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <FileText className="h-6 w-6 text-purple-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">نوع الأشعة</p>
                                    <p className="font-medium">{radio.radioType || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger>
                                    <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                        <FileImage className="h-6 w-6 text-green-500 ml-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">صور الأشعة</p>
                                            <p className="font-medium text-end">{radio.scannerImg.length || 'لا يوجد'}</p>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    {
                                        radio.scannerImg.length > 0 ?
                                            <ImgGallary images={radio.scannerImg} />
                                            : <div className='fs-4 text-center fw-bold'>لا يوجد صور أشعة !</div>
                                    }
                                </DialogContent>
                            </Dialog>

                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <FaTooth className="h-6 w-6 text-blue-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">رقم الضرس</p>
                                    <p className="font-medium">{radio.toothNumber || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <FileText className="h-6 w-6 text-blue-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">النتائج</p>
                                    <p className="font-medium">{radio.findings || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white p-3 rounded-lg shadow hover:scale-110 transform transition duration-300">
                                <Calendar className="h-6 w-6 text-red-500 ml-2" />
                                <div>
                                    <p className="text-sm text-gray-500">تاريخ الأشعة</p>
                                    <p className="font-medium">{DateFormate(radio.date)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                {/* Edit */}
                                <Drawer>
                                    <DrawerTrigger>
                                        <Button variant="outline" className="flex items-center"
                                            onClick={() => handleShowEdit(radio)}
                                        >
                                            <Edit2 className="h-4 w-4 ml-2" />
                                            تعديل
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle className='fs-2'>تعديل اشعة</DrawerTitle>
                                            <DrawerDescription>إجراءات تعديل اشعة للمريض</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter className=''>
                                            <Row>
                                                <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                                    <MultipleImg images={scannerImg} setImages={setScannerImg} />
                                                    <Input type="text" placeholder="نوع الاشعة"
                                                        value={radioType} onChange={(e) => setRadioType(e.target.value)}
                                                    />
                                                    <Input type="text" placeholder="النتائج"
                                                        value={findings} onChange={(e) => setFindings(e.target.value)}
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
                                                        <Button variant="default" disabled={loadingData} onClick={(e) => handleEditRadio(e, radio._id)}>
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
                                            <AlertDialogDescription>{radio.radioType}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <div className="d-flex align-items-center m-auto gap-2">
                                                <AlertDialogCancel className='m-0'>الغاء</AlertDialogCancel>
                                                <AlertDialogAction className='bg-danger' onClick={(e) => handleDeleteRadio(e, radio._id)}>
                                                    حذف
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    ))
                    : <div className='fs-4 text-center'>لا توجد أشعة سينية 😪</div>
            }

        </Card>
    )
}

export default RadiographsTab
