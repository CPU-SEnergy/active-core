"use client";

import {
  InstantSearch,
  useSearchBox,
  Hits,
  Highlight,
} from "react-instantsearch";
import { client } from "@/lib/algoliaSearchClient";
import { useState } from "react";
import { Hit as AlgoliaHit } from "instantsearch.js";

type UserData = {
  objectID: string;
  firstName: string;
  lastName: string;
  email: string;
};

type HitProps = {
  hit: AlgoliaHit<UserData>;
  onSelect: (user: { name: string; id: string; avatar?: string }) => void;
};

function Hit({ hit, onSelect }: HitProps) {
  const fullName = `${hit.firstName} ${hit.lastName}`;

  return (
    <div
      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
      onClick={() =>
        onSelect({
          name: fullName,
          id: hit.objectID,
        })
      }
    >
      <h2 className="font-semibold text-lg">
        <Highlight hit={hit} attribute="firstName" />{" "}
        <Highlight hit={hit} attribute="lastName" />
      </h2>
      <p className="text-sm text-gray-600">
        <Highlight hit={hit} attribute="email" />
      </p>
    </div>
  );
}

function CustomSearchBox({ onSearch }: { onSearch: (query: string) => void }) {
  const { refine } = useSearchBox();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refine(input);
    onSearch(input);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Search users..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
      />
      <button
        type="submit"
        className="px-4 py-2 font-medium text-white bg-black rounded-lg hover:bg-gray-800"
      >
        Search
      </button>
    </form>
  );
}

export default function UserSearch({
  onUserSelect,
}: {
  onUserSelect?: (user: { name: string; id: string; avatar?: string }) => void;
}) {
  const [query, setQuery] = useState("");

  const handleUserSelect = (user: {
    name: string;
    id: string;
    avatar?: string;
  }) => {
    const event = new CustomEvent("userSelected", {
      detail: user,
      bubbles: true,
    });

    document.dispatchEvent(event);

    if (onUserSelect) {
      onUserSelect(user);
    }
  };

  return (
    <InstantSearch searchClient={client} indexName="users_index">
      <CustomSearchBox onSearch={setQuery} />
      {query.trim() !== "" && (
        <Hits<UserData>
          hitComponent={(props) => (
            <Hit {...props} onSelect={handleUserSelect} />
          )}
        />
      )}
    </InstantSearch>
  );
}
