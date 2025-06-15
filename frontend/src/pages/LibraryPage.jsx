import { Fragment, useEffect, useState } from "react";
import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";
import { Button } from "../elements/button";
import { Text } from "../elements/text";
import FetchFailedAlert from "../components/FetchFailedAlert";
import { PaperClipIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Avatar } from "../elements/avatar";
import { useUserContext } from "../contexts/UserContext";

function VehicleList({ vehicles }) {
  return vehicles.length > 0 ? (
    <ul role="list" className="divide-y divide-secondary-100 dark:divide-secondary-700">
      {vehicles.map((vehicle) => (
        <Fragment key={vehicle.id}>
          <li key={vehicle.id} className="relative flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img alt="" src={vehicle.imgUrl} className="size-12 flex-none rounded-full bg-secondary-50" />
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-secondary-900 dark:text-secondary-100">
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {vehicle.make} {vehicle.model}
                </p>
                <p className="mt-1 flex text-xs/5 text-secondary-500">{vehicle.year}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <Button color="light">Details</Button>
              </div>
            </div>
          </li>
          {vehicle.parts.map((part) => (
            <li key={part.id} className="relative flex justify-between gap-x-6 py-5 ml-22">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-secondary-900 dark:text-secondary-100">
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {part.name}
                  </p>
                  <p className="mt-1 flex text-xs/5 text-secondary-500">${part.cost}</p>
                </div>
              </div>
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  ) : (
    <Text>No vehicles yet.</Text>
  );
}

function LibraryAssistant({ user }) {
  return (
    <div className="flex flex-col h-full items-center">
      <div className="w-full">
        <Subheading>Assistant</Subheading>
      </div>

      <div className="grow my-10 mx-auto text-sm text-center">
        <div className="flex items-center text-primary-500 justify-center">
          <SparklesIcon className="size-5 mr-1" /> Ask me about anything in the library.
        </div>
        <div className="mt-3 flex flex-col gap-y-1">
          <span className="text-secondary-500">"How many claims were filed in Florida for a 2025 Porsche 911?"</span>
          <span className="text-secondary-500">"Which claims had a rear-ended Ferrari 488 GTB?"</span>
          <span className="text-secondary-500">"What is the cost of a spark plug for a 2025 McLaren P1?"</span>
        </div>
      </div>

      <div className="flex w-full gap-x-3">
        <Avatar className="size-6 flex-none" initials={user.firstName[0] + user.lastName[0]} />
        <form action="#" className="relative flex-auto">
          <div className="overflow-hidden rounded-lg pb-12 outline outline-1 -outline-offset-1 outline-secondary-300 dark:outline-secondary-600 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
            <textarea
              id="comment"
              name="comment"
              rows={2}
              placeholder="Submit your chat..."
              className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline focus:outline-0 sm:text-sm/6"
              defaultValue={""}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex size-10 items-center justify-center rounded-full text-secondary-400 hover:text-secondary-500"
                >
                  <PaperClipIcon aria-hidden="true" className="size-5" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
            </div>
            <Button type="submit" color="light">
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [user, setUser] = useUserContext();
  const [vehicles, setVehicles] = useState([]);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    setIsFetching(true);
    Promise.all([
      fetch("/api/vehicles/")
        .then((response) => response.json())
        .then((data) => {
          setVehicles(data.vehicles);
        }),
      fetch("/api/parts/")
        .then((response) => response.json())
        .then((data) => {
          setParts(data.parts);
        }),
    ])
      .then(() => {
        setIsFetching(false);
      })
      .catch(() => {
        setFetchFailed(true);
      });
  }, []);

  vehicles.forEach((vehicle) => {
    vehicle.parts = parts.filter((part) => part.vehicleId === vehicle.id);
  });

  return (
    <MultiColumnLayout currentTab="library">
      <MainColumn>
        <Heading>Library</Heading>

        {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} />}

        <VehicleList vehicles={vehicles} />
      </MainColumn>
      <AsideColumn>
        <LibraryAssistant user={user} />
      </AsideColumn>
    </MultiColumnLayout>
  );
}
