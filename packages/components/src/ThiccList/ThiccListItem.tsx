import React, { useState } from "react";
import styles from "./ThiccList.css";
import { ListQueryType } from "./gqlUtils";
import { FormatRelativeDateTime } from "../FormatRelativeDateTime";
import { Text } from "../Text";
import { Grid } from "../Grid";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip";
import { Icon } from "../Icon";

type ListNode = ListQueryType["allPeople"]["edges"][number]["node"];

interface ThiccListItemProps extends ListNode {
  onClick: (data: ListNode) => void;
}

export function ThiccListItem({ onClick, ...node }: ThiccListItemProps) {
  const [showHoverMenu, setShowHoverMenu] = useState(false);
  const [showClickMenu, setShowClickMenu] = useState(false);

  return (
    <div
      className={styles.listContent}
      onMouseEnter={() => setShowHoverMenu(true)}
      onMouseLeave={() => setShowHoverMenu(false)}
      onContextMenu={e => {
        e.preventDefault();
        console.log(e);
        setShowClickMenu(true);
      }}
    >
      <button
        key={node.id}
        className={styles.listContentItem}
        onClick={() => onClick(node)}
      >
        <Grid>
          <Grid.Cell size={{ xs: 3 }}>
            <Text>{node.name}</Text>
          </Grid.Cell>
          <Grid.Cell size={{ xs: 3 }}>
            <Text variation="subdued">{node.homeworld.name}</Text>
          </Grid.Cell>
          <Grid.Cell size={{ xs: 2 }}>
            <Text variation="subdued">{node.gender}</Text>
          </Grid.Cell>
          <Grid.Cell size={{ xs: 2 }}>
            <Text variation="subdued">{node.skinColor}</Text>
          </Grid.Cell>
          <Grid.Cell size={{ xs: 2 }}>
            <Text variation="subdued">
              <FormatRelativeDateTime date={node.created} />
            </Text>
          </Grid.Cell>
        </Grid>
      </button>

      {/* Float-y bits be portaled to the body */}
      {showHoverMenu && (
        <div className={styles.listContentHoverMenu}>
          <Tooltip message="Compose Email">
            <Button
              icon="email"
              ariaLabel="Email"
              variation="subtle"
              type="secondary"
            />
          </Tooltip>
          <Tooltip message="Create Note">
            <Button
              icon="addNote"
              ariaLabel="Note"
              variation="subtle"
              type="secondary"
            />
          </Tooltip>
          <Tooltip message="More actions">
            <Button
              icon="more"
              ariaLabel="More"
              variation="subtle"
              type="secondary"
            />
          </Tooltip>
        </div>
      )}

      {showClickMenu && (
        <div className={styles.listContentClickMenu}>
          <button className={styles.listContentClickMenuItem}>
            <Text>
              <b>Select Client</b>
            </Text>
          </button>
          <button className={styles.listContentClickMenuItem}>
            <Text>
              <b>Create new...</b>
            </Text>
            <Icon name="arrowRight" color="blue" />
          </button>
          <button className={styles.listContentClickMenuItem}>
            <Text>
              <b>Tag with...</b>
            </Text>
            <Icon name="arrowRight" color="blue" />
          </button>
          <button className={styles.listContentClickMenuItem}>
            <Text>
              <b>Delete</b>
            </Text>
          </button>
        </div>
      )}
    </div>
  );
}
