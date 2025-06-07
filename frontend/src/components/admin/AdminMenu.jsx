
import { Link } from "react-router-dom";
import { menu } from "../../../data";

const AdminMenu = () => {
  return (
    <div className='AdminMenu text-sm gap-4 '>
      {menu.map((item) => (
        <div className="item mb-2 " key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <Link className="listItem py-2" key={listItem.id} to={listItem.url || '#'}> {/* Added a default '#' if listItem.url is missing */}
              <img src={listItem.icon} className="w-5 h-5 "  /> {/* Added alt attribute for accessibility */}
              <span className="listItemTitle">{listItem.title}</span>
              
            </Link>
            
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminMenu;