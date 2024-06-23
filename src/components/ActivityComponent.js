import React, {useState} from "react";

export const ActivityComponent = (props) => {
  const [activity, setActivity] = useState(props.activity);
  const [isCollapsed, setIsCollapsed] = useState(false);


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex mb-2">
      <div className={`w-1/4 flex items-center justify-center ${activity.mapType().color}`}>
        <p className='text-md text-white text-center'>{activity.mapType().emoji}</p>
      </div>

      <div class="w-3/4 p-2">

        <div onClick={toggleCollapse}>
          <span className="text-sm font-bold mb-2">
            {activity.name + " "}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 className={`inline h-4 w-4 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              <path fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414zM10 18a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"/>
            </svg>
          </span>

        </div>

        <div
          className={`text-sm text-left overflow-hidden transition-max-height duration-300 ${isCollapsed ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="px-4 py-2">
            <p class="text-gray-700">Address - {activity.address}</p>
            <p class="text-gray-700">Notes - {activity.details}</p>
          </div>
        </div>

      </div>
    </div>
  )
};
