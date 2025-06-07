import { Link } from 'react-router-dom'

const AdminNavBar = () => {
    return (
        <div className="adminNavBar text-sm top-0 sticky ">
            <div className="adminNavBar__logo">
                <Link to="/">
                
                <img
                    src="/logo.png"
                    alt="logo"
                    className="w-8 h-8 rounded-full"
                    />
                    </Link>
                <span>Admin Gadaboard</span>
            </div>
            <div className="adminNavBar__links text-white">
                <Link>
                    <img
                        src="/icons8-search (1).svg"
                        className="w-6 h-6"
                        alt=""
                    />{' '}
                </Link>
                <Link>
                    <img
                        src="/icons8-setting.svg"
                        className="w-6 h-6"
                        alt=""
                    />
                </Link>
            </div>
        </div>
    )
}

export default AdminNavBar
