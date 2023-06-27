import { observer } from "mobx-react-lite";
import { List, Image, Popup, PopupContent } from "semantic-ui-react";
import { Profile } from "../../../app/layout/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/profileCard";

interface Props {
  attendees: Profile[];
}

const ActivityListItemAttendee = ({ attendees }: Props) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.userName}
          trigger={
            <List.Item
              key={attendee.userName}
              as={Link}
              to={`/profiles/${attendee.userName}`}
            >
              <Image
                size="mini"
                circular
                src={attendee.image || "/assets/user.png"}
              />
            </List.Item>
          }
        >
          <PopupContent>
            <ProfileCard profile={attendee} />
          </PopupContent>
        </Popup>
      ))}
    </List>
  );
};

export default observer(ActivityListItemAttendee);
