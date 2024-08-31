import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaUserInjured } from "react-icons/fa6";
import { IoCalendarSharp } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import './Dashboard.css';
import { AppointmentTableHome } from '../../components/Tables/AppointmentTableHome';
import ChartCircle from '../../components/Charts/ChartCircle';
import { Calendar } from '../../components/ui/calendar';
import { Card } from '../../components/ui/card';
import { Link } from 'react-router-dom';

const Dashboard = ({ getAllAppointment, allUser, allAppointment, loading }) => {
  const UsersPaid = loading ? allUser.data?.filter((user) => user.isPaid === true) : []
  const UsersNotPaid = loading ? allUser.data?.filter((user) => user.isPaid === false) : []

  return (
    <Row>
      <div className='d-flex gap-1 align-items-center mb-4'>
        <MdSpaceDashboard size={40} className='main-color' />
        <div className='fs-2 p-0'>
          لوحة التحكم
        </div>
      </div>
      <Col lg={9} className='dashboard d-flex flex-column gap-3 p-2'>
        <div className='d-flex card-home flex-wrap gap-3'>
          <Col className='p-0'>
            <Card id='active-card' className='p-3 rounded-5 shadow'>
              <div className='bg-body-secondary shadow d-inline-block text-dark p-2 rounded-4 mb-2'>
                <FaUserInjured size={35} />
              </div>
              <p className='opacity-75 fs-5'>مجموع المرضي</p>
              <p className='fs-2 m-0'>{allUser.results} مريض</p>
            </Card>
          </Col>
          <Col className='p-0'>
            <Card className='p-3 rounded-5'>
              <div className='bg-body-secondary shadow d-inline-block text-dark p-2 rounded-4 mb-2'>
                <IoCalendarSharp size={35} />
              </div>
              <p className='opacity-75 fs-5'>مجموع المواعيد</p>
              <p className='fs-2 m-0'>{allAppointment.results} {allAppointment.results === 1 ? 'موعد' : 'مواعيد'}</p>
            </Card>
          </Col>
        </div>
        <Col lg={12}>
          <Card className='p-3 rounded-5'>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className='bg-body-secondary shadow d-inline-block text-dark p-2 rounded-4 mb-2'>
                  <IoCalendarSharp size={40} />
                </div>
                <div className='lh-sm'>
                  <p className='fs-3 m-0'>المواعيد</p>
                  <p className='opacity-75 fs-6'>تابع كل مواعيدك</p>
                </div>
              </div>
              <Link to={'/appointments'} className="btn bg-color text-light fw-bold py-2 px-4 shadow">المزيد عن المواعيد</Link>
            </div>
            <AppointmentTableHome getAllAppointment={getAllAppointment} allUser={allUser} allAppointment={allAppointment} loading={loading} />
          </Card>

        </Col>
      </Col>
      <Col lg={3} className='d-flex flex-column gap-3 p-2'>
        <Card className="flex justify-center align-items-center flex-column rounded-5">
          <ChartCircle UsersPaid={UsersPaid} UsersNotPaid={UsersNotPaid} />
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-5 text-center"
          />
        </Card>
      </Col>
    </Row>

  )
}

export default Dashboard
