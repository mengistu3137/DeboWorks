import { useSearchParams } from "react-router-dom"

const Jobs = () => {

    const fields = [
        { label: 'Accounting and Finance', value: 'Accounting-and-Finance' },
        {
            label: 'Admin, Secretarial, and Clerical',
            value: 'Admin-Secretarial-and-Clerical',
        },
        { label: 'Agriculture', value: 'Agriculture' },
        {
            label: 'Architecture and Construction',
            value: 'Architecture-and-Construction',
        },
        { label: 'Automotive', value: 'Automotive' },
        { label: 'Banking and Insurance', value: 'Banking-and-Insurance' },
        {
            label: 'Business and Administration',
            value: 'Business-and-Administration',
        },
        { label: 'Business Development', value: 'Business-Development' },
        {
            label: 'Consultancy and Training',
            value: 'Consultancy-and-Training',
        },
        { label: 'Creative Arts', value: 'Creative-Arts' },
        { label: 'Customer Service', value: 'Customer-Service' },
        {
            label: 'Development and Project Management',
            value: 'Development-and-Project-Management',
        },
        { label: 'Economics', value: 'Economics' },
        { label: 'Education', value: 'Education' },
        { label: 'Engineering', value: 'Engineering' },
        {
            label: 'Environment and Natural Resource',
            value: 'Environment-and-Natural-Resource',
        },
        { label: 'Event Management', value: 'Event-Management' },
        {
            label: 'Graduate and Management Trainee',
            value: 'Graduate-and-Management-Trainee',
        },
        { label: 'Health Care', value: 'Health-Care' },
        { label: 'Hotel and Hospitality', value: 'Hotel-and-Hospitality' },
        {
            label: 'Human Resource and Recruitment',
            value: 'Human-Resource-and-Recruitment',
        },
        {
            label: 'IT, Computer Science and Software Engineering',
            value: 'IT-Computer-Science-and-Software-Engineering',
        },
        { label: 'Legal', value: 'Legal' },
        {
            label: 'Logistics, Transport and Supply Chain',
            value: 'Logistics-Transport-and-Supply-Chain',
        },
        { label: 'Management', value: 'Management' },
        { label: 'FMCG and Manufacturing', value: 'FMCG-and-Manufacturing' },
        {
            label: 'Communications, Media and Journalism',
            value: 'Communications-Media-and-Journalism',
        },
        { label: 'Natural Sciences', value: 'Natural-Sciences' },
        { label: 'Pharmaceutical', value: 'Pharmaceutical' },
        {
            label: 'Purchasing and Procurement',
            value: 'Purchasing-and-Procurement',
        },
        { label: 'Quality Assurance', value: 'Quality-Assurance' },
        {
            label: 'Research and Development',
            value: 'Research-and-Development',
        },
        {
            label: 'Retail, Wholesale and Distribution',
            value: 'Retail-Wholesale-and-Distribution',
        },
        { label: 'Sales and Marketing', value: 'Sales-and-Marketing' },
        { label: 'Security', value: 'Security' },
        { label: 'Technology', value: 'Technology' },
        {
            label: 'Social Sciences and Community Service',
            value: 'Social-Sciences-and-Community-Service',
        },
        { label: 'Telecommunications', value: 'Telecommunications' },
        { label: 'Travel and Tourism', value: 'Travel-and-Tourism' },
        { label: 'Veterinary Services', value: 'Veterinary-Services' },
        {
            label: 'Warehouse, Supply Chain and Distribution',
            value: 'Warehouse-Supply-Chain-and-Distribution',
        },
        { label: 'Water and Sanitation', value: 'Water-and-Sanitation' },
    ]
    const firstColumnFields = fields.slice(0,21)
    const secondColumnFields = fields.slice(21)
   
        const [searchParams, setSearchParams] = useSearchParams();
      
        const handleCategoryChange = (Category) => {
            if (searchParams.get("cat") !== Category) {
                setSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    cat: Category
                });
            }
        };
      
        return (
            <div className="flex flex-col items-center font-light text-white bg-debo-blue/25 w-[80%] rounded-xl">
                <form className="flex flex-col gap-2 w-2/3 items-center mt-2">
                    <div className="flex gap-16 ">
                        <div className="flex flex-col gap-2 ">
                            {firstColumnFields.map(field => (
                                <div
                                    key={field.value}
                                    className="flex gap-2 items-center hover:text-blue-500 "
                                    onClick={() =>
                                        handleCategoryChange(`${field.value}`)
                                    }>
                                    <input
                                        type="checkbox"
                                        name="field"
                                        id={field.value}
                                        value={field.value}
                                        className=" w-4 h-4 bg-white outline-blue-500"
                                    />
                                    <label
                                        htmlFor={field.value}
                                        className="cursor-pointer">
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2">
                            {secondColumnFields.map(field => (
                                <div
                                    key={field.value}
                                    className="flex gap-2 items-center  hover:text-blue-500">
                                    <input
                                        type="checkbox"
                                        name="field"
                                        id={field.value}
                                        value={field.value}
                                        className=" w-4 h-4  bg-white"
                                    />
                                    <label
                                        htmlFor={field.value}
                                        className="cursor-pointer">
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        )
    }

export default Jobs