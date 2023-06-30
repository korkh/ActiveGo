import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStore } from "../../app/layout/stores/store";
import { Button, Grid, GridColumn, Header, TabPane } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";

const ProfileAbout = () => {
  const [editMode, setEditMode] = useState(false);
  const { profileStore } = useStore();
  const { isCurrentUser, profile } = profileStore;

  return (
    <TabPane>
      <Grid>
        <GridColumn width="16">
          <Header
            floated="left"
            icon="user"
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
          <Grid.Column width="16">
            {editMode ? (
              <ProfileEditForm setEditMode={setEditMode} />
            ) : (
              <span style={{ whiteSpace: "pre-wrap" }}>{profile?.bio}</span>
            )}
          </Grid.Column>
        </GridColumn>
      </Grid>
    </TabPane>
  );
};

export default observer(ProfileAbout);
