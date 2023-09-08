import React, { useState } from "react";
import styles from "./DataList.css";
import { EmptyState } from "./components/EmptyState";
import { DataListLayout } from "./components/DataListLayout";
import {
  DataListFiltersProps,
  DataListLayoutProps,
  DataListObject,
  DataListProps,
  DataListSearchProps,
} from "./DataList.types";
import {
  generateDataListEmptyState,
  generateHeaderElements,
  getCompoundComponent,
  getCompoundComponents,
} from "./DataList.utils";
import { DataListTotalCount } from "./components/DataListTotalCount";
import { DataListLoadingState } from "./components/DataListLoadingState/DataListLoadingState";
import {
  DataListHeader,
  DataListItems,
} from "./components/DataListLayoutInternal";
import { useLayoutMediaQueries } from "./hooks/useLayoutMediaQueries";
import { DataListContext, useDataListContext } from "./context/DataListContext";
import {
  DataListFilters,
  InternalDataListFilters,
} from "./components/DataListFilters";
import {
  DataListSearch,
  InternalDataListSearch,
} from "./components/DataListSearch";
import { DataListStickyHeader } from "./components/DataListStickyHeader/DataListStickyHeader";
import {
  DATA_LIST_FILTERING_SPINNER_TEST_ID,
  DATA_LIST_LOADING_MORE_SPINNER_TEST_ID,
} from "./DataList.const";
import { Heading } from "../Heading";
import { Spinner } from "../Spinner";

export function DataList<T extends DataListObject>(props: DataListProps<T>) {
  const searchComponent = getCompoundComponent<DataListSearchProps>(
    props.children,
    DataListSearch,
  );
  const filterComponent = getCompoundComponent<DataListFiltersProps>(
    props.children,
    DataListFilters,
  );
  const layoutComponents = getCompoundComponents<
    DataListLayoutProps<DataListObject>
  >(props.children, DataListLayout);

  return (
    <DataListContext.Provider
      value={{ searchComponent, filterComponent, layoutComponents, ...props }}
    >
      <InternalDataList />
    </DataListContext.Provider>
  );
}

function InternalDataList() {
  const {
    data,
    headers,
    filterApplied = false,
    children,
    title,
    totalCount,
    headerVisibility = { xs: true, sm: true, md: true, lg: true, xl: true },
    loadingState = "none",
    layoutComponents,
  } = useDataListContext();

  const headerData = generateHeaderElements(headers);
  const mediaMatches = useLayoutMediaQueries();

  const initialLoading = loadingState === "initial";
  const showEmptyState = !initialLoading && data.length === 0;
  const [isFilterApplied, setIsFilterApplied] = useState(filterApplied);
  const EmptyStateComponent = generateDataListEmptyState({
    children,
    isFilterApplied,
    setIsFilterApplied,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleContainer}>
        {title && <Heading level={3}>{title}</Heading>}
        <DataListTotalCount totalCount={totalCount} loading={initialLoading} />
      </div>

      <DataListStickyHeader>
        <div className={styles.headerFilters}>
          <InternalDataListFilters />
          <InternalDataListSearch />
        </div>

        {headerData && (
          <DataListHeader
            layouts={layoutComponents}
            headerData={headerData}
            headerVisibility={headerVisibility}
            mediaMatches={mediaMatches}
          />
        )}
      </DataListStickyHeader>

      {initialLoading && (
        <DataListLoadingState
          headers={headers}
          layouts={layoutComponents}
          mediaMatches={mediaMatches}
        />
      )}

      {!initialLoading && (
        <DataListItems
          data={data}
          layouts={layoutComponents}
          mediaMatches={mediaMatches}
        />
      )}

      {loadingState === "filtering" && (
        <div
          data-testid={DATA_LIST_FILTERING_SPINNER_TEST_ID}
          className={styles.filtering}
        >
          <div className={styles.filteringSpinner}>
            <Spinner size="small" />
          </div>
        </div>
      )}

      {loadingState === "loadingMore" && (
        <div
          data-testid={DATA_LIST_LOADING_MORE_SPINNER_TEST_ID}
          className={styles.loadingMore}
        >
          <Spinner size="small" />
        </div>
      )}

      {showEmptyState && EmptyStateComponent}
    </div>
  );
}

DataList.Layout = DataListLayout;
DataList.EmptyState = EmptyState;
DataList.Filters = DataListFilters;
DataList.Search = DataListSearch;
