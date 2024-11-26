const Header = (props) => {
    const { type } = props;
    return (
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 shadow-lg rounded-lg mx-auto mb-6 max-w-full">
            <h1 className="text-3xl font-bold text-center sm:text-4xl">{type} Dashboard</h1>
            <div className="w-16 h-1 bg-white mx-auto mt-6 mb-4"></div>
            <p className="text-center text-lg sm:text-xl">
              {type === "Admin" ? "Manage the courses submitted by users with ease." : "Create and submit your courses for review."}  
            </p>
        </div>
    )
}

export default Header
