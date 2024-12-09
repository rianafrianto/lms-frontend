import React, { useContext, useEffect } from 'react'
import { CourseContext } from '../context/CourseContext'
import Navbar from '../components/Navbar'
import { Button, Image, Spin } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom'

const CourseDetailPage = () => {
    const { id } = useParams()
    const {
        detailCourse,
        loading,
        navigate,
        fetchDetailCourse,
        user
    } = useContext(CourseContext)

    useEffect(() => {
        fetchDetailCourse(id)
    }, [id])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        )
    }

    const handleBack = () => {
        if (user?.role === "admin") {
            navigate("/admin-dashboard")
        } else {
            navigate("/user-dashboard")
        }
    }

    const handleViewCourse = (lessons) => {
        if (user?.role === "admin") {
            navigate(`/admin-dashboard/detail/play/${id}`, { state: { lessons } });
        } else {
            navigate(`/user-dashboard/detail/play/${id}`, { state: { lessons } });
        }
    };

    return (
        <>
            <Navbar />
            <div className='container mx-auto p-10 bg-white shadow-lg rounded-lg max-w-full'>
                <div className="relative mb-8">
                    <h1 className="text-3xl font-semibold text-center">{detailCourse?.title || "Course Detail"}</h1>
                    <Button
                        type="primary"
                        onClick={handleBack}
                        icon={<ArrowLeftOutlined />}
                        className="absolute right-0 top-0 mt-1"
                    >
                        Back to Course
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 h-full">
                    {/* Left side: Image and additional content */}
                    <div className="col-span-2 h-[50%]">
                        {/* Image */}
                        <Image
                            src={detailCourse?.coverImage}
                            alt="Course Cover"
                            className="w-full border h-auto rounded-lg shadow-md"
                            preview={true}
                        />

                        {/* Additional Content */}
                        <div className="mt-4">
                            <p className="text-gray-600">
                                {detailCourse?.description ? (
                                    <span dangerouslySetInnerHTML={{ __html: detailCourse.description }} />
                                ) : (
                                    "No description available for this course."
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Right side: Units */}
                    <div className="col-span-1 h-[55%]">
                        <div className="border p-4 rounded-lg shadow-md h-full flex flex-col justify-between">
                            <h3 className="text-lg font-semibold mb-4">Course Content</h3>

                            <ul className="space-y-3 flex-grow">
                                {detailCourse?.units?.map((unit) => (
                                    <li key={unit.unit_id} className="flex items-center">
                                        <CheckCircleOutlined className="text-green-500 mr-2" />
                                        <span className="text-sm font-medium">{unit.title}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 text-center">
                                <Button
                                    type="primary"
                                    className="rounded-md shadow"
                                    onClick={() =>
                                        handleViewCourse(
                                            detailCourse.units.flatMap((unit) => unit.lessons || [])
                                        )
                                    }
                                >
                                    View Course
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default CourseDetailPage
