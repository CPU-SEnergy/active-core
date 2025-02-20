"use client";

// credits to >>> https://github.com/algolia/instantsearch/tree/master/examples/react/next-app-router
import { Hit as AlgoliaHit } from "instantsearch.js";
import React from "react";
import {
  Hits,
  Highlight,
  SearchBox,
  RefinementList,
  DynamicWidgets,
  useSearchBox,
} from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Panel } from "@/components/Panel";
import { client } from "@/lib/client";
import { Schema } from "@/lib/schema/firestore";

type HitProps = {
  hit: AlgoliaHit<Schema["users"]["Data"]>;
};

function Hit({ hit }: HitProps) {
  return (
    <div className="hit">
      <h2>
        <Highlight hit={hit} attribute="firstName" />{" "}
        <Highlight hit={hit} attribute="lastName" />
      </h2>
      <p>Email: {hit.email}</p>
      <p>Sex: {hit.sex}</p>
    </div>
  );
}

export default function Search() {
  return (
    <InstantSearchNext searchClient={client} indexName="users_index">
      <div className="Container">
        <div>
          <DynamicWidgets fallbackComponent={FallbackComponent} />
        </div>
        <div>
          <SearchBox
            classNames={{
              root: "relative flex items-center w-full max-w-lg mx-auto",
              form: "w-full",
              input:
                "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-black",
              reset: "absolute right-4 top-2 text-gray-500 hover:text-gray-700",
            }}
            placeholder="Search"
          />
          <SearchResults />
        </div>
      </div>
    </InstantSearchNext>
  );
}

function SearchResults() {
  const { query } = useSearchBox();

  if (!query.trim()) return null;

  return <Hits hitComponent={Hit} />;
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}
