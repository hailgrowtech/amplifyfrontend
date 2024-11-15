import React from 'react';

const data = [
    {
      transcationId: '#12324654685',
      date: '26/01/2024',
      subscription: 'Expertise Basic',
      name: 'Rohit Aggi',
      amount: '₹1,999 ',
      invoice: 'INV001'
    },
    {
        transcationId: '#12324654685',
        date: '26/01/2024',
        subscription: 'Expertise Basic',
        name: 'Rohit Aggi',
        amount: '₹1,999 ',
        invoice: 'INV001'
      },
      {
        transcationId: '#12324654685',
        date: '26/01/2024',
        subscription: 'Expertise Basic',
        name: 'Rohit Aggi',
        amount: '₹1,999 ',
        invoice: 'INV001'
      },
      {
        transcationId: '#12324654685',
        date: '26/01/2024',
        subscription: 'Expertise Basic',
        name: 'Rohit Aggi',
        amount: '₹1,999 ',
        invoice: 'INV001'
      },
      {
        transcationId: '#12324654685',
        date: '26/01/2024',
        subscription: 'Expertise Basic',
        name: 'Rohit Aggi',
        amount: '₹1,999 ',
        invoice: 'INV001'
      },
      {
        transcationId: '#12324654685',
        date: '26/01/2024',
        subscription: 'Expertise Basic',
        name: 'Rohit Aggi',
        amount: '₹1,999 ',
        invoice: 'INV001'
      },
      {
        transcationId: '#12324654685',
        date: '26/01/2024',
        subscription: 'Expertise Basic',
        name: 'Rohit Aggi',
        amount: '₹1,999 ',
        invoice: 'INV001'
      },
      {
        transcationId: '#12324654685',
        date: '26/01/2024',
        subscription: 'Expertise Basic',
        name: 'Rohit Aggi',
        amount: '₹1,999 ',
        invoice: 'INV001'
      },
      {
        transcationId: '#12324654685',
        date: '26/01/2024',
        subscription: 'Expertise Basic',
        name: 'Rohit Aggi',
        amount: '₹1,999 ',
        invoice: 'INV001'
      },
  ];

  const TableData = () => {
    return (
      <div className="flex justify-center items-center">
        <table className='w-[1234px] h-[797px] px-[1rem] bg-[#18181B] bg-opacity-[50%] rounded-[30px]'>
          <thead className='text-dimWhite w-[1234px] h-[51px]'>
            <tr>
              <th className='py-2 px-4'>Transcation ID</th>
              <th className='py-2 px-4'>Date</th>
              <th className='py-2 px-4'>Subscription</th>
              <th className='py-2 px-4'>Name</th>
              <th className='py-2 px-4'>Amount</th>
              <th className='py-2 px-4'>Invoice</th>
            </tr>
          </thead>
          <tbody className='text-lightWhite w-[1234px] h-[81px]'>
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-[#1E1E22]' : ''}>
                <td className='py-2 px-20 w-[152px] h-[18px] font-[500] text-[16px] leading-[18px]'>{row.transcationId}</td>
                <td className='py-2 px-20 w-[105px] h-[18px] font-[500] text-[16px] leading-[18px]'>{row.date}</td>
                <td className='py-2 px-20 w-[143px] h-[36px] font-[500] text-[16px] leading-[18px]'>{row.subscription}</td>
                <td className='py-2 px-20 w-[105px] h-[18px] font-[500] text-[16px] leading-[18px]'>{row.name}</td>
                <td className='py-2 px-20 w-[105px] h-[18px] font-[500] text-[16px] leading-[18px]'>{row.amount}</td>
                <td className='py-2 px-20'>{row.invoice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default TableData;