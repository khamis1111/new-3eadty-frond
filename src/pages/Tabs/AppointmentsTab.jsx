import { Calendar, Clock, User } from 'lucide-react';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';

const AppointmentsTab = ({ user, allAppointment }) => {
    const appointment = allAppointment.data?.filter(appointment => appointment.patientName === user.name)

    return (
        <Card className='bg-gray-100 shadow-none '>
            <CardHeader>
                <CardTitle>مواعيد هذا المريض</CardTitle>
                <Separator className="mt-3" />
            </CardHeader>
            <CardContent style={{ direction: 'rtl' }} className='d-flex flex-column gap-2'>
                {
                    appointment && appointment.length > 0 ?
                        appointment.map((appointment) => (
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center flex-wrap gap-2">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <Calendar className="h-5 w-5" />
                                            <span className="font-semibold">{moment(appointment.date).format('MM/DD dddd')}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <Clock className="h-5 w-5" />
                                            <span>{moment(appointment.date).format('hh:mm A')}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <span className="font-semibold">التفاصيل</span>
                                            <span>{appointment.description}</span>
                                        </div>
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <span className="font-semibold">الطبيب</span>
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <User className="h-5 w-5" />
                                                <span>حسين حشاد</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                        : <div className='fs-4 text-center'>لا يوجد مواعيد لهذا المريض 😪</div>
                }
            </CardContent>
        </Card>
    )
}

export default AppointmentsTab
