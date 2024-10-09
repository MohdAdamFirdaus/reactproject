import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Person } from './model/Person';
import Home from './components/Home';
import PersonList from './components/PersonList';
import AddPerson from './components/AddPerson';
import './App.css'; // Import your CSS file

const App: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [persons]);

  const addPerson = (person: Person) => {
    setPersons([...persons, person]);
  };

  return (
    <Router>
      <nav className="bg-teal-600 p-2 shadow-md">
        <div className="container mx-auto">
          <ul className="flex justify-around items-center">
            <li>
              <Link to="/" className="text-white hover:text-blue-300 text-lg font-semibold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/add-person" className="text-white hover:text-blue-300 text-lg font-semibold">
                Add Person
              </Link>
            </li>
            <li>
              <Link to="/person-list" className="text-white hover:text-blue-300 text-lg font-semibold">
                Person List
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/add-person"
            element={<AddPerson onAddPerson={addPerson} inputRef={inputRef} />}
          />
          <Route path="/person-list" element={<PersonList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
