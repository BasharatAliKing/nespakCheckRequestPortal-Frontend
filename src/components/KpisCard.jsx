import React from 'react'
import { CiFileOn } from 'react-icons/ci'
import { FaFile } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'
import { Link } from 'react-router-dom'

const KpisCard = ({handleRfiFormOpen}) => {
  return (
    <div className='border border-gray-200 relative w-full grid grid-cols-2 gap-2  p-4 rounded-lg shadow-md'>
      <div className='bg-green-500 flex flex-col relative col-span-2 p-2 rounded-md  text-white'>
        <h1 className='text-3xl font-medium'>16</h1>
        <p className='text-sm'>Total Requests</p>
        <CiFileOn className='absolute text-5xl text-white right-2 top-0 h-full' />
      </div>
          <div className='bg-yellow-500 flex flex-col relative p-2 rounded-md text-white'>
        <h1 className='text-3xl font-medium'>0</h1>
        <p className='text-sm'>Pending</p>
         <CiFileOn className='absolute text-3xl text-white right-2 top-0 h-full' />
      </div>
      <div className='bg-green-900 flex flex-col relative p-2 rounded-md text-white'>
        <h1 className='text-3xl font-medium'>0</h1>
        <p className='text-sm'>Received</p>
         <CiFileOn className='absolute text-3xl text-white right-2 top-0 h-full' />
      </div>
      <div className='bg-green-700 flex flex-col relative p-2 rounded-md text-white'>
        <h1 className='text-3xl font-medium'>0</h1>
        <p className='text-sm'>Approved</p>
         <CiFileOn className='absolute text-3xl text-white right-2 top-0 h-full' />
      </div>
      <div className='bg-red-400 flex flex-col relative p-2 rounded-md text-white'>
        <h1 className='text-3xl font-medium'>0</h1>
        <p className='text-sm'>Not Approved</p>
         <CiFileOn className='absolute text-3xl text-white right-2 top-0 h-full' />
      </div>
      <div className='bg-red-500 flex flex-col relative p-2 rounded-md text-white'>
        <h1 className='text-3xl font-medium'>0</h1>
        <p className='text-sm'>Expired</p>
         <CiFileOn className='absolute text-3xl text-white right-2 top-0 h-full' />
      </div>
    <div title="Add New RFI" onClick={() => handleRfiFormOpen(true)}>  <IoMdAdd className='absolute text-2xl bg-green-500 text-white right-3 bottom-3 rounded-md p-[2px] h-7 w-7 cursor-pointer' /></div>
    </div>
  )
}

export default KpisCard
