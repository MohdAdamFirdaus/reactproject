import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Person } from '../model/Person';

const fetchPersons = async (): Promise<Person[]> => {
  const { data } = await axios.get('http://localhost:3060/api/people');
  return data.map((person: any) => new Person(person.id, person.name, person.email, person.phone, person.address));
};

const updatePerson = async (person: Person) => {
  const { data } = await axios.put(`http://localhost:3060/api/people/${person.id}`, person);
  return new Person(data.id, data.name, data.email, data.phone, data.address);
};

const deletePerson = async (id: number) => {
  if (!id) {
    console.error('No ID provided for deletion');
    return;
  }
  try {
    await axios.delete(`http://localhost:3060/api/people/${id}`);
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;
  }
};

const PersonList: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [updatedPerson, setUpdatedPerson] = useState<Person | null>(null);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

  const { data: persons = [], isLoading, isError, error } = useQuery<Person[], Error>(['persons'], fetchPersons);

  const updatePersonMutation = useMutation(updatePerson, {
    onSuccess: () => {
      queryClient.invalidateQueries(['persons']); 
      setEditingPerson(null); // Close the modal after update
    },
  });

  const deletePersonMutation = useMutation(deletePerson, {
    onSuccess: () => {
      queryClient.invalidateQueries(['persons']);
    },
  });

  const handleUpdate = (person: Person) => {
    setEditingPerson(person);
    setUpdatedPerson(person);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedPerson) {
      setUpdatedPerson({ ...updatedPerson, [e.target.name]: e.target.value });
    }
  };

  const handleFormSubmit = () => {
    if (updatedPerson) {
      updatePersonMutation.mutate(updatedPerson);
    }
  };

  const handleDelete = (person: Person) => {
    setPersonToDelete(person);
  };

  const confirmDelete = () => {
    if (personToDelete && personToDelete.id) {
      deletePersonMutation.mutate(personToDelete.id);
      setPersonToDelete(null);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/50 ...'>
      <h2 className='mb-4 text-xl font-extrabold text-white dark:text-white md:text-xl lg:text-xl'>Person List</h2>
      {persons.length > 0 ? (
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 '>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => (
              <tr key={person.id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.phone}</td>
                <td>{person.address}</td>
                <td>
                  <button
                    onClick={() => handleUpdate(person)}
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(person)}
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No persons added yet.</p>
      )}

      {/* Delete Confirmation Modal */}
      {personToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete {personToDelete.name}?</h3>
            <button
              onClick={confirmDelete}
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Yes, I'm sure
            </button>
            <button
              onClick={() => setPersonToDelete(null)}
              className="text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              No, cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit form Modal */}
      {editingPerson && updatedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className='mb-4 text-xl font-extrabold text-gray-900 dark:text-white'>Edit Person</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Name:
                <input
                  className='rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  type="text"
                  name="name"
                  value={updatedPerson.name}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Email:
                <input
                  className='rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  type="email"
                  name="email"
                  value={updatedPerson.email}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Phone:
                <input
                  className='rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  type="text"
                  name="phone"
                  value={updatedPerson.phone}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Address:
                <input
                  className='rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  type="text"
                  name="address"
                  value={updatedPerson.address}
                  onChange={handleFormChange}
                />
              </label>
              <br />
              <button
                type="submit"
                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingPerson(null)} 
                className="text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonList;
