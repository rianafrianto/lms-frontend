import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from 'antd';
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

const CoursePlay = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const lessons = location.state?.lessons || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < lessons.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const renderContent = (lesson) => {

        const { content_type, mediaUrl, title } = lesson;
        switch (content_type) {
            case "pdf":
                return (
                    <div
                        key={lesson.lesson_id}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <div style={{ width: '80%', height: '90%' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>{title}</h3>
                            <iframe
                                src={mediaUrl}
                                title="Uploaded PDF"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                }}
                            />
                        </div>
                    </div>
                );

            case "image":
                return (
                    <div
                        key={lesson.lesson_id}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <h3 style={{ marginBottom: '16px' }}>{title}</h3>
                            <img
                                src={mediaUrl}
                                alt={title}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                }}
                            />
                        </div>
                    </div>
                );

            case "url":
                return (
                    <div
                        key={lesson.lesson_id}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <div style={{ width: '80%', height: '90%' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>{title}</h3>
                            <iframe
                                src={mediaUrl}
                                title={title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                }}
                            />
                        </div>
                    </div>
                );

            case "video":
                return (
                    <div
                        key={lesson.lesson_id}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <div style={{ width: '80%', height: '90%' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>{title}</h3>
                            <video
                                controls
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 8,
                                    border: '1px solid #ddd',
                                }}
                            >
                                <source src={mediaUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                );

            default:
                return (
                    <div
                        key={lesson.lesson_id}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <div style={{ width: '80%', height: '90%', textAlign: 'center' }}>
                            <h3>{title}</h3>
                            <p>No media available for this content type.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 10,
                        display: 'flex',
                        gap: '10px',
                    }}
                >
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Back to Course
                    </Button>
                    <Button
                        type="default"
                        icon={<LeftOutlined />}
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        type="default"
                        icon={<RightOutlined />}
                        onClick={handleNext}
                        disabled={currentIndex === lessons.length - 1}
                    >
                        Next
                    </Button>
                </div>

                <div>{renderContent(lessons[currentIndex])}</div>
            </div>
        </>
    );
};

export default CoursePlay;
