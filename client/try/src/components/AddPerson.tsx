// src/components/AddPerson.tsx
import React, { useState } from 'react';
import { Person } from '../model/Person';

interface AddPersonProps {
  onAddPerson: (person: Person) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const AddPerson: React.FC<AddPersonProps> = ({ onAddPerson, inputRef }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>(''); // Keep it as a string for phone
  const [address, setAddress] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Send POST request to backend to add a person
    fetch('http://localhost:3060/api/add-person', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone: Number(phone), address }), // Sending data directly
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);

        // Create a new instance of the Person class with id
        const newPerson = new Person(data.name, data.email, data.phone, data.address, data.id);

        // Call the onAddPerson function with the new person
        onAddPerson(newPerson);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Clear form fields after submission
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/50 ...'>
      <h2 className='mb-4 text-xl font-extrabold text-white dark:text-white md:text-xl lg:text-xl p-4'>Add Person</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          </span>
          <input
            type="text"
            id="name"
            className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Adam Firdaus"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required />
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Email:</label>
          <input
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number:</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
              <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
            </svg>
          </span>
          <input
            type="text"
            id="phone"
            className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="60182953706"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required />
        </div>
        <div>
          <label>Address:</label>
          <input
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            type="text"
            placeholder='Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <button className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' type="submit">Add Person
          
        </button>
      </form>
    </div>
  );
};

export default AddPerson;
