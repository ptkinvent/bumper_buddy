import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";
import { useEffect, useState } from "react";
import { Button } from "../elements/button";
import { EllipsisVerticalIcon, PlusIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Label } from "../elements/fieldset";
import { Avatar } from "../elements/avatar";
import { useUserContext } from "../contexts/UserContext";
import { Badge } from "../elements/badge";
import { Input } from "../elements/input";
import { Checkbox, CheckboxGroup, CheckboxField } from "../elements/checkbox";
import FetchFailedAlert from "../components/FetchFailedAlert";
import {
  CreateClaimModal,
  DeleteClaimModal,
  RemoveClaimAssigneeModal,
  UpdateClaimAssigneeModal,
} from "../components/ClaimModals";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "../elements/dropdown";
import { Text } from "../elements/text";

function ClaimFilters({ query, setQuery, stages, setStages }) {
  function handleChangeQuery(e) {
    setQuery(e.target.value);
  }

  function handleChangeStage(checked, value) {
    setStages((prevStages) =>
      prevStages.map((stage) => ({ ...stage, checked: stage.value === value ? checked : stage.checked }))
    );
  }

  return (
    <>
      <Subheading className="mb-4">Filter</Subheading>
      <Input type="text" placeholder="Search claims&hellip;" value={query} onChange={handleChangeQuery} />

      <Subheading className="mb-4 mt-8">Stages</Subheading>
      <CheckboxGroup>
        {stages.map((stage) => (
          <CheckboxField key={stage.value} value={stage.value}>
            <Checkbox
              color="indigo"
              checked={stage.checked}
              onChange={(checked) => handleChangeStage(checked, stage.value)}
            />
            <Label>
              <Badge color={stage.color}>{stage.name}</Badge>
            </Label>
          </CheckboxField>
        ))}
      </CheckboxGroup>
    </>
  );
}

