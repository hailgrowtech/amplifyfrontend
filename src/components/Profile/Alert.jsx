import React, { useState } from 'react';

const Alert = () => {
  const [isChecked, setIsChecked] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [name, setName] = useState('');
  const [option1, setOption1] = useState('Option 1');
  const [option2, setOption2] = useState('Option 2');


  const handleAddClick = () => {
    handleFormSubmit(); // Submit notification automatically
  };

  const handleFormSubmit = (event) => {
    if (event) event.preventDefault();
    const newNotification = {
      name: name,
      option1: option1,
      option2: option2,
      isChecked: isChecked
    };
    setNotifications([...notifications, newNotification]);
    setName('');
    setShowForm(false);
    setIsChecked(true);
    console.log("Name:", name);
    console.log("Dropdown 1:", option1);
    console.log("Dropdown 2:", option2);
    console.log("Notification:", isChecked ? "Enabled" : "Disabled");
  };



  return (
    <div className="container bg-transparent p-8 md:p-4 rounded-lg border-2 border-[#ffffff34]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="subheading-color font-bold md:text-[50px] text-[30px] subheading-color md:leading-[50px] leading-[51px]">Alert</h2>
        <button className="bg-[#ffffff21] md:tex-xl text-[15px] text-white py-2 px-8 rounded-md" onClick={handleAddClick}>+Add</button>
      </div>
      <div className="text-white mt-4">
        {notifications.map((notification, index) => (
          <div key={index} className="w-full flex flex-col md:flex-row items-center md:space-x-4 border-[1px] border-[#ffffff20] rounded-lg py-5 px-3 mt-3">
            <input
              type="text"
              placeholder='Enter Name'
              style={{ background:"transparent", border:"0", color:"#fff"}}
              value={notification.name}
              onChange={(e) => {
                const updatedNotifications = [...notifications];
                updatedNotifications[index].name = e.target.value;
                setNotifications(updatedNotifications);
              }}
              className="block border-0 bg-transparent text-white rounded-md py-2 px-3 w-50 mb-2 md:mb-0 md:text-left text-center md:text-[20px] text-xl"
            />
            <div className="flex flex-row md:flex-row items-center md:space-x-4 w-full md:gap-10 gap-3">
              <select
                value={notification.option1}
                onChange={(e) => {
                  const updatedNotifications = [...notifications];
                  updatedNotifications[index].option1 = e.target.value;
                  setNotifications(updatedNotifications);
                }}
                className="block border-0 bg-transparent text-white rounded-md py-2 px-3 md:w-50 w-100"
                
              >
                <option value="Option 1" className='text-black'>Option 1</option>
                <option value="Option 2" className='text-black'>Option 2</option>
                <option value="Option 3" className='text-black'>Option 3</option>
              </select>
              <select
                value={notification.option2}
                onChange={(e) => {
                  const updatedNotifications = [...notifications];
                  updatedNotifications[index].option2 = e.target.value;
                  setNotifications(updatedNotifications);
                }}
                className="block border-0 bg-transparent text-white rounded-md py-2 px-3 md:w-50 w-100"
                
              >
                <option value="Option 1" className='text-black'>Option 1</option>
                <option value="Option 2" className='text-black'>Option 2</option>
                <option value="Option 3" className='text-black'>Option 3</option>
              </select>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notification.isChecked}
                onChange={() => {
                  const updatedNotifications = [...notifications];
                  updatedNotifications[index].isChecked = !notification.isChecked;
                  setNotifications(updatedNotifications);
                }}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-00 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alert;
