import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";
import { useEffect, useState } from "react";
import { Button } from "../elements/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "../elements/dialog";
import { Field, FieldGroup, Fieldset, Label } from "../elements/fieldset";
import { Listbox, ListboxLabel, ListboxOption } from "../elements/listbox";
import { Avatar } from "../elements/avatar";
import FileInput from "../elements/FileInput";
import { useUserContext } from "../contexts/UserContext";
import { Badge } from "../elements/badge";
import { Input } from "../elements/input";
import { Checkbox, CheckboxGroup, CheckboxField } from "../elements/checkbox";
import FetchFailedAlert from "../components/FetchFailedAlert";

function CreateClaimModal({
  isSubmitting,
  open,
  setOpen,
  vehicles,
  policyholders,
  formData,
  setFormData,
  handleCreateClaim,
}) {
  const [formInvalid, setFormInvalid] = useState(false);

  function handleChangePolicyholderId(value) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      policyholderId: value,
    }));
  }

  function handleChangeVehicleId(value) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vehicleId: value,
    }));
  }

  return (
    <Dialog open={open} onClose={setOpen}>
      <DialogTitle>New Claim</DialogTitle>
      <form onSubmit={(e) => handleCreateClaim(e, formData)}>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Policyholder</Label>
                <Listbox
                  placeholder="Select policyholder&hellip;"
                  value={formData.policyholderId}
                  onChange={handleChangePolicyholderId}
                >
                  {policyholders.map((policyholder) => (
                    <ListboxOption value={policyholder.id} key={policyholder.id}>
                      <Avatar initials={policyholder.firstName.charAt(0) + policyholder.lastName.charAt(0)} />
                      <ListboxLabel>
                        {policyholder.firstName} {policyholder.lastName}
                      </ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              </Field>
              <Field>
                <Label>Vehicle</Label>
                <Listbox
                  placeholder="Select vehicle&hellip;"
                  value={formData.vehicleId}
                  onChange={handleChangeVehicleId}
                >
                  {vehicles.map((vehicle) => (
                    <ListboxOption value={vehicle.id} key={vehicle.id}>
                      <Avatar src={vehicle.imgUrl} />
                      <ListboxLabel>
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </ListboxLabel>
                    </ListboxOption>
                  ))}
                </Listbox>
              </Field>
              <Field>
                <Label>Uploads</Label>
                <FileInput
                  accept=".jpg, .jpeg, .png, .bmp, .svg"
                  label="JPG, PNG, BMP, SVG up to 100MB"
                  multiple
                  formData={formData}
                  setFormData={setFormData}
                  setFormInvalid={setFormInvalid}
                />
              </Field>
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button
            type="submit"
            color="indigo"
            onClick={() => setOpen(false)}
            disabled={
              isSubmitting ||
              formData.policyholderId === null ||
              formData.vehicleId === null ||
              formData.files.length === 0 ||
              formInvalid
            }
          >
            {isSubmitting ? (
              <>
                <Spinner /> Creating...
              </>
            ) : (
              <>
                <PlusIcon /> Create
              </>
            )}
          </Button>
          <Button color="light" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function ClaimList({ claims }) {
  return (
    <ul role="list" className="divide-y divide-gray-100 dark:divide-secondary-700">
      {claims.map((claim) => (
        <li key={claim.id} className="relative flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <Avatar src={claim.vehicle?.imgUrl} className="size-12" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900 dark:text-secondary-100">
                <a href={`/claims/${claim.id}`} className="hover:underline">
                  {claim.vehicle?.make} {claim.vehicle?.model} {claim.vehicle?.year}
                </a>{" "}
                <Badge color={claim.displayStage?.color}>{claim.displayStage?.name}</Badge>
              </p>
              <p className="mt-1 flex text-xs/5 text-gray-500">
                Created: {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <Button color="light" href={`/claims/${claim.id}`}>
                View
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ClaimIndexPage() {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useUserContext();
  const [vehicles, setVehicles] = useState([]);
  const [policyholders, setPolicyholders] = useState([]);
  const [claims, setClaims] = useState([]);
  const [formData, setFormData] = useState({
    policyholderId: null,
    vehicleId: null,
    files: [],
  });
  const [createClaimModalOpen, setCreateClaimModalOpen] = useState(false);
  const stages = [
    { name: "Unassigned", value: "unassigned", color: "zinc" },
    { name: "Assigned", value: "assigned", color: "blue" },
    { name: "In Review", value: "in_review", color: "yellow" },
    { name: "Approved", value: "approved", color: "green" },
  ];

  useEffect(() => {
    setIsFetching(true);
    Promise.all([
      fetch("/api/policyholders/")
        .then((response) => response.json())
        .then((data) => {
          setPolicyholders(data.policyholders);
        }),

      fetch("/api/vehicles/")
        .then((response) => response.json())
        .then((data) => {
          setVehicles(data.vehicles);
        }),

      fetch("/api/claims/")
        .then((response) => response.json())
        .then((data) => {
          setClaims(data.claims);
        }),
    ])
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  function handleCreateClaim(e, formData) {
    e.preventDefault();

    const data = new FormData();
    data.append("create", "");
    data.append("policyholder", formData.policyholderId);
    data.append("vehicle", formData.vehicleId);
    formData.files.forEach((file) => data.append("files", file));

    fetch("/api/claims/", {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setClaims(data.claims);
      });
  }

  claims.forEach((claim) => {
    claim.policyholder = policyholders.find((policyholder) => policyholder.id === claim.policyholderId);
    claim.vehicle = vehicles.find((vehicle) => vehicle.id === claim.vehicleId);
    claim.displayStage = stages.find((stage) => stage.value === claim.stage);
  });

  return (
    <>
      <MultiColumnLayout currentTab="claims">
        <MainColumn>
          <div className="flex gap-4 justify-between items-center">
            <Heading>Claims</Heading>
            <Button color="indigo" onClick={() => setCreateClaimModalOpen(true)}>
              <PlusIcon /> New Claim
            </Button>
          </div>

          {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} />}

          <ClaimList claims={claims} />
        </MainColumn>
        <AsideColumn>
          <Subheading className="mb-4">Filter</Subheading>
          <Input type="text" placeholder="Search claims&hellip;" />

          <Subheading className="mb-4 mt-8">Stages</Subheading>
          <CheckboxGroup>
            {stages.map((stage) => (
              <CheckboxField key={stage.value} value={stage.value}>
                <Checkbox color="indigo" />
                <Label>
                  <Badge color={stage.color}>{stage.name}</Badge>
                </Label>
              </CheckboxField>
            ))}
          </CheckboxGroup>
        </AsideColumn>
      </MultiColumnLayout>

      <CreateClaimModal
        isSubmitting={isSubmitting}
        open={createClaimModalOpen}
        setOpen={setCreateClaimModalOpen}
        vehicles={vehicles}
        policyholders={policyholders}
        formData={formData}
        setFormData={setFormData}
        handleCreateClaim={handleCreateClaim}
      />
    </>
  );
}
