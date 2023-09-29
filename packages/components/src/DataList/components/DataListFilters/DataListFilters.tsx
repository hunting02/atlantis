import React, { ReactElement } from "react";
import classNames from "classnames";
import { useInView } from "@jobber/hooks/useInView";
import styles from "./DataListFilters.css";
import { CONTAINER_TEST_ID } from "./DataListFilter.const";
import { DataListSort } from "./components/DataListSort";
import { useDataListContext } from "../../context/DataListContext";
import { getCompoundComponent } from "../../DataList.utils";
import { useShowHeader } from "../../hooks/useShowHeader";

interface DataListFiltersProps {
  readonly children: ReactElement | ReactElement[];
}

// This component is meant to capture the props of the DataList.Filters
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DataListFilters(_: DataListFiltersProps) {
  return null;
}

/**
 * Renders the DataList.Filters component
 */
export function InternalDataListFilters() {
  const { children: parentChildren } = useDataListContext();
  const showHeader = useShowHeader();
  const showSortButton = !showHeader;
  const component = getCompoundComponent<DataListFiltersProps>(
    parentChildren,
    DataListFilters,
  );

  const [leftRef, isLeftVisible] = useInView<HTMLSpanElement>();
  const [rightRef, isRightVisible] = useInView<HTMLSpanElement>();

  if (!showSortButton && !component) return null;

  const children = component?.props.children;

  return (
    <div
      data-testid={CONTAINER_TEST_ID}
      className={classNames(styles.filters, {
        [styles.overflowLeft]: !isLeftVisible,
        [styles.overflowRight]: !isRightVisible,
      })}
    >
      <div className={styles.filterActions}>
        <span ref={leftRef} className={styles.overflowTrigger} />

        {children && children}

        {showSortButton && <DataListSort />}

        <span ref={rightRef} className={styles.overflowTrigger} />
      </div>
    </div>
  );
}
