import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "../elements/badge";
import FetchFailedAlert from "../components/FetchFailedAlert";
import { Description, Field, Label } from "../elements/fieldset";
import { Select } from "../elements/select";
import { Textarea } from "../elements/textarea";
import { Input } from "../elements/input";
import { Button } from "../elements/button";
import { SparklesIcon } from "@heroicons/react/24/outline";

function MediaList({ media }) {
  return (
    <ul
      role="list"
      className="mt-8 divide-y divide-gray-200 dark:divide-gray-700 border-b border-t border-gray-200 dark:border-gray-700"
    >
      {media.map((media, mediaIdx) => (
        <li key={media.id} className="flex py-6 sm:py-10">
          <div className="shrink-0">
            <img alt={media.name} src={media.fileUrl} className="size-24 rounded-md object-cover sm:size-48" />
          </div>

          <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
            <div className="relative pr-9 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:pr-0">
              <Field>
                <Label>Location</Label>
                <Description>E.g. "Front windshield", "Passenger door"</Description>
                <Textarea rows={1} />
              </Field>

              <Field>
                <Label>Severity</Label>
                <Description>0-5</Description>
                <Select name={`severity-${media.id}`}>
                  <option value={0}>0 (None)</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5 (Critical)</option>
                </Select>
              </Field>

              <Field>
                <Label>Estimated cost</Label>
                <Description>Dollars (USD)</Description>
                <Input type="number" min={0} max={1000000} value={0} />
              </Field>
            </div>

            <p className="mt-4 flex justify-end space-x-2 text-sm text-gray-700">
              <Button color="indigo">
                <SparklesIcon /> Auto-assess
              </Button>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ClaimDetailPage() {
  const { claimId } = useParams();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claim, setClaim] = useState({});
  const [policyholder, setPolicyholder] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [media, setMedia] = useState([]);
  const [damages, setDamages] = useState([]);
  const stages = [
    { name: "Unassigned", value: "unassigned", color: "zinc" },
    { name: "Assigned", value: "assigned", color: "blue" },
    { name: "In Review", value: "in_review", color: "yellow" },
    { name: "Approved", value: "approved", color: "green" },
  ];

  useEffect(() => {
    setIsFetching(true);
    Promise.all([
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

      fetch(`/api/claims/${claimId}/damages`)
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

  useEffect(() => {
    if (!claim.policyholderId || !claim.vehicleId) return;

    Promise.all([
      fetch(`/api/policyholders/${claim.policyholderId}`)
        .then((response) => response.json())
        .then((data) => {
          setPolicyholder(data.policyholder);
        }),

      fetch(`/api/vehicles/${claim.vehicleId}`)
        .then((response) => response.json())
        .then((data) => {
          setVehicle(data.vehicle);
        }),
    ])
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [claim]);

  claim.displayStage = stages.find((stage) => stage.value === claim.stage);

  return (
    <MultiColumnLayout currentTab="claims">
      <MainColumn>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Heading>{claim.name}</Heading>
            <Badge color={claim.displayStage?.color}>{claim?.displayStage?.name}</Badge>
          </div>

          <Button color="indigo">
            <SparklesIcon /> Auto-assess all
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-xs text-secondary-500">Created: {new Date(claim.createdAt).toLocaleDateString()}</span>
        </div>

        {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} />}

        <MediaList media={media} />
      </MainColumn>
      <AsideColumn>
        <Subheading>Aside</Subheading>
      </AsideColumn>
    </MultiColumnLayout>
  );
}
