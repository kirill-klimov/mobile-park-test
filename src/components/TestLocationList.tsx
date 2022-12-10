import { useState } from "react";
import { TestLocationForm } from "./TestLocationForm";

import { ReactComponent as PlusIcon } from '../assets/plus.svg'
import { TestLocation } from "../store";

export const TestLocationsList = () => {

    const blank: TestLocation = {
      locationID: 0,
      envID: 0,
      hint: ''
    }
  
    const [locationsList, setLocationsList] = useState<TestLocation[]>([blank]);

    function handleLocationDelete(index: number) {
      const newLocationsList = [...locationsList];
      newLocationsList.splice(index, 1);
      setLocationsList(newLocationsList);
    }

    function handleLocationUpdate(index: number, location: TestLocation) {
      const newLocationsList = [...locationsList];
      newLocationsList[index] = location;
      setLocationsList(newLocationsList);
    }
  
    return (
      <>
        {locationsList.map((location, index) => (
          <TestLocationForm 
          key={`location-${index}`}
          onLocationDelete={() => handleLocationDelete(index)}
          onLocationUpdate={(data: TestLocation) => handleLocationUpdate(index, data)}
          index={index}
          testLocation={location} />
        ))}
        <div className="mt-4 flex flex-wrap justify-end">
          <button
            className="border-2 border-blue-400 rounded text-blue-400 flex items-center p-2 mr-4"
            onClick={() => {
              console.log(locationsList);
            }}>
            <span>Вывести результат в консоль</span>
          </button>

          <button
            className="border-2 border-blue-400 rounded text-blue-400 flex items-center p-2"
            onClick={() => {
              setLocationsList([...locationsList, blank]);
            }}>
            <PlusIcon className="w-6 h-6 fill-blue-400 mr-2" />
            <span>Добавить тестовую локацию</span>
          </button>
        </div>
      </>
    );
  };