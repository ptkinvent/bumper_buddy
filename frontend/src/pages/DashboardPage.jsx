import { useEffect, useState } from "react";
import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";
import { Text } from "../elements/text";
import { Avatar } from "../elements/avatar";
import { Button } from "../elements/button";
import { Badge } from "../elements/badge";
import { useUserContext } from "../contexts/UserContext";
import Stats from "../elements/Stats";
import { Checkbox, CheckboxField, CheckboxGroup } from "../elements/checkbox";
import { Label } from "../elements/fieldset";
import { Input } from "../elements/input";

function ClaimFilters({ user, claims, query, setQuery, stages, setStages }) {
  const stats = [
    {
      name: "Author",
      value: claims.filter((claim) => claim.authorId === user.id).length,
      color: "blue",
    },
    {
      name: "Reviewer",
      value: claims.filter((claim) => claim.reviewerId === user.id).length,
      color: "yellow",
    },
  ];

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
      <Subheading>Tasks</Subheading>
      <Stats stats={stats} />

      <Subheading className="mb-4 mt-8">Filter</Subheading>
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

function ClaimList({ user, claims }) {
  return claims.length > 0 ? (
    <ul role="list" className="divide-y divide-gray-100 dark:divide-secondary-700">
      {claims.map((claim) => (
        <li key={claim.id} className="relative flex gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4 grow">
            <Avatar src={claim.vehicle?.imgUrl} className="size-12" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900 dark:text-secondary-100">
                <a href={`/claims/${claim.id}`} className="hover:underline">
                  {claim.vehicle?.make} {claim.vehicle?.model} {claim.vehicle?.year}
                </a>{" "}
                <Badge color={claim.displayStage?.color}>{claim.displayStage?.name}</Badge>
              </p>
              <p className="mt-1 flex text-xs/5 text-gray-500">
                Filed: {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10 mr-20 shrink-0">
            {claim.authorId === user.id && <Badge color="blue">Author</Badge>}
            {claim.reviewerId === user.id && <Badge color="yellow">Reviewer</Badge>}
          </div>

          <div className="flex shrink-0 items-center gap-x-2">
            <div className="flex items-center gap-x-2">
              <Button color="light" href={`/claims/${claim.id}`}>
                View
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <Text>No tasks yet.</Text>
  );
}

export default function DashboardPage() {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [user, setUser] = useUserContext();
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [claims, setClaims] = useState([]);
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

  const checkedStages = stages.filter((stage) => stage.checked).map((stage) => stage.value);
  const filteredClaims = claims
    .filter((claim) => claim.authorId === user.id || claim.reviewerId === user.id)
    .filter((claim) => claim.name.toLowerCase().includes(query.toLowerCase()))
    .filter((claim) => checkedStages.includes(claim.stage) || checkedStages.length === 0);

  filteredClaims.forEach((claim) => {
    claim.vehicle = vehicles.find((vehicle) => vehicle.id === claim.vehicleId);
    claim.displayStage = stages.find((stage) => stage.value === claim.stage);
    claim.author = users.find((user) => user.id === claim.authorId);
    claim.reviewer = users.find((user) => user.id === claim.reviewerId);
  });

  return (
    <MultiColumnLayout currentTab="dashboard">
      <MainColumn>
        <Heading>Dashboard</Heading>
        <ClaimList user={user} claims={filteredClaims} />
      </MainColumn>
      <AsideColumn>
        <ClaimFilters
          user={user}
          claims={claims}
          query={query}
          setQuery={setQuery}
          stages={stages}
          setStages={setStages}
        />
      </AsideColumn>
    </MultiColumnLayout>
  );
}
