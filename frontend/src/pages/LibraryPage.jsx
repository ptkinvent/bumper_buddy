import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";
import { useEffect, useState } from "react";
import { Button } from "../elements/button";

function VehicleList({ vehicles }) {
  return (
    <ul role="list" className="divide-y divide-gray-100 dark:divide-secondary-700">
      {vehicles.map((vehicle) => (
        <li key={vehicle.id} className="relative flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <img alt="" src={vehicle.imgUrl} className="size-12 flex-none rounded-full bg-gray-50" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900 dark:text-secondary-100">
                <span className="absolute inset-x-0 -top-px bottom-0" />
                {vehicle.make} {vehicle.model}
              </p>
              <p className="mt-1 flex text-xs/5 text-gray-500">{vehicle.year}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <Button color="light">Details</Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function LibraryPage() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch("/api/vehicles/")
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data.vehicles);
      });
  }, []);

  return (
    <MultiColumnLayout currentTab="library">
      <MainColumn>
        <Heading>Library</Heading>
        <VehicleList vehicles={vehicles} />
      </MainColumn>
      <AsideColumn>
        <Subheading>Aside</Subheading>
      </AsideColumn>
    </MultiColumnLayout>
  );
}
