import { Droplet, Edit, Pill, Repeat, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { DeleteData } from '../../api/Axios/useDeleteData';
import { EditData } from '../../api/Axios/useEditData';
import { PostData } from '../../api/Axios/usePostData';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
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
import { Separator } from '../../components/ui/separator';
import notify from '../../utils/useToastify';

const CurrentMedicationsTab = ({ user, GetUser }) => {
    const { id } = useParams()
    const [isOpen, setIsOpen] = useState()

    const [name, setName] = useState()
    const [dose, setDose] = useState()
    const [frequency, setFrequency] = useState()

    const handleShowEdit = (medication) => {
        setName(medication.name)
        setDose(medication.dose)
        setFrequency(medication.frequency)
    }

    const handleAddMedications = (e) => {
        e.preventDefault()

        PostData(`/api/v1/medication/${id}`, {
            name,
            dose,
            frequency
        }).then(res => {
            notify('تمت الاضافة بنجاح', 'success')
            GetUser()
            setName()
            setDose()
            setFrequency()
            setIsOpen(false)
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleEditMedications = (e, medicationId) => {
        e.preventDefault()

        EditData(`/api/v1/medication/${id}`, {
            docId: medicationId,
            name,
            dose,
            frequency
        }).then(res => {
            notify('تم التعديل بنجاح', 'success')
            GetUser()
            setName()
            setDose()
            setFrequency()
        }).catch(err => {
            console.log(err)
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
        })
    }

    const handleDeleteMedications = (e, medicationId) => {
        e.preventDefault()

        DeleteData(`/api/v1/medication/${id}`, {
            docId: medicationId
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
                    <CardTitle>معلومات الدواء</CardTitle>

                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerTrigger>
                            <Button>
                                <span>اضافة الدواء</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle className='fs-2'>اضافة دواء جديد</DrawerTitle>
                                <DrawerDescription>إجراءات اضافة دواء للمريض</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Row>
                                    <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                        <Input type="text" placeholder="اسم الدواء"
                                            value={name} onChange={(e) => setName(e.target.value)}
                                        />
                                        <Input type="text" placeholder="الجرعة"
                                            value={dose} onChange={(e) => setDose(e.target.value)}
                                        />
                                        <Input type="text" placeholder="عدد التكرار"
                                            value={frequency} onChange={(e) => setFrequency(e.target.value)}
                                        />
                                        <div className="d-flex flex-wrap gap-2 justify-content-between">
                                            <DrawerClose>
                                                <Button variant="outline">الغاء</Button>
                                            </DrawerClose>
                                            <Button variant="default" onClick={(e) => handleAddMedications(e)}>اضافة</Button>
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
                    user.map((medication) => (

                        <Card className="flex items-center justify-between flex-wrap p-3 shadow-sm">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <Pill className="h-10 w-10 text-blue-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">اسم الدواء</p>
                                    <h3 className="text-lg font-semibold">{medication.name || 'لا يوجد'}</h3>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <Droplet className="h-10 w-10 text-green-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">الجرعة</p>
                                    <h3 className="text-lg font-semibold">{medication.dose || 'لا يوجد'}</h3>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <Repeat className="h-10 w-10 text-purple-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">عدد التكرار</p>
                                    <h3 className="text-lg font-semibold">{medication.frequency || 'لا يوجد'}</h3>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {/* Edit */}
                                <Drawer>
                                    <DrawerTrigger>
                                        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700"
                                            onClick={(e) => handleShowEdit(medication)}
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle className='fs-2'>{medication.name}</DrawerTitle>
                                            <DrawerDescription>إجراءات تعديل دواء للمريض</DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter className=''>
                                            <Row>
                                                <Col md={6} className='d-flex flex-column justify-content-center m-auto gap-2'>
                                                    <Input type="text" placeholder="اسم الدواء"
                                                        value={name} onChange={(e) => setName(e.target.value)}
                                                    />
                                                    <Input type="text" placeholder="الجرعة"
                                                        value={dose} onChange={(e) => setDose(e.target.value)}
                                                    />
                                                    <Input type="text" placeholder="عدد التكرار"
                                                        value={frequency} onChange={(e) => setFrequency(e.target.value)}
                                                    />
                                                    <div className="d-flex flex-wrap gap-2 justify-content-between">
                                                        <DrawerClose>
                                                            <Button variant="outline">الغاء</Button>
                                                        </DrawerClose>
                                                        <Button variant="default" onClick={(e) => handleEditMedications(e, medication._id)}>تعديل</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                                {/* Delete */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-5 w-5" />
                                            <span className="sr-only">حذف الدواء</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle> هل انت متأكد من الحذف ؟</AlertDialogTitle>
                                            <AlertDialogDescription>{medication.name}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <div className="d-flex align-items-center m-auto gap-2">
                                                <AlertDialogCancel className='m-0'>الغاء</AlertDialogCancel>
                                                <AlertDialogAction className='bg-danger' onClick={(e) => handleDeleteMedications(e, medication._id)}>
                                                    حذف
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>

                    ))
                    : <div className='fs-4 text-center'>لا يوجد أدوية 😪</div>
            }
        </Card>
    )
}

export default CurrentMedicationsTab