function ClaimList({
  claims,
  setFormData,
  setUpdateClaimAssigneeModalOpen,
  setRemoveClaimAssigneeModalOpen,
  setDeleteClaimModalOpen,
}) {
  return claims.length > 0 ? (
    <ul role="list" className="divide-y divide-gray-100 dark:divide-secondary-700">
      {claims.map((claim) => (
        <li key={claim.id} className="relative flex flex-col sm:flex-row gap-6 py-5">
          <div className="flex min-w-0 gap-x-4 grow">
            <Avatar src={claim.vehicle?.imgUrl} className="size-12" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900 dark:text-secondary-100">
                <a href={`/claims/${claim.id}`} className="hover:underline">
                  {claim.name}
                </a>{" "}
                <Badge color={claim.displayStage?.color}>{claim.displayStage?.name}</Badge>
              </p>
              <p className="mt-1 flex text-xs/5 text-gray-500">
                Filed: {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-10 mr-1 xl:mr-20 shrink-0">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-secondary-500">Author</span>
                <button
                  className="group cursor-pointer"
                  onClick={() => {
                    setFormData({ ...claim, category: "author", files: [] });
                    claim.author ? setRemoveClaimAssigneeModalOpen(true) : setUpdateClaimAssigneeModalOpen(true);
                  }}
                >
                  <div
                    className={`size-8 rounded-full ${
                      claim.author ? "" : "bg-secondary-100 dark:bg-secondary-600"
                    } group-hover:ring-2 group-hover:ring-primary-500 ring-offset-2 ring-offset-secondary-100 dark:ring-offset-secondary-700 dark:ring-secondary-700 grid place-items-center`}
                  >
                    {claim.author ? (
                      <Avatar className="size-8" initials={claim.author.firstName[0] + claim.author.lastName[0]} />
                    ) : (
                      <UserPlusIcon className="size-5 text-secondary-500 dark:text-secondary-300" />
                    )}
                  </div>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-secondary-500">Reviewer</span>
                <button
                  className="group cursor-pointer"
                  onClick={() => {
                    setFormData({ ...claim, category: "reviewer", files: [] });
                    claim.reviewer ? setRemoveClaimAssigneeModalOpen(true) : setUpdateClaimAssigneeModalOpen(true);
                  }}
                >
                  <div
                    className={`size-8 rounded-full ${
                      claim.reviewer ? "" : "bg-secondary-100 dark:bg-secondary-600"
                    } group-hover:ring-2 group-hover:ring-primary-500 ring-offset-2 ring-offset-secondary-100 dark:ring-offset-secondary-700 dark:ring-secondary-700 grid place-items-center`}
                  >
                    {claim.reviewer ? (
                      <Avatar className="size-8" initials={claim.reviewer.firstName[0] + claim.reviewer.lastName[0]} />
                    ) : (
                      <UserPlusIcon className="size-5 text-secondary-500 dark:text-secondary-300" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-x-2">
              <div className="flex items-center gap-x-2">
                <Button color="light" href={`/claims/${claim.id}`}>
                  View
                </Button>
                <Dropdown>
                  <DropdownButton plain>
                    <EllipsisVerticalIcon />
                  </DropdownButton>
                  <DropdownMenu anchor="bottom end">
                    <DropdownItem
                      onClick={() => {
                        setFormData({ ...claim, files: [] });
                        setDeleteClaimModalOpen(true);
                      }}
                    >
                      <TrashIcon className="stroke-red-500" /> Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <Text>No claims yet.</Text>
  );
}

export default function ClaimIndexPage() {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useUserContext();
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [claims, setClaims] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: null,
    files: [],
  });
  const [createClaimModalOpen, setCreateClaimModalOpen] = useState(false);
  const [updateClaimAssigneeModalOpen, setUpdateClaimAssigneeModalOpen] = useState(false);
  const [removeClaimAssigneeModalOpen, setRemoveClaimAssigneeModalOpen] = useState(false);
  const [deleteClaimModalOpen, setDeleteClaimModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [stages, setStages] = useState([
    { name: "Unassigned", value: "unassigned", color: "zinc", checked: false },
    { name: "Assigned", value: "assigned", color: "blue", checked: false },
    { name: "In Review", value: "in_review", color: "yellow", checked: false },
    { name: "Approved", value: "approved", color: "green", checked: false },
  ]);

  useEffect(() => {
    setIsFetching(true);
    Promise.all([
      fetch("/api/accounts/")
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.users);
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
    data.append("vehicle", formData.vehicleId);
    data.append("region", formData.region);
    formData.files.forEach((file) => data.append("files", file));

    setIsSubmitting(true);
    fetch("/api/claims/", {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        const newClaim = data.claim;
        window.location.href = `/claims/${newClaim.id}`;
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleUpdateClaimAssignee(e, claimId, category, assigneeId) {
    e.preventDefault();

    const data = new FormData();
    data.append("update_assignee", "");
    data.append("claim", claimId);
    data.append("category", category);
    data.append("assignee", assigneeId);

    setIsSubmitting(true);
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
        setUpdateClaimAssigneeModalOpen(false);
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleRemoveClaimAssignee(e, claimId, category) {
    e.preventDefault();

    const data = new FormData();
    data.append("remove_assignee", "");
    data.append("claim", claimId);
    data.append("category", category);

    setIsSubmitting(true);
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
        setRemoveClaimAssigneeModalOpen(false);
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleDeleteClaim(e, claimId) {
    e.preventDefault();

    const data = new FormData();
    data.append("delete", "");
    data.append("claim", claimId);

    setIsSubmitting(true);
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
        setDeleteClaimModalOpen(false);
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const checkedStages = stages.filter((stage) => stage.checked).map((stage) => stage.value);
  const filteredClaims = claims
    .filter((claim) => claim.name.toLowerCase().includes(query.toLowerCase()))
    .filter((claim) => checkedStages.includes(claim.stage) || checkedStages.length === 0);

  filteredClaims.forEach((claim) => {
    claim.vehicle = vehicles.find((vehicle) => vehicle.id === claim.vehicleId);
    claim.displayStage = stages.find((stage) => stage.value === claim.stage);
    claim.author = users.find((user) => user.id === claim.authorId);
    claim.reviewer = users.find((user) => user.id === claim.reviewerId);
  });

  return (
    <>
      <MultiColumnLayout currentTab="claims">
        <MainColumn>
          <div className="flex gap-4 justify-between items-center">
            <Heading>Claims</Heading>
            <Button
              color="indigo"
              onClick={() => {
                setFormData({
                  vehicleId: null,
                  region: null,
                  files: [],
                });
                setCreateClaimModalOpen(true);
              }}
            >
              <PlusIcon /> New claim
            </Button>
          </div>

          {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} />}

          <ClaimList
            claims={filteredClaims}
            setFormData={setFormData}
            setUpdateClaimAssigneeModalOpen={setUpdateClaimAssigneeModalOpen}
            setRemoveClaimAssigneeModalOpen={setRemoveClaimAssigneeModalOpen}
            setDeleteClaimModalOpen={setDeleteClaimModalOpen}
          />
        </MainColumn>
        <AsideColumn>
          <ClaimFilters query={query} setQuery={setQuery} stages={stages} setStages={setStages} />
        </AsideColumn>
      </MultiColumnLayout>

      <CreateClaimModal
        isSubmitting={isSubmitting}
        open={createClaimModalOpen}
        setOpen={setCreateClaimModalOpen}
        vehicles={vehicles}
        formData={formData}
        setFormData={setFormData}
        handleCreateClaim={handleCreateClaim}
      />

      <UpdateClaimAssigneeModal
        isSubmitting={isSubmitting}
        open={updateClaimAssigneeModalOpen}
        setOpen={setUpdateClaimAssigneeModalOpen}
        users={users}
        formData={formData}
        setFormData={setFormData}
        handleUpdateClaimAssignee={handleUpdateClaimAssignee}
      />

      <RemoveClaimAssigneeModal
        isSubmitting={isSubmitting}
        open={removeClaimAssigneeModalOpen}
        setOpen={setRemoveClaimAssigneeModalOpen}
        formData={formData}
        handleRemoveClaimAssignee={handleRemoveClaimAssignee}
      />

      <DeleteClaimModal
        isSubmitting={isSubmitting}
        open={deleteClaimModalOpen}
        setOpen={setDeleteClaimModalOpen}
        formData={formData}
        handleDeleteClaim={handleDeleteClaim}
      />
    </>
  );
}
