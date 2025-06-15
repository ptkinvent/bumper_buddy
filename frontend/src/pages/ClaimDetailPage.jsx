import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "../elements/badge";
import FetchFailedAlert from "../components/FetchFailedAlert";
import { Button } from "../elements/button";
import { useUserContext } from "../contexts/UserContext";
import Spinner from "../elements/spinner";
import { Text } from "../elements/text";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "../elements/dropdown";
import { AutoAssessModal, DeleteClaimModal } from "../components/ClaimModals";
import { Input } from "../elements/input";
import { Listbox, ListboxOption } from "../elements/listbox";
import Tooltip from "../elements/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../elements/table";
import {
  ArrowRightStartOnRectangleIcon,
  CalendarIcon,
  CheckIcon,
  DocumentMagnifyingGlassIcon,
  EllipsisVerticalIcon,
  MapPinIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ExclamationCircleIcon, FolderIcon, UserIcon } from "@heroicons/react/20/solid";

function MediaList({ media }) {
  return (
    <ul
      role="list"
      className="mt-8 flex flex-row gap-4 border-b border-t border-secondary-200 dark:border-secondary-700"
    >
      {media.map((media) => (
        <li key={media.id} className="flex py-6 sm:py-10">
          <div className="shrink-0">
            <img alt={media.name} src={media.fileUrl} className="size-24 rounded-md object-cover sm:size-48" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DamageList({
  isSubmitting,
  claim,
  damages,
  handleDeleteDamage,
  damageFormData,
  setDamageFormData,
  handleCreateDamage,
  handleUpdateDamage,
}) {
  return (
    <div className="px-4 mt-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <Subheading>Damages</Subheading>
          <p className="mt-2 text-sm text-secondary-700"></p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button color="light" onClick={(e) => handleCreateDamage(e, claim.id)}>
            <PlusIcon /> Add damage
          </Button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        {damages.length > 0 ? (
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-secondary-900 sm:pl-0 dark:text-secondary-200"
                    >
                      Name
                    </TableHeader>
                    <TableHeader
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-200"
                    >
                      Repair type
                    </TableHeader>
                    <TableHeader
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-200"
                    >
                      Parts cost
                    </TableHeader>
                    <TableHeader
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-200"
                    >
                      Labor cost
                    </TableHeader>
                    <TableHeader scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {damages.map((damage) => (
                    <TableRow
                      key={damage.id}
                      className={
                        damage.id === damageFormData.id
                          ? ""
                          : "cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-900/50"
                      }
                    >
                      <TableCell
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-secondary-900 dark:text-secondary-200 sm:pl-0"
                        onClick={(e) => {
                          setDamageFormData({ ...damage, autoFocus: "name" });
                          e.stopPropagation();
                        }}
                      >
                        {damage.id === damageFormData.id ? (
                          <Input
                            type="text"
                            value={damageFormData.name}
                            onChange={(e) => setDamageFormData({ ...damageFormData, name: e.target.value })}
                            autoFocus={damageFormData.autoFocus === "name"}
                          />
                        ) : damage.name ? (
                          damage.name
                        ) : (
                          <Text>No name</Text>
                        )}
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500"
                        onClick={(e) => {
                          setDamageFormData({ ...damage, autoFocus: "repairType" });
                          e.stopPropagation();
                        }}
                      >
                        {damage.id === damageFormData.id ? (
                          <Listbox
                            value={damageFormData.repairType}
                            onChange={(value) => setDamageFormData({ ...damageFormData, repairType: value })}
                            autoFocus={damageFormData.autoFocus === "repairType"}
                          >
                            <ListboxOption value="replace">Replace</ListboxOption>
                            <ListboxOption value="repair">Repair</ListboxOption>
                            <ListboxOption value="refinish">Refinish</ListboxOption>
                          </Listbox>
                        ) : (
                          <Badge color={damage.displayRepairType.color}>{damage.displayRepairType.name}</Badge>
                        )}
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500"
                        onClick={(e) => {
                          setDamageFormData({ ...damage, autoFocus: "partsCost" });
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {damage.id === damageFormData.id ? (
                            <Input
                              type="number"
                              value={damageFormData.partsCost}
                              onChange={(e) => setDamageFormData({ ...damageFormData, partsCost: e.target.value })}
                              autoFocus={damageFormData.autoFocus === "partsCost"}
                            />
                          ) : (
                            <>
                              {damage.displayPartsCost}
                              {damage.partsCostSource === "llm" && (
                                <Tooltip title="Source: Auto-assess">
                                  <ExclamationCircleIcon className="text-warning-500 size-4" />
                                </Tooltip>
                              )}
                              {damage.partsCostSource === "library" && (
                                <Tooltip title="Source: Library">
                                  <FolderIcon className="text-lime-500 size-4" />
                                </Tooltip>
                              )}
                              {damage.partsCostSource === "user" && (
                                <Tooltip title="Source: User">
                                  <UserIcon className="text-indigo-500 size-4" />
                                </Tooltip>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500"
                        onClick={(e) => {
                          setDamageFormData({ ...damage, autoFocus: "laborCost" });
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {damage.id === damageFormData.id ? (
                            <Input
                              type="number"
                              value={damageFormData.laborCost}
                              onChange={(e) => setDamageFormData({ ...damageFormData, laborCost: e.target.value })}
                              autoFocus={damageFormData.autoFocus === "laborCost"}
                            />
                          ) : (
                            <>
                              {damage.displayLaborCost}
                              {damage.laborCostSource === "llm" && (
                                <Tooltip title="Source: Auto-assess">
                                  <ExclamationCircleIcon className="text-warning-500 size-4" />
                                </Tooltip>
                              )}
                              {damage.laborCostSource === "library" && (
                                <Tooltip title="Source: Library">
                                  <FolderIcon className="text-lime-500 size-4" />
                                </Tooltip>
                              )}
                              {damage.laborCostSource === "user" && (
                                <Tooltip title="Source: User">
                                  <UserIcon className="text-indigo-500 size-4" />
                                </Tooltip>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        {damage.id === damageFormData.id ? (
                          <div className="flex gap-2">
                            <Button
                              color="indigo"
                              onClick={(e) => handleUpdateDamage(e, damageFormData)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? <Spinner /> : <CheckIcon />}
                            </Button>
                            <Button color="light" onClick={() => setDamageFormData({})} disabled={isSubmitting}>
                              <XMarkIcon />
                            </Button>
                          </div>
                        ) : (
                          <Dropdown>
                            <DropdownButton plain>
                              <EllipsisVerticalIcon />
                            </DropdownButton>
                            <DropdownMenu anchor="bottom end">
                              <DropdownItem onClick={(e) => handleDeleteDamage(e, damage.id)}>
                                <TrashIcon className="stroke-red-500" /> Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <Text>No damages yet.</Text>
        )}
      </div>
    </div>
  );
}

function EstimateReport({ claim, damages, handleUpdateClaimStage }) {
  return (
    <>
      <div className="flex justify-between items-center">
        <Subheading>Estimate report</Subheading>
        <Button color="light">
          <ArrowRightStartOnRectangleIcon /> Export
        </Button>
      </div>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-secondary-300 dark:divide-secondary-600">
              <thead className="bg-secondary-50 dark:bg-secondary-900">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-200 sm:pl-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-200"
                  >
                    Repair type
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-200"
                  >
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800 bg-white dark:bg-secondary-700">
                {damages.map((damage) => (
                  <tr key={damage.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-secondary-900 dark:text-secondary-200 sm:pl-6">
                      {damage.name ? damage.name : <Text>No name</Text>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500 dark:text-secondary-400">
                      {damage.displayRepairType.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500 dark:text-secondary-400">
                      ${parseFloat(damage.partsCost) + parseFloat(damage.laborCost)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-secondary-900 dark:text-secondary-200 sm:pl-6">
                    Total
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500 dark:text-secondary-400"></td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500 dark:text-secondary-400">
                    $
                    {damages.reduce(
                      (acc, damage) => acc + parseFloat(damage.partsCost) + parseFloat(damage.laborCost),
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <div className="flex gap-2">
          {(claim.stage === "unassigned" || claim.stage === "assigned") && (
            <Button color="amber" onClick={(e) => handleUpdateClaimStage(e, claim.id, "request_review")}>
              <DocumentMagnifyingGlassIcon /> Request review
            </Button>
          )}
          {claim.stage === "in_review" && (
            <>
              <Button color="amber" onClick={(e) => handleUpdateClaimStage(e, claim.id, "return_to_author")}>
                <DocumentMagnifyingGlassIcon /> Return to author
              </Button>
              <Button color="green" onClick={(e) => handleUpdateClaimStage(e, claim.id, "approve")}>
                <CheckIcon /> Approve
              </Button>
            </>
          )}
          {claim.stage === "approved" && (
            <Button color="green" onClick={(e) => handleUpdateClaimStage(e, claim.id, "unapprove")}>
              <XMarkIcon /> Unapprove
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default function ClaimDetailPage() {
  const { claimId } = useParams();
  const [user, setUser] = useUserContext();
  const [users, setUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claim, setClaim] = useState({});
  const [media, setMedia] = useState([]);
  const [damages, setDamages] = useState([]);
  const [damageFormData, setDamageFormData] = useState({});
  const [autoAssessment, setAutoAssessment] = useState([]);

  const [autoAssessModalOpen, setAutoAssessModalOpen] = useState(false);
  const [deleteClaimModalOpen, setDeleteClaimModalOpen] = useState(false);

  const stages = [
    { name: "Unassigned", value: "unassigned", color: "zinc" },
    { name: "Assigned", value: "assigned", color: "blue" },
    { name: "In Review", value: "in_review", color: "yellow" },
    { name: "Approved", value: "approved", color: "green" },
  ];
  const repairTypes = [
    { name: "Replace", value: "replace", color: "red" },
    { name: "Repair", value: "repair", color: "blue" },
    { name: "Refinish", value: "refinish", color: "green" },
  ];

  useEffect(() => {
    setIsFetching(true);
    Promise.all([
      fetch(`/api/accounts/`)
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.users);
        }),

      fetch(`/api/claims/${claimId}`)
        .then((response) => response.json())
        .then((data) => {
          setClaim(data.claim);
        }),

      fetch(`/api/claims/${claimId}/media`)
        .then((response) => response.json())
        .then((data) => {
          setMedia(data.media);
        }),

      fetch(`/api/damages/?claim=${claimId}`)
        .then((response) => response.json())
        .then((data) => {
          setDamages(data.damages);
        }),
    ])
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  function handleUpdateClaimStage(e, claimId, stage) {
    e.preventDefault();

    const data = new FormData();
    data.append("update_stage", stage);

    setIsSubmitting(true);
    fetch(`/api/claims/${claimId}/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setClaim(data.claim);
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
        window.location.href = "/claims";
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleCreateDamage(e, claimId) {
    e.preventDefault();

    const data = new FormData();
    data.append("create", "");
    data.append("claim_id", claimId);

    setIsSubmitting(true);
    fetch(`/api/damages/?claim=${claimId}`, {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setDamages(data.damages);
        setDamageFormData({});
        setAutoAssessModalOpen(false);
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleImportDamage(e, claimId, damages) {
    e.preventDefault();

    const data = new FormData();
    data.append("import", "");
    data.append("claim_id", claimId);
    data.append("damages", JSON.stringify(damages));

    setIsSubmitting(true);
    fetch(`/api/damages/?claim=${claimId}`, {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setDamages(data.damages);
        setDamageFormData({});
        setAutoAssessModalOpen(false);
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleUpdateDamage(e, formData) {
    e.preventDefault();

    const data = new FormData();
    data.append("update", formData.id);
    data.append("name", formData.name);
    data.append("repairType", formData.repairType);
    data.append("partsCost", formData.partsCost);
    data.append("laborCost", formData.laborCost);

    setIsSubmitting(true);
    fetch(`/api/damages/?claim=${claimId}`, {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setDamages(data.damages);
        setDamageFormData({});
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleDeleteDamage(e, damageId) {
    e.preventDefault();

    const data = new FormData();
    data.append("delete", "");
    data.append("damage_id", damageId);

    setIsSubmitting(true);
    fetch(`/api/damages/?claim=${claimId}`, {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setDamages(data.damages);
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleAutoAssess(e, claimId) {
    e.preventDefault();

    const data = new FormData();
    data.append("auto_assess", "");
    data.append("claim", claimId);

    setIsSubmitting(true);
    fetch(`/api/auto-assess/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setAutoAssessment(data.assessment.map((damage) => ({ ...damage, checked: true })));
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  claim.displayStage = stages.find((stage) => stage.value === claim.stage);
  claim.author = users.find((user) => user.id === claim.authorId);
  claim.reviewer = users.find((user) => user.id === claim.reviewerId);
  damages.forEach((damage) => {
    damage.displayRepairType = repairTypes.find((repairType) => repairType.value === damage.repairType);
    damage.displayPartsCost = `$${parseFloat(damage.partsCost).toFixed(2)}`;
    damage.displayLaborCost = `$${parseFloat(damage.laborCost).toFixed(2)}`;
  });
  autoAssessment.forEach((damage) => {
    damage.displayRepairType = repairTypes.find((repairType) => repairType.value === damage.repairType);
    damage.displayPartsCost = `$${parseFloat(damage.partsCost).toFixed(2)}`;
    damage.displayLaborCost = `$${parseFloat(damage.laborCost).toFixed(2)}`;
  });

  return (
    <>
      <MultiColumnLayout currentTab="claims">
        <MainColumn onClick={() => setDamageFormData({})}>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Heading>{claim.name}</Heading>
              <Badge color={claim.displayStage?.color}>{claim?.displayStage?.name}</Badge>
            </div>

            <div className="flex gap-2 items-center">
              <Button color="indigo" onClick={() => setAutoAssessModalOpen(true)} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner /> Auto-assessing...
                  </>
                ) : (
                  <>
                    <SparklesIcon /> Auto-assess
                  </>
                )}
              </Button>
              <Dropdown>
                <DropdownButton color="light">
                  <EllipsisVerticalIcon />
                </DropdownButton>
                <DropdownMenu anchor="bottom end">
                  <DropdownItem onClick={() => setDeleteClaimModalOpen(true)}>
                    <TrashIcon className="stroke-red-500" /> Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-secondary-500">
              <CalendarIcon className="mr-1.5 size-5 shrink-0 text-secondary-400" />
              Filed: {new Date(claim.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 flex items-center text-sm text-secondary-500">
              <MapPinIcon className="mr-1.5 size-5 shrink-0 text-secondary-400" />
              Region: {claim.region}
            </div>
            {claim.author && (
              <div className="mt-2 flex items-center text-sm text-secondary-500">
                <UserPlusIcon className="mr-1.5 size-5 shrink-0 text-secondary-400" />
                Author: {claim.author?.firstName} {claim.author?.lastName}
              </div>
            )}
            {claim.reviewer && (
              <div className="mt-2 flex items-center text-sm text-secondary-500">
                <DocumentMagnifyingGlassIcon className="mr-1.5 size-5 shrink-0 text-secondary-400" />
                Reviewer: {claim.reviewer?.firstName} {claim.reviewer?.lastName}
              </div>
            )}
          </div>

          {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} />}

          <MediaList media={media} />
          <DamageList
            isSubmitting={isSubmitting}
            claim={claim}
            damages={damages}
            handleDeleteDamage={handleDeleteDamage}
            damageFormData={damageFormData}
            setDamageFormData={setDamageFormData}
            handleCreateDamage={handleCreateDamage}
            handleUpdateDamage={handleUpdateDamage}
          />
        </MainColumn>
        <AsideColumn>
          <EstimateReport claim={claim} damages={damages} handleUpdateClaimStage={handleUpdateClaimStage} />
        </AsideColumn>
      </MultiColumnLayout>

      <AutoAssessModal
        isSubmitting={isSubmitting}
        open={autoAssessModalOpen}
        setOpen={setAutoAssessModalOpen}
        claim={claim}
        autoAssessment={autoAssessment}
        setAutoAssessment={setAutoAssessment}
        handleAutoAssess={handleAutoAssess}
        handleImportDamage={handleImportDamage}
      />

      <DeleteClaimModal
        isSubmitting={isSubmitting}
        open={deleteClaimModalOpen}
        setOpen={setDeleteClaimModalOpen}
        formData={claim}
        handleDeleteClaim={handleDeleteClaim}
      />
    </>
  );
}
