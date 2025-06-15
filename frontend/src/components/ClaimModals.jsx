import { useState } from "react";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "../elements/dialog";
import { Field, FieldGroup, Fieldset, Label } from "../elements/fieldset";
import { Listbox, ListboxDescription, ListboxLabel, ListboxOption } from "../elements/listbox";
import Spinner from "../elements/spinner";
import FileInput from "../elements/FileInput";
import { Avatar } from "../elements/avatar";
import { Button } from "../elements/button";
import { Checkbox } from "../elements/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../elements/table";
import { Badge } from "../elements/badge";
import Tooltip from "../elements/tooltip";
import {
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { ExclamationCircleIcon, FolderIcon, UserIcon } from "@heroicons/react/20/solid";

export function CreateClaimModal({ isSubmitting, open, setOpen, vehicles, formData, setFormData, handleCreateClaim }) {
  const [formInvalid, setFormInvalid] = useState(false);

  function handleChangeVehicleId(value) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vehicleId: value,
    }));
  }

  function handleChangeRegion(value) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      region: value,
    }));
  }

  const regions = [
    { name: "California", value: "CA" },
    { name: "Florida", value: "FL" },
    { name: "Georgia", value: "GA" },
    { name: "Maryland", value: "MD" },
    { name: "New York", value: "NY" },
    { name: "North Carolina", value: "NC" },
    { name: "South Carolina", value: "SC" },
  ];

  return (
    <Dialog open={open} onClose={setOpen}>
      <DialogTitle>New claim</DialogTitle>
      <form onSubmit={(e) => handleCreateClaim(e, formData)}>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
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
                <Label>Region</Label>
                <Listbox placeholder="Select region&hellip;" value={formData.region} onChange={handleChangeRegion}>
                  {regions.map((region) => (
                    <ListboxOption value={region.value} key={region.value}>
                      <ListboxLabel>{region.name}</ListboxLabel>
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
          <Button color="light" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            type="submit"
            color="indigo"
            onClick={() => setOpen(false)}
            disabled={
              isSubmitting ||
              formData.region === null ||
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
        </DialogActions>
      </form>
    </Dialog>
  );
}

export function UpdateClaimAssigneeModal({
  isSubmitting,
  open,
  setOpen,
  users,
  formData,
  setFormData,
  handleUpdateClaimAssignee,
}) {
  function handleChangeAssignee(value) {
    if (formData.category === "author") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        authorId: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        reviewerId: value,
      }));
    }
  }

  return (
    <Dialog open={open} onClose={setOpen}>
      <DialogTitle>Assign {formData.category}</DialogTitle>
      <DialogDescription>Only the assigned author and reviewer can edit this claim.</DialogDescription>
      <form
        onSubmit={(e) =>
          handleUpdateClaimAssignee(
            e,
            formData.id,
            formData.category,
            formData.category === "author" ? formData.authorId : formData.reviewerId
          )
        }
      >
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label className="capitalize">{formData.category}</Label>
                <Listbox
                  placeholder={`Select ${formData.category}...`}
                  value={formData.category === "author" ? formData.authorId : formData.reviewerId}
                  onChange={handleChangeAssignee}
                >
                  {users.map((user) => (
                    <ListboxOption value={user.id} key={user.id}>
                      <Avatar initials={user.firstName[0] + user.lastName[0]} />
                      <ListboxLabel>
                        {user.firstName} {user.lastName}
                      </ListboxLabel>
                      <ListboxDescription>{user.email}</ListboxDescription>
                    </ListboxOption>
                  ))}
                </Listbox>
              </Field>
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button color="light" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button type="submit" color="indigo" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Assigning...
              </>
            ) : (
              <>
                <UserPlusIcon /> Assign
              </>
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export function RemoveClaimAssigneeModal({ isSubmitting, open, setOpen, formData, handleRemoveClaimAssignee }) {
  return (
    <Dialog open={open} onClose={setOpen}>
      <DialogTitle>Remove {formData.category}</DialogTitle>
      <DialogDescription>
        Are you sure you want to remove{" "}
        {formData.category === "author" ? formData.author?.firstName : formData.reviewer?.firstName} as{" "}
        {formData.category === "author" ? "an author" : "a reviewer"}?
      </DialogDescription>
      <DialogActions>
        <Button color="light" onClick={() => setOpen(false)}>
          Close
        </Button>
        <Button color="red" onClick={(e) => handleRemoveClaimAssignee(e, formData.id, formData.category)}>
          {isSubmitting ? (
            <>
              <Spinner /> Removing...
            </>
          ) : (
            <>
              <UserMinusIcon /> Remove
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function AutoAssessModal({
  isSubmitting,
  open,
  setOpen,
  claim,
  autoAssessment,
  setAutoAssessment,
  handleAutoAssess,
  handleImportDamage,
}) {
  function handleCheck(checked, index) {
    setAutoAssessment((prevAssess) => prevAssess.map((damage, i) => (i === index ? { ...damage, checked } : damage)));
  }

  return (
    <Dialog open={open} onClose={setOpen} size={autoAssessment.length > 0 ? "3xl" : "lg"}>
      <DialogTitle>Auto-assess claim</DialogTitle>
      <DialogDescription>
        {autoAssessment.length === 0
          ? "Auto-assess will use AI to evaluate damage from the uploaded images and estimate costs using the library."
          : "The following damage was identified in the uploaded images. Please select items to import into the claim."}
      </DialogDescription>
      <DialogBody>
        {autoAssessment.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader></TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Repair type</TableHeader>
                <TableHeader>Parts cost</TableHeader>
                <TableHeader>Labor cost</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {autoAssessment.map((damage, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      color="indigo"
                      checked={damage.checked}
                      onChange={(checked) => handleCheck(checked, index)}
                    />
                  </TableCell>
                  <TableCell>{damage.name}</TableCell>
                  <TableCell>
                    <Badge color={damage.displayRepairType.color}>{damage.displayRepairType.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogBody>
      <DialogActions>
        <Button color="light" onClick={() => setOpen(false)}>
          Close
        </Button>
        {autoAssessment.length === 0 ? (
          <Button color="indigo" onClick={(e) => handleAutoAssess(e, claim.id)} disabled={isSubmitting}>
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
        ) : (
          <Button
            color="indigo"
            onClick={(e) =>
              handleImportDamage(
                e,
                claim.id,
                autoAssessment.filter((damage) => damage.checked)
              )
            }
          >
            {isSubmitting ? (
              <>
                <Spinner /> Importing...
              </>
            ) : (
              <>
                <ArrowRightStartOnRectangleIcon /> Import
              </>
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export function DeleteClaimModal({ isSubmitting, open, setOpen, formData, handleDeleteClaim }) {
  return (
    <Dialog open={open} onClose={setOpen}>
      <DialogTitle>Delete {formData.name}</DialogTitle>
      <DialogDescription>Are you sure you want to delete this claim?</DialogDescription>
      <DialogActions>
        <Button color="light" onClick={() => setOpen(false)}>
          Close
        </Button>
        <Button color="red" onClick={(e) => handleDeleteClaim(e, formData.id)}>
          {isSubmitting ? (
            <>
              <Spinner /> Deleting...
            </>
          ) : (
            <>
              <TrashIcon /> Delete
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
