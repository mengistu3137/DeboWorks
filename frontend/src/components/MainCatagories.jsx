import { useNavigate } from 'react-router-dom'
import Search from './Search'

const MainCatagories = () => {
    const navigate = useNavigate()

    return (
        <div className="hidden md:flex rounded-3xl bg-white p-2 shadow-lg items-center justify-center gap-2 w-full">
            <div className="flex-1 font-sans text-sm space-x-20">
                <button
                    className="bg-gray-300 cursor-pointer hover:text-blue-600 py-1 px-2 rounded-full font-semibold text-debo-dark-blue"
                    onClick={() => navigate(`/filter?type=category`)}>
                    Category
                </button>
                <button
                    className="bg-gray-300 cursor-pointer hover:text-blue-600 py-1 px-2 rounded-full font-semibold text-debo-dark-blue"
                    onClick={() => navigate(`/filter?type=location`)}>
                    Location
                </button>

                <select className="bg-gray-300 cursor-pointer hover:text-blue-600 py-1 px-2 rounded-full font-semibold text-debo-dark-blue ">
                    <option>Senior Executive (C Level)</option>
                    <option> Executive (VP, Director)</option>
                    <option> Senior (5-8 years)</option>
                    <option> Mid Level (3-5 years)</option>
                    <option> Junior Level (1-3 years)</option>
                </select>

                <select className="bg-gray-300 cursor-pointer hover:text-blue-600 py-1 px-2 rounded-full font-semibold text-debo-dark-blue">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Freelance</option>
                    <option>Contract</option>
                </select>
                <select className="bg-gray-300 cursor-pointer hover:text-blue-600 py-1 px-2 rounded-full font-semibold text-debo-dark-blue">
                    <option>Any time</option>
                    <option>Past 24 hours</option>
                    <option>Past week</option>
                    <option>Past Month</option>
                </select>
            </div>
            <span className="text-xl font-medium">|</span>

            <Search />
        </div>
    )
}

export default MainCatagories
