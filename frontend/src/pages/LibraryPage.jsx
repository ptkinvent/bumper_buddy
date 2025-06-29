import { useEffect, useState } from "react";
import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";
import { Button } from "../elements/button";
import { Text } from "../elements/text";
import FetchFailedAlert from "../components/FetchFailedAlert";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar } from "../elements/avatar";
import { useUserContext } from "../contexts/UserContext";
import Spinner from "../elements/spinner";

function PartsList({ parts, selectedPart, setSelectedPart }) {
  return parts.length > 0 ? (
    <ul role="list" className="divide-y divide-secondary-100 dark:divide-secondary-700">
      {parts.map((part) => (
        <li key={part.id} className="relative flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <img alt="" src={part.vehicle.imgUrl} className="size-12 flex-none rounded-full bg-secondary-50" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-secondary-900 dark:text-secondary-100">
                <span className="absolute inset-x-0 -top-px bottom-0" />
                {part.name}
              </p>
              <p className="mt-1 flex text-xs/5 text-secondary-500">
                {part.vehicle.make} {part.vehicle.model} {part.vehicle.year}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <Button
                color="light"
                onClick={() => (selectedPart.id === part.id ? setSelectedPart({}) : setSelectedPart(part))}
                className={
                  selectedPart.id === part.id
                    ? "ring-2 ring-offset-2 ring-primary-500 ring-offset-secondary-100 dark:ring-offset-secondary-700"
                    : ""
                }
              >
                Details
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <Text>No parts yet.</Text>
  );
}

function LibraryAssistant({ isSubmitting, user, chat, setChat, chatHistory, setChatHistory, handleChat }) {
  function handleChange(e) {
    setChat(e.target.value);
  }

  function handleKeyDown(e) {
    // Submit on enter
    if (e.key === "Enter" && !(e.metaKey || e.shiftKey)) {
      e.preventDefault();
      if (chat.trim() !== "") {
        handleSubmit(e);
      }
    }
  }

  function handleSubmit(e) {
    handleChat(e, chat);
    setChat("");
  }

  function handleClear() {
    setChatHistory([]);
  }

  const formInvalid = chat.length === 0;

  return (
    <div className="flex flex-col h-full items-center">
      <div className="w-full">
        <Subheading>Assistant</Subheading>
      </div>

      {chatHistory.length === 0 ? (
        <div className="grow my-10 mx-auto text-sm text-center">
          <div className="flex items-center text-primary-500 justify-center">
            <SparklesIcon className="size-5 mr-1" /> Ask me anything about the library.
          </div>
          <div className="mt-3 flex flex-col gap-y-1">
            <span className="text-secondary-500">"What is the cost of a spark plug for a 2025 McLaren P1?"</span>
            <span className="text-secondary-500">"How many claims were filed in Florida for Porsches?"</span>
            <span className="text-secondary-500">"Which claims had a rear-ended Ferrari 488 GTB?"</span>
          </div>
        </div>
      ) : (
        <div className="grow w-full overflow-y-auto">
          {chatHistory.map((message, index) =>
            message.role === "user" ? (
              <div key={index} className="flex justify-end ml-10 mr-1 my-3">
                <div className="shadow sm:rounded-lg text-sm whitespace-pre-wrap p-3 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white">
                  {message.content}
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-start mr-10 my-3 assistant-message">
                <div
                  className="shadow sm:rounded-lg text-sm whitespace-pre-wrap p-3 bg-primary-500 dark:bg-primary-950 text-white"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                ></div>
              </div>
            )
          )}

          {isSubmitting && (
            <div className="inline-block text-sm shadow sm:rounded-lg my-3 p-3 bg-primary-500 dark:bg-primary-950">
              <Spinner />
            </div>
          )}
        </div>
      )}

      <div className="flex w-full gap-x-3 mt-2">
        <Avatar className="size-6 flex-none" initials={user.firstName[0] + user.lastName[0]} />
        <form className="relative flex-auto" onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-lg pb-12 bg-white dark:bg-transparent outline outline-1 -outline-offset-1 outline-secondary-300 dark:outline-secondary-600 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
            <textarea
              rows={2}
              placeholder="Submit your chat..."
              className="block w-full resize-none px-3 py-1.5 text-base text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline focus:outline-0 sm:text-sm/6"
              value={chat}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
            {!isSubmitting && chatHistory.length > 0 && chat.trim() === "" ? (
              <Button type="button" color="light" onClick={handleClear}>
                Clear
              </Button>
            ) : (
              <Button type="submit" color="light" disabled={isSubmitting || formInvalid}>
                Send
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function PartDetails({ selectedPart, setSelectedPart }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <div>
        <Subheading>{selectedPart.name}</Subheading>
        <div className="text-xs text-secondary-500">
          {selectedPart.vehicle.make} {selectedPart.vehicle.model} {selectedPart.vehicle.year}
        </div>
      </div>
      <button
        type="button"
        className="inline-flex cursor-pointer rounded-md bg-secondary-100 dark:bg-secondary-700 p-1.5 text-secondary-500 dark:text-white hover:bg-secondary-200 hover:dark:bg-secondary-900 focus:outline-none focus:ring-focus:ring-secondary-600 focus:ring-offset-2 focus:ring-offset-secondary-50"
        onClick={() => setSelectedPart({})}
      >
        <XMarkIcon className="size-5" />
      </button>
    </div>
  );
}

export default function LibraryPage() {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useUserContext();
  const [vehicles, setVehicles] = useState([]);
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState({});
  const [chat, setChat] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

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
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  function handleChat(e, chat) {
    e.preventDefault();

    const data = new FormData();
    data.append("assistant", "");
    data.append("chat", chat);
    data.append("history", JSON.stringify(chatHistory));

    setIsSubmitting(true);
    fetch(`/api/assistant/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": user.csrfToken,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setChatHistory((prevChatHistory) => [...prevChatHistory, { role: "assistant", content: data.response }]);
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    setChatHistory((prevChatHistory) => [...prevChatHistory, { role: "user", content: chat }]);
  }

  parts.forEach((part) => {
    part.vehicle = vehicles.find((vehicle) => vehicle.id === part.vehicleId) || {};
  });

  return (
    <MultiColumnLayout currentTab="library">
      <MainColumn>
        <Heading>Library</Heading>

        {fetchFailed && <FetchFailedAlert setFetchFailed={setFetchFailed} />}

        <PartsList parts={parts} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
      </MainColumn>
      <AsideColumn>
        {selectedPart.id ? (
          <PartDetails selectedPart={selectedPart} setSelectedPart={setSelectedPart} />
        ) : (
          <LibraryAssistant
            isSubmitting={isSubmitting}
            user={user}
            chat={chat}
            setChat={setChat}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            handleChat={handleChat}
          />
        )}
      </AsideColumn>
    </MultiColumnLayout>
  );
}
