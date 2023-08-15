/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren } from "react";
import { data } from "./data";
import styles from "./DataList.css";
import { Text } from "../Text";
import { InlineLabel } from "../InlineLabel";
import { FormatRelativeDateTime } from "../FormatRelativeDateTime";
import { Grid } from "../Grid";

interface DataListValue<
  T = Record<string, unknown>,
  P = Record<string, unknown>,
> {
  data: T;
  columnProps: P;
}

interface DataListColumn<T, P> {
  header: string;
  render: (data: DataListValue<T, P>) => React.ReactNode;
  key: string;
}

interface DataListProps<Props, Data = Record<string, unknown>> {
  /**
   * Styles the text bold and uppercased
   * @default false
   */
  readonly columns: DataListColumn<Data, Props>[];

  /**
   * Text to display.
   */
  readonly items: DataListValue<Data, Props>[];
}
const maxTags = 3;
const actualData = data.map(item => {
  return {
    data: { ...item },
    columnProps: {
      status: item.status,
    },
  };
});
const headers = [
  { label: "Client", sortable: true },
  { label: "Address", sortable: true },
  { label: "Tags", sortable: false },
  { label: "Status", sortable: true },
  { label: "Activity", sortable: true },
];

const actualColumns: DataListColumn<
  (typeof actualData)[number]["data"],
  (typeof actualData)[number]["columnProps"]
>[] = [
  {
    header: "Name",
    key: "name",
    render: itemData => <Text maxLines="single">{itemData.data.name}</Text>,
  },
  {
    header: "Address",
    key: "address",
    render: itemData => <Text maxLines="single">{itemData.data.address}</Text>,
  },
  {
    header: "Tags",
    key: "tags",
    render: itemData => (
      <div className={styles.inlineLabel}>
        {itemData.data.tags.map((tag, i) => (
          <InlineLabel key={tag + i}>{tag}</InlineLabel>
        ))}
        <div className={styles.overflowTags}>
          {itemData.data.tags.length > maxTags && (
            <Text variation="subdued">
              +{itemData.data.tags.length - maxTags}
            </Text>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "Status",
    key: "status",
    render: itemData =>
      itemData.data.status.label !== "Active" && (
        <div className={styles.inlineLabel}>
          <InlineLabel color={itemData.columnProps.status.color}>
            {itemData.columnProps.status.label}
          </InlineLabel>
        </div>
      ),
  },
  {
    header: "Activity",
    key: "activity",
    render: itemData => (
      <Text variation="subdued">
        <FormatRelativeDateTime date={itemData.data.lastActiveDate} />
      </Text>
    ),
  },
];

export function DataList({ columns, items }: DataListProps<any, any>) {
  // const className = classnames(styles.dataList, { [styles.bold]: loud });
  const headerItems = actualColumns.map((column, i) => (
    <Grid.Cell key={i} size={{ xs: i <= 1 ? 3 : 2 }}>
      <ThiccListHeaderText key={i}>{column.header}</ThiccListHeaderText>
    </Grid.Cell>
  ));
  return (
    <div className={styles.wrapper}>
      {/* List title and counter */}
      <Grid>{headerItems.map(item => item)}</Grid>
      {/* List content */}
      <Grid>
        {actualData.flatMap((item, i) => {
          const Row = actualColumns.map(column => {
            return column.render({
              data: item.data,
              columnProps: item.columnProps,
            });
          });
          return Row.map((rowColumn, i2) => (
            <Grid.Cell size={{ xs: i2 <= 1 ? 3 : 2 }} key={i}>
              {rowColumn}
            </Grid.Cell>
          ));
        })}
      </Grid>
      {/* List empty state */}
    </div>
  );
}

function ThiccListHeaderText({ children }: PropsWithChildren<object>) {
  return (
    <Text size="small" variation="subdued">
      <b className={styles.listHeaderText}>{children}</b>
    </Text>
  );
}
