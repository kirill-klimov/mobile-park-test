import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Env, storeContext, TestLocation } from "../store";

import { ReactComponent as LocationIcon } from '../assets/location.svg'
import { ReactComponent as TubeIcon } from '../assets/tube.svg'
import { ReactComponent as LeafIcon } from '../assets/leaf.svg'
import { ReactComponent as ServerIcon } from '../assets/server.svg'
import { ReactComponent as QuestionIcon } from '../assets/question.svg'
import { ReactComponent as TrashIcon } from '../assets/trash.svg'

interface IProps {
  index: number
  onLocationDelete: Function
  onLocationUpdate: Function
  testLocation: TestLocation
}

export const TestLocationForm = observer(function TestLocationForm(props: IProps) {
    const store = useContext(storeContext);

    useEffect(() => {
      if (!store.isLoaded) {
        store.fetchData();
        return
      }

      props.onLocationUpdate({
        ...props.testLocation,
        locationID: store.locations[0].locationID,
        envID: filterEnvs(store.locations[0].locationID)[0].envID,
      })

    }, [store.isLoaded])

    function filterEnvs(locationId: number) {
      const servers = store.servers.filter(server => server.locationID === locationId);
      const envs = new Set<Env>()
      servers.forEach(server => {
        const env = store.envs.filter(e => e.envID === server.envID)[0];
        envs.add(env);
      })
      const envsArr = Array.from(envs);
      return envsArr;
    }

    function handleChange(e: any) {
      let newTestLocation;

      if (e.target.name === 'locationID') {
        newTestLocation = {
          ...props.testLocation,
          locationID: e.target.value,
          envID: String(filterEnvs(+e.target.value)[0].envID),
        }
      } else {
        newTestLocation = {
          ...props.testLocation,
          [e.target.name]: e.target.value
        }
      }

      props.onLocationUpdate({
        ...newTestLocation,
        locationID: +newTestLocation.locationID,
        envID: +newTestLocation.envID,
      });
    }

    return (
      <div className="shadow-md p-6 mb-4 relative">
        <TrashIcon 
        onClick={() => props.onLocationDelete && props.onLocationDelete()}
        className="absolute right-4 top-4 w-6 h-6 fill-red-500 cursor-pointer" />
        <div className="flex items-center mb-4">
          <TubeIcon className="h-8 w-8 mr-3" />
          <span className="text-xl font-medium">Тестовая локация {props.index + 1}</span>
        </div>
        {
          !store.isLoaded ? <span>Загрузка...</span> :
          <form className="flex flex-wrap">

            <label className="flex items-center mb-4 mr-4">
              <span className="mr-4">Локация</span>
              <div className="relative flex items-center">
                <LocationIcon className="absolute left-2 h-4 w-4 z-10" />
                <select
                name="locationID"
                value={props.testLocation?.locationID}
                onChange={handleChange} 
                className="bg-transparent border-2 rounded py-2 px-6">
                  {
                    !store.locations?.length ? <></> :
                    store.locations?.map((location, i) => {
                      return <option 
                      key={location.name + i}
                      value={location.locationID}>{location.name}</option>                  
                    })
                  }
                </select>
              </div>
            </label>

            <label className="flex items-center mb-4 mr-4">
              <span className="mr-4">Среда</span>
              <div className="relative flex items-center">
                <LeafIcon className="absolute left-2 h-4 w-4 z-10" />
                <select 
                value={props.testLocation?.envID}
                name="envID"
                onChange={handleChange}
                className="bg-transparent border-2 rounded py-2 px-6">
                  {
                    filterEnvs(+props.testLocation.locationID).map((env, i) => {
                      return <option 
                      key={env.name + i}
                      value={env.envID}>{env.name}</option>                  
                    })
                  }
                </select>
              </div>
            </label>

            <div className="flex items-center mb-4">
              <span className="mr-4">Серверы</span>
              <ServerIcon className="h-4 w-4 mr-2" />
              {
                !store.servers?.length ? <></> :
                store.servers?.filter(server => {
                  return server.envID === +props.testLocation.envID && 
                  server.locationID === +props.testLocation.locationID
                })
                .map((server, i, arr) => {
                  return <span
                  key={server.name + i} 
                  className="mr-1">{server.name}{i === arr.length-1 ? '' : ','}</span>
                })
              }
            </div>

            <label className="flex items-center grow min-w-full">
              <span className="mr-4">Подсказка</span>
              <div className="flex items-center relative w-full">
                <QuestionIcon className="absolute h-4 w-4 left-2" />
                <input 
                value={props.testLocation?.hint}
                name="hint"
                onChange={handleChange}
                type="text" 
                className="border-2 py-2 px-4 pl-7 w-full rounded"
                placeholder="Комментарий по локации" />
              </div>
            </label>

          </form>
        }
      </div>
    );
  });